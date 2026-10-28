import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { appendToGoogleSheets, updateGoogleSheetsDeliveryState } from "../server/integrationAdapters.mjs";
import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS,
  buildTalentSheetsV1Projection,
  buildMinimalSheetsPayloadEnvelope
} from "../server/contactSheetsProjection.mjs";
import { buildTalentClickUpTask } from "../server/integrationAdapters.mjs";

const talentPayload = {
  contractVersion: 2,
  interestAreas: ["design", "technology_development"],
  name: "Candidata Sintetica",
  email: "talent@example.test",
  phone: "+5583999999999",
  linkedin: "https://www.linkedin.com/in/synthetic",
  portfolio: "https://portfolio.example.test",
  resumeUrl: "https://files.example.test/cv",
  experienceSummary: "Experiencia sintetica.",
  availability: "A combinar",
  motivation: "Teste",
  relevantProjects: "Projeto sintetico",
  relevantExperience: "",
  consent: true,
  consentVersion: "talent-v2",
  source: "test",
  locale: "pt",
  utm: { campaign: "private-campaign" }
};

test("Talent v1 projection keeps all v2 areas and excludes consent, links and attribution", () => {
  const projection = buildTalentSheetsV1Projection(talentPayload);
  assert.equal(projection[0], 1);
  assert.deepEqual(JSON.parse(projection[4]), ["design", "technology_development"]);
  assert.equal(JSON.stringify(projection).includes("linkedin"), false);
  assert.equal(JSON.stringify(projection).includes("private-campaign"), false);
  assert.equal(JSON.stringify(projection).includes("consent"), false);
  const envelope = JSON.parse(buildMinimalSheetsPayloadEnvelope(talentPayload));
  const reorderedEnvelope = JSON.parse(buildMinimalSheetsPayloadEnvelope(Object.fromEntries(Object.entries(talentPayload).reverse())));
  assert.equal(envelope.envelopeVersion, 2);
  assert.equal(envelope.payloadSha256, reorderedEnvelope.payloadSha256);
  assert.equal(envelope.payloadSha256, createHash("sha256").update(JSON.stringify(Object.fromEntries(Object.keys(talentPayload).sort().map((key) => [key, talentPayload[key]])))).digest("hex"));
  assert.notEqual(envelope.payloadSha256, JSON.parse(buildMinimalSheetsPayloadEnvelope({ ...talentPayload, motivation: "Alterada" })).payloadSha256);
});

test("Talent ClickUp projection contains operational fields without links, consent or attribution", () => {
  const task = buildTalentClickUpTask({ aggregate_id: "record-synthetic" }, talentPayload);
  assert.match(task.description, /design, technology_development/);
  assert.match(task.description, /avaliacao humana/);
  assert.doesNotMatch(task.description, /linkedin|portfolio|files\.example|private-campaign|consent/i);

  const legacyTask = buildTalentClickUpTask({ aggregate_id: "record-v1" }, { ...talentPayload, contractVersion: undefined, interestAreas: [], vacancyTitle: "Copywriter" });
  assert.match(legacyTask.description, /Vaga historica: Copywriter/);
  assert.doesNotMatch(legacyTask.description, /Areas de interesse: Copywriter/);
});

