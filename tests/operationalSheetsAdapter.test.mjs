import assert from "node:assert/strict";
import test from "node:test";
import { appendToGoogleSheets, updateGoogleSheetsDeliveryState } from "../server/integrationAdapters.mjs";
import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS,
  buildTalentSheetsV1Projection
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
    return new Response(JSON.stringify({ updatedRange: "Leads!Q2:W2" }), { status: 200 });
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

test("Talent operational schema is versioned and its delivery columns follow the typed projection", () => {
  assert.equal(TALENT_SHEETS_V1_HEADERS[0], "projection_version");
  assert.ok(TALENT_SHEETS_V1_HEADERS.includes("interest_areas_json"));
  assert.equal(TALENT_DELIVERY_HEADERS[0], "sheets_row_reference");
  assert.equal(TALENT_SHEETS_V1_HEADERS.length + TALENT_DELIVERY_HEADERS.length, 20);
});
