"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import ErrorBoundary from "../../components/ErrorBoundary";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, type RouteLocale } from "../../config/routeRegistry";
import { i18n, type UiLanguage } from "../../i18n/siteI18n";
import { safeStorage } from "../../utils/storage";
import { initializeGoogleAnalytics, trackEngagement, trackPageView, trackScrollDepth } from "../../lib/analytics";

const Home = dynamic(() => import("./pages/Home"));
const Sobre = dynamic(() => import("./pages/Sobre"));
const Servicos = dynamic(() => import("./pages/Servicos"));
const ProcessIntelligence = dynamic(() => import("./pages/ProcessIntelligence"));
const ProcessActivation = dynamic(() => import("./pages/ProcessActivation"));
const DesenvolvimentoWeb = dynamic(() => import("./pages/DesenvolvimentoWeb"));
const Branding = dynamic(() => import("./pages/Branding"));
const GestaoRedesSociais = dynamic(() => import("./pages/GestaoRedesSociais"));
const Contato = dynamic(() => import("./pages/Contato"));
const TrabalheConosco = dynamic(() => import("./pages/TrabalheConosco"));
const Insights = dynamic(() => import("./pages/Insights"));
const ClienteOnboarding = dynamic(() => import("./pages/ClienteOnboarding"));
const CaseStudyDetail = dynamic(() => import("./pages/CaseStudyDetail"));
const Sebraetec = dynamic(() => import("./pages/Sebraetec"));
const ProgramaAfiliados = dynamic(() => import("./pages/ProgramaAfiliados"));
const HospedagemManutencaoSites = dynamic(() => import("./pages/HospedagemManutencaoSites"));
const AssessoriaMarketingDigitalEstrategico = dynamic(() => import("./pages/AssessoriaMarketingDigitalEstrategico"));
const ProducaoAudiovisual = dynamic(() => import("./pages/ProducaoAudiovisual"));

const localeToUiLanguage: Record<RouteLocale, UiLanguage> = {
  pt: "pt",
  en: "en",
  es: "es"
};

type SiteShellProps = {
  path: string;
  locale: RouteLocale;
};

