import assert from "node:assert/strict";
import {
  MAGIC_LINK_TTL_MS,
  ONBOARDING_SESSION_TTL_MS,
  allowMagicLinkAttempt,
  createOpaqueSecret,
  createOnboardingJourneyWithLink,
  getClearedOnboardingSessionCookie,
  getOnboardingSessionCookie,
  hashOpaqueSecret,
  isSecureCookieRequest,
  isSameOriginMutation,
  isValidOpaqueSecretFormat,
  redeemOnboardingMagicLink,
  reissueOnboardingMagicLink,
  resolveOnboardingSession,
  revokeOnboardingAccess
} from "../server/onboardingAccess";
import { parseOnboardingDraft } from "../src/lib/onboardingDraft";

const secret = createOpaqueSecret();
assert.equal(Buffer.from(secret, "base64url").byteLength, 32);
assert.equal(isValidOpaqueSecretFormat(secret), true);
assert.equal(isValidOpaqueSecretFormat("predictable-id"), false);
assert.notEqual(hashOpaqueSecret(secret), secret);
assert.equal(hashOpaqueSecret(secret).length, 64);
assert.equal(MAGIC_LINK_TTL_MS, 24 * 60 * 60 * 1000);
assert.equal(ONBOARDING_SESSION_TTL_MS, 8 * 60 * 60 * 1000);

