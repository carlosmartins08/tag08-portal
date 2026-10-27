import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactClickUpTask,
  CONTACT_STAGING_CLICKUP_INITIAL_STATUS,
  CONTACT_STAGING_CLICKUP_LIST_ID,
  findSheetRowReference,
  getDeliveryFailure,
  integrationHttpError,
  MAX_AUTOMATIC_DELIVERY_ATTEMPTS,
  resolveClickUpListId,
  unwrapDeliveryPayload
} from "../server/integrationDelivery.mjs";
import { appendToGoogleSheets, createClickUpTask } from "../server/integrationAdapters.mjs";

test("contact routes to approved Pre-venda list without changing other aggregate lists", () => {
  const env = {
    CLICKUP_PRE_SALES_LIST_ID: "900700475931",
    CLICKUP_TALENT_LIST_ID: "901327894264",
    CLICKUP_ONBOARDING_LIST_ID: "901327894265"
  };
  assert.equal(resolveClickUpListId("contact_lead", env), "900700475931");
  assert.equal(resolveClickUpListId("talent_application", env), "901327894264");
  assert.equal(resolveClickUpListId("onboarding_submission", env), "901327894265");
  assert.throws(() => resolveClickUpListId("contact_lead", {}), /clickup_list_not_configured/);
  assert.throws(() => resolveClickUpListId("unsupported", env), /clickup_aggregate_not_supported/);
  assert.equal(getDeliveryFailure(new Error("clickup_list_not_configured"), 1).retry, false);
});

test("contact task is human-readable and correlates by record and delivery IDs, not identity", () => {
  const task = buildContactClickUpTask(
    { id: "delivery-123", aggregate_id: "record-456", created_at: "2026-10-19T12:00:00.000Z" },
    {
      name: "Lead Sintético", company: "Empresa de Teste", whatsapp: "+5583999999999", email: "synthetic@example.test",
      requestType: "new_project", serviceInterests: ["technology", "branding"], needsServiceGuidance: true,
      message: "Avaliar uma solução digital.", source: "contact-page:offer",
      utm: { source: "campanha", medium: "referral", campaign: "outubro", content: "card", term: "" }
    }
  );
  assert.equal(task.name, "TAG08 Contact record-456");
  assert.match(task.description, /Nome: Lead Sintético/);
  assert.match(task.description, /Frentes: technology, branding/);
  assert.match(task.description, /Origem: contact-page:offer/);
  assert.match(task.description, /Record ID: record-456/);
  assert.match(task.description, /Delivery ID: delivery-123/);
  assert.deepEqual(task.tags, ["tag08", "contact_lead"]);
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
  assert.equal(getDeliveryFailure(integrationHttpError("clickup_task_create_failed", 429), 1).retry, true);
  assert.equal(getDeliveryFailure(integrationHttpError("sheets_append_failed", 503), 1).retry, true);
  assert.equal(getDeliveryFailure(integrationHttpError("clickup_task_create_failed", 401), 1).retry, false);
  assert.equal(getDeliveryFailure(new Error("clickup_not_configured"), 1).retry, false);
  assert.equal(getDeliveryFailure(new Error("socket timeout"), 1).retry, true);
  assert.equal(getDeliveryFailure(new Error("socket timeout"), MAX_AUTOMATIC_DELIVERY_ATTEMPTS).retry, false);
});

test("failure codes never expose arbitrary error text or personal data", () => {
  const failure = getDeliveryFailure(new Error("request from Maria Silva maria@example.test failed"), 1);
  assert.equal(failure.code, "integration_delivery_failed");
  assert.equal(failure.code.includes("maria@example.test"), false);
});

test("Contact Sheets adapter appends the structured A:P row and deduplicates by column A", async () => {
  const requests = [];
  const rows = [];
  const delivery = {
    id: "delivery-synthetic-contact",
    aggregate_id: "record-synthetic-contact",
    aggregate_type: "contact_lead",
    created_at: "2026-10-26T12:00:00.000Z",
    payload: { version: 1, data: { name: "Synthetic", requestType: "new_project", serviceInterests: [], utm: {} } }
  };
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) {
      return new Response(JSON.stringify({
        range: rows.length ? `Leads!A2:A${rows.length + 1}` : "Leads!A1:A1",
        values: rows.map((row) => [row[0]])
      }), { status: 200 });
    }
    const body = JSON.parse(init.body);
    rows.push(body.values[0]);
    return new Response(JSON.stringify({ updates: { updatedRange: `Leads!A${rows.length + 1}:P${rows.length + 1}` } }), { status: 200 });
  };

  const firstReference = await appendToGoogleSheets(delivery, {
    spreadsheetId: "synthetic-spreadsheet-id",
    accessToken: "synthetic-token",
    fetchImpl
  });
  const duplicateReference = await appendToGoogleSheets(delivery, {
    spreadsheetId: "synthetic-spreadsheet-id",
    accessToken: "synthetic-token",
    fetchImpl
  });

  assert.equal(firstReference, "Leads!A2:P2");
  assert.equal(duplicateReference, "Leads!A2:D2");
  assert.equal(requests.filter(({ init }) => init.method === "POST").length, 1);
  assert.match(requests.find(({ init }) => init.method === "POST").url, /Leads!A%3AP/);
  assert.equal(rows[0].length, 16);
  assert.equal(rows[0][0], delivery.id);
  assert.equal(rows[0][4], 1);
});

