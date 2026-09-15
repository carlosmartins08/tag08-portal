import { readCookiePreferences } from "./cookieConsent";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

const PII_PARAM_KEYS = new Set([
  "email", "phone", "whatsapp", "message", "full_name", "first_name", "last_name", "payload", "name", "company", "cpf", "cnpj"
]);

type DeviceCategory = "mobile" | "tablet" | "desktop";
type ConsentModeValue = "granted" | "denied";
type WindowWithAnalytics = Window & typeof globalThis & { dataLayer?: unknown[] };
type AnalyticsWindowState = WindowWithAnalytics & { __tag08TagManagerConfigured?: boolean };

// The container ID is public by design. Vendor IDs and trigger rules live in GTM,
// preventing snippets from being duplicated across application components.
const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-NNL7DMP").trim();
export const GSC_VERIFICATION_TOKEN = (process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "").trim();
const GTM_SCRIPT_ID = "tag08-google-tag-manager";
const PAGE_VIEW_DEBOUNCE_MS = 800;

let lastTrackedPageViewKey = "";
let lastTrackedPageViewAt = 0;

const getWindow = () => window as WindowWithAnalytics;
const hasTagManager = () => Boolean(GTM_ID) && typeof window !== "undefined";

const hasTrackingConsent = () => {
  if (typeof window === "undefined") return false;
  const preferences = readCookiePreferences();
  return preferences?.performance === true || preferences?.marketing === true;
};

const getConsentMode = () => {
  const preferences = readCookiePreferences();
  const analytics: ConsentModeValue = preferences?.performance ? "granted" : "denied";
  const marketing: ConsentModeValue = preferences?.marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    functionality_storage: "granted" as const,
    security_storage: "granted" as const,
    wait_for_update: 500
  };
};

const pushDataLayer = (value: unknown) => {
  if (typeof window === "undefined") return;
  const win = getWindow();
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(value);
};

const pushConsentCommand = (command: "default" | "update") => pushDataLayer(["consent", command, getConsentMode()]);

export const updateGoogleAnalyticsConsent = () => {
  if (hasTagManager()) pushConsentCommand("update");
};

export const getDeviceCategory = (): DeviceCategory => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

export const sanitizeAnalyticsParams = (params: AnalyticsParams = {}) =>
  Object.entries(params).reduce<Record<string, Exclude<AnalyticsValue, null | undefined>>>((acc, [key, value]) => {
    if (value === null || value === undefined || PII_PARAM_KEYS.has(key.toLowerCase())) return acc;
    acc[key] = value;
    return acc;
  }, {});

export const getMonitoringConfig = () => ({
  gtmId: GTM_ID || null,
  searchConsoleVerificationToken: GSC_VERIFICATION_TOKEN || null
});

/** Loads a single GTM container only after opt-in to analytics or marketing. */
export const initializeTagManager = () => {
  if (!hasTagManager() || !hasTrackingConsent()) return false;
  const win = getWindow() as AnalyticsWindowState;
  win.dataLayer = win.dataLayer || [];
  pushConsentCommand("default");
  if (document.getElementById(GTM_SCRIPT_ID) || win.__tag08TagManagerConfigured) return true;

  win.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
  win.__tag08TagManagerConfigured = true;
  return true;
};

// Kept for existing callers; it no longer loads gtag.js or configures GA directly.
export const initializeGoogleAnalytics = initializeTagManager;

export const trackAnalyticsEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (!hasTagManager() || !hasTrackingConsent()) return;
  initializeTagManager();
  pushDataLayer({ event: eventName, ...sanitizeAnalyticsParams(params) });
};

export const trackPageView = (params: {
  page_location: string; page_path: string; page_title: string; page_referrer?: string; language?: string;
  route_type?: string; route_key?: string; page_group?: string; is_service_page?: boolean;
}) => {
  const cacheKey = [params.page_location, params.page_title, params.page_path, params.language ?? "", params.route_type ?? ""].join("|");
  const now = Date.now();
  if (cacheKey === lastTrackedPageViewKey && now - lastTrackedPageViewAt < PAGE_VIEW_DEBOUNCE_MS) return;
  lastTrackedPageViewKey = cacheKey;
  lastTrackedPageViewAt = now;
  trackAnalyticsEvent("page_view", { ...params, device_category: getDeviceCategory() });
};

