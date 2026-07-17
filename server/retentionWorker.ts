import { randomUUID } from "node:crypto";
import { getPrisma } from "../src/lib/server/prisma";

const BATCH_SIZE = 100;

const purge = async (aggregateType: "contact_lead" | "talent_application" | "onboarding_submission") => {
  const prisma = getPrisma();
  const query = { where: { retentionUntil: { lt: new Date() } }, select: { id: true }, take: BATCH_SIZE, orderBy: { retentionUntil: "asc" } } as const;
  const expired =
    aggregateType === "contact_lead"
      ? await prisma.contactLead.findMany(query)
      : aggregateType === "talent_application"
        ? await prisma.talentApplication.findMany(query)
        : await prisma.onboardingSubmission.findMany(query);

  await prisma.$transaction(async (tx) => {
    for (const record of expired) {
      await tx.integrationDelivery.deleteMany({ where: { aggregateType, aggregateId: record.id } });
      await tx.retentionAudit.create({
        data: { id: randomUUID(), aggregateType, aggregateId: record.id, action: "retention_deleted" }
      });
      if (aggregateType === "contact_lead") await tx.contactLead.delete({ where: { id: record.id } });
      if (aggregateType === "talent_application") await tx.talentApplication.delete({ where: { id: record.id } });
      if (aggregateType === "onboarding_submission") await tx.onboardingSubmission.delete({ where: { id: record.id } });
    }
  });

  return expired.length;
};

const result = await Promise.all([
  purge("contact_lead"),
  purge("talent_application"),
  purge("onboarding_submission")
]);

console.log(JSON.stringify({ event: "retention_completed", deleted: result.reduce((total, count) => total + count, 0) }));
