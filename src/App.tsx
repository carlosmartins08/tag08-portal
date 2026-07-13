import { Suspense, lazy, useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Breadcrumbs from "./components/Breadcrumbs";
import ErrorBoundary from "./components/ErrorBoundary";
import Lenis from "lenis";
import { CASE_STUDIES } from "./data";

import { motion, AnimatePresence } from "motion/react";
import { canonicalizeRoute, getRouteByPath } from "./config/routeRegistry";
import { PRIMARY_SITE_DOMAIN, TAG08_OFFICIAL_CHANNELS, TAG08_OFFICIAL_CONTACT, TAG08_WHATSAPP_CONTACTS } from "./config/siteNetwork";
import { detectBrowserLanguage, i18n, resolveLanguage, type UiLanguage } from "./i18n/siteI18n";
import { safeStorage } from "./utils/storage";
import { initializeGoogleAnalytics, trackEngagement, trackPageView, trackScrollDepth } from "./lib/analytics";

const SITE_DOMAIN = PRIMARY_SITE_DOMAIN;
const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/brand/92ppi/symbol-primary1200x630.jpg`;
const OG_LOCALE_BY_LANGUAGE: Record<UiLanguage, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES"
};
const HREFLANG_BY_LANGUAGE: Record<UiLanguage, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es-ES"
};

const Home = lazy(() => import("./pages/Home"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Servicos = lazy(() => import("./pages/Servicos"));
const ProcessIntelligence = lazy(() => import("./pages/ProcessIntelligence"));
const ProcessActivation = lazy(() => import("./pages/ProcessActivation"));
const DesenvolvimentoWeb = lazy(() => import("./pages/DesenvolvimentoWeb"));
const Branding = lazy(() => import("./pages/Branding"));
const GestaoRedesSociais = lazy(() => import("./pages/GestaoRedesSociais"));
const Contato = lazy(() => import("./pages/Contato"));
const TrabalheConosco = lazy(() => import("./pages/TrabalheConosco"));
const Insights = lazy(() => import("./pages/Insights"));
const ClienteOnboarding = lazy(() => import("./pages/ClienteOnboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Sebraetec = lazy(() => import("./pages/Sebraetec"));
const ProgramaAfiliados = lazy(() => import("./pages/ProgramaAfiliados"));
const HospedagemManutencaoSites = lazy(() => import("./pages/HospedagemManutencaoSites"));
const AssessoriaMarketingDigitalEstrategico = lazy(() => import("./pages/AssessoriaMarketingDigitalEstrategico"));
const ProducaoAudiovisual = lazy(() => import("./pages/ProducaoAudiovisual"));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
    <div className="w-full max-w-2xl rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-8 sm:p-10">
      <div className="space-y-4 animate-pulse">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="h-10 w-3/4 rounded-2xl bg-white/10" />
        <div className="h-4 w-full rounded-full bg-white/5" />
        <div className="h-4 w-5/6 rounded-full bg-white/5" />
        <div className="h-4 w-2/3 rounded-full bg-white/5" />
      </div>
    </div>
  </div>
);

export default function App() {
  const [language, setLanguage] = useState<UiLanguage>(() => {
    if (typeof window === "undefined") {
      return "pt";
    }
    return resolveLanguage(safeStorage.get("tag08_language")) || detectBrowserLanguage();
  });

  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash.startsWith("/")) {
        return hash;
      }
      return window.location.pathname || "/";
    }
    return "/";
  });
  const lenisRef = useRef<Lenis | null>(null);
  const scrollDepthMarksRef = useRef<Set<number>>(new Set());
  const engagementTrackedRef = useRef(false);

  useEffect(() => {
    safeStorage.set("tag08_language", language);
    document.documentElement.lang = i18n[language].htmlLang;
  }, [language]);

  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  useEffect(() => {
    // Premium custom easing & smooth config for modern digital interactions
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.25,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const handleNavigationState = () => {
      let path = window.location.pathname || "/";
      let resolvedPath = "";
      
      const hash = window.location.hash.replace(/^#/, "");
      if ((path === "" || path === "/") && hash && hash.startsWith("/")) {
        path = hash;
      }
      
      const isCaseDetail = path.startsWith("/casos/");
      if (isCaseDetail && getRouteByPath(path)) {
        setCurrentPage(path);
        return;
      }

      resolvedPath = canonicalizeRoute(path);
      if (resolvedPath !== path) {
        window.history.replaceState(null, "", resolvedPath);
      }

      const route = getRouteByPath(resolvedPath);
      setCurrentPage(route ? resolvedPath : "/404");
    };

    window.addEventListener("popstate", handleNavigationState);
    window.addEventListener("hashchange", handleNavigationState);
    handleNavigationState(); // Run on initial render

    return () => {
      window.removeEventListener("popstate", handleNavigationState);
      window.removeEventListener("hashchange", handleNavigationState);
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage, language]);

  const handleNavigate = (page: string) => {
    if (typeof window !== "undefined") {
      const resolvedPage = canonicalizeRoute(page);
      if (window.location.pathname !== resolvedPage && window.location.pathname !== page) {
        window.history.pushState(null, "", resolvedPage);
        window.dispatchEvent(new Event("popstate"));
      } else if (window.location.pathname !== resolvedPage) {
        setCurrentPage(resolvedPage);
      } else {
        setCurrentPage(resolvedPage);
      }
    }
  };

  // SEO dynamic updates
  useEffect(() => {
    const route = getRouteByPath(currentPage);
    const effectivePath = route ? currentPage : "/404";
    const copy = i18n[language];
    const routeCopy = copy.seo.byPath[currentPage];
    let title = routeCopy?.title || copy.seo.default.title;
    let desc = routeCopy?.description || copy.seo.default.description;
    const isCaseDetail = route?.routeCategory === "case-study";
    const caseId = isCaseDetail ? currentPage.replace("/casos/", "") : "";
    const selectedCase = caseId ? CASE_STUDIES.find((cs) => cs.id === caseId) : undefined;

    if (selectedCase) {
        title = `${selectedCase.client} | ${language === "pt" ? "Case de Sucesso" : language === "en" ? "Success Case" : "Caso de Éxito"} - TAG08`;
        desc = `${language === "en" ? "Result analysis from the success story of" : language === "es" ? "Análisis de resultados del caso de éxito de" : "Análise de resultados do case de sucesso da empresa"} ${selectedCase.client}: ${selectedCase.title}.`;
    } else if (!route) {
      title = copy.seo.byPath["/404"].title;
      desc = copy.seo.byPath["/404"].description;
    }

    document.title = title;
    const cleanPath = effectivePath === "/" ? "" : effectivePath;
    const canonicalByLanguage: Record<UiLanguage, string> = {
      pt: `${SITE_DOMAIN}${cleanPath}`,
      en: `${SITE_DOMAIN}${cleanPath}`,
      es: `${SITE_DOMAIN}${cleanPath}`
    };
    const canonicalUrl = canonicalByLanguage[language] ?? canonicalByLanguage.pt;

    trackPageView({
      page_location: canonicalUrl,
      page_path: effectivePath,
      page_title: title,
      page_referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      language,
      route_type: route?.routeCategory ?? "aux",
      route_key: route?.key,
      page_group: route?.routeCategory ?? "aux",
      is_service_page: Boolean(route?.isServicePage),
    });

    // Update or append meta description item
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    const robotsContent = route?.indexable === false ? "noindex,follow" : "index,follow";
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", robotsContent);

    // Canonical link helper
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
      link.remove();
    });

    const updateAlternateLink = (hreflang: string, href: string) => {
      let alternateLink = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
      if (!alternateLink) {
        alternateLink = document.createElement("link");
        alternateLink.setAttribute("rel", "alternate");
        alternateLink.setAttribute("hreflang", hreflang);
        document.head.appendChild(alternateLink);
      }
      alternateLink.setAttribute("href", href);
    };

    Object.entries(canonicalByLanguage).forEach(([lang, href]) => {
      const hreflang = HREFLANG_BY_LANGUAGE[lang as UiLanguage];
      updateAlternateLink(hreflang, href);
    });
    updateAlternateLink("x-default", canonicalByLanguage.pt);

    // Open Graph updates
    const updateOGMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateOGMeta("og:title", title);
    updateOGMeta("og:description", desc);
    updateOGMeta("og:url", canonicalUrl);
    updateOGMeta("og:type", "website");
    updateOGMeta("og:image", DEFAULT_OG_IMAGE);
    updateOGMeta("og:locale", OG_LOCALE_BY_LANGUAGE[language]);

    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((meta) => {
      meta.remove();
    });
    Object.values(OG_LOCALE_BY_LANGUAGE).forEach((locale) => {
      if (locale === OG_LOCALE_BY_LANGUAGE[language]) {
        return;
      }
      let alternateLocale = document.querySelector(`meta[property="og:locale:alternate"][content="${locale}"]`) as HTMLMetaElement | null;
      if (!alternateLocale) {
        alternateLocale = document.createElement("meta");
        alternateLocale.setAttribute("property", "og:locale:alternate");
        document.head.appendChild(alternateLocale);
      }
      alternateLocale.setAttribute("content", locale);
    });

    // Dynamic Organization Schema Integration
    let orgSchemaScript = document.getElementById("schema-org-organization");
    if (!orgSchemaScript) {
      orgSchemaScript = document.createElement("script");
      orgSchemaScript.setAttribute("id", "schema-org-organization");
      orgSchemaScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(orgSchemaScript);
    }
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TAG08",
      "url": SITE_DOMAIN,
      "logo": `${SITE_DOMAIN}/brand/logos/logo-horizontal-no-tagline-primary.svg`,
      "contactPoint": TAG08_WHATSAPP_CONTACTS.map((contact) => ({
        "@type": "ContactPoint",
        "telephone": contact.phoneE164,
        "email": TAG08_OFFICIAL_CONTACT.email,
        "url": contact.key === "brazil" ? TAG08_OFFICIAL_CONTACT.whatsappBusinessUrl : TAG08_OFFICIAL_CONTACT.whatsappInternationalUrl,
        "contactType": contact.key === "brazil" ? "sales" : "international sales",
        "areaServed": contact.key === "brazil" ? "BR" : "Worldwide",
        "availableLanguage": contact.key === "brazil" ? ["Portuguese", "English", "Spanish"] : ["English", "Spanish"]
      })),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "R. Cassimiro de Abreu, Nº60, Sala 05 - Brisamar",
        "addressLocality": "João Pessoa",
        "addressRegion": "PB",
        "postalCode": "58033-330",
        "addressCountry": "BR"
      },
      "sameAs": TAG08_OFFICIAL_CHANNELS.map((channel) => channel.href)
    };
    orgSchemaScript.innerHTML = JSON.stringify(organizationSchema);

    // Dynamic Breadcrumb Schema Integration for Service Pages
    let breadcrumbScript = document.getElementById("schema-breadcrumb");
    if (currentPage.startsWith("/servicos/") || currentPage === "/servicos" || selectedCase) {
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement("script");
        breadcrumbScript.setAttribute("id", "schema-breadcrumb");
        breadcrumbScript.setAttribute("type", "application/ld+json");
        document.head.appendChild(breadcrumbScript);
      }

      const breadcrumbItems: Array<{
        "@type": "ListItem";
        position: number;
        name: string;
        item: string;
      }> = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": copy.breadcrumbs.home,
          "item": SITE_DOMAIN
        }
      ];

        if (currentPage === "/servicos") {
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 2,
          "name": copy.header.navServices,
          "item": `${SITE_DOMAIN}/servicos`
        });
      } else if (selectedCase) {
        breadcrumbItems.push(
          {
            "@type": "ListItem",
            "position": 2,
            "name": copy.breadcrumbs.case,
            "item": SITE_DOMAIN
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": selectedCase.client,
            "item": canonicalUrl
          }
        );
      } else {
        breadcrumbItems.push(
          {
            "@type": "ListItem",
            "position": 2,
            "name": copy.header.navServices,
            "item": `${SITE_DOMAIN}/servicos`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title.replace(" - TAG08", "").split("|")[0].trim(),
            "item": canonicalUrl
          }
        );
      }

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      };
      breadcrumbScript.innerHTML = JSON.stringify(breadcrumbSchema);
    } else {
      if (breadcrumbScript) {
        breadcrumbScript.remove();
      }
    }
  }, [currentPage, language]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    scrollDepthMarksRef.current = new Set();
    engagementTrackedRef.current = false;

    const route = getRouteByPath(currentPage);
    const effectivePath = route ? currentPage : "/404";
    const routeType = route?.routeCategory ?? "aux";
    const thresholds = [25, 50, 75, 90];

    const trackCurrentScrollDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(scrollHeight - viewportHeight, 1);
      const depthPercent = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));

      thresholds.forEach((threshold) => {
        if (depthPercent >= threshold && !scrollDepthMarksRef.current.has(threshold)) {
          scrollDepthMarksRef.current.add(threshold);
          trackScrollDepth({
            page_path: effectivePath,
            page_title: document.title,
            depth_percent: threshold,
            language,
            route_type: routeType
          });
        }
      });
    };

    const engagementTimer = window.setTimeout(() => {
      if (engagementTrackedRef.current) {
        return;
      }

      engagementTrackedRef.current = true;
      trackEngagement({
        page_path: effectivePath,
        page_title: document.title,
        engaged_seconds: 30,
        language,
        route_type: routeType
      });
    }, 30000);

    window.addEventListener("scroll", trackCurrentScrollDepth, { passive: true });
    trackCurrentScrollDepth();

    return () => {
      window.clearTimeout(engagementTimer);
      window.removeEventListener("scroll", trackCurrentScrollDepth);
    };
  }, [currentPage, language]);

  // Page switcher
  const renderActivePage = () => {
    const activeRoute = getRouteByPath(currentPage);
    if (activeRoute?.routeCategory === "case-study") {
      const caseId = currentPage.replace("/casos/", "");
      return <CaseStudyDetail caseId={caseId} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case "/":
        return <Home onNavigate={handleNavigate} />;
      case "/sobre":
        return <Sobre onNavigate={handleNavigate} />;
      case "/servicos":
        return <Servicos onNavigate={handleNavigate} />;
      case "/servicos/process-intelligence":
        return <ProcessIntelligence onNavigate={handleNavigate} />;
      case "/servicos/process-activation":
        return <ProcessActivation onNavigate={handleNavigate} />;
      case "/servicos/desenvolvimento-web":
        return <DesenvolvimentoWeb onNavigate={handleNavigate} />;
      case "/servicos/branding-identidade":
        return <Branding onNavigate={handleNavigate} />;
      case "/servicos/gestao-de-redes-sociais":
        return <GestaoRedesSociais onNavigate={handleNavigate} />;
      case "/servicos/producao-audiovisual":
        return <ProducaoAudiovisual onNavigate={handleNavigate} />;
      case "/contato":
        return <Contato />;
      case "/trabalhe-conosco":
        return <TrabalheConosco onNavigate={handleNavigate} />;
      case "/insights":
        return <Insights onNavigate={handleNavigate} />;
      case "/cliente/onboarding":
        return <ClienteOnboarding onNavigate={handleNavigate} />;
      case "/sebraetec-impulsionando-empreendedores":
        return <Sebraetec onNavigate={handleNavigate} />;
      case "/programa-afiliados":
        return <ProgramaAfiliados onNavigate={handleNavigate} />;
      case "/hospedagem-manutencao-sites":
        return <HospedagemManutencaoSites onNavigate={handleNavigate} />;
      case "/servicos/assessoria-marketing-digital-estrategico":
      case "/assessoria-marketing-digital-estrategico":
        return <AssessoriaMarketingDigitalEstrategico onNavigate={handleNavigate} />;
      default:
        return <NotFound onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-main text-primary font-sans flex flex-col justify-between selection:bg-brand selection:text-black relative overflow-x-hidden transition-colors duration-350">
      {/* Background pattern and ambient glow layers */}
      <div className="absolute inset-0 radial-grid opacity-[0.22] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-5%] w-[380px] h-[380px] bg-brand/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[-5%] w-[480px] h-[480px] bg-brand/3 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Header element */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Breadcrumbs Navigation with quick shortcuts */}
      <Breadcrumbs currentPage={currentPage} onNavigate={handleNavigate} language={language} />

      {/* Pages Container with clean fade transitions */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ErrorBoundary key={currentPage} boundaryName={`route:${currentPage}`}>
              <Suspense fallback={<PageLoadingFallback />}>
                {renderActivePage()}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer element */}
      <Footer
        onNavigate={handleNavigate}
        language={language}
      />

      {/* Interactive WhatsApp Helper */}
      <WhatsAppButton language={language} currentPage={currentPage} />
    </div>
  );
}





