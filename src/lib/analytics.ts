type AnalyticsValue = string | number | boolean | null | undefined;

type AnalyticsParams = Record<string, AnalyticsValue>;

const PII_PARAM_KEYS = new Set([
  "email",
  "phone",
  "whatsapp",
  "message",
  "full_name",
  "first_name",
  "last_name",
  "payload"
]);

type DeviceCategory = "mobile" | "tablet" | "desktop";

type WindowWithAnalytics = Window &
  typeof globalThis & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

type AnalyticsWindowState = WindowWithAnalytics & {
  __tag08GoogleAnalyticsConfigured?: boolean;
};

const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID ?? "").trim();
export const GSC_VERIFICATION_TOKEN = (process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "").trim();

const GTAG_SCRIPT_ID = "tag08-google-tag";
const PAGE_VIEW_DEBOUNCE_MS = 800;

let lastTrackedPageViewKey = "";
let lastTrackedPageViewAt = 0;

const getWindow = () => window as WindowWithAnalytics;

const hasGoogleAnalytics = () => Boolean(GA4_ID) && typeof window !== "undefined";

const hasAnalyticsConsent = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.localStorage.getItem("tag08_lgpd_consent");
    if (!raw) {
      return false;
    }

    return JSON.parse(raw)?.performance === true;
  } catch {
    return false;
  }
};

export const updateGoogleAnalyticsConsent = (granted: boolean) => {
  if (!hasGoogleAnalytics()) {
    return;
  }

  const win = getWindow() as WindowWithAnalytics & Record<string, boolean | undefined>;
  win[`ga-disable-${GA4_ID}`] = !granted;
  win.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
};

const getDeviceCategory = (): DeviceCategory => {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const width = window.innerWidth;
  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
};

export const sanitizeAnalyticsParams = (params: AnalyticsParams = {}) =>
  Object.entries(params).reduce<Record<string, Exclude<AnalyticsValue, null | undefined>>>((acc, [key, value]) => {
    if (value === null || value === undefined || PII_PARAM_KEYS.has(key.toLowerCase())) {
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});

export const getMonitoringConfig = () => ({
  ga4Id: GA4_ID || null,
  searchConsoleVerificationToken: GSC_VERIFICATION_TOKEN || null
});

export const initializeGoogleAnalytics = () => {
  if (!hasGoogleAnalytics() || !hasAnalyticsConsent()) {
    return false;
  }

  const win = getWindow();
  win.dataLayer = win.dataLayer || [];
  win.gtag =
    win.gtag ||
    function gtagShim(...args: unknown[]) {
      win.dataLayer?.push(args);
    };

  if (document.getElementById(GTAG_SCRIPT_ID)) {
    return true;
  }

  const analyticsWindow = win as AnalyticsWindowState;
  if (!analyticsWindow.__tag08GoogleAnalyticsConfigured) {
    win.gtag("js", new Date());
    win.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    win.gtag("consent", "update", {
      analytics_storage: "granted"
    });
    win.gtag("config", GA4_ID, {
      send_page_view: false,
      allow_google_signals: false
    });
    analyticsWindow.__tag08GoogleAnalyticsConfigured = true;
  }

  const script = document.createElement("script");
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);

  return true;
};

export const trackAnalyticsEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (!hasGoogleAnalytics() || !hasAnalyticsConsent()) {
    return;
  }

  const win = getWindow();
  initializeGoogleAnalytics();
  win.gtag?.("event", eventName, sanitizeAnalyticsParams(params));
};

export const trackPageView = (params: {
  page_location: string;
  page_path: string;
  page_title: string;
  page_referrer?: string;
  language?: string;
  route_type?: string;
  route_key?: string;
  page_group?: string;
  is_service_page?: boolean;
}) => {
  if (!hasGoogleAnalytics()) {
    return;
  }

  const cacheKey = [
    params.page_location,
    params.page_title,
    params.page_path,
    params.language ?? "",
    params.route_type ?? ""
  ].join("|");
  const now = Date.now();

  if (cacheKey === lastTrackedPageViewKey && now - lastTrackedPageViewAt < PAGE_VIEW_DEBOUNCE_MS) {
    return;
  }

  lastTrackedPageViewKey = cacheKey;
  lastTrackedPageViewAt = now;

  trackAnalyticsEvent("page_view", {
    page_location: params.page_location,
    page_path: params.page_path,
    page_title: params.page_title,
    page_referrer: params.page_referrer,
    language: params.language,
    route_type: params.route_type,
    route_key: params.route_key,
    page_group: params.page_group,
    is_service_page: params.is_service_page,
    device_category: getDeviceCategory()
  });
};

