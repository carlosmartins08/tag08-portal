import { ONBOARDING_PAYLOAD_VERSION } from "../../../../../server/onboardingContract";
import { getOperationalMetrics, isPersistenceUnavailable } from "../../../../../server/submissionStore";
import { jsonResponse, optionsResponse } from "../../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  if (!process.env.INTERNAL_API_TOKEN || request.headers.get("authorization") !== `Bearer ${process.env.INTERNAL_API_TOKEN}`) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401, request);
  }

  try {
    return jsonResponse({ ok: true, schemaVersion: ONBOARDING_PAYLOAD_VERSION, ...(await getOperationalMetrics()) }, 200, request);
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, error: "persistence_unavailable" }, 503, request);
    }

    return jsonResponse({ ok: false, error: "metrics_unavailable" }, 500, request);
  }
}
