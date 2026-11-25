import { CASE_STUDIES } from "../data";
import { PRIMARY_SITE_DOMAIN, TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { getIndexableLocales, getLocalizedPath, getRouteByPath, isRouteLocalePublished, type RouteDefinition, type RouteLocale } from "../config/routeRegistry";
import { i18n, type UiLanguage } from "../i18n/siteI18n";
import { getLocalizedInsightBySlug } from "../features/site/pages/insightsTranslations";

const localeToUiLanguage: Record<RouteLocale, UiLanguage> = {
  pt: "pt",
  en: "en",
  es: "es"
};

const localeToHreflang: Record<RouteLocale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es-ES"
};

const localeToOpenGraph: Record<RouteLocale, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES"
};

export const getUiLanguage = (locale: RouteLocale): UiLanguage => localeToUiLanguage[locale];

export const getAbsoluteLocalizedUrl = (path: string, locale: RouteLocale): string =>
  `${PRIMARY_SITE_DOMAIN}${getLocalizedPath(path, locale)}`;

export const getAlternates = (path: string) => {
  const route = getRouteByPath(path);
  const locales = route ? getIndexableLocales(route) : ["pt"] as const;
  const alternates: Record<string, string> = {
    "x-default": getAbsoluteLocalizedUrl(path, "pt")
  };

  locales.forEach((locale) => {
    alternates[localeToHreflang[locale]] = getAbsoluteLocalizedUrl(path, locale);
  });

  return alternates;
};

export const getRouteSeo = (route: RouteDefinition, path: string, locale: RouteLocale) => {
  const language = getUiLanguage(locale);
  const copy = i18n[language];
  const caseId = route.routeCategory === "case-study" ? path.replace("/casos/", "") : "";
  const caseStudy = caseId ? CASE_STUDIES.find((item) => item.id === caseId) : undefined;
  const fallback = copy.seo.default;
  const localized = copy.seo.byPath[path] || fallback;

  if (route.key === "insights" && path !== "/insights") {
    if (locale !== "pt" && !isRouteLocalePublished(route, locale)) return localized;
    const slug = path.slice("/insights/".length);
    const post = getLocalizedInsightBySlug(slug, locale);
    if (post) return { title: `${post.title} | TAG08`, description: post.excerpt };
  }

  if (caseStudy) {
    const caseLabel = language === "en" ? "Success Case" : language === "es" ? "Caso de Exito" : "Case de Sucesso";
    const descriptionPrefix =
      language === "en"
        ? "Result analysis from the success story of"
        : language === "es"
          ? "Analisis de resultados del caso de exito de"
          : "Analise de resultados do case de sucesso da empresa";

    return {
      title: caseStudy.metaTitle || `${caseStudy.client} | ${caseLabel} - TAG08`,
      description: caseStudy.metaDescription || `${descriptionPrefix} ${caseStudy.client}: ${caseStudy.title}.`
    };
  }

  return localized;
};

export const buildOrganizationSchema = (locale: RouteLocale = "pt") => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TAG08",
  description: {
    pt: "A TAG08 conecta estratégia, conteúdo, tecnologia e processos para organizar a presença digital de empresas com clareza, método e execução responsável.",
    en: "TAG08 brings strategy, content, technology, and processes together to organize businesses’ digital presence with clarity, method, and responsible execution.",
    es: "TAG08 conecta estrategia, contenido, tecnología y procesos para organizar la presencia digital de las empresas con claridad, método y ejecución responsable."
  }[locale],
  url: PRIMARY_SITE_DOMAIN,
  logo: `${PRIMARY_SITE_DOMAIN}/brand/logos/logo-horizontal-no-tagline-primary.svg`,
  contactPoint: TAG08_WHATSAPP_CONTACTS.map((contact) => ({
    "@type": "ContactPoint",
    telephone: contact.phoneE164,
    email: TAG08_OFFICIAL_CONTACT.email,
    url: contact.key === "brazil" ? TAG08_OFFICIAL_CONTACT.whatsappBusinessUrl : TAG08_OFFICIAL_CONTACT.whatsappInternationalUrl,
    contactType: contact.key === "brazil" ? "sales" : "international sales",
    areaServed: contact.key === "brazil" ? "BR" : "Worldwide",
    availableLanguage: contact.key === "brazil" ? ["Portuguese", "English", "Spanish"] : ["English", "Spanish"]
  })),
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Cassimiro de Abreu, No60, Sala 05 - Brisamar",
    addressLocality: "Joao Pessoa",
    addressRegion: "PB",
    postalCode: "58033-330",
    addressCountry: "BR"
  },
  sameAs: TAG08_OFFICIAL_CHANNELS.map((channel) => channel.href)
});

export const buildArticleSchema = (path: string, locale: RouteLocale) => {
  const post = path.startsWith("/insights/")
    ? getLocalizedInsightBySlug(path.slice("/insights/".length), locale)
    : null;
  if (!post) return null;

  const url = getAbsoluteLocalizedUrl(path, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "TAG08" },
    publisher: { "@type": "Organization", name: "TAG08", url: PRIMARY_SITE_DOMAIN },
    inLanguage: locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en"
  };
};

export const buildBreadcrumbSchema = (route: RouteDefinition, path: string, locale: RouteLocale) => {
  const insight = route.key === "insights" && path !== "/insights"
    ? getLocalizedInsightBySlug(path.slice("/insights/".length), locale)
    : undefined;
  if (!insight && !(path.startsWith("/servicos/") || path === "/servicos" || route.routeCategory === "case-study")) {
    return null;
  }

  const language = getUiLanguage(locale);
  const copy = i18n[language];
  const items: Array<{ "@type": "ListItem"; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: copy.breadcrumbs.home,
      item: getAbsoluteLocalizedUrl("/", locale)
    }
  ];

  if (insight) {
    items.push(
      { "@type": "ListItem", position: 2, name: copy.header.navInsights, item: getAbsoluteLocalizedUrl("/insights", locale) },
      { "@type": "ListItem", position: 3, name: insight.title, item: getAbsoluteLocalizedUrl(path, locale) }
    );
  } else if (path === "/servicos") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: copy.header.navServices,
      item: getAbsoluteLocalizedUrl("/servicos", locale)
    });
  } else if (route.routeCategory === "case-study") {
    const caseStudy = CASE_STUDIES.find((item) => path === `/casos/${item.id}`);
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: copy.breadcrumbs.case,
        item: getAbsoluteLocalizedUrl("/", locale)
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caseStudy?.client || "Case",
        item: getAbsoluteLocalizedUrl(path, locale)
      }
    );
  } else {
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: copy.header.navServices,
        item: getAbsoluteLocalizedUrl("/servicos", locale)
      },
      {
        "@type": "ListItem",
        position: 3,
        name: getRouteSeo(route, path, locale).title.split("|")[0].replace(" - TAG08", "").trim(),
        item: getAbsoluteLocalizedUrl(path, locale)
      }
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
};

export const getOpenGraphLocale = (locale: RouteLocale) => localeToOpenGraph[locale];
export const getHreflang = (locale: RouteLocale) => localeToHreflang[locale];
