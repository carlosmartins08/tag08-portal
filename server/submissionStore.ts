import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { DeliveryStatus, DeliveryTarget, SubmissionStatus } from "../src/generated/prisma/enums";
import { getPrisma } from "../src/lib/server/prisma";
import { hashOpaqueSecret } from "./onboardingAccess";
import { buildOnboardingClickUpDeliveryProjection, buildOnboardingSheetsDeliveryProjection } from "./onboardingDeliveryProjection.mjs";
import type { OnboardingPayload } from "./onboardingContract";
import { getPersistenceErrorCode, isPersistenceUnavailable } from "./submissionErrors";

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

export const persistOnboardingSubmission = async (
  payload: OnboardingPayload,
  idempotencyKey: string,
  access: { journeyId: string; sessionId: string; sessionSecret: string }
): Promise<PersistResult> => {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const session = await tx.onboardingSession.findFirst({
      where: {
        id: access.sessionId,
        journeyId: access.journeyId,
        tokenHash: hashOpaqueSecret(access.sessionSecret),
        revokedAt: null,
        expiresAt: { gt: now }
      },
      include: { journey: true }
    });
    if (!session || session.journey.accessRevokedAt || session.journey.status === "CLOSED") throw new Error("onboarding_session_invalid");

    const existing = await tx.onboardingSubmission.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.journeyId !== access.journeyId || !isDeepStrictEqual(existing.payload, payload)) throw new Error("idempotency_key_conflict");
      return { id: existing.id, created: false };
    }

    if (session.journey.status !== "ACTIVE") throw new Error("onboarding_already_completed");

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
        retentionUntil: retentionUntil(),
        journeyId: access.journeyId
      }
    });
    await tx.integrationDelivery.createMany({
      data: [
        queueDelivery(DeliveryTarget.GOOGLE_SHEETS, "onboarding_submission", id, buildOnboardingSheetsDeliveryProjection(payload)),
        queueDelivery(DeliveryTarget.CLICKUP, "onboarding_submission", id, buildOnboardingClickUpDeliveryProjection(payload))
      ]
    });
    await tx.onboardingJourney.update({
      where: { id: access.journeyId },
      data: { status: "COMPLETED", completedAt: now, draft: null }
    });
    await tx.onboardingAuditEvent.create({
      data: { id: randomUUID(), journeyId: access.journeyId, event: "onboarding_completed", result: "accepted" }
    });
    return { id, created: true };
  }, { isolationLevel: "Serializable" });
};

export { getPersistenceErrorCode, isPersistenceUnavailable };

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
