import assert from "node:assert/strict";
import test from "node:test";
import {
  getMonitoringConfig,
  sanitizeAnalyticsParams,
  shouldEmitGenerateLead,
  trackFormSubmit,
  trackOutboundClick,
  trackPageView,
  updateGoogleAnalyticsConsent,
  initializeTagManager
} from "../src/lib/analytics";

const withBrowser = async (
  preferences: string | null,
  run: (browser: { dataLayer: unknown[]; scripts: { id: string; src: string }[]; storage: Map<string, string>; window: Record<string, unknown> }) => void | Promise<void>
) => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();
  if (preferences !== null) storage.set("tag08_lgpd_consent", preferences);
  const dataLayer: unknown[] = [];
  const scripts: { id: string; src: string }[] = [];
  const fakeWindow = {
    dataLayer,
    localStorage: { getItem: (key: string) => storage.get(key) ?? null },
    location: { origin: "https://tag08.com.br" },
    innerWidth: 1280
  };
  const fakeDocument = {
    getElementById: (id: string) => scripts.find((script) => script.id === id) ?? null,
    createElement: () => ({ id: "", src: "", async: false }),
    head: { appendChild: (script: { id: string; src: string }) => scripts.push(script) }
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
  Object.defineProperty(globalThis, "document", { configurable: true, value: fakeDocument });
  try {
    await run({ dataLayer, scripts, storage, window: fakeWindow });
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
};

const consent = (performance: boolean, marketing: boolean) => JSON.stringify({ version: 2, essential: true, performance, marketing });
const eventNames = (dataLayer: unknown[]) => dataLayer.flatMap((entry) =>
  typeof entry === "object" && entry !== null && "event" in entry ? [(entry as { event: string }).event] : []
);

test("analytics accepts only approved non-identifying parameters and rejects PII values", () => {
  assert.deepEqual(sanitizeAnalyticsParams({
    simulator_id: "hosting_price",
    page_path: "/servicos/desenvolvimento-web?email=person@example.test",
    email: "person@example.test",
    cta_name: "Contato +55 83 99999-0000",
    company: "Private Company",
    payload: "private detail",
    unknown_parameter: "should_not_pass",
    metric_value: 1200
  }), { simulator_id: "hosting_price", metric_value: 1200 });
});

test("analytics exposes one GTM container and no direct GA measurement ID", () => {
  const config = getMonitoringConfig();
  assert.equal(config.gtmId, "GTM-NNL7DMP");
  assert.equal("ga4Id" in config, false);
});

test("consent defaults to denied before GTM, updates by category, and loads once after opt-in", async () => {
  await withBrowser(null, ({ dataLayer, scripts, storage }) => {
    updateGoogleAnalyticsConsent();
    const defaultConsent = dataLayer.find((entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "default") as unknown[];
    assert.ok(defaultConsent);
    assert.equal((defaultConsent[2] as Record<string, string>).analytics_storage, "denied");
    assert.equal((defaultConsent[2] as Record<string, string>).ad_storage, "denied");
    assert.equal(initializeTagManager(), false);
    assert.equal(scripts.length, 0);

    storage.set("tag08_lgpd_consent", consent(true, false));
    updateGoogleAnalyticsConsent();
    assert.equal(initializeTagManager(), true);
    assert.equal(initializeTagManager(), true);
    assert.equal(scripts.length, 1);
    const updates = dataLayer.filter((entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update") as unknown[][];
    assert.equal((updates.at(-1)?.[2] as Record<string, string>).analytics_storage, "granted");
    assert.equal((updates.at(-1)?.[2] as Record<string, string>).ad_storage, "denied");

    storage.set("tag08_lgpd_consent", consent(false, true));
    updateGoogleAnalyticsConsent();
    const marketingUpdates = dataLayer.filter((entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update") as unknown[][];
    const marketingOnly = marketingUpdates.at(-1)?.[2] as Record<string, string>;
    assert.equal(marketingOnly.analytics_storage, "denied");
    assert.equal(marketingOnly.ad_storage, "granted");
    assert.equal(marketingOnly.ad_user_data, "granted");
    assert.equal(marketingOnly.ad_personalization, "granted");
  });
});

test("consent revocation updates categories and prevents further application events", async () => {
  await withBrowser(consent(true, true), ({ dataLayer, storage }) => {
    assert.equal(initializeTagManager(), true);
    storage.set("tag08_lgpd_consent", consent(false, false));
    updateGoogleAnalyticsConsent();
    const before = eventNames(dataLayer).length;
    trackPageView({ page_location: "https://tag08.com.br/consent-revoked", page_path: "/consent-revoked", page_title: "Test" });
    assert.equal(eventNames(dataLayer).length, before);
    const updates = dataLayer.filter((entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update") as unknown[][];
    assert.equal((updates.at(-1)?.[2] as Record<string, string>).analytics_storage, "denied");
    assert.equal((updates.at(-1)?.[2] as Record<string, string>).ad_storage, "denied");
  });
});

test("page_view waits for consent, deduplicates rerenders, preserves only safe UTMs, and recounts back navigation", async () => {
  await withBrowser(null, ({ dataLayer, storage }) => {
    const page = { page_location: "https://tag08.com.br/rota?email=person@example.test&utm_source=linkedin&utm_campaign=service_a", page_path: "/rota", page_title: "Route" };
    trackPageView(page);
    assert.equal(eventNames(dataLayer).includes("page_view"), false);

    storage.set("tag08_lgpd_consent", consent(true, false));
    trackPageView(page);
    trackPageView(page);
    const first = dataLayer.find((entry) => typeof entry === "object" && entry !== null && "event" in entry && entry.event === "page_view") as Record<string, unknown>;
    assert.equal(first.page_location, "https://tag08.com.br/rota?utm_source=linkedin&utm_campaign=service_a");
    assert.equal(first.page_referrer, undefined);

    trackPageView({ ...page, page_location: "https://tag08.com.br/other", page_path: "/other" });
    trackPageView(page);
    assert.equal(eventNames(dataLayer).filter((event) => event === "page_view").length, 3);
  });
});

test("generate_lead means only a persisted new-project contact and duplicate submission confirmations are suppressed", async () => {
  const base = { form_name: "contact", form_surface: "contact-page", status: "success" as const, request_type: "new_project" as const };
  assert.equal(shouldEmitGenerateLead(base), true);
  assert.equal(shouldEmitGenerateLead({ ...base, status: "queued" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, form_name: "talent_application", request_type: undefined }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "diagnostic" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "existing_client" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "partnership" }), false);

  await withBrowser(consent(true, false), ({ dataLayer }) => {
    trackFormSubmit({ ...base, submission_key: "synthetic-delivery-1" });
    trackFormSubmit({ ...base, submission_key: "synthetic-delivery-1" });
    assert.equal(eventNames(dataLayer).filter((event) => event === "form_submit").length, 1);
    assert.equal(eventNames(dataLayer).filter((event) => event === "generate_lead").length, 1);
    assert.equal(JSON.stringify(dataLayer).includes("synthetic-delivery-1"), false);
  });
});

test("WhatsApp tracking accepts only official HTTPS hosts and never emits URL paths or query data", async () => {
  await withBrowser(consent(true, false), ({ dataLayer }) => {
    trackOutboundClick({ label: "WhatsApp Brasil", url: "https://wa.me/5583999999999?text=private", surface: "footer" });
    trackOutboundClick({ label: "WhatsApp API", url: "https://api.whatsapp.com/send?phone=5583999999999", surface: "contact" });
    trackOutboundClick({ label: "Lookalike", url: "https://wa.me.attacker.test/5583999999999", surface: "test" });
    trackOutboundClick({ label: "Insecure", url: "http://wa.me/5583999999999", surface: "test" });
    assert.equal(eventNames(dataLayer).filter((event) => event === "contact_whatsapp").length, 2);
    const serialized = JSON.stringify(dataLayer);
    assert.equal(serialized.includes("5583999999999"), false);
    assert.equal(serialized.includes("private"), false);
    assert.equal(serialized.includes("wa.me/"), false);
  });
});
