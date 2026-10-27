import { hashOpaqueSecret, getOnboardingPrisma, getOnboardingSecretFromRequest, isSameOriginMutation, resolveRequestOnboardingSession } from "../../../../../server/onboardingAccess";
import { parseOnboardingDraft } from "../../../../lib/onboardingDraft";
import { jsonResponse, readJsonBody } from "../../../../lib/api/response";
import { isOnboardingEnabled } from "../../../../../server/onboardingAvailability.mjs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isOnboardingEnabled()) return jsonResponse({ ok: false, error: "access_unavailable" }, 404, request);
  const session = await resolveRequestOnboardingSession(request);
  if (!session) return jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
  try {
    const secret = getOnboardingSecretFromRequest(request);
    if (!secret) return jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
    const authorizedSession = await getOnboardingPrisma().onboardingSession.findFirst({
      where: {
        id: session.id,
        journeyId: session.journeyId,
        tokenHash: hashOpaqueSecret(secret),
        revokedAt: null,
        expiresAt: { gt: new Date() },
        journey: { is: { status: { in: ["ACTIVE", "COMPLETED"] }, accessRevokedAt: null } }
      },
      include: { journey: { select: { draft: true, status: true } } }
    });
    if (!authorizedSession) return jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
    return jsonResponse({ ok: true, draft: authorizedSession.journey.draft, completed: authorizedSession.journey.status === "COMPLETED" }, 200, request);
  } catch {
    return jsonResponse({ ok: false, error: "progress_unavailable" }, 503, request);
  }
}

export async function PUT(request: Request) {
  if (!isOnboardingEnabled()) return jsonResponse({ ok: false, error: "access_unavailable" }, 404, request);
  if (!isSameOriginMutation(request)) return jsonResponse({ ok: false, error: "access_unavailable" }, 400, request);
  const session = await resolveRequestOnboardingSession(request);
  const secret = getOnboardingSecretFromRequest(request);
  if (!session || !secret) return jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
  const body = await readJsonBody(request, 64 * 1024);
  const candidate = body.ok && body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
    ? (body.payload as { draft?: unknown }).draft
    : undefined;
  const draft = parseOnboardingDraft(candidate);
  if (!draft) return jsonResponse({ ok: false, error: "invalid_progress" }, 400, request);

  try {
    const prisma = getOnboardingPrisma();
    const now = new Date();
    const saved = await prisma.$transaction(async (tx) => {
      const liveSession = await tx.onboardingSession.findFirst({
        where: { id: session.id, tokenHash: hashOpaqueSecret(secret), revokedAt: null, expiresAt: { gt: now }, journeyId: session.journeyId }
      });
      if (!liveSession) return false;
      const updated = await tx.onboardingJourney.updateMany({
        where: { id: session.journeyId, status: "ACTIVE", accessRevokedAt: null },
        data: { draft: JSON.parse(JSON.stringify(draft)) }
      });
      return updated.count === 1;
    }, { isolationLevel: "Serializable" });
    return saved
      ? jsonResponse({ ok: true }, 200, request)
      : jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
  } catch {
    return jsonResponse({ ok: false, error: "progress_unavailable" }, 503, request);
  }
}
