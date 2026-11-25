import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { appendToGoogleSheets } from "../server/integrationAdapters.mjs";
import { submitWithUnconfirmedSheetsAppendRecovery } from "../tools/run-contact-staging-outbox.mjs";
import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS,
  buildTalentSheetsV1Projection,
  buildMinimalSheetsPayloadEnvelope
} from "../server/contactSheetsProjection.mjs";

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
      return new Response(JSON.stringify({ updates: { updatedRange: `Leads!A${rows.length}:W${rows.length}`, updatedRows: 1 } }), { status: 200 });
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
  assert.equal(rows[1].length, 23);
  assert.equal(rows[1][0], delivery.id);
  assert.equal(rows[1][1], delivery.aggregate_id);
  const minimalEnvelope = JSON.parse(rows[1][3]);
  assert.equal(minimalEnvelope.envelopeVersion, 2);
  assert.equal(minimalEnvelope.payloadSha256, JSON.parse(buildMinimalSheetsPayloadEnvelope(delivery.payload.data)).payloadSha256);
  assert.doesNotMatch(rows[1][3], /Synthetic|example\.test|branding/);
  assert.equal(rows[1][16], "");
  assert.equal(rows[1][17], "NOT_ROUTED");
  assert.equal(rows[1][18], "");
  assert.equal(rows[1][19], 0);
  assert.equal(first.rowReference, "Leads!A2:W2");

  const replay = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(replay.existing, true);
  assert.equal(replay.rowNumber, 2);
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);

  await assert.rejects(appendToGoogleSheets({
    ...delivery,
    payload: { version: 1, data: { name: "Changed", requestType: "new_project", serviceInterests: ["branding"], utm: {} } }
  }, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }), /google_sheets_idempotency_conflict/);

  assert.equal(requests.some(({ init }) => init.method === "PUT"), false);
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
  const diagnostics = [];
  const originalWarn = console.warn;
  console.warn = (message) => diagnostics.push(String(message));
  try {
    await assert.rejects(
      appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }),
      (error) => error.code === "google_sheets_append_unconfirmed" && error.retryable === true && error.outcomeUnknown === true
    );
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(JSON.parse(diagnostics[0]).rejectionCode, "updated_range_absent");
  const replay = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(replay.existing, true);
  assert.equal(replay.rowNumber, 2);
  assert.equal(posts, 1);
});

test("ambiguous append shifted outside A:W is found on replay and never posted twice", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const rows = [headers];
  const delivery = {
    id: "del-displaced-replay",
    aggregate_id: "rec-displaced-replay",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { name: "Synthetic", requestType: "diagnostic" } }
  };
  let posts = 0;
  const fetchImpl = async (_url, init = {}) => {
    if (!init.method) return new Response(JSON.stringify({ range: `Leads!A1:ZZ${rows.length}`, values: rows }), { status: 200 });
    posts += 1;
    const appendedRow = JSON.parse(init.body).values[0];
    rows.push([...Array(21).fill(""), ...appendedRow]);
    return new Response(JSON.stringify({ updates: { updatedRange: "Leads!V2:AR2", updatedRows: 1, updatedColumns: 23 } }), { status: 200 });
  };
  const submit = () => appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });

  await assert.rejects(
    submitWithUnconfirmedSheetsAppendRecovery(submit, delivery.payload.data, "synthetic-key"),
    (error) => error.code === "google_sheets_delivery_identity_outside_contract_requires_reconciliation"
  );
  assert.equal(posts, 1);
  assert.equal(rows[1][21], delivery.id);
});

test("concurrent independent append callers can race before either sees the Delivery ID", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const rows = [headers];
  const delivery = {
    id: "del-concurrent-independent-callers",
    aggregate_id: "rec-concurrent-independent-callers",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { name: "Synthetic", requestType: "diagnostic" } }
  };
  let lookupCount = 0;
  let releaseLookups;
  const bothLookupsStarted = new Promise((resolve) => { releaseLookups = resolve; });
  const fetchImpl = async (_url, init = {}) => {
    if (!init.method) {
      lookupCount += 1;
      if (lookupCount === 2) releaseLookups();
      await bothLookupsStarted;
      return new Response(JSON.stringify({ range: "Leads!A1:W1", values: [headers] }), { status: 200 });
    }
    const nextRow = rows.length + 1;
    rows.push(JSON.parse(init.body).values[0]);
    return new Response(JSON.stringify({ updates: { updatedRange: `Leads!A${nextRow}:W${nextRow}`, updatedRows: 1, updatedColumns: 23 } }), { status: 200 });
  };

  const results = await Promise.all([
    appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }),
    appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl })
  ]);
  assert.equal(results.filter((result) => result.existing === false).length, 2);
  assert.equal(rows.slice(1).filter((row) => row[0] === delivery.id).length, 2);
});

