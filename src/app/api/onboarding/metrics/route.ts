import { ONBOARDING_PAYLOAD_VERSION } from "../../../../../server/onboardingContract";
import { getOperationalMetrics, isPersistenceUnavailable } from "../../../../../server/submissionStore";
import { jsonResponse, optionsResponse } from "../../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  if (!process.env.INTERNAL_API_TOKEN || request.headers.get("authorization") !== `Bearer ${process.env.INTERNAL_API_TOKEN}`) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  try {
    return jsonResponse({ ok: true, schemaVersion: ONBOARDING_PAYLOAD_VERSION, ...(await getOperationalMetrics()) });
  } catch (error) {
    if (isPersistenceUnavailable(error)) {
      return jsonResponse({ ok: false, error: "persistence_unavailable" }, 503);
    }

    return jsonResponse({ ok: false, error: "metrics_unavailable" }, 500);
  }
}
