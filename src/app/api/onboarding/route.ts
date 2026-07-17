import { ONBOARDING_PAYLOAD_VERSION, parseAndValidatePayload } from "../../../../server/onboardingContract";
import { isPersistenceUnavailable, persistOnboardingSubmission } from "../../../../server/submissionStore";
import { createRequestId, jsonResponse, optionsResponse } from "../../../lib/api/response";

export const runtime = "nodejs";

const resolveQueueHint = (payload: unknown): boolean => {
  if (!payload || typeof payload !== "object") return false;
  const meta = (payload as { meta?: { replayedFromQueue?: unknown } }).meta;
  return meta?.replayedFromQueue === true;
};

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const requestId = createRequestId();
  const fromQueue = resolveQueueHint(payload);
  const result = parseAndValidatePayload(payload);

  if (result.errors.length > 0) {
    console.warn(JSON.stringify({ event: "onboarding_submission_rejected", requestId, error: "invalid_payload" }));
    return jsonResponse({ ok: false, status: "failed", error: result.errors.join(" | "), requestId }, 400, request);
  }

  result.payload.schemaVersion = ONBOARDING_PAYLOAD_VERSION;
  result.payload.status = "accepted";
  result.payload.meta = { ...result.payload.meta, replayedFromQueue: fromQueue };

  try {
    const idempotencyKey = request.headers.get("idempotency-key") || result.payload.meta?.queueEntryId || requestId;
    const persisted = await persistOnboardingSubmission(result.payload, idempotencyKey);
    const receivedAt = new Date().toISOString();

    console.log(JSON.stringify({ event: "onboarding_submission_accepted", requestId, submissionId: persisted.id, fromQueue, replayed: !persisted.created }));

    return jsonResponse({ ok: true, submissionId: persisted.id, status: "accepted", schemaVersion: ONBOARDING_PAYLOAD_VERSION, receivedAt, requestId }, 202, request);
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, status: "failed", error: "persistence_unavailable", requestId }, 503, request);
    }

    console.error(JSON.stringify({ event: "onboarding_submission_failed", requestId, error: "persistence_error" }));
    return jsonResponse({ ok: false, status: "failed", error: "persistence_error", requestId }, 500, request);
  }
}