test("operational Sheets writes preserve A:D and require the approved E+ headers", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const rows = [headers];
  const requests = [];
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) return new Response(JSON.stringify({ range: `Leads!A1:W${rows.length}`, values: rows }), { status: 200 });
    if (init.method === "POST") {
      const row = JSON.parse(init.body).values[0];
      rows.push(row);
      return new Response(JSON.stringify({ updates: { updatedRange: `Leads!A${rows.length}:W${rows.length}` } }), { status: 200 });
    }
    return new Response(JSON.stringify({ updatedRange: "Leads!Q2:W2", updatedRows: 1 }), { status: 200 });
  };
  const delivery = {
    id: "del-synthetic-contact",
    aggregate_id: "rec-synthetic-contact",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { name: "Synthetic", requestType: "new_project", serviceInterests: ["branding"], utm: {} } }
  };

  const first = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(first.rowNumber, 2);
  assert.equal(first.clickupStatus, "PENDING");
  assert.equal(rows[1].length, 23);
  assert.equal(rows[1][0], delivery.id);
  assert.equal(rows[1][1], delivery.aggregate_id);
  const minimalEnvelope = JSON.parse(rows[1][3]);
  assert.equal(minimalEnvelope.envelopeVersion, 2);
  assert.equal(minimalEnvelope.payloadSha256, JSON.parse(buildMinimalSheetsPayloadEnvelope(delivery.payload.data)).payloadSha256);
  assert.doesNotMatch(rows[1][3], /Synthetic|example\.test|branding/);
  assert.equal(rows[1][16], "");
  assert.equal(rows[1][17], "PENDING");
  assert.equal(first.rowReference, "Leads!A2:W2");

  const replay = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(replay.existing, true);
  assert.equal(replay.rowNumber, 2);
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);

  await assert.rejects(appendToGoogleSheets({
    ...delivery,
    payload: { version: 1, data: { name: "Changed", requestType: "new_project", serviceInterests: ["branding"], utm: {} } }
  }, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }), /google_sheets_idempotency_conflict/);

  await updateGoogleSheetsDeliveryState(delivery, {
    rowNumber: 2,
    sheetsRowReference: first.rowReference,
    clickupStatus: "DELIVERED",
    clickupTaskId: "task-synthetic",
    clickupAttempts: 1,
    clickupLastErrorCode: "",
    updatedAt: "2026-10-27T12:01:00.000Z"
  }, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  const update = requests.find(({ init }) => init.method === "PUT");
  assert.match(update.url, /Leads!Q2%3AW2/);
  assert.deepEqual(JSON.parse(update.init.body).values[0], ["Leads!A2:W2", "DELIVERED", "task-synthetic", 1, "", "DELIVERED", "2026-10-27T12:01:00.000Z"]);
});

test("operational replay remains compatible with an existing legacy raw-JSON D cell", async () => {
  const payload = { name: "Legacy Synthetic", requestType: "new_project", serviceInterests: ["branding"], utm: {} };
  const delivery = {
    id: "del-legacy-compatible",
    aggregate_id: "rec-legacy-compatible",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: payload }
  };
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const legacyRow = [delivery.id, delivery.aggregate_id, delivery.created_at, JSON.stringify(payload), 1, "Legacy Synthetic", "", "", "legacy@example.test", "new_project", "branding", "[]", false, "", "test", "{}", "", "PENDING", "", 0, "", "DELIVERED", delivery.created_at];
  let appends = 0;
  const fetchImpl = async () => new Response(JSON.stringify({ range: "Leads!A1:W2", values: [headers, legacyRow] }), { status: 200 });
  const result = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl: async (url, init) => {
    if (init?.method === "POST") appends += 1;
    return fetchImpl(url, init);
  } });
  assert.equal(result.existing, true);
  assert.equal(result.rowNumber, 2);
  assert.equal(appends, 0);
});

test("operational replay accepts v2 digest rows created by the preceding insertion-order implementation", async () => {
  const payload = { name: "Earlier v2", requestType: "new_project", serviceInterests: ["branding"], utm: {} };
  const delivery = {
    id: "del-prior-v2-compatible",
    aggregate_id: "rec-prior-v2-compatible",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: payload }
  };
  const priorEnvelope = JSON.stringify({ envelopeVersion: 2, payloadSha256: createHash("sha256").update(JSON.stringify(payload)).digest("hex") });
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const row = [delivery.id, delivery.aggregate_id, delivery.created_at, priorEnvelope, ...Array(19).fill("")];
  const fetchImpl = async () => new Response(JSON.stringify({ range: "Leads!A1:W2", values: [headers, row] }), { status: 200 });
  const result = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(result.existing, true);
  assert.equal(result.rowNumber, 2);
});

