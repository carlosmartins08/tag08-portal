import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_SHEETS_V1_HEADERS,
  buildContactSheetsV1Row
} from "../server/contactSheetsProjection.mjs";
import { findSheetRowReference } from "../server/integrationDelivery.mjs";

const delivery = {
  id: "delivery-synthetic-001",
  aggregate_id: "record-synthetic-001",
  aggregate_type: "contact_lead",
  created_at: "2026-10-26T12:00:00.000Z"
};

const payload = {
  name: "Synthetic Lead",
  company: "Synthetic Company",
  whatsapp: "+5583999999999",
  email: "lead@example.test",
  service: "multiple",
  stage: "not_collected",
  requestType: "new_project",
  serviceInterests: ["technology", "branding"],
  needsServiceGuidance: false,
  message: "Synthetic message for mapping validation.",
  consentVersion: "contact-v1",
  locale: "pt",
  source: "contact-page:offer",
  utm: { source: "synthetic", medium: "test", campaign: "contract", content: "", term: "" }
};

test("Contact v1 preserves A:D and appends the fixed E+ projection", () => {
  const row = buildContactSheetsV1Row(delivery, payload);

  assert.deepEqual(row.slice(0, 4), [
    delivery.id,
    delivery.aggregate_id,
    delivery.created_at,
    JSON.stringify(payload)
  ]);
  assert.deepEqual(CONTACT_SHEETS_V1_HEADERS, [
    "projection_version", "name", "company", "whatsapp", "email", "request_type",
    "service", "service_interests_json", "needs_service_guidance", "message", "source", "utm_json"
  ]);
  assert.equal(row.length, 4 + CONTACT_SHEETS_V1_HEADERS.length);
  assert.deepEqual(row.slice(4), [
    1,
    payload.name,
    payload.company,
    payload.whatsapp,
    payload.email,
    payload.requestType,
    payload.service,
    JSON.stringify(payload.serviceInterests),
    false,
    payload.message,
    payload.source,
    JSON.stringify(payload.utm)
  ]);
});

test("typed projection is an explicit minimization allowlist", () => {
  const payloadWithInternalFields = {
    ...payload,
    consent: true,
    website: "honeypot-value",
    idempotencyKey: "synthetic-key",
    retentionUntil: "2099-01-01T00:00:00.000Z",
    internalToken: "synthetic-secret"
  };
  const typed = buildContactSheetsV1Row(delivery, payloadWithInternalFields).slice(4);

  assert.equal(typed.length, CONTACT_SHEETS_V1_HEADERS.length);
  for (const excluded of ["consent", "website", "idempotencyKey", "retentionUntil", "internalToken", payload.consentVersion, payload.locale, payload.stage]) {
    assert.equal(typed.includes(excluded), false);
  }
  assert.equal(JSON.parse(typed.at(-1)).source, "synthetic");
});

test("repeated projection is deterministic and existing Delivery ID prevents a duplicate append", () => {
  const first = buildContactSheetsV1Row(delivery, payload);
  const retry = buildContactSheetsV1Row(delivery, payload);

  assert.deepEqual(retry, first);
  assert.equal(first[0], delivery.id);
  assert.equal(findSheetRowReference("Leads!A2:A2", [first], delivery.id), "Leads!A2:D2");
});

test("projection rejects wrong aggregate and invalid identities", () => {
  assert.throws(() => buildContactSheetsV1Row({ ...delivery, aggregate_type: "talent_application" }, payload), /contact_sheet_delivery_invalid/);
  assert.throws(() => buildContactSheetsV1Row({ ...delivery, id: "" }, payload), /contact_sheet_identity_invalid/);
  assert.throws(() => buildContactSheetsV1Row(delivery, null), /contact_sheet_payload_invalid/);
});
