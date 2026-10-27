import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { CONTACT_SHEETS_V1_HEADERS } from "../server/contactSheetsProjection.mjs";
import { evaluateIntegrationPreflight } from "../tools/preflight-integrations.mjs";
import {
  buildOneContactWorkerEnvironment,
  CONTACT_STAGING_RETRY_ERROR,
  isSyntheticContactPayload,
  validateContactDeliveryRows
} from "../tools/contactStagingGate.mjs";

const env = () => ({
  NODE_ENV: "production",
  BASE_URL: "https://tag08-qa.test",
  ALLOWED_ORIGINS: "https://tag08-qa.test",
  DATABASE_URL: "postgresql://qa:synthetic@db-tag08-staging.internal:5432/tag08_contact_staging?sslmode=verify-full",
  DATABASE_SSL: "true",
  TAG08_STAGING_DATABASE_HOST: "db-tag08-staging.internal",
  TAG08_STAGING_DATABASE_NAME: "tag08_contact_staging",
  TAG08_STAGING_DATABASE_APPROVED: "true",
  INTEGRATIONS_ENABLED: "false",
  GOOGLE_SHEETS_ENABLED: "false",
  CLICKUP_ENABLED: "false",
  INTEGRATION_MOCK_MODE: "false",
  INTEGRATION_DELIVERY_ID: "",
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE",
  CLICKUP_PRE_SALES_LIST_ID: "901327894264",
  CLICKUP_TALENT_LIST_ID: "",
  CLICKUP_ONBOARDING_LIST_ID: "",
  GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "contact-staging@example.test", private_key: "synthetic-private-key" }),
  CLICKUP_API_TOKEN: "synthetic-clickup-token"
});

const row = (target) => ({
  id: `delivery-${target.toLowerCase()}-12345678`,
  aggregate_id: "contact-record-12345678",
  aggregate_type: "contact_lead",
  target,
  status: "PENDING",
  attempts: 0,
  next_attempt_at: new Date(Date.now() - 1000),
  last_error_code: null,
  external_reference: null,
  payload: {
    version: 1,
    data: {
      name: "TAG08 QA Contact Synthetic",
      company: "TAG08 QA Synthetic",
      email: "tag08-contact-20261026-abc123@example.test",
      whatsapp: "+5500000000000",
      requestType: "new_project",
      message: "SIMULACAO SINTETICA TAG08 \u2014 NAO ATENDER NEM APROVAR."
    }
  }
});

test("Contact preflight accepts only the pinned staging destinations while the persistent service stays disabled", () => {
  const result = evaluateIntegrationPreflight(env(), "contact", "inspect");
  assert.equal(result.event, "contact_staging_config_preflight_passed");
  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.invalid, []);
  assert.equal(result.enabled, false);
});

test("Contact preflight rejects production or unrelated destinations, enabled background flags, and bad stage database identity", () => {
  const wrongSheet = evaluateIntegrationPreflight({ ...env(), GOOGLE_SHEETS_SPREADSHEET_ID: "production-sheet" }, "contact");
  assert.ok(wrongSheet.invalid.some((item) => item.toLowerCase().includes("spreadsheet")));

  const wrongList = evaluateIntegrationPreflight({ ...env(), CLICKUP_PRE_SALES_LIST_ID: "900700475931" }, "contact");
  assert.ok(wrongList.invalid.some((item) => item.includes("staging list")));

  const extraLists = evaluateIntegrationPreflight({ ...env(), CLICKUP_TALENT_LIST_ID: "123456789" }, "contact");
  assert.ok(extraLists.invalid.some((item) => item.includes("Talent or Onboarding")));

  const enabledBackground = evaluateIntegrationPreflight({ ...env(), INTEGRATIONS_ENABLED: "true" }, "contact");
  assert.ok(enabledBackground.invalid.some((item) => item.startsWith("INTEGRATIONS_ENABLED ")));

  const wrongDatabase = evaluateIntegrationPreflight({ ...env(), DATABASE_URL: "postgresql://qa@other-db.internal:5432/tag08_contact_staging?sslmode=verify-full" }, "contact");
  assert.ok(wrongDatabase.invalid.some((item) => item.includes("host does not match")));

  const unapprovedDatabase = evaluateIntegrationPreflight({ ...env(), TAG08_STAGING_DATABASE_APPROVED: "false" }, "contact");
  assert.ok(unapprovedDatabase.invalid.some((item) => item.includes("independent operator approval")));

  const insecureDatabase = evaluateIntegrationPreflight({ ...env(), DATABASE_SSL: "false" }, "contact");
  assert.ok(insecureDatabase.invalid.some((item) => item.includes("DATABASE_SSL")));

  const unverifiedTls = evaluateIntegrationPreflight({ ...env(), DATABASE_URL: env().DATABASE_URL.replace("sslmode=verify-full", "sslmode=require") }, "contact");
  assert.ok(unverifiedTls.invalid.some((item) => item.includes("sslmode=verify-full")));
});

