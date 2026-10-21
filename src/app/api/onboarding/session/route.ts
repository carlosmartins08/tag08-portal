import { randomUUID } from "node:crypto";
import { getOnboardingPrisma, getOnboardingSecretFromRequest, getClearedOnboardingSessionCookie, hashOpaqueSecret, isSameOriginMutation, isSecureCookieRequest, resolveRequestOnboardingSession } from "../../../../../server/onboardingAccess";
import { jsonResponse } from "../../../../lib/api/response";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await resolveRequestOnboardingSession(request);
  return session
    ? jsonResponse({ ok: true, expiresAt: session.expiresAt.toISOString(), completed: session.status === "COMPLETED" }, 200, request)
    : jsonResponse({ ok: false, error: "access_unavailable" }, 401, request);
}

export async function DELETE(request: Request) {
  if (!isSameOriginMutation(request)) return jsonResponse({ ok: false, error: "access_unavailable" }, 400, request);
  const session = await resolveRequestOnboardingSession(request);
  const secret = getOnboardingSecretFromRequest(request);
  if (!session || !secret) return jsonResponse({ ok: true }, 200, request, {
    "Set-Cookie": getClearedOnboardingSessionCookie(isSecureCookieRequest(request))
  });

  try {
    const prisma = getOnboardingPrisma();
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const revoked = await tx.onboardingSession.updateMany({
        where: { id: session.id, tokenHash: hashOpaqueSecret(secret), revokedAt: null },
        data: { revokedAt: now }
      });
      if (revoked.count === 1) {
        await tx.onboardingAuditEvent.create({
          data: { id: randomUUID(), journeyId: session.journeyId, event: "session_revoked", result: "operator_logout" }
        });
      }
    });
    return jsonResponse({ ok: true }, 200, request, {
      "Set-Cookie": getClearedOnboardingSessionCookie(isSecureCookieRequest(request))
    });
  } catch {
    return jsonResponse({ ok: false, error: "session_unavailable" }, 503, request);
  }
}
