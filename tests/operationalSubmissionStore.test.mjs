import assert from "node:assert/strict";
import test from "node:test";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";
import { IntegrationDeliveryError } from "../server/integrationDelivery.mjs";
import {
  GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID,
  GOOGLE_SHEETS_STAGING_SPREADSHEET_ID
} from "../server/sheetsDestinations.mjs";

const contact = (requestType = "new_project") => ({
  name: "Lead Sintetico", company: "Empresa Teste", whatsapp: "+5500000000000", email: "lead@example.test",
  service: "branding", stage: "estrutura", requestType, serviceInterests: ["branding"],
  needsServiceGuidance: false, message: "Dados ficticios para teste.", consent: true,
  consentVersion: "test-v1", locale: "pt", source: "test", utm: { source: "", medium: "", campaign: "", content: "", term: "" }
});

const talent = () => ({
  contractVersion: 2, interestAreas: ["design", "technology_development"], name: "Candidata Sintetica",
  email: "talent@example.test", phone: "+5500000000000", linkedin: "", resumeUrl: "", portfolio: "",
  experienceSummary: "Experiencia sintetica.", availability: "A combinar", motivation: "Teste",
  relevantProjects: "Projeto sintetico", relevantExperience: "", consent: true,
  consentVersion: "talent-v2", locale: "pt", source: "test", utm: { source: "", medium: "", campaign: "", content: "", term: "" }
});

const setup = ({ appendFailure, envOverrides = {} } = {}) => {
  const rows = new Map();
  const calls = { token: 0, appendAttempts: 0, appends: 0 };
  const store = createOperationalSubmissionStore({
    env: {
      NODE_ENV: "test", TAG08_DEPLOYMENT_ENV: "test",
      SUBMISSIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true", INTEGRATIONS_ENABLED: "true",
      CLICKUP_ENABLED: "false", GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet",
      ...envOverrides
    },
    tokenProvider: async () => { calls.token += 1; return "synthetic-access-token"; },
    appendSheet: async (delivery) => {
      calls.appendAttempts += 1;
      const current = rows.get(delivery.id);
      const serialized = JSON.stringify(delivery.payload.data);
      if (current) {
        if (current.aggregateId !== delivery.aggregate_id || current.payload !== serialized) {
          throw new IntegrationDeliveryError("google_sheets_idempotency_conflict");
        }
        return { rowNumber: current.rowNumber, rowReference: current.rowReference, existing: true };
      }
      if (appendFailure) throw appendFailure;
      calls.appends += 1;
      const rowNumber = rows.size + 2;
      const rowReference = `${delivery.aggregate_type === "contact_lead" ? "Leads" : "Talentos"}!A${rowNumber}`;
      rows.set(delivery.id, { aggregateId: delivery.aggregate_id, payload: serialized, rowNumber, rowReference });
      return { rowNumber, rowReference, existing: false };
    }
  });
  return { store, rows, calls };
};

test("Contact persists directly to Sheets regardless of commercial intent with ClickUp disabled", async () => {
  const { store, rows, calls } = setup();
  const first = await store.persistContactLead(contact(), "synthetic-contact-key");
  const nonCommercial = await store.persistContactLead(contact("diagnostic"), "synthetic-diagnostic-key");
  assert.match(first.id, /^rec_[a-f0-9]{64}$/);
  assert.equal(first.created, true);
  assert.match(first.sheetsRowReference, /^Leads!A[2-9]/);
  assert.equal(nonCommercial.created, true);
  assert.equal([...rows.values()].length, 2);
  assert.deepEqual(calls, { token: 2, appendAttempts: 2, appends: 2 });
});

test("Talent retains all selected areas and persists directly to Sheets without ClickUp configuration", async () => {
  const { store, rows, calls } = setup();
  const result = await store.persistTalentApplication(talent(), "synthetic-talent-key");
  const delivery = [...rows.keys()][0];
  assert.equal(result.created, true);
  assert.match(result.sheetsRowReference, /^Talentos!A2/);
  assert.equal(rows.get(delivery).payload.includes("technology_development"), true);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 1 });
});

test("replay returns the same identity and row, while changed content conflicts", async () => {
  const { store, calls } = setup();
  const first = await store.persistTalentApplication(talent(), "synthetic-replay-key");
  const replay = await store.persistTalentApplication(talent(), "synthetic-replay-key");
  assert.equal(replay.id, first.id);
  assert.equal(replay.created, false);
  assert.equal(replay.sheetsRowReference, first.sheetsRowReference);
  await assert.rejects(
    store.persistTalentApplication({ ...talent(), motivation: "Alterada" }, "synthetic-replay-key"),
    /idempotency_key_conflict/
  );
  assert.deepEqual(calls, { token: 3, appendAttempts: 3, appends: 1 });
});

test("same-process concurrent replay appends only one canonical row", async () => {
  const { store, calls, rows } = setup();
  const [first, replay] = await Promise.all([
    store.persistContactLead(contact(), "synthetic-concurrent-key"),
    store.persistContactLead(contact(), "synthetic-concurrent-key")
  ]);
  assert.equal(first.id, replay.id);
  assert.equal([first, replay].filter((item) => item.created).length, 1);
  assert.equal(rows.size, 1);
  assert.equal(calls.appends, 1);
});

