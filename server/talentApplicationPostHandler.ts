import { contactIdempotencyKeySchema, talentApplicationSchema } from "./submissionContracts";
import { isPersistenceUnavailable } from "./submissionErrors";
import { persistTalentApplicationToSheets } from "./operationalSubmissionStore.mjs";
import {
  CONTACT_REQUEST_MAX_BYTES,
  createRequestId,
  hasHoneypotValue,
  jsonResponse,
  readJsonBody
} from "../src/lib/api/response";

type TalentPersist = typeof persistTalentApplicationToSheets;

export const createTalentApplicationPostHandler = (persist: TalentPersist = persistTalentApplicationToSheets) => async (request: Request) => {
  const requestId = createRequestId();
  const body = await readJsonBody(request, CONTACT_REQUEST_MAX_BYTES);
  if (body.ok === false) {
    return jsonResponse({ ok: false, error: body.error, requestId }, body.error === "payload_too_large" ? 413 : 400, request);
  }

  if (hasHoneypotValue(body.payload)) {
    return jsonResponse({ ok: false, error: "invalid_payload", requestId }, 400, request);
  }

  const parsed = talentApplicationSchema.safeParse(body.payload);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "invalid_payload", requestId }, 400, request);
  }

  const parsedIdempotencyKey = contactIdempotencyKeySchema.safeParse(request.headers.get("idempotency-key"));
  if (!parsedIdempotencyKey.success) {
    return jsonResponse({ ok: false, error: "idempotency_key_required", requestId }, 400, request);
  }

  try {
    const result = await persist(parsed.data, parsedIdempotencyKey.data);
    return jsonResponse({
      ok: true,
      applicationId: result.id,
      status: "accepted",
      replayed: !result.created,
      ...(result.clickUpStatus ? { deliveryStatus: { sheets: "delivered", sheetsRowReference: result.sheetsRowReference, clickUp: result.clickUpStatus } } : {}),
      requestId
    }, 202, request);
  } catch (error) {
    if (error instanceof Error && error.message === "idempotency_key_conflict") {
      return jsonResponse({ ok: false, error: "idempotency_key_conflict", requestId }, 409, request);
    }
    if (isPersistenceUnavailable(error) || (error && typeof error === "object" && "code" in error && /^(google_|submission_)/.test(String(error.code)))) {
      return jsonResponse({ ok: false, error: "persistence_unavailable", requestId }, 503, request);
    }

    console.error(JSON.stringify({ event: "talent_application_failed", requestId, error: "persistence_error" }));
    return jsonResponse({ ok: false, error: "persistence_error", requestId }, 500, request);
  }
};