const cookie = getOnboardingSessionCookie(secret, new Date(Date.now() + ONBOARDING_SESSION_TTL_MS), true);
assert.match(cookie, /HttpOnly/);
assert.match(cookie, /SameSite=Lax/);
assert.match(cookie, /Secure/);
assert.match(cookie, /Path=\//);
assert.match(getClearedOnboardingSessionCookie(false), /Max-Age=0/);

assert.equal(isSameOriginMutation(new Request("https://tag08.test/api", {
  method: "POST",
  headers: { origin: "https://tag08.test", host: "tag08.test", "sec-fetch-site": "same-origin" }
})), true);
assert.equal(isSameOriginMutation(new Request("https://tag08.test/api", {
  method: "POST",
  headers: { origin: "https://attacker.test", host: "tag08.test", "sec-fetch-site": "cross-site" }
})), false);
assert.equal(isSameOriginMutation(new Request("https://tag08.test/api", { method: "POST" })), false);
assert.equal(isSameOriginMutation(new Request("http://0.0.0.0:3220/api", {
  method: "POST",
  headers: { origin: "http://127.0.0.1:3220", host: "127.0.0.1:3220", "sec-fetch-site": "same-origin" }
})), true);
assert.equal(isSameOriginMutation(new Request("http://10.0.0.2/api", {
  method: "POST",
  headers: { origin: "https://tag08.test", host: "tag08.test", "x-forwarded-proto": "https", "sec-fetch-site": "same-origin" }
})), true);
assert.equal(isSecureCookieRequest(new Request("http://10.0.0.2/api", {
  headers: { host: "tag08.test", "x-forwarded-proto": "https" }
})), true);
const limitedRequest = new Request("https://tag08.test/api/onboarding/access/redeem", {
  headers: { "x-real-ip": "198.51.100.77" }
});
for (let attempt = 0; attempt < 20; attempt += 1) assert.equal(allowMagicLinkAttempt(limitedRequest, 100_000), true);
assert.equal(allowMagicLinkAttempt(limitedRequest, 100_000), false);
assert.equal(allowMagicLinkAttempt(limitedRequest, 160_000), true);

assert.ok(parseOnboardingDraft({ version: 1, currentStep: 2, values: { companyName: "TAG08" } }));
assert.equal(parseOnboardingDraft({ version: 1, currentStep: 2, values: { journeyId: "another-journey" } }), null);
assert.equal(parseOnboardingDraft({ version: 1, currentStep: 9, values: {} }), null);
assert.equal(parseOnboardingDraft({ version: 1, currentStep: 2, values: { companyName: "x".repeat(5_001) } }), null);

const journeys = new Map<string, Record<string, any>>();
const links = new Map<string, Record<string, any>>();
const sessions = new Map<string, Record<string, any>>();
const audits: Record<string, any>[] = [];
const matches = (record: Record<string, any>, where: Record<string, any>) => Object.entries(where).every(([key, value]) => {
  if (value && typeof value === "object" && "gt" in value) return record[key] > value.gt;
  if (value instanceof Date) return record[key] instanceof Date && record[key].getTime() === value.getTime();
  return record[key] === value;
});
const fake: Record<string, any> = {
  $queryRaw: async () => [],
  onboardingJourney: {
    create: async ({ data }: any) => { journeys.set(data.id, { ...data }); return data; },
    findUnique: async ({ where }: any) => journeys.get(where.id) ?? null,
    update: async ({ where, data }: any) => { const row = journeys.get(where.id)!; Object.assign(row, data); return row; },
    updateMany: async ({ where, data }: any) => { const row = journeys.get(where.id); if (!row || !matches(row, where)) return { count: 0 }; Object.assign(row, data); return { count: 1 }; }
  },
  onboardingMagicLink: {
    create: async ({ data }: any) => { links.set(data.id, { usedAt: null, revokedAt: null, ...data }); return data; },
    findUnique: async ({ where, include }: any) => {
      const row = [...links.values()].find((candidate) => matches(candidate, where));
      return row && include?.journey ? { ...row, journey: journeys.get(row.journeyId) } : row ?? null;
    },
    updateMany: async ({ where, data }: any) => {
      let count = 0;
      for (const row of links.values()) if (matches(row, where)) { Object.assign(row, data); count += 1; }
      return { count };
    }
  },
  onboardingSession: {
    create: async ({ data }: any) => { sessions.set(data.id, { revokedAt: null, expiredAt: null, ...data }); return data; },
    findUnique: async ({ where, include }: any) => {
      const row = [...sessions.values()].find((candidate) => matches(candidate, where));
      return row && include?.journey ? { ...row, journey: journeys.get(row.journeyId) } : row ?? null;
    },
    updateMany: async ({ where, data }: any) => {
      let count = 0;
      for (const row of sessions.values()) if (matches(row, where)) { Object.assign(row, data); count += 1; }
      return { count };
    }
  },
  onboardingAuditEvent: { create: async ({ data }: any) => { audits.push(data); return data; } },
  $transaction: async (operation: any) => operation(fake)
};

const now = new Date("2026-10-20T12:00:00.000Z");
const issued = await createOnboardingJourneyWithLink(fake as never, {
  operator: "operator-1", commercialReference: "contract-ref-1", reason: "confirmed contract", now
});
assert.equal(issued.expiresAt.getTime() - now.getTime(), MAGIC_LINK_TTL_MS);
const storedLink = [...links.values()][0];
assert.equal(storedLink.tokenHash, hashOpaqueSecret(issued.token));
assert.equal("token" in storedLink, false);
const reissued = await reissueOnboardingMagicLink(fake as never, {
  journeyId: issued.journeyId, operator: "operator-1", commercialReference: "contract-ref-1", reason: "customer requested new link", now
});
assert.ok([...links.values()][0].revokedAt instanceof Date);
assert.equal((await redeemOnboardingMagicLink(fake as never, issued.token, now)).ok, false);
const redeemed = await redeemOnboardingMagicLink(fake as never, reissued.token, now);
assert.equal(redeemed.ok, true);
if (redeemed.ok) {
  assert.equal(redeemed.sessionExpiresAt.getTime() - now.getTime(), ONBOARDING_SESSION_TTL_MS);
  assert.equal([...sessions.values()][0].tokenHash, hashOpaqueSecret(redeemed.sessionSecret));
  const session = [...sessions.values()][0];
  const validSession = await resolveOnboardingSession(fake as never, redeemed.sessionSecret, now);
  assert.equal(validSession?.journeyId, issued.journeyId);
  assert.equal(await resolveOnboardingSession(fake as never, redeemed.sessionSecret, new Date(now.getTime() + ONBOARDING_SESSION_TTL_MS)), null);
  assert.ok(session.expiredAt instanceof Date);
  const replay = await redeemOnboardingMagicLink(fake as never, reissued.token, now);
  assert.deepEqual(replay, { ok: false, reason: "used" });
  assert.ok(session.expiresAt.getTime() - session.createdAt.getTime() === ONBOARDING_SESSION_TTL_MS);
}

await revokeOnboardingAccess(fake as never, {
  journeyId: issued.journeyId, operator: "operator-1", commercialReference: "contract-ref-1", reason: "security review", now
});
assert.equal((await redeemOnboardingMagicLink(fake as never, reissued.token, now)).ok, false);
if (redeemed.ok) assert.equal(await resolveOnboardingSession(fake as never, redeemed.sessionSecret, now), null);
await assert.rejects(
  reissueOnboardingMagicLink(fake as never, {
    journeyId: issued.journeyId, operator: "operator-1", commercialReference: "contract-ref-1", reason: "must not override revocation", now
  }),
  /onboarding_journey_not_eligible/
);
assert.ok(journeys.get(issued.journeyId)?.accessRevokedAt instanceof Date);
assert.ok(audits.some((event) => event.event === "magic_link_issued"));
assert.ok(audits.some((event) => event.event === "magic_link_reissued"));
assert.ok(audits.some((event) => event.event === "magic_link_revoked"));
assert.ok(audits.some((event) => event.event === "session_expired"));
const expiredLink = await createOnboardingJourneyWithLink(fake as never, {
  operator: "operator-1", commercialReference: "contract-ref-2", reason: "confirmed contract", now
});
assert.deepEqual(await redeemOnboardingMagicLink(fake as never, expiredLink.token, expiredLink.expiresAt), { ok: false, reason: "expired" });
assert.ok(audits.some((event) => event.event === "magic_link_expired"));

console.log("Onboarding access and draft security contracts passed.");
