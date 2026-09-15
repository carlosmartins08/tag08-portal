"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import { PageCanvas } from "../../components/VisualPrimitives";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, type RouteLocale } from "../../config/routeRegistry";
import { i18n, type UiLanguage } from "../../i18n/siteI18n";
import { safeStorage } from "../../utils/storage";
import { initializeTagManager, trackEngagement, trackPageView, trackScrollDepth, trackWebVital, updateGoogleAnalyticsConsent } from "../../lib/analytics";
import { COOKIE_CONSENT_EVENT, readCookiePreferences, type CookiePreferences } from "../../lib/cookieConsent";
import { flushFormQueue } from "../../lib/formQueue";
import { ContentReviewBanner } from "../../components/ContentReview";

const localeToUiLanguage: Record<RouteLocale, UiLanguage> = {
  pt: "pt",
  en: "en",
  es: "es"
};

type SiteShellProps = {
  path: string;
  locale: RouteLocale;
  children: ReactNode;
};

export default function SiteShell({ path, locale, children }: SiteShellProps) {
  const router = useRouter();
  const currentRoute = getRouteByPath(path);
  const [language, setLanguage] = useState<UiLanguage>(localeToUiLanguage[locale]);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollDepthMarksRef = useRef<Set<number>>(new Set());
  const engagementTrackedRef = useRef(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const nextLanguage = localeToUiLanguage[locale];
    setLanguage(nextLanguage);
    safeStorage.set("tag08_language", nextLanguage);
    document.documentElement.lang = i18n[nextLanguage].htmlLang;
  }, [locale]);

  useEffect(() => {
    const syncAnalyticsConsent = (preferences: CookiePreferences | null) => {
      const enabled = preferences?.performance === true || preferences?.marketing === true;
      setAnalyticsEnabled(enabled);
      updateGoogleAnalyticsConsent();
      if (enabled) {
        initializeTagManager();
      }
    };

    syncAnalyticsConsent(readCookiePreferences());
    const handleCookieConsent = (event: Event) => {
      syncAnalyticsConsent((event as CustomEvent<CookiePreferences>).detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleCookieConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleCookieConsent);
  }, []);

  useEffect(() => {
    void flushFormQueue();
    window.addEventListener("online", flushFormQueue);
    return () => window.removeEventListener("online", flushFormQueue);
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
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) {
      return;
    }

    let frameId = 0;
    let lenis: Lenis | null = null;
    // Smooth scrolling is ornamental. Starting its animation loop during LCP delays every route's first paint.
    const startLenis = () => {
      lenis = new Lenis({
        duration: 1.1,
        easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.25
      });

      lenisRef.current = lenis;
      const update = (time: number) => {
        lenis?.raf(time);
        frameId = requestAnimationFrame(update);
      };
      frameId = requestAnimationFrame(update);
    };
    const startupTimer = window.setTimeout(startLenis, 5000);

    return () => {
      window.clearTimeout(startupTimer);
      lenis?.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [path, language]);

  useEffect(() => {
    if (!analyticsEnabled || typeof PerformanceObserver === "undefined") {
      return;
    }

    let cls = 0;
    let inp = 0;
    let lcp = 0;
    const observers: PerformanceObserver[] = [];
    const reportedMetrics = new Set<string>();

    const ratingFor = (metric: "CLS" | "INP" | "LCP", value: number) => {
      const limits =
        metric === "CLS"
          ? [0.1, 0.25]
          : metric === "INP"
            ? [200, 500]
            : [2500, 4000];

      if (value <= limits[0]) return "good" as const;
      if (value <= limits[1]) return "needs_improvement" as const;
      return "poor" as const;
    };

    const report = (metric: "CLS" | "INP" | "LCP", value: number) => {
      if (value <= 0 || reportedMetrics.has(metric)) {
        return;
      }

      reportedMetrics.add(metric);
      trackWebVital({
        metric_name: metric,
        metric_value: metric === "CLS" ? Number(value.toFixed(3)) : Math.round(value),
        metric_rating: ratingFor(metric, value),
        page_path: path,
        language
      });
    };

    const observe = (type: string, onEntries: (entries: PerformanceEntry[]) => void) => {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) {
        return;
      }

      const observer = new PerformanceObserver((list) => onEntries(list.getEntries()));
      observer.observe({ type, buffered: true });
      observers.push(observer);
    };

    observe("largest-contentful-paint", (entries) => {
      const entry = entries.at(-1);
      if (entry) {
        lcp = entry.startTime;
      }
    });

    observe("layout-shift", (entries) => {
      entries.forEach((entry) => {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput) {
          cls += shift.value ?? 0;
        }
      });
    });

    observe("event", (entries) => {
      entries.forEach((entry) => {
        inp = Math.max(inp, entry.duration);
      });
    });

    const flushVitals = () => {
      report("LCP", lcp);
      report("CLS", cls);
      report("INP", inp);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushVitals();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      flushVitals();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [analyticsEnabled, language, path]);

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
    const pageTitle = document.title;

    trackPageView({
      page_location: window.location.href,
      page_path: path,
      page_title: pageTitle,
      page_referrer: document.referrer || undefined,
      language,
      route_type: currentRoute?.routeCategory ?? "aux",
      route_key: currentRoute?.key,
      page_group: currentRoute?.routeCategory ?? "aux",
      is_service_page: Boolean(currentRoute?.isServicePage)
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
            route_type: currentRoute?.routeCategory ?? "aux"
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
        route_type: currentRoute?.routeCategory ?? "aux"
      });
    }, 30000);

    window.addEventListener("scroll", trackCurrentScrollDepth, { passive: true });
    trackCurrentScrollDepth();

    return () => {
      window.clearTimeout(engagementTimer);
      window.removeEventListener("scroll", trackCurrentScrollDepth);
    };
  }, [analyticsEnabled, currentRoute, language, path]);

  return (
    <PageCanvas
      className={`min-h-screen bg-main text-primary font-sans flex flex-col justify-between selection:bg-brand selection:text-black relative overflow-x-hidden transition-colors duration-350 ${currentRoute?.isServicePage ? "tag08-page--service" : "tag08-page--editorial"}`}
      data-route-category={currentRoute?.routeCategory ?? "aux"}
    >
      <div className="absolute inset-0 radial-grid opacity-[0.22] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-5%] w-[380px] h-[380px] bg-brand/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[-5%] w-[480px] h-[480px] bg-brand/3 rounded-full blur-[150px] pointer-events-none z-0" />
      <Header currentPage={path} onNavigate={navigate} language={language} onLanguageChange={changeLanguage} />
      <Breadcrumbs currentPage={path} onNavigate={navigate} language={language} />
      <main className="flex-grow relative z-10" data-route={path}>
        <AnimatePresence mode="wait">
          <motion.div
            className="tag08-editorial-page"
            key={`${locale}:${path}`}
            // The server-rendered page must be paintable before hydration. Entry motion here was delaying LCP on every route.
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} language={language} />
      <WhatsAppButton language={language} currentPage={path} />
      <ContentReviewBanner />
    </PageCanvas>
  );
}
