import { ONBOARDING_PAYLOAD_VERSION } from "../../../../../server/onboardingContract";
import { jsonResponse, optionsResponse } from "../../../../lib/api/response";
import { getPrisma } from "../../../../lib/server/prisma";

export const runtime = "nodejs";
const DATABASE_HEALTH_TIMEOUT_MS = 5_000;

const checkDatabase = () => Promise.race([
  getPrisma().$queryRaw`SELECT 1`,
  new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("database_health_timeout")), DATABASE_HEALTH_TIMEOUT_MS);
  })
]);

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  try {
    // A bounded query detects an unavailable database without exposing its details.
    await checkDatabase();

    return jsonResponse({
      ok: true,
      service: "tag08-onboarding-api",
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      status: "online",
      timestamp: new Date().toISOString()
    }, 200, request);
  } catch {
    return jsonResponse({
      ok: false,
      service: "tag08-onboarding-api",
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      status: "unavailable",
      timestamp: new Date().toISOString()
    }, 503, request);
  }
}
