import { redeemOnboardingMagicLink, allowMagicLinkAttempt, getOnboardingPrisma, getOnboardingSessionCookie, isSameOriginMutation, isSecureCookieRequest } from "../../../../../../server/onboardingAccess";
import { jsonResponse, readJsonBody } from "../../../../../lib/api/response";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return jsonResponse({ ok: false, error: "access_unavailable" }, 400);
  if (!allowMagicLinkAttempt(request)) return jsonResponse({ ok: false, error: "access_unavailable" }, 429);
  const body = await readJsonBody(request, 2_048);
  const token = body.ok && body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
    ? (body.payload as { token?: unknown }).token
    : undefined;
  if (typeof token !== "string") return jsonResponse({ ok: false, error: "access_unavailable" }, 400);

  try {
    const result = await redeemOnboardingMagicLink(getOnboardingPrisma(), token);
    if (!result.ok) return jsonResponse({ ok: false, error: "access_unavailable" }, 400);
    return jsonResponse({ ok: true }, 200, request, {
      "Set-Cookie": getOnboardingSessionCookie(result.sessionSecret, result.sessionExpiresAt, isSecureCookieRequest(request))
    });
  } catch {
    return jsonResponse({ ok: false, error: "access_unavailable" }, 503);
  }
}
