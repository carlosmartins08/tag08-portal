import assert from "node:assert/strict";
import test from "node:test";
import { createContactPostHandler } from "../server/contactPostHandler";
import { createTalentApplicationPostHandler } from "../server/talentApplicationPostHandler";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";

const createMockedStore = () => {
  const records = new Map<string, { payload: unknown; rowNumber: number; rowReference: string }>();
  let appends = 0;
  const store = createOperationalSubmissionStore({
    env: {
      NODE_ENV: "test", SUBMISSIONS_ENABLED: "true", INTEGRATIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true",
      GOOGLE_SHEETS_SPREADSHEET_ID: "synthetic-sheet"
      // No ClickUp token or list IDs are present.
    },
    tokenProvider: async () => "synthetic-access-token",
    appendSheet: async (delivery) => {
      const existing = records.get(delivery.id);
      const payload = JSON.stringify(delivery.payload.data);
      if (existing) {
        if (JSON.stringify(existing.payload) !== payload) throw Object.assign(new Error("conflict"), { code: "google_sheets_idempotency_conflict" });
        return { ...existing, existing: true };
      }
      const number = ++appends + 1;
      const record = { payload: delivery.payload.data, rowNumber: number, rowReference: `${delivery.aggregate_type === "contact_lead" ? "Leads" : "Talentos"}!A${number}` };
      records.set(delivery.id, record);
      return { ...record, existing: false };
    }
  });
  return { store, records };
};

const postRequest = (path: string, payload: unknown, idempotencyKey?: string) => {
  const headers = new Headers({ "content-type": "application/json" });
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
  return new Request(`https://tag08.example.test${path}`, { method: "POST", headers, body: JSON.stringify(payload) });
};

test("Contact API accepts Sheets-only delivery without ClickUp configuration or status", async () => {
  const { store } = createMockedStore();
  const handler = createContactPostHandler(store.persistContactLead);
  const request = postRequest("/api/contact", {
    name: "Lead Sintetico", company: "Empresa Teste", whatsapp: "+5500000000000", email: "lead@example.test",
    service: "branding", stage: "estrutura", requestType: "new_project", serviceInterests: ["branding"],
    needsServiceGuidance: false, message: "Teste sintetico", consent: true, consentVersion: "v1", locale: "pt", source: "test"
  }, "synthetic-contact-key");
  const first = await handler(request);
  const body = await first.json();
  assert.equal(first.status, 202);
  assert.equal(body.status, "accepted");
  assert.equal(body.replayed, false);
  assert.equal(body.deliveryStatus.sheets, "delivered");
  assert.match(body.deliveryStatus.sheetsRowReference, /^Leads!A/);
  assert.equal("clickUp" in body.deliveryStatus, false);
  const replay = await handler(postRequest("/api/contact", {
    name: "Lead Sintetico", company: "Empresa Teste", whatsapp: "+5500000000000", email: "lead@example.test",
    service: "branding", stage: "estrutura", requestType: "new_project", serviceInterests: ["branding"],
    needsServiceGuidance: false, message: "Teste sintetico", consent: true, consentVersion: "v1", locale: "pt", source: "test"
  }, "synthetic-contact-key"));
  assert.equal((await replay.json()).replayed, true);
});

test("Talent API preserves multiple areas with Sheets as its only destination", async () => {
  const { store } = createMockedStore();
  const handler = createTalentApplicationPostHandler(store.persistTalentApplication);
  const response = await handler(postRequest("/api/talent-applications", {
    contractVersion: 2, interestAreas: ["design", "technology_development"], name: "Candidata Sintetica",
    email: "talent@example.test", phone: "+5500000000000", linkedin: "", resumeUrl: "", portfolio: "",
    experienceSummary: "Experiencia sintetica", availability: "A combinar", motivation: "Teste",
    relevantProjects: "Projeto sintetico", relevantExperience: "", consent: true, consentVersion: "v2",
    locale: "pt", source: "test"
  }, "synthetic-talent-key"));
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.status, "accepted");
  assert.equal(body.deliveryStatus.sheets, "delivered");
  assert.match(body.deliveryStatus.sheetsRowReference, /^Talentos!A/);
  assert.equal("clickUp" in body, false);
});

test("Talent API rejects a missing idempotency key without writing", async () => {
  let persistenceCalls = 0;
  const handler = createTalentApplicationPostHandler(async () => { persistenceCalls += 1; return { id: "unused", created: true, sheetsRowReference: "Talentos!A2:X2" }; });
  const response = await handler(postRequest("/api/talent-applications", {
    contractVersion: 2, interestAreas: ["design"], name: "Candidata Sintetica", email: "talent@example.test", phone: "+5500000000000",
    linkedin: "", resumeUrl: "", portfolio: "", experienceSummary: "Experiencia sintetica", availability: "A combinar",
    motivation: "Teste", relevantProjects: "", relevantExperience: "", consent: true, consentVersion: "v2", locale: "pt", source: "test"
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "idempotency_key_required");
  assert.equal(persistenceCalls, 0);
});

test("Contact and Talent handlers do not convert a Sheets failure into accepted", async () => {
  const unavailable = async () => { throw Object.assign(new Error("sheets unavailable"), { code: "google_sheets_append_failed_503" }); };
  const contactResponse = await createContactPostHandler(unavailable)(postRequest("/api/contact", {
    name: "Lead", company: "Empresa", whatsapp: "+5500000000000", email: "lead@example.test", service: "branding",
    stage: "estrutura", requestType: "new_project", serviceInterests: ["branding"], needsServiceGuidance: false,
    message: "Teste", consent: true, consentVersion: "v1", locale: "pt", source: "test"
  }, "synthetic-contact-error"));
  assert.equal(contactResponse.status, 503);
  assert.equal((await contactResponse.json()).error, "persistence_unavailable");
});
