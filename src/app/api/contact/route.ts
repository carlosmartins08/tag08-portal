import { optionsResponse } from "../../../lib/api/response";
import { createContactPostHandler } from "../../../../server/contactPostHandler";

export const runtime = "nodejs";
export const POST = createContactPostHandler();

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}
