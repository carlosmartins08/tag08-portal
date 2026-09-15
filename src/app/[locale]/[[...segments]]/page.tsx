import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import SiteShell from "../../../features/site/SiteShell";
import RouteContent from "../../../features/site/RouteContent";
import {
  canonicalizeRoute,
  getContentReviewRouteByPath,
  getLocalizedPath,
  getRouteByPath,
  isRouteLocalePublished,
  resolveLocalizedPath,
  staticRouteSegments,
  ROUTE_LOCALES,
  type RouteLocale
} from "../../../config/routeRegistry";
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  getAbsoluteLocalizedUrl,
  getAlternates,
  getOpenGraphLocale,
  getRouteSeo
} from "../../../lib/seo";
import { isContentReviewMode } from "../../../content/publicEvidence";

type RoutePageProps = {
  params: Promise<{ locale: string; segments?: string[] }>;
};

const DEFAULT_OG_IMAGE = "https://tag08.com.br/brand/92ppi/symbol-primary1200x630.jpg";

const resolveRoute = async (params: RoutePageProps["params"]) => {
  const { locale, segments = [] } = await params;
  const validLocale = ROUTE_LOCALES.includes(locale as RouteLocale);
  const path = segments.length ? `/${segments.join("/")}` : "/";
  const canonicalPath = canonicalizeRoute(path);
  const route = getRouteByPath(canonicalPath) ?? getContentReviewRouteByPath(canonicalPath);

  return { locale: (validLocale ? locale : "pt") as RouteLocale, path, validLocale, canonicalPath, route };
};

export const generateStaticParams = () =>
  staticRouteSegments().map((segments) => {
    const resolved = resolveLocalizedPath(segments);

    return {
      locale: resolved.locale,
      segments: resolved.path === "/" ? undefined : resolved.path.slice(1).split("/")
    };
  });

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { locale, validLocale, canonicalPath, route } = await resolveRoute(params);
  if (!validLocale || !route) {
    return { robots: { index: false, follow: true } };
  }

  const seo = getRouteSeo(route, canonicalPath, locale);
  const canonicalUrl = getAbsoluteLocalizedUrl(canonicalPath, locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getAlternates(canonicalPath)
    },
    robots: !isContentReviewMode() && route.indexable && isRouteLocalePublished(route, locale) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      type: "website",
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

  if (!validLocale || !route) {
    notFound();
  }

  if (canonicalPath !== path) {
    permanentRedirect(getLocalizedPath(canonicalPath, locale as RouteLocale));
  }

  // Do not serve a shortened substitute under a language URL. A non-published
  // locale returns visitors to the canonical Portuguese page until the complete
  // translation (including interactions and legal copy) is approved.
  if (!isRouteLocalePublished(route, locale)) {
    permanentRedirect(getLocalizedPath(canonicalPath, "pt"));
  }

  const organizationSchema = buildOrganizationSchema();
  const breadcrumbSchema = buildBreadcrumbSchema(route, canonicalPath, locale);

  return (
    <>
      <script id="schema-org-organization" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {breadcrumbSchema ? (
        <script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      ) : null}
      <SiteShell path={canonicalPath} locale={locale}>
        <RouteContent path={canonicalPath} locale={locale} />
      </SiteShell>
    </>
  );
}
