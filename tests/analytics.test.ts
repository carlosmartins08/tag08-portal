import assert from "node:assert/strict";
import test from "node:test";
import { getMonitoringConfig, sanitizeAnalyticsParams, shouldEmitGenerateLead, trackPageView } from "../src/lib/analytics";

test("analytics removes personal data keys while preserving simulator context", () => {
  assert.deepEqual(
    sanitizeAnalyticsParams({
      simulator_id: "hosting_price",
      simulator_version: 1,
      page_path: "/hospedagem-manutencao-sites",
      metric_name: "LCP",
      metric_value: 1200,
      email: "person@example.test",
      name: "Person Name",
      company: "Private Company",
      whatsapp: "+5500000000000",
      message: "private detail",
      payload: "private payload"
    }),
    {
      simulator_id: "hosting_price",
      simulator_version: 1,
      page_path: "/hospedagem-manutencao-sites",
      metric_name: "LCP",
      metric_value: 1200
    }
  );
});

test("analytics exposes a single GTM container rather than a direct GA measurement id", () => {
  const config = getMonitoringConfig();
  assert.equal(config.gtmId, "GTM-NNL7DMP");
  assert.equal("ga4Id" in config, false);
});

test("generate_lead only represents a persisted new-project Contact submission", () => {
  const base = { form_name: "contact", form_surface: "contact-page", status: "success" as const, request_type: "new_project" as const };
  assert.equal(shouldEmitGenerateLead(base), true);
  assert.equal(shouldEmitGenerateLead({ ...base, status: "queued" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, form_name: "talent_application", request_type: undefined }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "diagnostic" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "existing_client" }), false);
  assert.equal(shouldEmitGenerateLead({ ...base, request_type: "partnership" }), false);
});

test("page_view waits for consent without consuming the duplicate guard", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();
  const fakeWindow = {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null },
    dataLayer: [] as unknown[],
    innerWidth: 1280,
    __tag08TagManagerConfigured: true
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { getElementById: () => null } });

  const page = {
    page_location: "https://tag08.com.br/analytics-consent-test",
    page_path: "/analytics-consent-test",
    page_title: "Analytics consent test"
  };

  try {
    trackPageView(page);
    assert.equal(fakeWindow.dataLayer.some((entry) => typeof entry === "object" && entry !== null && "event" in entry && entry.event === "page_view"), false);

    storage.set("tag08_lgpd_consent", JSON.stringify({ version: 2, essential: true, performance: true, marketing: false }));
    trackPageView(page);
    trackPageView(page);
    assert.equal(fakeWindow.dataLayer.filter((entry) => typeof entry === "object" && entry !== null && "event" in entry && entry.event === "page_view").length, 1);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
