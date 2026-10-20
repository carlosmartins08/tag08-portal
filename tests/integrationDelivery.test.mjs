import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactClickUpTask,
  findSheetRowReference,
  getDeliveryFailure,
  integrationHttpError,
  MAX_AUTOMATIC_DELIVERY_ATTEMPTS,
  resolveClickUpListId,
  unwrapDeliveryPayload
} from "../server/integrationDelivery.mjs";

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
