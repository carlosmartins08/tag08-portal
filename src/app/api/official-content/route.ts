import { buildOfficialContentFallbackResponse, getOfficialContentResponse } from "../../../../server/officialContent";
import { jsonResponse, optionsResponse } from "../../../lib/api/response";
import type { RouteLocale } from "../../../config/routeRegistry";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedLocale = url.searchParams.get("locale");
  const locale: RouteLocale = requestedLocale === "en" || requestedLocale === "es" ? requestedLocale : "pt";
  const response = await getOfficialContentResponse(locale);
  const requireLiveGoogleBusiness = url.searchParams.get("requireLive") === "googleBusiness";

  // The public endpoint remains resilient and can render its editorial fallback.
  // Monitoring uses this explicit probe so a fallback is never mistaken for a
  // healthy Google Business Profile integration.
  if (requireLiveGoogleBusiness && response.sources.googleBusiness !== "live") {
    return jsonResponse(
      {
        ...response,
        ok: false,
        error: "google_business_not_live"
      },
      503,
      request
    );
  }

  return jsonResponse(response.ok ? response : buildOfficialContentFallbackResponse(), 200, request);
}
