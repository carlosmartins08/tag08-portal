import assert from "node:assert/strict";
import test from "node:test";
import { getMonitoringConfig, sanitizeAnalyticsParams, trackFormSubmit } from "../src/lib/analytics";

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

test("only a persisted form success emits generate_lead", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const dataLayer: unknown[] = [];
  const mockWindow = {
    dataLayer,
    __tag08TagManagerConfigured: true,
    localStorage: {
      getItem: () => JSON.stringify({ version: 2, essential: true, performance: true, marketing: false })
    }
  };

  Object.defineProperty(globalThis, "window", { configurable: true, value: mockWindow });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { getElementById: () => ({}) }
  });

  try {
    for (const status of ["success", "queued", "validation_error", "error"] as const) {
      dataLayer.length = 0;
      trackFormSubmit({ form_name: "talent_application", form_surface: "talent-page", status });

      const events = dataLayer.filter((entry): entry is { event: string; delivery_status?: string } =>
        typeof entry === "object" && entry !== null && "event" in entry
      );
      assert.equal(events.some((event) => event.event === "form_submit"), true, `${status} remains observable`);
      assert.equal(
        events.some((event) => event.event === "generate_lead"),
        status === "success",
        `${status} ${status === "success" ? "counts as" : "does not count as"} a completed lead`
      );
    }
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
