import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeAnalyticsParams } from "../src/lib/analytics";

test("analytics removes personal data keys while preserving simulator context", () => {
  assert.deepEqual(
    sanitizeAnalyticsParams({
      simulator_id: "hosting_price",
      simulator_version: 1,
      page_path: "/hospedagem-manutencao-sites",
      email: "person@example.test",
      whatsapp: "+5500000000000",
      message: "private detail",
      payload: "private payload"
    }),
    {
      simulator_id: "hosting_price",
      simulator_version: 1,
      page_path: "/hospedagem-manutencao-sites"
    }
  );
});
