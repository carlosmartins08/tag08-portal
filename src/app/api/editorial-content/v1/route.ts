import { NextResponse } from "next/server";
import { EDITORIAL_SECTION_ROUTES } from "../../../../content/editorialContentV1";
import { readEditorialProjection } from "../../../../../server/editorialProjectionReader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const sectionId = new URL(request.url).searchParams.get("sectionId");
  if (!sectionId || !Object.hasOwn(EDITORIAL_SECTION_ROUTES, sectionId)) {
    return NextResponse.json({ ok: false, error: "invalid_section" }, {
      status: 400,
      headers: NO_STORE_HEADERS,
    });
  }

  const result = await readEditorialProjection(sectionId);
  if (!("error" in result)) {
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json(result, {
    status: result.error === "not_configured" ? 503 : 502,
    headers: NO_STORE_HEADERS,
  });
}