export default function SiteShell({ path, locale }: SiteShellProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<UiLanguage>(localeToUiLanguage[locale]);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollDepthMarksRef = useRef<Set<number>>(new Set());
  const engagementTrackedRef = useRef(false);

  useEffect(() => {
    const nextLanguage = localeToUiLanguage[locale];
    setLanguage(nextLanguage);
    safeStorage.set("tag08_language", nextLanguage);
    document.documentElement.lang = i18n[nextLanguage].htmlLang;
  }, [locale]);

  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  useEffect(() => {
    const hashPath = window.location.hash.replace(/^#/, "");
    if (!hashPath.startsWith("/")) {
      return;
    }

    const canonicalPath = canonicalizeRoute(hashPath);
    const search = window.location.search;
    router.replace(`${getLocalizedPath(canonicalPath, locale)}${search}`);
  }, [locale, router]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.25
    });

    lenisRef.current = lenis;
    let frameId = 0;
    const update = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [path, language]);

  const navigate = (targetPath: string) => {
    const canonicalPath = canonicalizeRoute(targetPath);
    router.push(getLocalizedPath(canonicalPath, locale));
  };

  const changeLanguage = (nextLanguage: UiLanguage) => {
    const nextLocale = nextLanguage as RouteLocale;
    setLanguage(nextLanguage);
    router.push(getLocalizedPath(path, nextLocale));
  };

  useEffect(() => {
    const route = getRouteByPath(path);
    const pageTitle = document.title;

    trackPageView({
      page_location: window.location.href,
      page_path: path,
      page_title: pageTitle,
      page_referrer: document.referrer || undefined,
      language,
      route_type: route?.routeCategory ?? "aux",
      route_key: route?.key,
      page_group: route?.routeCategory ?? "aux",
      is_service_page: Boolean(route?.isServicePage)
    });

    scrollDepthMarksRef.current = new Set();
    engagementTrackedRef.current = false;
    const thresholds = [25, 50, 75, 90];

    const trackCurrentScrollDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const totalScrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const depthPercent = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));

      thresholds.forEach((threshold) => {
        if (depthPercent >= threshold && !scrollDepthMarksRef.current.has(threshold)) {
          scrollDepthMarksRef.current.add(threshold);
          trackScrollDepth({
            page_path: path,
            page_title: pageTitle,
            depth_percent: threshold,
            language,
            route_type: route?.routeCategory ?? "aux"
          });
        }
      });
    };

    const engagementTimer = window.setTimeout(() => {
      if (engagementTrackedRef.current) return;
      engagementTrackedRef.current = true;
      trackEngagement({
        page_path: path,
        page_title: pageTitle,
        engaged_seconds: 30,
        language,
        route_type: route?.routeCategory ?? "aux"
      });
    }, 30000);

    window.addEventListener("scroll", trackCurrentScrollDepth, { passive: true });
    trackCurrentScrollDepth();

    return () => {
      window.clearTimeout(engagementTimer);
      window.removeEventListener("scroll", trackCurrentScrollDepth);
    };
  }, [language, path]);

  const renderPage = () => {
    const activeRoute = getRouteByPath(path);
    if (activeRoute?.routeCategory === "case-study") {
      return <CaseStudyDetail caseId={path.replace("/casos/", "")} onNavigate={navigate} />;
    }

    switch (path) {
      case "/":
        return <Home onNavigate={navigate} />;
      case "/sobre":
        return <Sobre onNavigate={navigate} />;
      case "/servicos":
        return <Servicos onNavigate={navigate} />;
      case "/servicos/process-intelligence":
        return <ProcessIntelligence onNavigate={navigate} />;
      case "/servicos/process-activation":
        return <ProcessActivation onNavigate={navigate} />;
      case "/servicos/desenvolvimento-web":
        return <DesenvolvimentoWeb onNavigate={navigate} />;
      case "/servicos/branding-identidade":
        return <Branding onNavigate={navigate} />;
      case "/servicos/gestao-de-redes-sociais":
        return <GestaoRedesSociais onNavigate={navigate} />;
      case "/servicos/producao-audiovisual":
        return <ProducaoAudiovisual onNavigate={navigate} />;
      case "/contato":
        return <Contato />;
      case "/trabalhe-conosco":
        return <TrabalheConosco onNavigate={navigate} />;
      case "/insights":
        return <Insights onNavigate={navigate} />;
      case "/cliente/onboarding":
        return <ClienteOnboarding onNavigate={navigate} />;
      case "/sebraetec-impulsionando-empreendedores":
        return <Sebraetec onNavigate={navigate} />;
      case "/programa-afiliados":
        return <ProgramaAfiliados onNavigate={navigate} />;
      case "/hospedagem-manutencao-sites":
        return <HospedagemManutencaoSites onNavigate={navigate} />;
      case "/servicos/assessoria-marketing-digital-estrategico":
        return <AssessoriaMarketingDigitalEstrategico onNavigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-main text-primary font-sans flex flex-col justify-between selection:bg-brand selection:text-black relative overflow-x-hidden transition-colors duration-350">
      <div className="absolute inset-0 radial-grid opacity-[0.22] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-5%] w-[380px] h-[380px] bg-brand/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[-5%] w-[480px] h-[480px] bg-brand/3 rounded-full blur-[150px] pointer-events-none z-0" />
      <Header currentPage={path} onNavigate={navigate} language={language} onLanguageChange={changeLanguage} />
      <Breadcrumbs currentPage={path} onNavigate={navigate} language={language} />
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${locale}:${path}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ErrorBoundary boundaryName={`route:${path}`}>{renderPage()}</ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} language={language} />
      <WhatsAppButton language={language} currentPage={path} />
    </div>
  );
}
