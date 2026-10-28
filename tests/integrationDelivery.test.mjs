import assert from "node:assert/strict";
import test from "node:test";
import {
  getDeliveryFailure,
  findSheetRowReference,
  integrationHttpError,
  MAX_AUTOMATIC_DELIVERY_ATTEMPTS,
  resolveClickUpListId,
  unwrapDeliveryPayload
} from "../server/integrationDelivery.mjs";
import { appendToGoogleSheets, createClickUpTask } from "../server/integrationAdapters.mjs";

test("ClickUp routing is restricted to the still-disabled Onboarding integration", () => {
  assert.equal(resolveClickUpListId("onboarding_submission", { CLICKUP_ONBOARDING_LIST_ID: "901327894265" }), "901327894265");
  assert.throws(() => resolveClickUpListId("contact_lead", { CLICKUP_PRE_SALES_LIST_ID: "900700475931" }), /clickup_aggregate_not_supported/);
  assert.throws(() => resolveClickUpListId("talent_application", { CLICKUP_TALENT_LIST_ID: "900700474161" }), /clickup_aggregate_not_supported/);
  assert.throws(() => resolveClickUpListId("unsupported", {}), /clickup_aggregate_not_supported/);
});

test("versioned outbox payload remains backward compatible with pre-existing raw payloads", () => {
  const payload = { name: "Synthetic", source: "contact-page" };
  assert.deepEqual(unwrapDeliveryPayload({ version: 1, data: payload }), payload);
  assert.deepEqual(unwrapDeliveryPayload(payload), payload);
  assert.throws(() => unwrapDeliveryPayload({ version: 2, data: payload }), /integration_payload_version_unsupported/);
});

test("Sheets delivery reference identifies the existing or newly appended row", () => {
  assert.equal(findSheetRowReference("Leads!A1:A3", [["x"], ["delivery-1"], ["z"]], "delivery-1"), "Leads!A2:D2");
  assert.equal(findSheetRowReference("Leads!A5:A7", [["x"], ["delivery-1"]], "delivery-1"), "Leads!A6:D6");
  assert.equal(findSheetRowReference("Leads!A1:A2", [["x"], ["y"]], "delivery-1"), null);
});

test("transient errors back off, permanent errors stop, and automatic attempts are bounded", () => {
  assert.equal(getDeliveryFailure(integrationHttpError("sheets_append_failed", 503), 1).retry, true);
  assert.equal(getDeliveryFailure(integrationHttpError("sheets_append_failed", 401), 1).retry, false);
  assert.equal(getDeliveryFailure(new Error("socket timeout"), 1).retry, true);
  assert.equal(getDeliveryFailure(new Error("socket timeout"), MAX_AUTOMATIC_DELIVERY_ATTEMPTS).retry, false);
});

test("failure codes never expose arbitrary error text or personal data", () => {
  const failure = getDeliveryFailure(new Error("request from Maria Silva maria@example.test failed"), 1);
  assert.equal(failure.code, "integration_delivery_failed");
  assert.equal(failure.code.includes("maria@example.test"), false);
});

test("Sheets API appends the A:P legacy-compatible Contact row and deduplicates by Delivery ID", async () => {
  const requests = [];
  const rows = [];
  const delivery = {
    id: "delivery-synthetic-contact", aggregate_id: "record-synthetic-contact", aggregate_type: "contact_lead",
    created_at: "2026-10-26T12:00:00.000Z", payload: { version: 1, data: { name: "Synthetic", requestType: "new_project", serviceInterests: [], utm: {} } }
  };
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) return new Response(JSON.stringify({ range: rows.length ? `Leads!A2:A${rows.length + 1}` : "Leads!A1:A1", values: rows.map((row) => [row[0]]) }), { status: 200 });
    rows.push(JSON.parse(init.body).values[0]);
    return new Response(JSON.stringify({ updates: { updatedRange: `Leads!A${rows.length + 1}:P${rows.length + 1}` } }), { status: 200 });
  };
  const firstReference = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  const replay = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-sheet", accessToken: "synthetic-token", fetchImpl });
  assert.equal(firstReference, "Leads!A2:P2");
  assert.equal(replay, "Leads!A2:D2");
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);
  assert.equal(rows[0].length, 16);
});

test("legacy ClickUp outbox Contact and Talent deliveries are rejected before any HTTP request", async () => {
  let calls = 0;
  for (const aggregate_type of ["contact_lead", "talent_application"]) {
    await assert.rejects(createClickUpTask({
      id: "synthetic-delivery", aggregate_id: "synthetic-record", aggregate_type,
      payload: { version: 1, data: { name: "Synthetic", requestType: "new_project" } }
    }, { env: { CLICKUP_API_TOKEN: "unused", CLICKUP_PRE_SALES_LIST_ID: "900700475931", CLICKUP_TALENT_LIST_ID: "900700474161" }, fetchImpl: async () => { calls += 1; } }), /clickup_aggregate_not_supported/);
  }
  assert.equal(calls, 0);
});
