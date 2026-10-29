export const EDITORIAL_CONTRACT_VERSION = "tag08.editorial.v1" as const;

export const EDITORIAL_SECTION_ROUTES = {
  home: "/",
  "service:branding": "/servicos/branding-identidade",
  "service:social-media": "/servicos/gestao-de-redes-sociais",
  "service:web-development": "/servicos/desenvolvimento-web",
  "service:strategic-marketing": "/servicos/assessoria-marketing-digital-estrategico",
  "service:audiovisual": "/servicos/producao-audiovisual",
  "service:process-activation": "/servicos/process-activation",
  "service:process-intelligence": "/servicos/process-intelligence",
  "service:hosting-maintenance": "/hospedagem-manutencao-sites",
  "program:partnership": "/programa-afiliados",
} as const;

export type EditorialSectionId = keyof typeof EDITORIAL_SECTION_ROUTES;

export interface EditorialTermV1 {
  id: string;
  slug: string;
  name: string;
}

export interface EditorialArticleV1 {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: { format: "html" | "markdown"; value: string };
  categories: EditorialTermV1[];
  tags: EditorialTermV1[];
  image: { url: string; altText: string } | null;
  author: { id: string | null; name: string } | null;
  publishedAt: string;
  updatedAt: string | null;
  locale: string;
  status: "published";
  canonicalUrl: string;
}

export interface EditorialContentEnvelopeV1 {
  contractVersion: typeof EDITORIAL_CONTRACT_VERSION;
  generatedAt: string;
  items: EditorialArticleV1[];
}

export interface EditorialCardV1 {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image: EditorialArticleV1["image"];
  author: EditorialArticleV1["author"];
  publishedAt: string;
  locale: string;
  canonicalUrl: string;
}

export type EditorialRelationshipsV1 = Readonly<
  Partial<Record<string, readonly EditorialSectionId[]>>
>;

/** Curadoria do portal; preenchida somente com IDs estáveis e relações aprovadas. */
export const EDITORIAL_RELATIONSHIPS_V1: EditorialRelationshipsV1 = Object.freeze({});

const BLOG_ORIGIN = "https://blog.tag08.com.br";
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

function isTerm(value: unknown): value is EditorialTermV1 {
  return isRecord(value) && isNonEmptyString(value.id) &&
    isNonEmptyString(value.slug) && isNonEmptyString(value.name);
}

export function isCanonicalBlogArticleUrl(value: unknown, slug: string): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.origin === BLOG_ORIGIN &&
      url.pathname === `/artigo/${encodeURIComponent(slug)}` &&
      !url.search && !url.hash && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isArticle(value: unknown): value is EditorialArticleV1 {
  if (!isRecord(value) || !isNonEmptyString(value.id) || !isNonEmptyString(value.slug) ||
    !isNonEmptyString(value.title) || typeof value.summary !== "string" ||
    !isRecord(value.body) || !["html", "markdown"].includes(String(value.body.format)) ||
    typeof value.body.value !== "string" || !Array.isArray(value.categories) ||
    !value.categories.every(isTerm) || !Array.isArray(value.tags) || !value.tags.every(isTerm) ||
    !(value.image === null || (isRecord(value.image) && isNonEmptyString(value.image.url) && typeof value.image.altText === "string")) ||
    !(value.author === null || (isRecord(value.author) &&
      (value.author.id === null || isNonEmptyString(value.author.id)) && isNonEmptyString(value.author.name))) ||
    !isIsoDate(value.publishedAt) || !(value.updatedAt === null || isIsoDate(value.updatedAt)) ||
    !isNonEmptyString(value.locale) || value.status !== "published") {
    return false;
  }

  return isCanonicalBlogArticleUrl(value.canonicalUrl, value.slug);
}

export function parseEditorialContentEnvelopeV1(value: unknown): EditorialContentEnvelopeV1 | null {
  if (!isRecord(value) || value.contractVersion !== EDITORIAL_CONTRACT_VERSION ||
    !isIsoDate(value.generatedAt) || !Array.isArray(value.items) || !value.items.every(isArticle)) {
    return null;
  }

  const seenIds = new Set<string>();
  for (const article of value.items) {
    if (seenIds.has(article.id)) return null;
    seenIds.add(article.id);
  }

  return value as unknown as EditorialContentEnvelopeV1;
}

export function selectEditorialCardsForSection(
  envelope: EditorialContentEnvelopeV1,
  sectionId: EditorialSectionId,
  relationships: EditorialRelationshipsV1 = EDITORIAL_RELATIONSHIPS_V1,
): EditorialCardV1[] {
  return envelope.items.flatMap((article) => {
    if (article.status !== "published" || !relationships[article.id]?.includes(sectionId)) return [];
    const { id, slug, title, summary, image, author, publishedAt, locale, canonicalUrl } = article;
    return [{ id, slug, title, summary, image, author, publishedAt, locale, canonicalUrl }];
  });
}
