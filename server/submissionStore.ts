import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { DeliveryStatus, DeliveryTarget, SubmissionStatus } from "../src/generated/prisma/enums";
import { getPrisma } from "../src/lib/server/prisma";
import type { ContactLeadInput, TalentApplicationInput } from "./submissionContracts";
import type { OnboardingPayload } from "./onboardingContract";

const RETENTION_MONTHS = 12;

const retentionUntil = () => {
  const until = new Date();
  until.setMonth(until.getMonth() + RETENTION_MONTHS);
  return until;
};

const queueDelivery = (target: DeliveryTarget, aggregateType: string, aggregateId: string, payload: unknown) => ({
  id: randomUUID(),
  idempotencyKey: `${aggregateType}:${aggregateId}:${target.toLowerCase()}`,
  target,
  aggregateType,
  aggregateId,
  payload: JSON.parse(JSON.stringify(payload)),
  status: DeliveryStatus.PENDING
});

type PersistResult = { id: string; created: boolean };

const assertSameContactRequest = (existing: { id: string; payload: unknown }, payload: ContactLeadInput) => {
  if (!isDeepStrictEqual(existing.payload, payload)) throw new Error("idempotency_key_conflict");
  return { id: existing.id, created: false };
};

const isUniqueConstraintError = (error: unknown) =>
  Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");

export const buildContactDeliveryPayload = (payload: ContactLeadInput) => ({
  name: payload.name,
  company: payload.company,
  whatsapp: payload.whatsapp,
  email: payload.email,
  service: payload.service,
  stage: payload.stage,
  requestType: payload.requestType,
  serviceInterests: payload.serviceInterests,
  needsServiceGuidance: payload.needsServiceGuidance,
  message: payload.message,
  consentVersion: payload.consentVersion,
  locale: payload.locale,
  source: payload.source,
  utm: payload.utm
});

export const persistContactLeadWithClient = async (
  prisma: ReturnType<typeof getPrisma>,
  payload: ContactLeadInput,
  idempotencyKey: string
): Promise<PersistResult> => prisma.$transaction(async (tx) => {
  const existing = await tx.contactLead.findUnique({ where: { idempotencyKey } });
  if (existing) return assertSameContactRequest(existing, payload);

  const id = randomUUID();
  await tx.contactLead.create({
    data: {
      id,
      idempotencyKey,
      payload: JSON.parse(JSON.stringify(payload)),
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      locale: payload.locale,
      consentVersion: payload.consentVersion,
      source: payload.source,
      status: SubmissionStatus.ACCEPTED,
      retentionUntil: retentionUntil()
    }
  });
  const versionedPayload = { version: 1, data: JSON.parse(JSON.stringify(buildContactDeliveryPayload(payload))) };
  await tx.integrationDelivery.createMany({
    data: [
      queueDelivery(DeliveryTarget.CLICKUP, "contact_lead", id, versionedPayload),
      queueDelivery(DeliveryTarget.GOOGLE_SHEETS, "contact_lead", id, versionedPayload)
    ]
  });
  return { id, created: true };
});

export const persistContactLead = async (payload: ContactLeadInput, idempotencyKey: string): Promise<PersistResult> => {
  const prisma = getPrisma();
  try {
    return await persistContactLeadWithClient(prisma, payload, idempotencyKey);
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error;
    const existing = await prisma.contactLead.findUnique({ where: { idempotencyKey } });
    if (!existing) throw error;
    return assertSameContactRequest(existing, payload);
  }
};

export const persistTalentApplication = async (payload: TalentApplicationInput, idempotencyKey: string): Promise<PersistResult> => {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const existing = await tx.talentApplication.findUnique({ where: { idempotencyKey } });
    if (existing) return { id: existing.id, created: false };

    const id = randomUUID();
    await tx.talentApplication.create({
      data: {
        id,
        idempotencyKey,
        payload: JSON.parse(JSON.stringify(payload)),
        name: payload.name,
        email: payload.email,
        vacancyId: payload.vacancyId,
        locale: payload.locale,
        consentVersion: payload.consentVersion,
        source: payload.source,
        status: SubmissionStatus.ACCEPTED,
        retentionUntil: retentionUntil()
      }
    });
    await tx.integrationDelivery.createMany({
      data: [
        queueDelivery(DeliveryTarget.GOOGLE_SHEETS, "talent_application", id, payload),
        queueDelivery(DeliveryTarget.CLICKUP, "talent_application", id, payload)
      ]
    });
    return { id, created: true };
  });
};

export const persistOnboardingSubmission = async (payload: OnboardingPayload, idempotencyKey: string): Promise<PersistResult> => {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const existing = await tx.onboardingSubmission.findUnique({ where: { idempotencyKey } });
    if (existing) return { id: existing.id, created: false };

    const id = randomUUID();
    await tx.onboardingSubmission.create({
      data: {
        id,
        idempotencyKey,
        payload: JSON.parse(JSON.stringify(payload)),
        companyName: payload.clientData.companyName || "",
        email: payload.projectContacts.email || "",
        locale: payload.clientData.preferredLanguage || "pt",
        schemaVersion: payload.schemaVersion || 1,
        source: payload.source,
        status: SubmissionStatus.ACCEPTED,
        retentionUntil: retentionUntil()
      }
    });
    await tx.integrationDelivery.createMany({
      data: [
        queueDelivery(DeliveryTarget.GOOGLE_SHEETS, "onboarding_submission", id, payload),
        queueDelivery(DeliveryTarget.CLICKUP, "onboarding_submission", id, payload)
      ]
    });
    return { id, created: true };
  });
};

export const isPersistenceUnavailable = (error: unknown) =>
  error instanceof Error && error.message === "persistence_unavailable";

export const getPersistenceErrorCode = (error: unknown) => {
  if (isPersistenceUnavailable(error)) return "database_configuration_unavailable";
  if (error instanceof Error) return error.name || "database_operation_failed";
  return "database_operation_failed";
};

export const getOperationalMetrics = async () => {
  const prisma = getPrisma();
  const [onboardingTotal, onboardingAccepted, failedDeliveries, pendingDeliveries, processingDeliveries, oldestQueuedDelivery] = await Promise.all([
    prisma.onboardingSubmission.count(),
    prisma.onboardingSubmission.count({ where: { status: SubmissionStatus.ACCEPTED } }),
    prisma.integrationDelivery.count({ where: { status: DeliveryStatus.FAILED } }),
    prisma.integrationDelivery.count({ where: { status: DeliveryStatus.PENDING } }),
    prisma.integrationDelivery.count({ where: { status: DeliveryStatus.PROCESSING } }),
    prisma.integrationDelivery.aggregate({
      where: { status: { in: [DeliveryStatus.PENDING, DeliveryStatus.FAILED] } },
      _min: { createdAt: true }
    })
  ]);

  return {
    onboardingTotal,
    onboardingAccepted,
    failedDeliveries,
    pendingDeliveries,
    processingDeliveries,
    oldestQueuedDeliveryAt: oldestQueuedDelivery._min.createdAt?.toISOString() ?? null
  };
};