test("operational append validates the complete Google Sheets response contract", async (t) => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const delivery = {
    id: "del-response-contract",
    aggregate_id: "rec-response-contract",
    aggregate_type: "contact_lead",
    created_at: "2026-10-27T12:00:00.000Z",
    operational_mode: true,
    payload: { version: 1, data: { name: "Synthetic", requestType: "diagnostic" } }
  };
  const completeResponse = {
    spreadsheetId: "synthetic-sheet",
    tableRange: "Leads!A1:W1",
    updates: {
      spreadsheetId: "synthetic-sheet",
      updatedRange: "Leads!A2:W2",
      updatedRows: 1,
      updatedColumns: 23,
      updatedCells: 23
    }
  };
  const cases = [
    { name: "accepts the complete API response", body: completeResponse, expected: "success", expectedRange: "Leads!A2:W2", expectedRow: 2 },
    { name: "accepts a quoted equivalent tab name", body: { updates: { updatedRange: "'Leads'!A2:W2", updatedRows: 1, updatedColumns: 23 } }, expected: "success", expectedRange: "'Leads'!A2:W2", expectedRow: 2 },
    { name: "accepts an append at a later row", body: { updates: { updatedRange: "Leads!A1004:W1004", updatedRows: 1, updatedColumns: 23 } }, expected: "success", expectedRange: "Leads!A1004:W1004", expectedRow: 1004 },
    { name: "classifies absent updates", body: { spreadsheetId: "synthetic-sheet" }, expected: "updates_absent" },
    { name: "classifies incompatible updates", body: { updates: null }, expected: "updates_incompatible" },
    { name: "reports updates arrays by their actual type", body: { updates: [] }, expected: "updates_incompatible", expectedUpdatesType: "array" },
    { name: "classifies absent updatedRange", body: { updates: { updatedRows: 1 } }, expected: "updated_range_absent" },
    { name: "classifies a different tab", body: { updates: { updatedRange: "Talentos!A2:X2", updatedRows: 1 } }, expected: "updated_range_sheet_mismatch" },
    { name: "classifies insufficient coordinates", body: { updates: { updatedRange: "Leads!A2:W", updatedRows: 1 } }, expected: "updated_range_coordinates_insufficient" },
    { name: "classifies incompatible columns", body: { updates: { updatedRange: "Leads!B2:W2", updatedRows: 1 } }, expected: "updated_range_columns_incompatible" },
    { name: "rejects a same-width range shifted to another table", body: { updates: { updatedRange: "Leads!V7:AR7", updatedRows: 1, updatedColumns: 23 } }, expected: "updated_range_columns_incompatible" },
    { name: "classifies a range spanning multiple rows", body: { updates: { updatedRange: "Leads!A2:W3", updatedRows: 2 } }, expected: "updated_range_rows_incompatible" },
    { name: "classifies an invalid range syntax", body: { updates: { updatedRange: "Leads!A2:W2-extra", updatedRows: 1 } }, expected: "updated_range_syntax_invalid" },
    { name: "rejects the header row", body: { updates: { updatedRange: "Leads!A1:W1", updatedRows: 1 } }, expected: "updated_range_rows_incompatible" },
    { name: "classifies an unexpected zero updated rows", body: { updates: { updatedRange: "Leads!A2:W2", updatedRows: 0 } }, expected: "updated_rows_mismatch" },
    { name: "classifies an unexpected multiple updated rows", body: { updates: { updatedRange: "Leads!A2:W2", updatedRows: 2 } }, expected: "updated_rows_mismatch" },
    { name: "classifies an invalid updatedRows value", body: { updates: { updatedRange: "Leads!A2:W2", updatedRows: "1" } }, expected: "updated_rows_invalid" },
    { name: "classifies an incompatible updated column count", body: { updates: { updatedRange: "Leads!A2:W2", updatedRows: 1, updatedColumns: 22 } }, expected: "updated_columns_mismatch" },
    { name: "classifies an invalid updated column count", body: { updates: { updatedRange: "Leads!A2:W2", updatedRows: 1, updatedColumns: "23" } }, expected: "updated_columns_invalid" },
    { name: "classifies an enveloped response as incompatible", body: { data: completeResponse }, expected: "structure_incompatible" },
    { name: "classifies a JSON array as incompatible", body: [], expected: "structure_incompatible" },
    { name: "classifies an empty body", body: "", expected: "body_empty" },
    { name: "classifies invalid JSON", body: "{invalid-json", expected: "json_invalid", raw: true }
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const requests = [];
      const diagnostics = [];
      const originalWarn = console.warn;
      console.warn = (message) => diagnostics.push(String(message));
      const fetchImpl = async (url, init = {}) => {
        requests.push({ url: String(url), init });
        if (!init.method) {
          return new Response(JSON.stringify({ range: "Leads!A1:W1", values: [headers] }), { status: 200 });
        }
        const body = scenario.raw ? scenario.body : scenario.body === "" ? "" : JSON.stringify(scenario.body);
        return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
      };

      try {
        if (scenario.expected === "success") {
          const result = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
          assert.equal(result.rowReference, scenario.expectedRange);
          assert.equal(result.rowNumber, scenario.expectedRow);
        } else {
          await assert.rejects(
            appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl }),
            (error) => error.code === "google_sheets_append_unconfirmed" && error.outcomeUnknown === true
          );
        }
      } finally {
        console.warn = originalWarn;
      }

      const appendRequest = requests.find(({ init }) => init.method === "POST");
      assert.ok(appendRequest, "expected exactly one mocked append request");
      assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);
      assert.ok(appendRequest.url.endsWith("/values/Leads!A%3AA:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS"));
      assert.deepEqual(JSON.parse(appendRequest.init.body).values.length, 1);
      assert.equal(appendRequest.init.headers["Content-Type"], "application/json");
      if (scenario.expected === "success") {
        assert.equal(diagnostics.length, 0);
      } else {
        assert.equal(diagnostics.length, 1);
        const diagnostic = JSON.parse(diagnostics[0]);
        assert.equal(diagnostic.event, "google_sheets_append_confirmation_rejected");
        assert.equal(diagnostic.status, 200);
        assert.equal(diagnostic.rejectionCode, scenario.expected);
        assert.equal(diagnostic.rangeValid, scenario.expected === "updated_rows_mismatch" || scenario.expected === "updated_rows_invalid" || scenario.expected === "updated_columns_mismatch" || scenario.expected === "updated_columns_invalid");
        if (scenario.expected === "updates_absent") assert.equal(diagnostic.updatesPresent, false);
        if (scenario.expected === "updates_incompatible") assert.equal(diagnostic.updatesType, scenario.expectedUpdatesType || "null");
        if (scenario.expected === "updated_range_absent") assert.equal(diagnostic.updatedRangePresent, false);
        if (scenario.expected === "updated_range_incompatible") {
          assert.equal(diagnostic.updatedRangePresent, true);
          assert.equal(diagnostic.updatedRangeType, "string");
        }
        assert.equal(diagnostics.join(" ").includes("synthetic-token"), false);
        assert.equal(diagnostics.join(" ").includes("Synthetic"), false);
        assert.deepEqual(Object.keys(diagnostic).sort(), [
          "bodyType", "event", "rangeValid", "rejectionCode", "status", "updatedColumns", "updatedRangePresent",
          "updatedRangeType", "updatedRows", "updatesPresent", "updatesType"
        ].sort());
      }
    });
  }
});