test("operational replay blocks duplicate Delivery IDs for explicit reconciliation", async () => {
  const payload = { name: "Duplicate", requestType: "diagnostic" };
  const delivery = {
    id: "del-duplicate",
    aggregate_id: "rec-duplicate",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: payload }
  };
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const row = [delivery.id, delivery.aggregate_id, delivery.created_at, JSON.stringify(payload), ...Array(19).fill("")];
  const fetchImpl = async () => new Response(JSON.stringify({ range: "Leads!A1:W3", values: [headers, row, row] }), { status: 200 });
  await assert.rejects(appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }), /google_sheets_delivery_duplicate_requires_reconciliation/);
});

test("operational Sheets replay recovers an append whose 2xx response lost its row reference", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const rows = [headers];
  const delivery = {
    id: "del-uncertain-append",
    aggregate_id: "rec-uncertain-append",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { name: "Synthetic", requestType: "diagnostic" } }
  };
  let posts = 0;
  const fetchImpl = async (_url, init = {}) => {
    if (!init.method) return new Response(JSON.stringify({ range: `Leads!A1:W${rows.length}`, values: rows }), { status: 200 });
    posts += 1;
    rows.push(JSON.parse(init.body).values[0]);
    return new Response(JSON.stringify({ updates: {} }), { status: 200 });
  };
  await assert.rejects(
    appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }),
    (error) => error.code === "google_sheets_append_unconfirmed" && error.retryable === true && error.outcomeUnknown === true
  );
  const replay = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(replay.existing, true);
  assert.equal(replay.rowNumber, 2);
  assert.equal(posts, 1);
});

test("operational Sheets refuses an unapproved or incomplete E+ schema before appending", async () => {
  let writes = 0;
  const fetchImpl = async (_url, init = {}) => {
    if (init.method) writes += 1;
    return new Response(JSON.stringify({ range: "Leads!A1:W1", values: [["delivery_id", "record_id", "received_at", "payload_json", "wrong_header"]] }), { status: 200 });
  };
  await assert.rejects(appendToGoogleSheets({
    id: "del-schema-check",
    aggregate_id: "rec-schema-check",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { requestType: "diagnostic" } }
  }, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }), /google_sheets_operational_schema_mismatch/);
  assert.equal(writes, 0);
});

test("Sheets state update rejects 2xx responses that do not confirm the exact row and range", async () => {
  const delivery = { aggregate_type: "contact_lead" };
  const state = {
    rowNumber: 2,
    sheetsRowReference: "Leads!A2:W2",
    clickupStatus: "DELIVERED",
    clickupTaskId: "synthetic-task",
    clickupAttempts: 1,
    clickupLastErrorCode: "",
    updatedAt: "2026-10-27T12:01:00.000Z"
  };
  const badBodies = [null, { updatedRange: "Leads!Q3:W3", updatedRows: 1 }, { updatedRange: "Leads!Q2:W2", updatedRows: 0 }];
  for (const badBody of badBodies) {
    const fetchImpl = async () => new Response(badBody === null ? "invalid-json" : JSON.stringify(badBody), { status: 200 });
    await assert.rejects(updateGoogleSheetsDeliveryState(delivery, state, {
      spreadsheetId: "synthetic-sheet",
      accessToken: "synthetic-token",
      fetchImpl
    }), /google_sheets_delivery_state_update_unconfirmed/);
  }
});

test("Talent operational schema is versioned and its delivery columns follow the typed projection", () => {
  assert.equal(TALENT_SHEETS_V1_HEADERS[0], "projection_version");
  assert.ok(TALENT_SHEETS_V1_HEADERS.includes("interest_areas_json"));
  assert.equal(TALENT_DELIVERY_HEADERS[0], "sheets_row_reference");
  assert.equal(TALENT_SHEETS_V1_HEADERS.length + TALENT_DELIVERY_HEADERS.length, 20);
});
