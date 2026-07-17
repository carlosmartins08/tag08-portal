import { buildOfficialContentFallbackResponse, getOfficialContentResponse } from "../../../../server/officialContent";
import { jsonResponse, optionsResponse } from "../../../lib/api/response";

export const runtime = "nodejs";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  const response = await getOfficialContentResponse();
  return jsonResponse(response.ok ? response : buildOfficialContentFallbackResponse());
}