test("operational Talent append accepts the quoted configured tab and its exact column count", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...TALENT_SHEETS_V1_HEADERS, ...TALENT_DELIVERY_HEADERS];
  const requests = [];
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) return new Response(JSON.stringify({ range: "Talentos!A1:X1", values: [headers] }), { status: 200 });
    return new Response(JSON.stringify({ updates: { updatedRange: "'Talentos'!A1004:X1004", updatedRows: 1, updatedColumns: 24 } }), { status: 200 });
  };
  const result = await appendToGoogleSheets({
    id: "del-synthetic-talent", aggregate_id: "rec-synthetic-talent", aggregate_type: "talent_application",
    created_at: "2026-10-27T12:00:00.000Z", operational_mode: true, payload: { version: 1, data: talentPayload }
  }, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(result.rowReference, "'Talentos'!A1004:X1004");
  assert.equal(result.rowNumber, 1004);
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);
});

test("operational append logs transport failure without changing the thrown error or retrying", async () => {
  const headers = ["delivery_id", "record_id", "received_at", "payload_json", ...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS];
  const requests = [];
  const diagnostics = [];
  const originalWarn = console.warn;
  console.warn = (message) => diagnostics.push(String(message));
  const transportError = new Error("secret-token synthetic personal data");
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) return new Response(JSON.stringify({ range: "Leads!A1:W1", values: [headers] }), { status: 200 });
    throw transportError;
  };
  try {
    await assert.rejects(
      appendToGoogleSheets({
        id: "del-transport-failure", aggregate_id: "rec-transport-failure", aggregate_type: "contact_lead",
        created_at: "2026-10-27T12:00:00.000Z", operational_mode: true,
        payload: { version: 1, data: { name: "Sensitive Synthetic Person", requestType: "diagnostic" } }
      }, { spreadsheetId: "synthetic-sheet", accessToken: "secret-token", fetchImpl }),
      (error) => error === transportError
    );
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);
  assert.equal(diagnostics.length, 1);
  const diagnostic = JSON.parse(diagnostics[0]);
  assert.equal(diagnostic.rejectionCode, "transport_failure");
  assert.equal(diagnostic.status, null);
  assert.equal(diagnostic.bodyType, "unavailable");
  assert.equal(diagnostics.join(" ").includes("secret-token"), false);
  assert.equal(diagnostics.join(" ").includes("Sensitive Synthetic Person"), false);
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
