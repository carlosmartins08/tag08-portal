import {
  EDITORIAL_SECTION_ROUTES,
  parseEditorialContentEnvelopeV1,
  selectEditorialCardsForSection,
  type EditorialCardV1,
  type EditorialSectionId,
  type EditorialRelationshipsV1,
} from "../src/content/editorialContentV1";

export type EditorialProjectionFailure =
  | "not_configured"
  | "invalid_section"
  | "upstream_unavailable"
  | "invalid_contract";

export type EditorialProjectionResult =
  | { ok: true; sectionId: EditorialSectionId; route: string; items: EditorialCardV1[] }
  | { ok: false; error: EditorialProjectionFailure };

interface ReaderOptions {
  apiUrl?: string;
  fetcher?: typeof fetch;
  relationships?: EditorialRelationshipsV1;
}

function resolveApiUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "blog.tag08.com.br" ||
      url.pathname !== "/api/v1/editorial-content" || url.search || url.hash ||
      url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

export async function readEditorialProjection(
  sectionId: string,
  options: ReaderOptions = {},
): Promise<EditorialProjectionResult> {
  if (!Object.hasOwn(EDITORIAL_SECTION_ROUTES, sectionId)) {
    return { ok: false, error: "invalid_section" };
  }

  const apiUrl = resolveApiUrl(options.apiUrl ?? process.env.TAG08_BLOG_EDITORIAL_API_URL);
  if (!apiUrl) return { ok: false, error: "not_configured" };

  try {
    const response = await (options.fetcher ?? fetch)(apiUrl, { cache: "no-store" });
    if (!response.ok) return { ok: false, error: "upstream_unavailable" };
    const envelope = parseEditorialContentEnvelopeV1(await response.json());
    if (!envelope) return { ok: false, error: "invalid_contract" };

    return {
      ok: true,
      sectionId: sectionId as EditorialSectionId,
      route: EDITORIAL_SECTION_ROUTES[sectionId as EditorialSectionId],
      items: selectEditorialCardsForSection(
        envelope,
        sectionId as EditorialSectionId,
        options.relationships,
      ),
    };
  } catch {
    return { ok: false, error: "upstream_unavailable" };
  }
}
