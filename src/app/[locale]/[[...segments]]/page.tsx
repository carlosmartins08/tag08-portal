import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import SiteShell from "../../../features/site/SiteShell";
import RouteContent from "../../../features/site/RouteContent";
import {
  canonicalizeRoute,
  getLocalizedPath,
  getRouteByPath,
  isLocaleIndexable,
  isRouteLocalePublished,
  resolveLocalizedPath,
  staticRouteSegments,
  ROUTE_LOCALES,
  type RouteLocale
} from "../../../config/routeRegistry";
import {
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildOrganizationSchema,
  getAbsoluteLocalizedUrl,
  getAlternates,
  getOpenGraphLocale,
  getRouteSeo
} from "../../../lib/seo";

type RoutePageProps = {
  params: Promise<{ locale: string; segments?: string[] }>;
};

const DEFAULT_OG_IMAGE = "https://tag08.com.br/brand/92ppi/symbol-primary1200x630.jpg";

const resolveRoute = async (params: RoutePageProps["params"]) => {
  const { locale, segments = [] } = await params;
  const validLocale = ROUTE_LOCALES.includes(locale as RouteLocale);
  const path = segments.length ? `/${segments.join("/")}` : "/";
  const canonicalPath = canonicalizeRoute(path);
  const route = getRouteByPath(canonicalPath);

  return { locale: (validLocale ? locale : "pt") as RouteLocale, path, validLocale, canonicalPath, route };
};

export const generateStaticParams = () =>
  staticRouteSegments()
    // The authenticated onboarding has its own dynamic route and must never
    // be emitted by this public catchall as a static page.
    .filter((segments) => resolveLocalizedPath(segments).path !== "/cliente/onboarding")
    .map((segments) => {
    const resolved = resolveLocalizedPath(segments);

    return {
      locale: resolved.locale,
      segments: resolved.path === "/" ? undefined : resolved.path.slice(1).split("/")
    };
    });

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { locale, validLocale, canonicalPath, route } = await resolveRoute(params);
  if (!validLocale || !route || route.key === "not-found") {
    return { robots: { index: false, follow: true } };
  }

  const seo = getRouteSeo(route, canonicalPath, locale);
  const localePublished = isRouteLocalePublished(route, locale);
  const canonicalUrl = getAbsoluteLocalizedUrl(canonicalPath, localePublished ? locale : "pt");

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getAlternates(canonicalPath)
    },
    robots: route.indexable && localePublished && isLocaleIndexable(locale) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      type: route.key === "insights" && canonicalPath !== "/insights" ? "article" : "website",
      locale: getOpenGraphLocale(locale),
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: seo.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { locale, path, validLocale, canonicalPath, route } = await resolveRoute(params);

  if (!validLocale || !route || route.key === "not-found") {
    notFound();
  }

  if (canonicalPath !== path) {
    permanentRedirect(getLocalizedPath(canonicalPath, locale as RouteLocale));
  }

  // The proxy owns the canonical redirect for unpublished locales. Keep this
  // page-level guard as a not-found fallback so a missed proxy cannot serve
  // Portuguese content under an English or Spanish URL.
  if (!isRouteLocalePublished(route, locale)) {
    notFound();
  }

  const organizationSchema = buildOrganizationSchema(locale);
  const breadcrumbSchema = buildBreadcrumbSchema(route, canonicalPath, locale);
  const articleSchema = route.key === "insights" && canonicalPath !== "/insights"
    ? buildArticleSchema(canonicalPath, locale)
    : null;

  return (
    <>
      <script id="schema-org-organization" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {breadcrumbSchema ? (
        <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      ) : null}
      {articleSchema ? (
        <script id="schema-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      ) : null}
      <SiteShell path={canonicalPath} locale={locale}>
        <RouteContent path={canonicalPath} locale={locale} />
      </SiteShell>
    </>
  );
}
