import assert from "node:assert/strict";
import test from "node:test";
import { createContactPostHandler } from "../server/contactPostHandler";
import { createTalentApplicationPostHandler } from "../server/talentApplicationPostHandler";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";

const createMockedStore = () => {
  const records = new Map<string, { payload: unknown; rowNumber: number; rowReference: string; clickupStatus: string; clickupTaskId: string; clickupAttempts: number }>();
  let rowNumber = 1;
  const store = createOperationalSubmissionStore({
    env: {
      NODE_ENV: "test",
      SUBMISSIONS_ENABLED: "true",
      GOOGLE_SHEETS_ENABLED: "true",
      INTEGRATIONS_ENABLED: "true",
      CLICKUP_ENABLED: "true",
      GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet",
      CLICKUP_API_TOKEN: "synthetic-token"
    },
    tokenProvider: async () => "synthetic-access-token",
    appendSheet: async (delivery) => {
      const existing = records.get(delivery.id);
      const payload = JSON.stringify(delivery.payload.data);
      if (existing) {
        if (JSON.stringify(existing.payload) !== payload) throw Object.assign(new Error("conflict"), { code: "google_sheets_idempotency_conflict" });
        return { ...existing, existing: true, createdAt: delivery.created_at };
      }
      const number = ++rowNumber;
      const record = { payload: delivery.payload.data, rowNumber: number, rowReference: `Leads!A${number}:W${number}`, clickupStatus: "PENDING", clickupTaskId: "", clickupAttempts: 0 };
      records.set(delivery.id, record);
      return { ...record, existing: false, createdAt: delivery.created_at };
    },
    updateSheetState: async (delivery, state) => {
      Object.assign(records.get(delivery.id)!, {
        clickupStatus: state.clickupStatus,
        clickupTaskId: state.clickupTaskId,
        clickupAttempts: state.clickupAttempts
      });
      return true;
    },
    createTask: async () => "synthetic-clickup-task"
  });
  return store;
};

const postRequest = (path: string, payload: unknown, idempotencyKey: string) => new Request(`https://tag08.example.test${path}`, {
  method: "POST",
  headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
  body: JSON.stringify(payload)
});

test("Contact API accepts a Sheets-canonical submission and reports ClickUp delivery separately", async () => {
  const store = createMockedStore();
  const handler = createContactPostHandler(store.persistContactLead);
  const response = await handler(postRequest("/api/contact", {
    name: "Lead Sintetico",
    company: "Empresa Teste",
    whatsapp: "+5583999999999",
    email: "lead@example.test",
    service: "branding",
    stage: "estrutura",
    requestType: "new_project",
    serviceInterests: ["branding"],
    needsServiceGuidance: false,
    message: "Teste sintetico",
    consent: true,
    consentVersion: "v1",
    locale: "pt",
    source: "test"
  }, "synthetic-contact-key"));
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.status, "accepted");
  assert.equal(body.deliveryStatus.sheets, "delivered");
  assert.match(body.deliveryStatus.sheetsRowReference, /^Leads!A/);
  assert.equal(body.deliveryStatus.clickUp, "DELIVERED");
});

test("Talent API preserves multiple areas through Sheets and reports human-routing delivery", async () => {
  const store = createMockedStore();
  const handler = createTalentApplicationPostHandler(store.persistTalentApplication);
  const response = await handler(postRequest("/api/talent-applications", {
    contractVersion: 2,
    interestAreas: ["design", "technology_development"],
    name: "Candidata Sintetica",
    email: "talent@example.test",
    phone: "+5583999999999",
    linkedin: "",
    resumeUrl: "",
    portfolio: "",
    experienceSummary: "Experiencia sintetica",
    availability: "A combinar",
    motivation: "Teste",
    relevantProjects: "Projeto sintetico",
    relevantExperience: "",
    consent: true,
    consentVersion: "v2",
    locale: "pt",
    source: "test"
  }, "synthetic-talent-key"));
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.status, "accepted");
  assert.equal(body.deliveryStatus.sheets, "delivered");
  assert.equal(body.deliveryStatus.clickUp, "DELIVERED");
});
