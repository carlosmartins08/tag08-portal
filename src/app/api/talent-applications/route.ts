import { optionsResponse } from "../../../lib/api/response";
import { createTalentApplicationPostHandler } from "../../../../server/talentApplicationPostHandler";

export const runtime = "nodejs";
export const POST = createTalentApplicationPostHandler();

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}
