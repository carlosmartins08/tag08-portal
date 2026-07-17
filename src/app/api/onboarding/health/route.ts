import { ONBOARDING_PAYLOAD_VERSION } from "../../../../../server/onboardingContract";
import { jsonResponse, optionsResponse } from "../../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  return jsonResponse({
    ok: true,
    service: "tag08-onboarding-api",
    schemaVersion: ONBOARDING_PAYLOAD_VERSION,
    status: "online",
    timestamp: new Date().toISOString()
  }, 200, request);
}
