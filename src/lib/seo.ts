import { CASE_STUDIES } from "../data";
import { PRIMARY_SITE_DOMAIN, TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS } from "../config/siteNetwork";
import { getLocalizedPath, type RouteDefinition, type RouteLocale } from "../config/routeRegistry";
import { i18n, type UiLanguage } from "../i18n/siteI18n";

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

export const getAlternates = (path: string) => ({
  "pt-BR": getAbsoluteLocalizedUrl(path, "pt"),
  en: getAbsoluteLocalizedUrl(path, "en"),
  "es-ES": getAbsoluteLocalizedUrl(path, "es"),
  "x-default": getAbsoluteLocalizedUrl(path, "pt")
});

export const getRouteSeo = (route: RouteDefinition, path: string, locale: RouteLocale) => {
  const language = getUiLanguage(locale);
  const copy = i18n[language];
  const caseId = route.routeCategory === "case-study" ? path.replace("/casos/", "") : "";
  const caseStudy = caseId ? CASE_STUDIES.find((item) => item.id === caseId) : undefined;
  const fallback = copy.seo.default;
  const localized = copy.seo.byPath[path] || fallback;

  if (caseStudy) {
    const caseLabel = language === "en" ? "Success Case" : language === "es" ? "Caso de Exito" : "Case de Sucesso";
    const descriptionPrefix =
      language === "en"
        ? "Result analysis from the success story of"
        : language === "es"
          ? "Analisis de resultados del caso de exito de"
          : "Analise de resultados do case de sucesso da empresa";

    return {
      title: `${caseStudy.client} | ${caseLabel} - TAG08`,
      description: `${descriptionPrefix} ${caseStudy.client}: ${caseStudy.title}.`
    };
  }

  return localized;
};

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TAG08",
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

export const buildBreadcrumbSchema = (route: RouteDefinition, path: string, locale: RouteLocale) => {
  if (!(path.startsWith("/servicos/") || path === "/servicos" || route.routeCategory === "case-study")) {
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

  if (path === "/servicos") {
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
