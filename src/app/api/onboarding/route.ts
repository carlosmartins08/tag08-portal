import { ONBOARDING_PAYLOAD_VERSION, parseAndValidatePayload } from "../../../../server/onboardingContract";
import { getPersistenceErrorCode, isPersistenceUnavailable, persistOnboardingSubmission } from "../../../../server/submissionStore";
import {
  ONBOARDING_REQUEST_MAX_BYTES,
  createRequestId,
  hasHoneypotValue,
  jsonResponse,
  optionsResponse,
  readJsonBody
} from "../../../lib/api/response";
import { getOnboardingSecretFromRequest, isSameOriginMutation, resolveRequestOnboardingSession } from "../../../../server/onboardingAccess";
import { isOnboardingEnabled } from "../../../../server/onboardingAvailability.mjs";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  if (!isOnboardingEnabled()) return jsonResponse({ ok: false, status: "failed", error: "unavailable" }, 404, request);
  return optionsResponse(request);
}

export async function POST(request: Request) {
  if (!isOnboardingEnabled()) return jsonResponse({ ok: false, status: "failed", error: "unavailable" }, 404, request);
  if (!isSameOriginMutation(request)) return jsonResponse({ ok: false, status: "failed", error: "access_unavailable" }, 400, request);
  const session = await resolveRequestOnboardingSession(request);
  const sessionSecret = getOnboardingSecretFromRequest(request);
  if (!session || !sessionSecret) return jsonResponse({ ok: false, status: "failed", error: "access_unavailable" }, 401, request);
  const requestId = createRequestId();
  const body = await readJsonBody(request, ONBOARDING_REQUEST_MAX_BYTES);
  if (body.ok === false) {
    return jsonResponse(
      { ok: false, status: "failed", error: body.error, requestId },
      body.error === "payload_too_large" ? 413 : 400,
      request
    );
  }

  const payload = body.payload;
  if (hasHoneypotValue(payload)) {
    return jsonResponse({ ok: false, status: "failed", error: "invalid_payload", requestId }, 400, request);
  }

  const result = parseAndValidatePayload(payload);

  if (result.errors.length > 0) {
    console.warn(JSON.stringify({ event: "onboarding_submission_rejected", requestId, error: "invalid_payload" }));
    return jsonResponse({ ok: false, status: "failed", error: result.errors.join(" | "), requestId }, 400, request);
  }

  result.payload.schemaVersion = ONBOARDING_PAYLOAD_VERSION;
  result.payload.status = "accepted";
  result.payload.submissionContext = { submittedBy: "client" };
  result.payload.consent.authorizationConfirmedByOperator = false;

  try {
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey || idempotencyKey.length > 128 || !/^[A-Za-z0-9_.:-]+$/.test(idempotencyKey)) {
      return jsonResponse({ ok: false, status: "failed", error: "idempotency_key_required", requestId }, 400, request);
    }
    const persisted = await persistOnboardingSubmission(result.payload, idempotencyKey, {
      journeyId: session.journeyId,
      sessionId: session.id,
      sessionSecret
    });
    const receivedAt = new Date().toISOString();

    console.log(JSON.stringify({ event: "onboarding_submission_accepted", requestId, submissionId: persisted.id, replayed: !persisted.created }));

    return jsonResponse({ ok: true, submissionId: persisted.id, status: "accepted", schemaVersion: ONBOARDING_PAYLOAD_VERSION, receivedAt, requestId }, 202, request);
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, status: "failed", error: "persistence_unavailable", requestId }, 503, request);
    }

    console.error(JSON.stringify({ event: "onboarding_submission_failed", requestId, error: "persistence_error", code: getPersistenceErrorCode(error) }));
    return jsonResponse({ ok: false, status: "failed", error: "persistence_error", requestId }, 500, request);
  }
}