test("Contact preflight is fail-closed and credentials are required only for real delivery", () => {
  const noCredentials = { ...env(), GOOGLE_SERVICE_ACCOUNT_JSON: "", CLICKUP_API_TOKEN: "" };
  assert.equal(evaluateIntegrationPreflight(noCredentials, "contact", "inspect").invalid.length, 0);
  assert.equal(evaluateIntegrationPreflight(noCredentials, "contact", "simulate-failure").invalid.length, 0);
  assert.ok(evaluateIntegrationPreflight(noCredentials, "contact", "deliver").missing.includes("GOOGLE_SERVICE_ACCOUNT_JSON"));
  assert.ok(evaluateIntegrationPreflight(noCredentials, "contact", "deliver").missing.includes("CLICKUP_API_TOKEN"));

  for (const key of ["INTEGRATIONS_ENABLED", "GOOGLE_SHEETS_ENABLED", "CLICKUP_ENABLED", "INTEGRATION_MOCK_MODE"]) {
    for (const value of [undefined, null, "", "false ", "yes", "true"]) {
      const altered = { ...env() };
      if (value === undefined) delete altered[key];
      else altered[key] = value;
      const result = evaluateIntegrationPreflight(altered, "contact", "inspect");
      assert.ok(result.missing.includes(key) || result.invalid.some((item) => item.startsWith(`${key} `)), `${key}=${String(value)}`);
    }
  }

  for (const value of [undefined, null, " ", "delivery-12345678"]) {
    const altered = { ...env() };
    if (value === undefined) delete altered.INTEGRATION_DELIVERY_ID;
    else altered.INTEGRATION_DELIVERY_ID = value;
    const result = evaluateIntegrationPreflight(altered, "contact", "inspect");
    assert.ok(result.missing.includes("INTEGRATION_DELIVERY_ID") || result.invalid.some((item) => item.includes("INTEGRATION_DELIVERY_ID")));
  }
});

test("full integration preflight retains the existing requirements for non-Contact flows", () => {
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

test("one-delivery worker environment cannot inherit production secrets or another target", () => {
  const staging = env();
  staging.GOOGLE_SERVICE_ACCOUNT_JSON = "staging-json";
  staging.CLICKUP_API_TOKEN = "staging-token";
  const inherited = {
    PATH: "system-path",
    DATABASE_URL: "postgresql://production",
    CLICKUP_API_TOKEN: "production-token",
    GOOGLE_SERVICE_ACCOUNT_JSON: "production-json",
    NODE_OPTIONS: "--require unexpected.js",
    GOOGLE_SHEETS_ENABLED: "true"
  };

  const child = buildOneContactWorkerEnvironment(staging, "CLICKUP", "delivery-clickup-12345678", "deliver", inherited);
  assert.equal(child.DATABASE_URL, staging.DATABASE_URL);
  assert.equal(child.CLICKUP_API_TOKEN, "staging-token");
  assert.equal(child.GOOGLE_SERVICE_ACCOUNT_JSON, "staging-json");
  assert.equal(child.INTEGRATION_DELIVERY_ID, "delivery-clickup-12345678");
  assert.equal(child.CLICKUP_ENABLED, "true");
  assert.equal(child.GOOGLE_SHEETS_ENABLED, "false");
  assert.equal(Object.hasOwn(child, "NODE_OPTIONS"), false);
});

test("synthetic test payload is required; real-looking payloads are rejected", () => {
  assert.equal(isSyntheticContactPayload(row("CLICKUP").payload), true);
  const personal = structuredClone(row("CLICKUP").payload);
  personal.data.email = "person@example.com";
  assert.equal(isSyntheticContactPayload(personal), false);
});

test("staging runner refuses missing, additional, or cross-aggregate deliveries", () => {
  const aggregateId = "contact-record-12345678";
  const twoRows = [row("GOOGLE_SHEETS"), row("CLICKUP")];
  assert.equal(validateContactDeliveryRows(twoRows, aggregateId).size, 2);
  assert.throws(() => validateContactDeliveryRows([twoRows[0]], aggregateId), /exactly_two/);
  assert.throws(() => validateContactDeliveryRows([...twoRows, { ...twoRows[0] }], aggregateId), /exactly_two/);
  assert.throws(() => validateContactDeliveryRows(twoRows.map((item) => ({ ...item, aggregate_id: "other-contact" })), aggregateId), /not_the_synthetic_contact/);
});

test("staging environment template has blank secrets and all transmission flags disabled", async () => {
  const template = await readFile(new URL("../.env.staging.example", import.meta.url), "utf8");
  assert.match(template, /^INTEGRATIONS_ENABLED="false"$/m);
  assert.match(template, /^GOOGLE_SHEETS_ENABLED="false"$/m);
  assert.match(template, /^CLICKUP_ENABLED="false"$/m);
  assert.match(template, /^INTEGRATION_MOCK_MODE="false"$/m);
  assert.match(template, /^TAG08_STAGING_DATABASE_APPROVED="false"$/m);
  assert.match(template, /^GOOGLE_SERVICE_ACCOUNT_JSON=""$/m);
  assert.match(template, /^CLICKUP_API_TOKEN=""$/m);
  assert.match(template, /^CLICKUP_PRE_SALES_LIST_ID="901327894264"$/m);
  assert.match(template, /^CLICKUP_TALENT_LIST_ID=""$/m);
  assert.match(template, /^CLICKUP_ONBOARDING_LIST_ID=""$/m);
});

test("Contact v1 Sheets projection matches exactly the twelve E:P headers", () => {
  assert.deepEqual(CONTACT_SHEETS_V1_HEADERS, [
    "projection_version", "name", "company", "whatsapp", "email", "request_type",
    "service", "service_interests_json", "needs_service_guidance", "message", "source", "utm_json"
  ]);
  assert.equal(CONTACT_SHEETS_V1_HEADERS.length, 12);
});

test("mock failure marker is stable and retry payload remains synthetic", () => {
  assert.equal(CONTACT_STAGING_RETRY_ERROR, "integration_mock_contact_staging_transient");
  const failed = { ...row("GOOGLE_SHEETS"), status: "FAILED", attempts: 1, last_error_code: CONTACT_STAGING_RETRY_ERROR };
  assert.equal(validateContactDeliveryRows([failed, row("CLICKUP")], "contact-record-12345678").size, 2);
});
