import assert from "node:assert/strict";
import test from "node:test";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";
import { IntegrationDeliveryError } from "../server/integrationDelivery.mjs";

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

const setup = ({ appendFailure } = {}) => {
  const rows = new Map();
  const calls = { token: 0, appendAttempts: 0, appends: 0, clickUp: 0 };
  const store = createOperationalSubmissionStore({
    env: {
      SUBMISSIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true", INTEGRATIONS_ENABLED: "true",
      CLICKUP_ENABLED: "true", GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet"
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

test("Contact persists directly to Sheets regardless of commercial intent and ClickUp flags", async () => {
  const { store, rows, calls } = setup();
  const first = await store.persistContactLead(contact(), "synthetic-contact-key");
  const nonCommercial = await store.persistContactLead(contact("diagnostic"), "synthetic-diagnostic-key");
  assert.match(first.id, /^rec_[a-f0-9]{64}$/);
  assert.equal(first.created, true);
  assert.match(first.sheetsRowReference, /^Leads!A[2-9]/);
  assert.equal(nonCommercial.created, true);
  assert.equal([...rows.values()].length, 2);
  assert.deepEqual(calls, { token: 2, appendAttempts: 2, appends: 2, clickUp: 0 });
});

test("Talent retains all selected areas and persists directly to Sheets without ClickUp configuration", async () => {
  const { store, rows, calls } = setup();
  const result = await store.persistTalentApplication(talent(), "synthetic-talent-key");
  const delivery = [...rows.keys()][0];
  assert.equal(result.created, true);
  assert.match(result.sheetsRowReference, /^Talentos!A2/);
  assert.equal(rows.get(delivery).payload.includes("technology_development"), true);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 1, clickUp: 0 });
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
  assert.deepEqual(calls, { token: 3, appendAttempts: 3, appends: 1, clickUp: 0 });
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
  assert.equal(calls.clickUp, 0);
});

test("Sheets failure propagates without reporting acceptance or invoking another destination", async () => {
  const failure = new IntegrationDeliveryError("google_sheets_append_failed_503", true);
  const { store, calls } = setup({ appendFailure: failure });
  await assert.rejects(store.persistContactLead(contact(), "synthetic-failure-key"), /google_sheets_append_failed_503/);
  assert.deepEqual(calls, { token: 1, appendAttempts: 1, appends: 0, clickUp: 0 });
});

test("disabled submissions fail closed before requesting credentials or writing", async () => {
  const calls = { token: 0, appendAttempts: 0, appends: 0, clickUp: 0 };
  const store = createOperationalSubmissionStore({
    env: { SUBMISSIONS_ENABLED: "false", GOOGLE_SHEETS_ENABLED: "false" },
    tokenProvider: async () => { calls.token += 1; return "unused"; },
    appendSheet: async () => { calls.appendAttempts += 1; calls.appends += 1; }
  });
  await assert.rejects(store.persistContactLead(contact(), "synthetic-disabled-key"), /submission_store_disabled/);
  assert.deepEqual(calls, { token: 0, appendAttempts: 0, appends: 0, clickUp: 0 });
});
