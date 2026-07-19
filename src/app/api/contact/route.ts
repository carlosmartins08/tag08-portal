import { contactLeadSchema } from "../../../../server/submissionContracts";
import { isPersistenceUnavailable, persistContactLead } from "../../../../server/submissionStore";
import {
  CONTACT_REQUEST_MAX_BYTES,
  createRequestId,
  hasHoneypotValue,
  jsonResponse,
  optionsResponse,
  readJsonBody
} from "../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const body = await readJsonBody(request, CONTACT_REQUEST_MAX_BYTES);
  if (body.ok === false) {
    return jsonResponse({ ok: false, error: body.error, requestId }, body.error === "payload_too_large" ? 413 : 400, request);
  }

  if (hasHoneypotValue(body.payload)) {
    return jsonResponse({ ok: false, error: "invalid_payload", requestId }, 400, request);
  }

  const parsed = contactLeadSchema.safeParse(body.payload);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "invalid_payload", requestId }, 400, request);
  }

  try {
    const idempotencyKey = request.headers.get("idempotency-key") || requestId;
    const result = await persistContactLead(parsed.data, idempotencyKey);
    return jsonResponse({ ok: true, leadId: result.id, status: "accepted", replayed: !result.created, requestId }, 202, request);
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, error: "persistence_unavailable", requestId }, 503, request);
    }

    console.error(JSON.stringify({ event: "contact_submission_failed", requestId, error: "persistence_error" }));
    return jsonResponse({ ok: false, error: "persistence_error", requestId }, 500, request);
  }
}