export const trackCtaClick = (params: {
  cta_name: string;
  cta_location: string;
  cta_type?: string;
  target_url?: string;
  language?: string;
  page_path?: string;
}) => {
  let targetDomain: string | undefined;
  let targetPath: string | undefined;

  if (params.target_url) {
    try {
      const parsed = new URL(params.target_url);
      const scheme = parsed.protocol.replace(":", "");
      if (scheme === "mailto" || scheme === "tel") {
        targetDomain = scheme;
      } else {
        targetDomain = parsed.hostname.replace(/^www\./, "");
      }
      targetPath = parsed.pathname;
    } catch {
      targetDomain = undefined;
      targetPath = undefined;
    }
  }

  trackAnalyticsEvent("cta_click", {
    cta_name: params.cta_name,
    cta_location: params.cta_location,
    cta_type: params.cta_type,
    target_domain: targetDomain,
    target_path: targetPath,
    language: params.language,
    page_path: params.page_path
  });
};

export const trackOutboundClick = (params: {
  label: string;
  url: string;
  surface: string;
  language?: string;
}) => {
  trackCtaClick({
    cta_name: params.label,
    cta_location: params.surface,
    cta_type: "outbound",
    target_url: params.url,
    language: params.language
  });
};

export const trackLeadEvent = (params: {
  action: string;
  surface: string;
  label?: string;
  language?: string;
  status?: string;
  page_path?: string;
  step?: number;
  step_name?: string;
  total_steps?: number;
}) => {
  trackAnalyticsEvent("lead_action", {
    action: params.action,
    lead_surface: params.surface,
    lead_label: params.label,
    language: params.language,
    status: params.status,
    page_path: params.page_path,
    step: params.step,
    step_name: params.step_name,
    total_steps: params.total_steps
  });
};

export const trackFormStart = (params: {
  form_name: string;
  form_surface: string;
  language?: string;
  page_path?: string;
}) => {
  trackAnalyticsEvent("form_start", {
    form_name: params.form_name,
    form_surface: params.form_surface,
    language: params.language,
    page_path: params.page_path
  });
};

export const trackFormSubmit = (params: {
  form_name: string;
  form_surface: string;
  status: "success" | "queued" | "validation_error" | "error";
  language?: string;
  page_path?: string;
}) => {
  trackAnalyticsEvent("form_submit", {
    form_name: params.form_name,
    form_surface: params.form_surface,
    status: params.status,
    language: params.language,
    page_path: params.page_path
  });

  if (params.status === "success" || params.status === "queued") {
    trackAnalyticsEvent("generate_lead", {
      form_name: params.form_name,
      form_surface: params.form_surface,
      delivery_status: params.status,
      language: params.language,
      page_path: params.page_path
    });
  }
};

export const trackFormError = (params: {
  form_name: string;
  form_surface: string;
  error_count: number;
  language?: string;
  page_path?: string;
}) => {
  trackAnalyticsEvent("form_error", {
    form_name: params.form_name,
    form_surface: params.form_surface,
    error_count: params.error_count,
    language: params.language,
    page_path: params.page_path
  });
};

export const trackFormStep = (params: {
  form_name: string;
  form_surface: string;
  step: number;
  step_name?: string;
  total_steps?: number;
  language?: string;
  page_path?: string;
}) => {
  trackAnalyticsEvent("form_step", {
    form_name: params.form_name,
    form_surface: params.form_surface,
    step: params.step,
    step_name: params.step_name,
    total_steps: params.total_steps,
    language: params.language,
    page_path: params.page_path
  });
};

export const trackScrollDepth = (params: {
  page_path: string;
  page_title: string;
  depth_percent: number;
  language?: string;
  route_type?: string;
}) => {
  trackAnalyticsEvent("scroll_depth", {
    page_path: params.page_path,
    page_title: params.page_title,
    depth_percent: params.depth_percent,
    language: params.language,
    route_type: params.route_type
  });
};

export const trackEngagement = (params: {
  page_path: string;
  page_title: string;
  engaged_seconds: number;
  language?: string;
  route_type?: string;
}) => {
  trackAnalyticsEvent("engagement_time", {
    page_path: params.page_path,
    page_title: params.page_title,
    engaged_seconds: params.engaged_seconds,
    language: params.language,
    route_type: params.route_type
  });
};

export const trackVideoEvent = (params: {
  action: "selected" | "started" | "closed";
  video_id: string;
  video_source: "youtube";
  surface: string;
  page_path?: string;
}) => {
  trackAnalyticsEvent("content_video", {
    video_action: params.action,
    video_id: params.video_id,
    video_source: params.video_source,
    video_surface: params.surface,
    page_path: params.page_path
  });
};

export const trackSimulatorEvent = (params: {
  action: "started" | "input_changed" | "result_viewed" | "cta_clicked";
  simulator_id: string;
  simulator_version: number;
  page_path: string;
}) => {
  trackAnalyticsEvent("simulator_interaction", params);
};