test("Sheets failure propagates without reporting acceptance or invoking another destination", async () => {
  const failure = new IntegrationDeliveryError("google_sheets_append_failed_503", true);
  const { store, calls } = setup({ appendFailure: failure });
  await assert.rejects(store.persistContactLead(contact(), "synthetic-failure-key"), /google_sheets_append_failed_503/);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 0 });
});

test("each operational flag fails closed before requesting credentials or writing", async () => {
  for (const disabledFlag of ["SUBMISSIONS_ENABLED", "INTEGRATIONS_ENABLED", "GOOGLE_SHEETS_ENABLED"]) {
    const calls = { token: 0, appendAttempts: 0, appends: 0 };
    const store = createOperationalSubmissionStore({
      env: {
        NODE_ENV: "test", TAG08_DEPLOYMENT_ENV: "test",
        SUBMISSIONS_ENABLED: "true", INTEGRATIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true",
        [disabledFlag]: "false", GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet"
      },
      tokenProvider: async () => { calls.token += 1; return "unused"; },
      appendSheet: async () => { calls.appendAttempts += 1; calls.appends += 1; }
    });
    await assert.rejects(store.persistContactLead(contact(), `synthetic-disabled-key-${disabledFlag}`), /submission_store_disabled/);
    assert.deepEqual(calls, { token: 0, appendAttempts: 0, appends: 0 });
  }
});

test("production accepts only the approved production Sheets destination", async () => {
  const { store, calls } = setup({ envOverrides: {
    NODE_ENV: "production",
    TAG08_DEPLOYMENT_ENV: "production",
    GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID
  } });
  const result = await store.persistContactLead(contact(), "synthetic-production-key");
  assert.equal(result.created, true);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 1 });
});

test("production rejects staging and unknown Sheets destinations before token or write", async () => {
  for (const spreadsheetId of [
    GOOGLE_SHEETS_STAGING_SPREADSHEET_ID,
    "unapproved-sheet-id"
  ]) {
    const { store, calls } = setup({ envOverrides: {
      NODE_ENV: "production",
      TAG08_DEPLOYMENT_ENV: "production",
      GOOGLE_SHEETS_SPREADSHEET_ID: spreadsheetId
    } });
    await assert.rejects(store.persistContactLead(contact(), `synthetic-production-key-${spreadsheetId}`), /google_sheets_destination_not_authorized/);
    assert.deepEqual(calls, { token: 0, appendAttempts: 0, appends: 0 });
  }
});

test("staging accepts only the approved staging Sheets destination", async () => {
  const { store, calls } = setup({ envOverrides: {
    NODE_ENV: "production",
    TAG08_DEPLOYMENT_ENV: "staging",
    GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_STAGING_SPREADSHEET_ID
  } });
  const result = await store.persistTalentApplication(talent(), "synthetic-staging-key");
  assert.equal(result.created, true);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 1 });
});

test("staging rejects production and unknown destinations before token or write", async () => {
  for (const spreadsheetId of [
    GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID,
    "unapproved-sheet-id"
  ]) {
    const { store, calls } = setup({ envOverrides: {
      NODE_ENV: "production",
      TAG08_DEPLOYMENT_ENV: "staging",
      GOOGLE_SHEETS_SPREADSHEET_ID: spreadsheetId
    } });
    await assert.rejects(store.persistTalentApplication(talent(), `synthetic-staging-key-${spreadsheetId}`), /google_sheets_destination_not_authorized/);
    assert.deepEqual(calls, { token: 0, appendAttempts: 0, appends: 0 });
  }
});

test("missing or malformed destination and missing runtime environment fail before token or write", async () => {
  for (const envOverrides of [
    { NODE_ENV: "production", TAG08_DEPLOYMENT_ENV: "production", GOOGLE_SHEETS_SPREADSHEET_ID: "" },
    { NODE_ENV: "production", TAG08_DEPLOYMENT_ENV: "production", GOOGLE_SHEETS_SPREADSHEET_ID: "not-a-spreadsheet-id" },
    { NODE_ENV: "production", TAG08_DEPLOYMENT_ENV: "", GOOGLE_SHEETS_SPREADSHEET_ID: "1xpl6y5jLIESG3x5AF-yOS5Dh1G-2owPxLsPa8_hh-ms" }
  ]) {
    const { store, calls } = setup({ envOverrides });
    await assert.rejects(store.persistContactLead(contact(), "synthetic-invalid-destination-key"));
    assert.deepEqual(calls, { token: 0, appendAttempts: 0, appends: 0 });
  }
});

test("test mocks may use a synthetic destination, but development cannot", async () => {
  const synthetic = setup();
  const syntheticResult = await synthetic.store.persistContactLead(contact(), "synthetic-test-only-key");
  assert.equal(syntheticResult.created, true);

  const development = setup({ envOverrides: {
    NODE_ENV: "development",
    TAG08_DEPLOYMENT_ENV: "development",
    GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet"
  } });
  await assert.rejects(development.store.persistContactLead(contact(), "synthetic-development-key"), /google_sheets_destination_not_authorized/);
  assert.deepEqual(development.calls, { token: 0, appendAttempts: 0, appends: 0 });
});
