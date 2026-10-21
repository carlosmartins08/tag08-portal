import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  createOnboardingJourneyWithLink,
  redeemOnboardingMagicLink,
  reissueOnboardingMagicLink,
  resolveOnboardingSession,
  revokeOnboardingAccess,
  hashOpaqueSecret
} from "../server/onboardingAccess";
import { parseAndValidatePayload, ONBOARDING_PAYLOAD_VERSION } from "../server/onboardingContract";
import { persistOnboardingSubmission } from "../server/submissionStore";
import { getPrisma } from "../src/lib/server/prisma";

const databaseUrl = process.env.ONBOARDING_TEST_DATABASE_URL;
assert.ok(databaseUrl, "ONBOARDING_TEST_DATABASE_URL must point to the disposable PostgreSQL QA database");
const parsedUrl = new URL(databaseUrl);
assert.ok(["127.0.0.1", "localhost"].includes(parsedUrl.hostname), "PostgreSQL integration tests are restricted to loopback");
assert.equal(decodeURIComponent(parsedUrl.username), "tag08_qa", "unexpected test database user");
assert.equal(parsedUrl.pathname, "/tag08_p1_2e2_qa", "unexpected test database name");
assert.ok(!process.env.DATABASE_URL || process.env.DATABASE_URL === databaseUrl, "refusing to replace a different DATABASE_URL");
process.env.DATABASE_URL = databaseUrl;

const prisma = getPrisma();
const operator = "P1.2E.2 synthetic QA operator";
const now = new Date();
const makeJourney = (suffix: string) => createOnboardingJourneyWithLink(prisma, {
  operator,
  commercialReference: `SYNTHETIC-P1.2E.2-${suffix}`,
  reason: "Disposable PostgreSQL security regression test",
  now
});
const reissue = (journeyId: string, suffix: string) => reissueOnboardingMagicLink(prisma, {
  journeyId,
  operator,
  commercialReference: `SYNTHETIC-P1.2E.2-${suffix}`,
  reason: "Concurrent reissue regression",
  now
});