export const trackCtaClick = (params: {
  cta_name: string; cta_location: string; cta_type?: string; target_url?: string; language?: string; page_path?: string;
}) => {
  let targetDomain: string | undefined;
  let targetPath: string | undefined;
  if (params.target_url) {
    try {
      const parsed = new URL(params.target_url);
      targetDomain = ["mailto:", "tel:"].includes(parsed.protocol) ? parsed.protocol.slice(0, -1) : parsed.hostname.replace(/^www\./, "");
      targetPath = parsed.pathname;
    } catch {
      // Tracking must never break an outbound action.
    }
  }
  trackAnalyticsEvent("cta_click", {
    cta_name: params.cta_name, cta_location: params.cta_location, cta_type: params.cta_type,
    target_domain: targetDomain, target_path: targetPath, language: params.language, page_path: params.page_path
  });
};

export const trackOutboundClick = (params: { label: string; url: string; surface: string; language?: string }) => {
  trackCtaClick({ cta_name: params.label, cta_location: params.surface, cta_type: "outbound", target_url: params.url, language: params.language });
  try {
    const target = new URL(params.url);
    const contactParams = { contact_surface: params.surface, contact_label: params.label, language: params.language };
    if (target.protocol === "https:" && /wa\.me$/i.test(target.hostname)) trackAnalyticsEvent("contact_whatsapp", contactParams);
    if (target.protocol === "tel:") trackAnalyticsEvent("contact_phone", contactParams);
    if (target.protocol === "mailto:") trackAnalyticsEvent("contact_email", contactParams);
  } catch {
    // The generic CTA event remains useful when a target cannot be parsed.
  }
};

export const trackLeadEvent = (params: { action: string; surface: string; label?: string; language?: string; status?: string; page_path?: string; step?: number; step_name?: string; total_steps?: number }) =>
  trackAnalyticsEvent("lead_action", { action: params.action, lead_surface: params.surface, lead_label: params.label, language: params.language, status: params.status, page_path: params.page_path, step: params.step, step_name: params.step_name, total_steps: params.total_steps });

export const trackFormStart = (params: { form_name: string; form_surface: string; language?: string; page_path?: string }) => trackAnalyticsEvent("form_start", params);

export const trackFormSubmit = (params: { form_name: string; form_surface: string; status: "success" | "queued" | "validation_error" | "error"; language?: string; page_path?: string }) => {
  trackAnalyticsEvent("form_submit", params);
  if (params.status === "success" || params.status === "queued") {
    trackAnalyticsEvent("generate_lead", { form_name: params.form_name, form_surface: params.form_surface, delivery_status: params.status, language: params.language, page_path: params.page_path });
  }
};

export const trackFormError = (params: { form_name: string; form_surface: string; error_count: number; language?: string; page_path?: string }) => trackAnalyticsEvent("form_error", params);
export const trackFormStep = (params: { form_name: string; form_surface: string; step: number; step_name?: string; total_steps?: number; language?: string; page_path?: string }) => trackAnalyticsEvent("form_step", params);
export const trackScrollDepth = (params: { page_path: string; page_title: string; depth_percent: number; language?: string; route_type?: string }) => trackAnalyticsEvent("scroll_depth", params);
export const trackEngagement = (params: { page_path: string; page_title: string; engaged_seconds: number; language?: string; route_type?: string }) => trackAnalyticsEvent("engagement_time", params);
export const trackWebVital = (params: { metric_name: "CLS" | "INP" | "LCP"; metric_value: number; metric_rating: "good" | "needs_improvement" | "poor"; page_path: string; language?: string }) => trackAnalyticsEvent("web_vital", params);
export const trackVideoEvent = (params: { action: "selected" | "started" | "closed"; video_id: string; video_source: "youtube"; surface: string; page_path?: string }) => trackAnalyticsEvent("content_video", { video_action: params.action, video_id: params.video_id, video_source: params.video_source, video_surface: params.surface, page_path: params.page_path });
export const trackSimulatorEvent = (params: { action: "started" | "input_changed" | "result_viewed" | "cta_clicked"; simulator_id: string; simulator_version: number; page_path: string }) => trackAnalyticsEvent("simulator_interaction", params);
