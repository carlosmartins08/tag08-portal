import { buildOfficialContentFallbackResponse, getOfficialContentResponse } from "../../../../server/officialContent";
import { jsonResponse, optionsResponse } from "../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function GET(request: Request) {
  const response = await getOfficialContentResponse();
  return jsonResponse(response.ok ? response : buildOfficialContentFallbackResponse(), 200, request);
}