try {
  const identity = await prisma.$queryRaw<Array<{ current_database: string; current_user: string }>>`SELECT current_database(), current_user`;
  assert.deepEqual(identity[0], { current_database: "tag08_p1_2e2_qa", current_user: "tag08_qa" });

  {
    const suffix = `lifecycle-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const stored = await prisma.onboardingMagicLink.findFirstOrThrow({ where: { journeyId: created.journeyId } });
    assert.equal(created.expiresAt.getTime() - now.getTime(), 24 * 60 * 60 * 1000);
    assert.equal(stored.tokenHash, (await import("../server/onboardingAccess")).hashOpaqueSecret(created.token));
    assert.equal("token" in stored, false);
    const redeemed = await redeemOnboardingMagicLink(prisma, created.token, now);
    assert.equal(redeemed.ok, true);
    if (!redeemed.ok) throw new Error("synthetic_redeem_failed");
    assert.equal(redeemed.sessionExpiresAt.getTime() - now.getTime(), 8 * 60 * 60 * 1000);
    const session = await prisma.onboardingSession.findFirstOrThrow({ where: { journeyId: created.journeyId } });
    assert.notEqual(session.tokenHash, redeemed.sessionSecret);
    assert.equal((await redeemOnboardingMagicLink(prisma, created.token, now)).ok, false, "replay must fail");
    assert.equal(await resolveOnboardingSession(prisma, redeemed.sessionSecret, new Date(now.getTime() + 8 * 60 * 60 * 1000)), null);
    assert.ok((await prisma.onboardingSession.findUniqueOrThrow({ where: { id: session.id } })).expiredAt);
  }

  {
    const suffix = `expired-link-${randomUUID()}`;
    const created = await makeJourney(suffix);
    await prisma.onboardingMagicLink.updateMany({ where: { journeyId: created.journeyId }, data: { expiresAt: new Date(now.getTime() - 1) } });
    assert.equal((await redeemOnboardingMagicLink(prisma, created.token, now)).ok, false, "expired links must fail");
  }

  {
    const suffix = `submission-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const redeemed = await redeemOnboardingMagicLink(prisma, created.token, now);
    assert.equal(redeemed.ok, true);
    if (!redeemed.ok) throw new Error("synthetic_submission_redeem_failed");
    const session = await prisma.onboardingSession.findUniqueOrThrow({ where: { tokenHash: hashOpaqueSecret(redeemed.sessionSecret) } });
    const validation = parseAndValidatePayload({
      clientData: { companyName: "TAG08 TESTE SINTÉTICO P1.2E.2", preferredLanguage: "pt" },
      projectContacts: { responsibleName: "Contato Sintético", email: "p12e2@example.invalid", whatsapp: "+15005550006" },
      selectedServices: ["Process Intelligence"],
      businessMoment: {}, generalBriefing: {}, serviceSpecificBriefing: {}, filesAndLinks: {},
      consent: { truthChecked: true, useChecked: true, noPasswordsChecked: true },
      submittedAt: now.toISOString(), source: "synthetic-p1.2e.2"
    });
    assert.deepEqual(validation.errors, []);
    validation.payload.schemaVersion = ONBOARDING_PAYLOAD_VERSION;
    validation.payload.status = "accepted";
    validation.payload.submissionContext = { submittedBy: "client" };
    validation.payload.consent.authorizationConfirmedByOperator = false;
    const key = `synthetic-p1.2e.2-${randomUUID()}`;
    const first = await persistOnboardingSubmission(validation.payload, key, {
      journeyId: created.journeyId, sessionId: session.id, sessionSecret: redeemed.sessionSecret
    });
    const replay = await persistOnboardingSubmission(validation.payload, key, {
      journeyId: created.journeyId, sessionId: session.id, sessionSecret: redeemed.sessionSecret
    });
    assert.equal(replay.created, false);
    assert.equal(replay.id, first.id);
    assert.equal(await prisma.onboardingSubmission.count({ where: { journeyId: created.journeyId } }), 1);
    assert.equal(await prisma.integrationDelivery.count({ where: { aggregateType: "onboarding_submission", aggregateId: first.id } }), 2);
  }

  {
    const suffix = `rollback-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const submissionsBefore = await prisma.onboardingSubmission.count();
    const deliveriesBefore = await prisma.integrationDelivery.count({ where: { aggregateType: "onboarding_submission" } });
    const redeemed = await redeemOnboardingMagicLink(prisma, created.token, now);
    assert.equal(redeemed.ok, true);
    if (!redeemed.ok) throw new Error("synthetic_rollback_redeem_failed");
    const session = await prisma.onboardingSession.findUniqueOrThrow({ where: { tokenHash: hashOpaqueSecret(redeemed.sessionSecret) } });
    const payload = {
      clientData: { companyName: "TAG08 TESTE ROLLBACK", preferredLanguage: "pt" },
      projectContacts: { responsibleName: "Contato Sintético", email: "rollback@example.invalid", whatsapp: "+15005550006" },
      selectedServices: ["Process Intelligence"],
      businessMoment: {}, generalBriefing: {}, serviceSpecificBriefing: {}, filesAndLinks: {},
      consent: { truthChecked: true, useChecked: true, noPasswordsChecked: true },
      submittedAt: now.toISOString(), source: "synthetic-p1.2e.2", status: "accepted" as const, schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      submissionContext: { submittedBy: "client" as const }
    };
    await prisma.$executeRaw`CREATE FUNCTION p12e2_qa_force_audit_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic_rollback_test'; END; $$`;
    await prisma.$executeRaw`CREATE TRIGGER p12e2_qa_force_audit_failure BEFORE INSERT ON onboarding_audit_events FOR EACH ROW EXECUTE FUNCTION p12e2_qa_force_audit_failure()`;
    try {
      await assert.rejects(() => persistOnboardingSubmission(payload, `rollback-${randomUUID()}`, {
        journeyId: created.journeyId, sessionId: session.id, sessionSecret: redeemed.sessionSecret
      }));
    } finally {
      await prisma.$executeRaw`DROP TRIGGER IF EXISTS p12e2_qa_force_audit_failure ON onboarding_audit_events`;
      await prisma.$executeRaw`DROP FUNCTION IF EXISTS p12e2_qa_force_audit_failure()`;
    }
    assert.equal(await prisma.onboardingSubmission.count(), submissionsBefore);
    assert.equal(await prisma.integrationDelivery.count({ where: { aggregateType: "onboarding_submission" } }), deliveriesBefore);
    assert.equal((await prisma.onboardingJourney.findUniqueOrThrow({ where: { id: created.journeyId } })).status, "ACTIVE");
  }

  {
    const suffix = `revoked-session-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const redeemed = await redeemOnboardingMagicLink(prisma, created.token, now);
    assert.equal(redeemed.ok, true);
    if (!redeemed.ok) throw new Error("synthetic_revoke_redeem_failed");
    await reissue(created.journeyId, suffix);
    await revokeOnboardingAccess(prisma, { journeyId: created.journeyId, operator, commercialReference: `SYNTHETIC-P1.2E.2-${suffix}`, reason: "Revoke live session regression", now });
    assert.equal(await resolveOnboardingSession(prisma, redeemed.sessionSecret, now), null);
    assert.equal(await prisma.onboardingMagicLink.count({ where: { journeyId: created.journeyId, revokedAt: null, usedAt: null } }), 0);
    assert.equal(await prisma.onboardingSession.count({ where: { journeyId: created.journeyId, revokedAt: null } }), 0);
  }

  for (const concurrency of [2, 5, 10]) {
    const suffix = `parallel-${concurrency}-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const outcomes = await Promise.allSettled(Array.from({ length: concurrency }, () => reissue(created.journeyId, suffix)));
    assert.equal(outcomes.filter((result) => result.status === "fulfilled").length, concurrency, `${concurrency} reissues should serialize without unhandled conflicts`);
    const links = await prisma.onboardingMagicLink.findMany({ where: { journeyId: created.journeyId } });
    const active = links.filter((link) => !link.usedAt && !link.revokedAt && link.expiresAt > now);
    assert.equal(active.length, 1, `${concurrency} concurrent reissues must leave exactly one redeemable link`);
    const issuedTokens = outcomes.flatMap((result) => result.status === "fulfilled" ? [result.value.token] : []);
    const redeemed = await Promise.all(issuedTokens.map((token) => redeemOnboardingMagicLink(prisma, token, now)));
    assert.equal(redeemed.filter((result) => result.ok).length, 1, `${concurrency} concurrent reissues must leave exactly one usable token`);
    assert.equal((await prisma.onboardingSession.count({ where: { journeyId: created.journeyId } })), 1);
  }

  {
    const suffix = `reissue-redeem-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const [issued, redeemed] = await Promise.allSettled([
      reissue(created.journeyId, suffix),
      redeemOnboardingMagicLink(prisma, created.token, now)
    ]);
    assert.equal(issued.status, "fulfilled");
    assert.equal(redeemed.status, "fulfilled");
    const active = await prisma.onboardingMagicLink.count({ where: { journeyId: created.journeyId, usedAt: null, revokedAt: null, expiresAt: { gt: now } } });
    assert.ok(active <= 1, "reissue racing redemption must not leave multiple active links");
    if (redeemed.status === "fulfilled" && redeemed.value.ok) {
      assert.equal((await prisma.onboardingSession.count({ where: { journeyId: created.journeyId } })), 1);
    } else {
      const finalLink = await prisma.onboardingMagicLink.findFirst({ where: { journeyId: created.journeyId, usedAt: null, revokedAt: null, expiresAt: { gt: now } } });
      assert.ok(finalLink);
      const activeToken = (issued as PromiseFulfilledResult<Awaited<ReturnType<typeof reissue>>>).value.token;
      assert.equal((await redeemOnboardingMagicLink(prisma, activeToken, now)).ok, true);
    }
  }

  {
    const suffix = `reissue-revoke-${randomUUID()}`;
    const created = await makeJourney(suffix);
    const outcomes = await Promise.allSettled([
      reissue(created.journeyId, suffix),
      revokeOnboardingAccess(prisma, { journeyId: created.journeyId, operator, commercialReference: `SYNTHETIC-P1.2E.2-${suffix}`, reason: "Concurrent revoke regression", now })
    ]);
    const journey = await prisma.onboardingJourney.findUniqueOrThrow({ where: { id: created.journeyId } });
    assert.ok(journey.accessRevokedAt, "the serialized revoke must remain authoritative");
    assert.ok(outcomes.some((result) => result.status === "fulfilled"));
    assert.equal(await prisma.onboardingMagicLink.count({ where: { journeyId: created.journeyId, revokedAt: null, usedAt: null, expiresAt: { gt: now } } }), 0);
    assert.equal(await prisma.onboardingSession.count({ where: { journeyId: created.journeyId, revokedAt: null } }), 0);
  }

  console.log("Disposable PostgreSQL onboarding regressions passed (token lifecycle, submission/outbox/idempotency, rollback, revocation, 2/5/10 reissues and races).");
} finally {
  await prisma.$disconnect();
}
