import assert from "node:assert/strict";
import test from "node:test";
import { getMonitoringConfig, sanitizeAnalyticsParams } from "../src/lib/analytics";

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
