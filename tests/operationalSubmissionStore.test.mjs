import assert from "node:assert/strict";
import test from "node:test";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";
import { IntegrationDeliveryError } from "../server/integrationDelivery.mjs";

const contact = (requestType = "new_project") => ({
  name: "Lead Sintetico",
  company: "Empresa Teste",
  whatsapp: "+5583999999999",
  email: "lead@example.test",
  service: "branding",
  stage: "estrutura",
  requestType,
  serviceInterests: ["branding"],
  needsServiceGuidance: false,
  message: "Dados ficticios para teste.",
  consent: true,
  consentVersion: "test-v1",
  locale: "pt",
  source: "test",
  utm: { source: "", medium: "", campaign: "", content: "", term: "" }
});

const talent = () => ({
  contractVersion: 2,
  interestAreas: ["design", "technology_development"],
  name: "Candidata Sintetica",
  email: "talent@example.test",
  phone: "+5583999999999",
  linkedin: "",
  resumeUrl: "",
  portfolio: "",
  experienceSummary: "Experiencia sintetica.",
  availability: "A combinar",
  motivation: "Teste",
  relevantProjects: "Projeto sintetico",
  relevantExperience: "",
  consent: true,
  consentVersion: "talent-v2",
  locale: "pt",
  source: "test",
  utm: { source: "", medium: "", campaign: "", content: "", term: "" }
});

const setup = ({ failFirstClickUp = false, unknownFirstClickUp = false, clickUpEnabled = true } = {}) => {
  const rows = new Map();
  const calls = { appends: 0, updates: 0, tasks: 0 };
  let shouldFail = failFirstClickUp;
  let shouldBeUnknown = unknownFirstClickUp;
  let taskAvailableForReconciliation = false;
  let reconciliations = 0;
  const store = createOperationalSubmissionStore({
    env: {
      SUBMISSIONS_ENABLED: "true",
      GOOGLE_SHEETS_ENABLED: "true",
      INTEGRATIONS_ENABLED: clickUpEnabled ? "true" : "false",
      CLICKUP_ENABLED: clickUpEnabled ? "true" : "false",
      GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet",
      CLICKUP_API_TOKEN: "synthetic-token"
    },
    tokenProvider: async () => "synthetic-access-token",
    appendSheet: async (delivery) => {
      const key = delivery.id;
      const serialized = JSON.stringify(delivery.payload.data);
      const current = rows.get(key);
      if (current) {
        if (current.aggregateId !== delivery.aggregate_id || current.payload !== serialized) {
          throw new IntegrationDeliveryError("google_sheets_idempotency_conflict");
        }
        return { rowNumber: current.rowNumber, rowReference: current.rowReference, existing: true, createdAt: current.createdAt, clickupStatus: current.clickupStatus, clickupTaskId: current.clickupTaskId, clickupAttempts: current.clickupAttempts };
      }
      calls.appends += 1;
      const rowNumber = rows.size + 2;
      const rowReference = `${delivery.aggregate_type === "contact_lead" ? "Leads" : "Talentos"}!A${rowNumber}`;
      rows.set(key, { aggregateId: delivery.aggregate_id, payload: serialized, rowNumber, rowReference, createdAt: delivery.created_at, clickupStatus: "PENDING", clickupTaskId: "", clickupAttempts: 0 });
      return { rowNumber, rowReference, existing: false, createdAt: delivery.created_at, clickupStatus: "PENDING", clickupTaskId: "", clickupAttempts: 0 };
    },
    updateSheetState: async (delivery, state) => {
      calls.updates += 1;
      Object.assign(rows.get(delivery.id), {
        clickupStatus: state.clickupStatus,
        clickupTaskId: state.clickupTaskId,
        clickupAttempts: state.clickupAttempts,
        clickupLastErrorCode: state.clickupLastErrorCode
      });
    },
    findTask: async () => {
      reconciliations += 1;
      return taskAvailableForReconciliation ? "synthetic-clickup-task" : null;
    },
    createTask: async () => {
      calls.tasks += 1;
      if (shouldBeUnknown) {
        shouldBeUnknown = false;
        throw new IntegrationDeliveryError("clickup_task_create_outcome_unknown", true, true);
      }
      if (shouldFail) {
        shouldFail = false;
        throw new IntegrationDeliveryError("clickup_task_create_failed_503", true);
      }
      return "synthetic-task-id";
    }
  });
  return { store, rows, calls, get reconciliations() { return reconciliations; }, setTaskAvailableForReconciliation: (value) => { taskAvailableForReconciliation = value; } };
};

test("Contact stores a stable Sheets record and routes only new projects to ClickUp", async () => {
  const { store, rows, calls } = setup();
  const result = await store.persistContactLead(contact(), "synthetic-contact-key");
  const row = [...rows.values()][0];
  assert.match(result.id, /^rec_[a-f0-9]{64}$/);
  assert.equal(result.created, true);
  assert.equal(result.clickUpStatus, "DELIVERED");
  assert.match(result.sheetsRowReference, /^Leads!A2/);
  assert.equal(row.clickupTaskId, "synthetic-task-id");
  assert.deepEqual(calls, { appends: 1, updates: 1, tasks: 1 });

  const diagnostic = await store.persistContactLead(contact("diagnostic"), "synthetic-diagnostic-key");
  assert.equal(diagnostic.clickUpStatus, "NOT_ROUTED");
  assert.deepEqual(calls, { appends: 2, updates: 2, tasks: 1 });
});

