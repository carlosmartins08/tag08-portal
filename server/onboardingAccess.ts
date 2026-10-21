import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Prisma } from "../src/generated/prisma/client";
import { getPrisma } from "../src/lib/server/prisma";

export const MAGIC_LINK_TTL_MS = 24 * 60 * 60 * 1000;
export const ONBOARDING_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const ONBOARDING_SESSION_COOKIE = "tag08-onboarding-session";
const TOKEN_BYTES = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type PrismaClientLike = ReturnType<typeof getPrisma>;
type Tx = Prisma.TransactionClient;

export const createOpaqueSecret = () => randomBytes(TOKEN_BYTES).toString("base64url");
export const hashOpaqueSecret = (secret: string) => createHash("sha256").update(secret, "utf8").digest("hex");
export const isValidOpaqueSecretFormat = (secret: unknown): secret is string =>
  typeof secret === "string" && TOKEN_PATTERN.test(secret);

const audit = (tx: Tx, input: {
  event: string;
  journeyId?: string | null;
  actor?: string | null;
  commercialReference?: string | null;
  reason?: string | null;
  result: string;
}) => tx.onboardingAuditEvent.create({
  data: {
    id: randomUUID(),
    event: input.event,
    journeyId: input.journeyId ?? null,
    actor: input.actor ?? null,
    commercialReference: input.commercialReference ?? null,
    reason: input.reason ?? null,
    result: input.result
  }
});

const lockOnboardingJourney = async (tx: Tx, journeyId: string) => {
  await tx.$queryRaw<Array<{ id: string }>>`SELECT "id" FROM "onboarding_journeys" WHERE "id" = ${journeyId} FOR UPDATE`;
};

const issueForJourney = async (
  tx: Tx,
  input: { journeyId: string; operator: string; commercialReference: string; now: Date }
) => {
  const token = createOpaqueSecret();
  const expiresAt = new Date(input.now.getTime() + MAGIC_LINK_TTL_MS);
  await tx.onboardingMagicLink.updateMany({
    where: { journeyId: input.journeyId, usedAt: null, revokedAt: null, expiresAt: { gt: input.now } },
    data: { revokedAt: input.now }
  });
  await tx.onboardingMagicLink.create({
    data: {
      id: randomUUID(),
      journeyId: input.journeyId,
      tokenHash: hashOpaqueSecret(token),
      issuedBy: input.operator,
      commercialReference: input.commercialReference,
      issuedAt: input.now,
      expiresAt
    }
  });
  return { token, expiresAt };
};

export const createOnboardingJourneyWithLink = async (
  prisma: PrismaClientLike,
  input: { operator: string; commercialReference: string; reason: string; now?: Date }
) => prisma.$transaction(async (tx) => {
  const now = input.now ?? new Date();
  const journeyId = randomUUID();
  await tx.onboardingJourney.create({
    data: {
      id: journeyId,
      commercialReference: input.commercialReference,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    }
  });
  const issued = await issueForJourney(tx, { journeyId, operator: input.operator, commercialReference: input.commercialReference, now });
  await audit(tx, { event: "magic_link_issued", journeyId, actor: input.operator, commercialReference: input.commercialReference, reason: input.reason, result: "created" });
  return { journeyId, ...issued };
});

export const reissueOnboardingMagicLink = async (
  prisma: PrismaClientLike,
  input: { journeyId: string; operator: string; commercialReference: string; reason: string; now?: Date }
) => prisma.$transaction(async (tx) => {
  await lockOnboardingJourney(tx, input.journeyId);
  const now = input.now ?? new Date();
  const journey = await tx.onboardingJourney.findUnique({ where: { id: input.journeyId } });
  if (!journey || journey.status !== "ACTIVE" || journey.accessRevokedAt || journey.commercialReference !== input.commercialReference) {
    throw new Error("onboarding_journey_not_eligible");
  }
  const issued = await issueForJourney(tx, { journeyId: input.journeyId, operator: input.operator, commercialReference: input.commercialReference, now });
  await audit(tx, { event: "magic_link_reissued", journeyId: input.journeyId, actor: input.operator, commercialReference: input.commercialReference, reason: input.reason, result: "created" });
  return issued;
});

export const revokeOnboardingAccess = async (
  prisma: PrismaClientLike,
  input: { journeyId: string; operator: string; commercialReference: string; reason: string; now?: Date }
) => prisma.$transaction(async (tx) => {
  await lockOnboardingJourney(tx, input.journeyId);
  const now = input.now ?? new Date();
  const journey = await tx.onboardingJourney.findUnique({ where: { id: input.journeyId } });
  if (!journey || journey.commercialReference !== input.commercialReference) {
    throw new Error("onboarding_journey_not_found");
  }
  await tx.onboardingJourney.update({ where: { id: input.journeyId }, data: { accessRevokedAt: now } });
  await tx.onboardingMagicLink.updateMany({ where: { journeyId: input.journeyId, revokedAt: null }, data: { revokedAt: now } });
  await tx.onboardingSession.updateMany({ where: { journeyId: input.journeyId, revokedAt: null }, data: { revokedAt: now } });
  await audit(tx, { event: "magic_link_revoked", journeyId: input.journeyId, actor: input.operator, commercialReference: input.commercialReference, reason: input.reason, result: "revoked" });
  await audit(tx, { event: "session_revoked", journeyId: input.journeyId, actor: input.operator, commercialReference: input.commercialReference, reason: input.reason, result: "all_active_sessions_revoked" });
});

export type RedeemResult =
  | { ok: true; sessionSecret: string; journeyId: string; sessionExpiresAt: Date }
  | { ok: false; reason: "invalid" | "expired" | "used" | "revoked" | "closed" };