test("non-Contact Sheets deliveries keep the existing A:D envelope", async () => {
  let appended;
  const delivery = {
    id: "delivery-synthetic-talent",
    aggregate_id: "record-synthetic-talent",
    aggregate_type: "talent_application",
    created_at: "2026-10-26T12:00:00.000Z",
    payload: { version: 1, data: { name: "Synthetic applicant" } }
  };
  const fetchImpl = async (url, init = {}) => {
    if (!init.method) return new Response(JSON.stringify({ range: "Talentos!A1:A1", values: [] }), { status: 200 });
    appended = { url: String(url), body: JSON.parse(init.body) };
    return new Response(JSON.stringify({ updates: { updatedRange: "Talentos!A2:D2" } }), { status: 200 });
  };

  await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-id", accessToken: "synthetic-token", fetchImpl });
  assert.match(appended.url, /Talentos!A%3AD/);
  assert.deepEqual(appended.body.values[0], [delivery.id, delivery.aggregate_id, delivery.created_at, JSON.stringify({ name: "Synthetic applicant" })]);
});

test("Sheets retry after an uncertain append checks Delivery ID before sending again", async () => {
  const delivery = {
    id: "delivery-synthetic-retry",
    aggregate_id: "record-synthetic-retry",
    aggregate_type: "contact_lead",
    created_at: "2026-10-26T12:00:00.000Z",
    payload: { version: 1, data: { name: "Synthetic", requestType: "new_project" } }
  };
  const rows = [];
  let posts = 0;
  const fetchImpl = async (_url, init = {}) => {
    if (!init.method) {
      return new Response(JSON.stringify({ range: "Leads!A2:A2", values: rows.map((row) => [row[0]]) }), { status: 200 });
    }
    posts += 1;
    rows.push(JSON.parse(init.body).values[0]);
    return new Response("temporary append response failure", { status: 503 });
  };

  let failure;
  try {
    await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-id", accessToken: "synthetic-token", fetchImpl });
  } catch (error) {
    failure = error;
  }
  assert.equal(failure?.code, "google_sheets_append_failed_503");
  assert.equal(getDeliveryFailure(failure, 1).retry, true);

  const retryReference = await appendToGoogleSheets(delivery, { spreadsheetId: "synthetic-id", accessToken: "synthetic-token", fetchImpl });
  assert.equal(retryReference, "Leads!A2:D2");
  assert.equal(posts, 1);
  assert.equal(rows.length, 1);
});

test("ClickUp adapter keeps Contact in Pre-sales, sends intent without status, and blocks other Contact journeys", async () => {
  const requests = [];
  const env = { CLICKUP_PRE_SALES_LIST_ID: "900700475931", CLICKUP_API_TOKEN: "synthetic-token" };
  const delivery = {
    id: "delivery-synthetic-clickup",
    aggregate_id: "record-synthetic-clickup",
    aggregate_type: "contact_lead",
    created_at: "2026-10-26T12:00:00.000Z",
    payload: { version: 1, data: { name: "Synthetic", requestType: "new_project", service: "multiple" } }
  };
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), init });
    if (!init.method) return new Response(JSON.stringify({ tasks: [] }), { status: 200 });
    return new Response(JSON.stringify({ id: "synthetic-clickup-task" }), { status: 200 });
  };

  const taskId = await createClickUpTask(delivery, { env, fetchImpl });
  const createRequest = requests.find(({ init }) => init.method === "POST");
  const taskBody = JSON.parse(createRequest.init.body);
  assert.equal(taskId, "synthetic-clickup-task");
  assert.match(createRequest.url, /list\/900700475931\/task/);
  assert.match(taskBody.description, /new_project/);
  assert.equal(Object.hasOwn(taskBody, "status"), false);

  let blockedCalls = 0;
  let routingError;
  try {
    await createClickUpTask({ ...delivery, payload: { version: 1, data: { requestType: "partnership" } } }, {
      env,
      fetchImpl: async () => { blockedCalls += 1; throw new Error("must_not_call_external"); }
    });
  } catch (error) {
    routingError = error;
  }
  assert.equal(routingError?.code, "clickup_contact_not_pre_sales");
  assert.equal(getDeliveryFailure(routingError, 1).retry, false);
  assert.equal(blockedCalls, 0);
});

test("Contact staging ClickUp task is explicitly created in the existing open status only for the staging list", async () => {
  let createBody;
  const delivery = {
    id: "delivery-synthetic-contact-stage",
    aggregate_id: "record-synthetic-contact-stage",
    aggregate_type: "contact_lead",
    created_at: "2026-10-26T12:00:00.000Z",
    payload: { version: 1, data: { name: "Synthetic", requestType: "new_project" } }
  };
  const env = {
    CLICKUP_PRE_SALES_LIST_ID: CONTACT_STAGING_CLICKUP_LIST_ID,
    CLICKUP_API_TOKEN: "synthetic-token"
  };
  const fetchImpl = async (_url, init = {}) => {
    if (!init.method) return new Response(JSON.stringify({ tasks: [] }), { status: 200 });
    createBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: "synthetic-staging-task" }), { status: 200 });
  };

  await createClickUpTask(delivery, { env, fetchImpl });
  assert.equal(createBody.status, CONTACT_STAGING_CLICKUP_INITIAL_STATUS);
  assert.equal(CONTACT_STAGING_CLICKUP_INITIAL_STATUS, "em aberto \u{1F9E0}");
});
