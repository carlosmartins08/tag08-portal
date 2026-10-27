import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS
} from "../server/contactSheetsProjection.mjs";
import { evaluateIntegrationPreflight } from "../tools/preflight-integrations.mjs";
import {
  CONTACT_STAGING_HEADERS,
  CONTACT_TALENT_STAGING_CONFIRMATION,
  CONTACT_TALENT_STAGING_SYNTHETIC_MARKER,
  TALENT_STAGING_HEADERS
} from "../tools/contactStagingGate.mjs";

const env = () => ({
  NODE_ENV: "production",
  ONBOARDING_ENABLED: "false",
  SUBMISSIONS_ENABLED: "false",
  INTEGRATIONS_ENABLED: "false",
  GOOGLE_SHEETS_ENABLED: "false",
  CLICKUP_ENABLED: "false",
  INTEGRATION_MOCK_MODE: "false",
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE",
  CLICKUP_PRE_SALES_LIST_ID: "901327894264",
  CLICKUP_TALENT_LIST_ID: "901327894264",
  CLICKUP_ONBOARDING_LIST_ID: ""
});

test("Contact and Talent direct staging preflight accepts exact staging destinations with persistent writes disabled and no database", () => {
  const result = evaluateIntegrationPreflight(env(), "contact-talent", "inspect");
  assert.equal(result.event, "direct_staging_preflight_passed");
  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.invalid, []);
  assert.equal(result.enabled, false);
});

test("direct staging rejects wrong destinations, enabled persistent flags, PostgreSQL settings, and enabled Onboarding", () => {
  for (const altered of [
    { ...env(), GOOGLE_SHEETS_SPREADSHEET_ID: "production-sheet" },
    { ...env(), CLICKUP_TALENT_LIST_ID: "900700474161" },
    { ...env(), CLICKUP_PRE_SALES_LIST_ID: "900700474161" },
    { ...env(), CLICKUP_ONBOARDING_LIST_ID: "123456789" },
    { ...env(), SUBMISSIONS_ENABLED: "true" },
    { ...env(), INTEGRATIONS_ENABLED: "true" },
    { ...env(), GOOGLE_SHEETS_ENABLED: "true" },
    { ...env(), CLICKUP_ENABLED: "true" },
    { ...env(), INTEGRATION_MOCK_MODE: "true" },
    { ...env(), ONBOARDING_ENABLED: "true" },
    { ...env(), DATABASE_URL: "postgresql://synthetic@db.invalid:5432/staging" },
    { ...env(), DATABASE_SSL: "true" }
  ]) {
    const result = evaluateIntegrationPreflight(altered, "contact-talent", "inspect");
    assert.ok(result.invalid.length > 0);
  }
});

test("deliver mode requires valid staging credentials while inspect does not require secrets", () => {
  const noSecrets = env();
  assert.deepEqual(evaluateIntegrationPreflight(noSecrets, "contact-talent", "inspect").missing, []);
  const deliver = evaluateIntegrationPreflight(noSecrets, "contact-talent", "deliver");
  assert.ok(deliver.missing.includes("GOOGLE_SERVICE_ACCOUNT_JSON"));
  assert.ok(deliver.missing.includes("CLICKUP_API_TOKEN"));

  const invalidJson = evaluateIntegrationPreflight({ ...noSecrets, GOOGLE_SERVICE_ACCOUNT_JSON: "not-json", CLICKUP_API_TOKEN: "synthetic" }, "contact-talent", "deliver");
  assert.ok(invalidJson.invalid.some((item) => item.includes("not valid JSON")));
  const placeholder = evaluateIntegrationPreflight({ ...noSecrets, GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "staging@tag08.invalid", private_key: "synthetic" }), CLICKUP_API_TOKEN: "placeholder-token" }, "contact-talent", "deliver");
  assert.ok(placeholder.invalid.some((item) => item.includes("placeholder")));
});

test("direct staging header contracts match exactly the authorized Sheets ranges", () => {
  assert.deepEqual(CONTACT_STAGING_HEADERS, [
    "Delivery ID", "Record ID", "Created At", "Payload JSON",
    ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS
  ]);
  assert.deepEqual(TALENT_STAGING_HEADERS, [
    "Delivery ID", "Record ID", "Created At", "Payload JSON",
    ...TALENT_SHEETS_V1_HEADERS, ...TALENT_DELIVERY_HEADERS
  ]);
  assert.equal(CONTACT_STAGING_HEADERS.length, 23);
  assert.equal(TALENT_STAGING_HEADERS.length, 24);
});

test("staging template has no database fallback, keeps integrations disabled, and pins both flows to staging", async () => {
  const template = await readFile(new URL("../.env.staging.example", import.meta.url), "utf8");
  assert.match(template, /^SUBMISSIONS_ENABLED="false"$/m);
  assert.match(template, /^INTEGRATIONS_ENABLED="false"$/m);
  assert.match(template, /^GOOGLE_SHEETS_ENABLED="false"$/m);
  assert.match(template, /^CLICKUP_ENABLED="false"$/m);
  assert.match(template, /^INTEGRATION_MOCK_MODE="false"$/m);
  assert.match(template, /^ONBOARDING_ENABLED="false"$/m);
  assert.match(template, /^CLICKUP_PRE_SALES_LIST_ID="901327894264"$/m);
  assert.match(template, /^CLICKUP_TALENT_LIST_ID="901327894264"$/m);
  assert.doesNotMatch(template, /^DATABASE_URL=/m);
  assert.doesNotMatch(template, /^CLICKUP_API_TOKEN=".+"$/m);
  assert.equal(CONTACT_TALENT_STAGING_CONFIRMATION, "TAG08_CONTACT_TALENT_STAGING");
  assert.equal(CONTACT_TALENT_STAGING_SYNTHETIC_MARKER, "TAG08 STAGING SYNTHETIC");
});

test("direct staging runner uses the Sheets store and contains no PostgreSQL/outbox worker path", async () => {
  const runner = await readFile(new URL("../tools/run-contact-staging-outbox.mjs", import.meta.url), "utf8");
  assert.match(runner, /createOperationalSubmissionStore/);
  assert.match(runner, /appendToGoogleSheets|createClickUpTask/);
  assert.doesNotMatch(runner, /from ["']pg["']|DATABASE_URL|integration_deliveries|integrationWorker\.mjs|spawnSync/);
});

test("full integration preflight retains the existing non-staging scope", () => {
  const fullScope = evaluateIntegrationPreflight({
    INTEGRATIONS_ENABLED: "true",
    GOOGLE_SHEETS_ENABLED: "false",
    CLICKUP_ENABLED: "true",
    CLICKUP_API_TOKEN: "synthetic-token",
    CLICKUP_PRE_SALES_LIST_ID: "901327894264"
  }, "all");
  assert.ok(fullScope.missing.includes("CLICKUP_TALENT_LIST_ID"));
  assert.ok(fullScope.missing.includes("CLICKUP_ONBOARDING_LIST_ID"));
});