export const redeemOnboardingMagicLink = async (
  prisma: PrismaClientLike,
  secret: string,
  fixedNow?: Date
): Promise<RedeemResult> => {
  if (!isValidOpaqueSecretFormat(secret)) return { ok: false, reason: "invalid" };
  const tokenHash = hashOpaqueSecret(secret);
  return prisma.$transaction(async (tx) => {
    const initialLink = await tx.onboardingMagicLink.findUnique({ where: { tokenHash } });
    if (!initialLink) return { ok: false, reason: "invalid" };
    await lockOnboardingJourney(tx, initialLink.journeyId);
    const link = await tx.onboardingMagicLink.findUnique({ where: { tokenHash }, include: { journey: true } });
    const now = fixedNow ?? new Date();
    if (!link) return { ok: false, reason: "invalid" };
    if (link.revokedAt || link.journey.accessRevokedAt) return { ok: false, reason: "revoked" };
    if (link.usedAt) return { ok: false, reason: "used" };
    if (link.expiresAt <= now) {
      await audit(tx, { event: "magic_link_expired", journeyId: link.journeyId, result: "expired" });
      return { ok: false, reason: "expired" };
    }
    if (link.journey.status !== "ACTIVE") return { ok: false, reason: "closed" };

    const consumed = await tx.onboardingMagicLink.updateMany({
      where: { id: link.id, usedAt: null, revokedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now }
    });
    if (consumed.count !== 1) return { ok: false, reason: "used" };

    const sessionSecret = createOpaqueSecret();
    const sessionExpiresAt = new Date(now.getTime() + ONBOARDING_SESSION_TTL_MS);
    await tx.onboardingSession.create({
      data: { id: randomUUID(), journeyId: link.journeyId, tokenHash: hashOpaqueSecret(sessionSecret), createdAt: now, expiresAt: sessionExpiresAt }
    });
    await audit(tx, { event: "magic_link_redeemed", journeyId: link.journeyId, result: "consumed" });
    await audit(tx, { event: "session_created", journeyId: link.journeyId, result: "created" });
    return { ok: true, sessionSecret, journeyId: link.journeyId, sessionExpiresAt };
  });
};

export const resolveOnboardingSession = async (prisma: PrismaClientLike, secret: string, now = new Date()) => {
  if (!isValidOpaqueSecretFormat(secret)) return null;
  const session = await prisma.onboardingSession.findUnique({
    where: { tokenHash: hashOpaqueSecret(secret) },
    include: { journey: true }
  });
  if (!session || session.revokedAt || session.journey.accessRevokedAt || session.journey.status === "CLOSED") return null;
  if (session.expiresAt <= now) {
    if (!session.expiredAt) {
      await prisma.onboardingSession.updateMany({ where: { id: session.id, expiredAt: null }, data: { expiredAt: now } });
      await prisma.onboardingAuditEvent.create({
        data: { id: randomUUID(), event: "session_expired", journeyId: session.journeyId, result: "expired" }
      });
    }
    return null;
  }
  return { id: session.id, journeyId: session.journeyId, status: session.journey.status, expiresAt: session.expiresAt };
};

export const getOnboardingSecretFromRequest = (request: Request) => {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ONBOARDING_SESSION_COOKIE}=`));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(ONBOARDING_SESSION_COOKIE.length + 1));
  } catch {
    return null;
  }
};

export const resolveRequestOnboardingSession = async (request: Request) => {
  const secret = getOnboardingSecretFromRequest(request);
  if (!secret) return null;
  try {
    return await resolveOnboardingSession(getPrisma(), secret);
  } catch {
    return null;
  }
};

export const isSameOriginMutation = (request: Request) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) return false;
  try {
    if (!host) return false;
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.username || parsedOrigin.password || parsedOrigin.pathname !== "/" || parsedOrigin.search || parsedOrigin.hash) return false;
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const requestProtocol = new URL(request.url).protocol.slice(0, -1);
    const effectiveProtocol = forwardedProtocol || requestProtocol;
    const requestHost = new URL(`${effectiveProtocol}://${host}`).host;
    if (parsedOrigin.host !== requestHost || parsedOrigin.protocol !== `${effectiveProtocol}:`) return false;
  } catch {
    return false;
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  return fetchSite !== "cross-site";
};

type AttemptBucket = { startedAt: number; count: number };
const redeemAttempts = new Map<string, AttemptBucket>();
export const allowMagicLinkAttempt = (request: Request, now = Date.now()) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  const address = request.headers.get("x-real-ip")?.trim() || forwarded || "unknown";
  const key = createHash("sha256").update(address).digest("hex");
  const current = redeemAttempts.get(key);
  if (!current || now - current.startedAt >= 60_000) {
    if (redeemAttempts.size > 10_000) {
      for (const [candidate, bucket] of redeemAttempts) if (now - bucket.startedAt >= 60_000) redeemAttempts.delete(candidate);
    }
    redeemAttempts.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
};

export const getOnboardingSessionCookie = (secret: string, expiresAt: Date, secure: boolean) =>
  `${ONBOARDING_SESSION_COOKIE}=${encodeURIComponent(secret)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor((expiresAt.getTime() - Date.now()) / 1000)}${secure ? "; Secure" : ""}`;

export const getClearedOnboardingSessionCookie = (secure: boolean) =>
  `${ONBOARDING_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;

export const isSecureCookieRequest = (request: Request) => {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const url = new URL(request.url);
  return forwardedProtocol === "https" || url.protocol === "https:" || (process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(request.headers.get("host")?.split(":")[0] || url.hostname));
};

export const getOnboardingPrisma = () => getPrisma();
