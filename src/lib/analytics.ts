import { readCookiePreferences } from "./cookieConsent";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;
type DeviceCategory = "mobile" | "tablet" | "desktop";
type ConsentModeValue = "granted" | "denied";
type WindowWithAnalytics = Window & typeof globalThis & {
  dataLayer?: unknown[];
  __tag08TagManagerConfigured?: boolean;
  __tag08ConsentDefaultConfigured?: boolean;
  __tag08ConsentSnapshot?: string;
};

const PRODUCTION_GTM_ID = "GTM-NNL7DMP";
const PRODUCTION_HOSTNAMES = new Set(["tag08.com.br", "www.tag08.com.br"]);
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;
export const GSC_VERIFICATION_TOKEN = (process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "").trim();
const GTM_SCRIPT_ID = "tag08-google-tag-manager";
let lastTrackedPageViewKey = "";
const emittedSubmissionKeys = new Set<string>();

const getWindow = () => window as WindowWithAnalytics;
export const resolveTagManagerId = (
  deploymentEnvironment: string | undefined,
  configuredId: string | undefined,
  hostname: string | undefined
) => {
  const environment = deploymentEnvironment?.trim().toLowerCase();
  const id = configuredId?.trim();
  const host = hostname?.trim().toLowerCase();

  if (environment === "production") {
    if (!host || !PRODUCTION_HOSTNAMES.has(host)) return null;
    if (!id) return PRODUCTION_GTM_ID;
    return id === PRODUCTION_GTM_ID ? id : null;
  }

  if (environment === "staging") {
    if (!host || PRODUCTION_HOSTNAMES.has(host) || !id || !GTM_ID_PATTERN.test(id) || id === PRODUCTION_GTM_ID) return null;
    return id;
  }

  return null;
};

const getTagManagerId = () => resolveTagManagerId(
  process.env.NEXT_PUBLIC_TAG08_DEPLOYMENT_ENV,
  process.env.NEXT_PUBLIC_GTM_ID,
  typeof window === "undefined" ? undefined : window.location.hostname
);
const hasTagManager = () => Boolean(getTagManagerId()) && typeof window !== "undefined";
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
    personalization_storage: "denied" as const,
    security_storage: "granted" as const
  };
};

const pushDataLayer = (value: unknown) => {
  if (typeof window === "undefined") return;
  const win = getWindow();
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(value);
};

const ensureDefaultConsent = () => {
  if (typeof window === "undefined") return;
  const win = getWindow();
  win.dataLayer = win.dataLayer || [];
  if (win.__tag08ConsentDefaultConfigured) return;
  win.dataLayer.push(["consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500
  }]);
  win.__tag08ConsentDefaultConfigured = true;
};

export const updateGoogleAnalyticsConsent = () => {
  if (!hasTagManager()) return;
  ensureDefaultConsent();
  const win = getWindow();
  const state = getConsentMode();
  const snapshot = JSON.stringify(state);
  if (win.__tag08ConsentSnapshot === snapshot) return;
  win.dataLayer!.push(["consent", "update", state]);
  win.__tag08ConsentSnapshot = snapshot;
};

export const getDeviceCategory = (): DeviceCategory => {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
};

const ALLOWED_PARAM_KEYS = new Set([
  "action", "ad_personalization", "ad_storage", "ad_user_data", "analytics_storage", "campaign", "contact_label",
  "contact_surface", "cta_location", "cta_name", "cta_type", "depth_percent", "delivery_status", "device_category",
  "engaged_seconds", "error_count", "form_name", "form_surface", "is_service_page", "language", "lead_label",
  "lead_surface", "metric_name", "metric_rating", "metric_value", "page_group", "page_location", "page_path",
  "page_referrer", "page_title", "request_type", "route_key", "route_type", "simulator_id", "simulator_version",
  "status", "step", "step_name", "surface", "total_steps", "video_action",
  "video_id", "video_source", "video_surface"
]);
const PII_PARAM_KEYS = new Set([
  "email", "phone", "whatsapp", "message", "full_name", "first_name", "last_name", "payload", "name", "company",
  "cpf", "cnpj", "token", "authorization", "resumeurl", "linkedin", "portfolio", "motivation"
]);
const LIKELY_EMAIL = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/i;
const LIKELY_PHONE = /(?:\+?\d[\d ().-]{7,}\d)/;

const safeString = (value: string) => {
  const normalized = value.trim();
  if (!normalized || normalized.length > 160 || LIKELY_EMAIL.test(normalized) || LIKELY_PHONE.test(normalized)) return undefined;
  return normalized;
};

export const sanitizeAnalyticsParams = (params: AnalyticsParams = {}) =>
  Object.entries(params).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
    const normalizedKey = key.toLowerCase();
    if (!ALLOWED_PARAM_KEYS.has(normalizedKey) || PII_PARAM_KEYS.has(normalizedKey) || value === null || value === undefined) return acc;
    if (typeof value === "string") {
      const normalized = safeString(value);
      if (normalized !== undefined) acc[normalizedKey] = normalized;
      return acc;
    }
    if (typeof value === "number" && Number.isFinite(value)) acc[normalizedKey] = value;
    if (typeof value === "boolean") acc[normalizedKey] = value;
    return acc;
  }, {});

export const getMonitoringConfig = () => ({
  gtmId: getTagManagerId(),
  searchConsoleVerificationToken: GSC_VERIFICATION_TOKEN || null
});