test("replay is idempotent, changed content conflicts, and a ClickUp failure recovers on replay", async () => {
  const { store, rows, calls } = setup({ failFirstClickUp: true });
  const first = await store.persistTalentApplication(talent(), "synthetic-talent-key");
  assert.equal(first.clickUpStatus, "FAILED");
  const [record] = [...rows.values()];
  assert.equal(record.clickupAttempts, 1);
  assert.equal(record.clickupTaskId, "");

  const replay = await store.persistTalentApplication(talent(), "synthetic-talent-key");
  assert.equal(replay.id, first.id);
  assert.equal(replay.created, false);
  assert.equal(replay.clickUpStatus, "DELIVERED");
  assert.equal(record.clickupAttempts, 2);
  assert.equal(record.clickupTaskId, "synthetic-task-id");
  assert.deepEqual(calls, { appends: 1, updates: 2, tasks: 2 });

  await assert.rejects(
    store.persistTalentApplication({ ...talent(), motivation: "Alterada" }, "synthetic-talent-key"),
    /idempotency_key_conflict/
  );
  assert.deepEqual(calls, { appends: 1, updates: 2, tasks: 2 });
});

test("uncertain ClickUp creation is reconciled by stable name and never blindly recreated", async () => {
  const setupResult = setup({ unknownFirstClickUp: true });
  const first = await setupResult.store.persistContactLead(contact(), "synthetic-unknown-clickup-key");
  assert.equal(first.clickUpStatus, "UNKNOWN");
  assert.equal(setupResult.calls.tasks, 1);
  const unresolved = await setupResult.store.persistContactLead(contact(), "synthetic-unknown-clickup-key");
  assert.equal(unresolved.clickUpStatus, "UNKNOWN");
  assert.equal(setupResult.calls.tasks, 1);
  assert.equal(setupResult.reconciliations, 1);

  setupResult.setTaskAvailableForReconciliation(true);
  const reconciled = await setupResult.store.persistContactLead(contact(), "synthetic-unknown-clickup-key");
  assert.equal(reconciled.clickUpStatus, "DELIVERED");
  assert.equal(reconciled.clickUpTaskId, "synthetic-clickup-task");
  assert.equal(setupResult.calls.tasks, 1);
  assert.equal(setupResult.reconciliations, 2);
});

test("ClickUp replay stops at the configured attempt ceiling", async () => {
  let createCalls = 0;
  let savedState;
  const store = createOperationalSubmissionStore({
    env: { SUBMISSIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true", INTEGRATIONS_ENABLED: "true", CLICKUP_ENABLED: "true", GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet" },
    tokenProvider: async () => "synthetic-access-token",
    appendSheet: async (delivery) => ({
      rowNumber: 2,
      rowReference: "Leads!A2:W2",
      existing: true,
      createdAt: delivery.created_at,
      clickupStatus: "FAILED",
      clickupTaskId: "",
      clickupAttempts: 8,
      clickupLastErrorCode: "clickup_task_create_failed_400"
    }),
    updateSheetState: async (_delivery, state) => { savedState = state; },
    createTask: async () => { createCalls += 1; return "unexpected-task"; }
  });
  const result = await store.persistContactLead(contact(), "synthetic-attempt-limit-key");
  assert.equal(result.clickUpStatus, "FAILED");
  assert.equal(result.clickUpLastErrorCode, "clickup_attempt_limit_reached");
  assert.equal(savedState.clickupAttempts, 8);
  assert.equal(createCalls, 0);
});

test("disabled submissions fail closed without invoking external adapters", async () => {
  const calls = { token: 0, append: 0, task: 0 };
  const store = createOperationalSubmissionStore({
    env: { SUBMISSIONS_ENABLED: "false", GOOGLE_SHEETS_ENABLED: "false" },
    tokenProvider: async () => { calls.token += 1; return "unused"; },
    appendSheet: async () => { calls.append += 1; },
    createTask: async () => { calls.task += 1; }
  });
  await assert.rejects(store.persistContactLead(contact(), "synthetic-disabled-key"), /submission_store_disabled/);
  assert.deepEqual(calls, { token: 0, append: 0, task: 0 });
});

test("ClickUp stays pending and is never called while external delivery flags are disabled", async () => {
  const { store, rows, calls } = setup({ clickUpEnabled: false });
  const result = await store.persistContactLead(contact(), "synthetic-clickup-disabled-key");
  const row = [...rows.values()][0];
  assert.equal(result.clickUpStatus, "PENDING");
  assert.equal(row.clickupAttempts, 0);
  assert.equal(row.clickupTaskId, "");
  assert.deepEqual(calls, { appends: 1, updates: 1, tasks: 0 });
});

test("same-process concurrent replays create one canonical row and one ClickUp task", async () => {
  const { store, calls } = setup();
  const [first, replay] = await Promise.all([
    store.persistContactLead(contact(), "synthetic-concurrent-key"),
    store.persistContactLead(contact(), "synthetic-concurrent-key")
  ]);
  assert.equal(first.id, replay.id);
  assert.equal([first, replay].filter((result) => result.created).length, 1);
  assert.deepEqual(calls, { appends: 1, updates: 1, tasks: 1 });
});
