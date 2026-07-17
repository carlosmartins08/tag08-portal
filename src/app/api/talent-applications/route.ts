import { talentApplicationSchema } from "../../../../server/submissionContracts";
import { isPersistenceUnavailable, persistTalentApplication } from "../../../../server/submissionStore";
import { createRequestId, jsonResponse, optionsResponse } from "../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const parsed = talentApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "invalid_payload", requestId }, 400, request);
  }

  try {
    const idempotencyKey = request.headers.get("idempotency-key") || requestId;
    const result = await persistTalentApplication(parsed.data, idempotencyKey);
    return jsonResponse({ ok: true, applicationId: result.id, status: "accepted", replayed: !result.created, requestId }, 202, request);
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, error: "persistence_unavailable", requestId }, 503, request);
    }

    console.error(JSON.stringify({ event: "talent_application_failed", requestId, error: "persistence_error" }));
    return jsonResponse({ ok: false, error: "persistence_error", requestId }, 500, request);
  }
}