/** Loads the single GTM container only after opt-in to analytics or marketing. */
export const initializeTagManager = () => {
  const gtmId = getTagManagerId();
  if (!gtmId || typeof window === "undefined") return false;
  ensureDefaultConsent();
  updateGoogleAnalyticsConsent();
  if (!hasTrackingConsent()) return false;
  const win = getWindow();
  if (document.getElementById(GTM_SCRIPT_ID) || win.__tag08TagManagerConfigured) return true;

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
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

const trackedPageLocation = (raw: string) => {
  try {
    const url = new URL(raw, typeof window === "undefined" ? "https://tag08.com.br" : window.location.origin);
    const result = new URL(`${url.origin}${url.pathname}`);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    for (const key of utmKeys) {
      const value = url.searchParams.get(key);
      if (value && /^[\p{L}\p{N}_-]{1,100}$/u.test(value) && !LIKELY_EMAIL.test(value) && !LIKELY_PHONE.test(value)) {
        result.searchParams.set(key, value);
      }
    }
    return result.toString();
  } catch {
    return undefined;
  }
};

const trackedReferrer = (raw?: string) => {
  if (!raw) return undefined;
  try { return new URL(raw).origin; } catch { return undefined; }
};

const safePagePath = (raw: string) => {
  const path = raw.split(/[?#]/, 1)[0];
  return path.startsWith("/") && !LIKELY_EMAIL.test(path) && !LIKELY_PHONE.test(path) ? path : "/";
};

export const trackPageView = (params: {
  page_location: string; page_path: string; page_title: string; page_referrer?: string; language?: string;
  route_type?: string; route_key?: string; page_group?: string; is_service_page?: boolean;
}) => {
  if (!hasTrackingConsent()) return;
  const pageLocation = trackedPageLocation(params.page_location);
  const pagePath = safePagePath(params.page_path);
  if (!pageLocation) return;
  const page = { ...params, page_location: pageLocation, page_path: pagePath, page_referrer: trackedReferrer(params.page_referrer) };
  const cacheKey = [page.page_location, page.page_title, page.page_path, page.language ?? "", page.route_type ?? ""].join("|");
  if (cacheKey === lastTrackedPageViewKey) return;
  lastTrackedPageViewKey = cacheKey;
  trackAnalyticsEvent("page_view", { ...page, device_category: getDeviceCategory() });
};

export const trackCtaClick = (params: {
  cta_name: string; cta_location: string; cta_type?: string; target_url?: string; language?: string; page_path?: string;
}) => {
  trackAnalyticsEvent("cta_click", {
    cta_name: params.cta_name, cta_location: params.cta_location, cta_type: params.cta_type,
    language: params.language, page_path: params.page_path
  });
};

const isApprovedWhatsAppUrl = (raw: string) => {
  try {
    const target = new URL(raw);
    return target.protocol === "https:" && !target.username && !target.password &&
      (target.hostname.toLowerCase() === "wa.me" || target.hostname.toLowerCase() === "api.whatsapp.com");
  } catch { return false; }
};

export const trackOutboundClick = (params: { label: string; url: string; surface: string; language?: string }) => {
  trackCtaClick({ cta_name: params.label, cta_location: params.surface, cta_type: "outbound", language: params.language });
  try {
    const target = new URL(params.url);
    const contactParams = { contact_surface: params.surface, contact_label: params.label, language: params.language };
    if (isApprovedWhatsAppUrl(params.url)) trackAnalyticsEvent("contact_whatsapp", contactParams);
    if (target.protocol === "tel:") trackAnalyticsEvent("contact_phone", contactParams);
    if (target.protocol === "mailto:") trackAnalyticsEvent("contact_email", contactParams);
  } catch {
    // The generic CTA event remains useful when a target cannot be parsed.
  }
};

export const trackLeadEvent = (params: { action: string; surface: string; label?: string; language?: string; status?: string; page_path?: string; step?: number; step_name?: string; total_steps?: number }) =>
  trackAnalyticsEvent("lead_action", { action: params.action, lead_surface: params.surface, lead_label: params.label, language: params.language, status: params.status, page_path: params.page_path, step: params.step, step_name: params.step_name, total_steps: params.total_steps });

export const trackFormStart = (params: { form_name: string; form_surface: string; language?: string; page_path?: string }) => trackAnalyticsEvent("form_start", params);

type ContactRequestType = "new_project" | "diagnostic" | "existing_client" | "partnership" | "";
type FormSubmitParams = {
  form_name: string;
  form_surface: string;
  status: "success" | "queued" | "validation_error" | "error";
  language?: string;
  page_path?: string;
  request_type?: ContactRequestType;
  /** Local-only key used to suppress duplicate confirmations; never sent to analytics. */
  submission_key?: string;
};

export const shouldEmitGenerateLead = (params: FormSubmitParams) =>
  params.status === "success" && params.form_name === "contact" && params.request_type === "new_project";

export const trackFormSubmit = (params: FormSubmitParams) => {
  if (params.submission_key && emittedSubmissionKeys.has(params.submission_key)) return;
  if (params.submission_key) emittedSubmissionKeys.add(params.submission_key);
  const { submission_key: _localOnlySubmissionKey, ...eventParams } = params;
  trackAnalyticsEvent("form_submit", eventParams);
  if (shouldEmitGenerateLead(params)) {
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
