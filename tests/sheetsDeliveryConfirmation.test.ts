import assert from "node:assert/strict";
import test from "node:test";
import { confirmsSheetsSubmission } from "../src/lib/sheetsDeliveryConfirmation";

const contactReceipt = {
  ok: true,
  leadId: "lead-123",
  status: "accepted",
  deliveryStatus: { sheets: "delivered", sheetsRowReference: "Leads!A12:W12" }
};

const talentReceipt = {
  ok: true,
  applicationId: "application-123",
  status: "accepted",
  deliveryStatus: { sheets: "delivered", sheetsRowReference: "Talentos!A102:X102" }
};

test("accepts only a 202 response with the persisted Sheets receipt for Contact", () => {
  assert.equal(confirmsSheetsSubmission(202, contactReceipt, "contact"), true);
  assert.equal(confirmsSheetsSubmission(200, contactReceipt, "contact"), false);
  assert.equal(confirmsSheetsSubmission(202, { ...contactReceipt, deliveryStatus: { sheets: "pending", sheetsRowReference: "Leads!A12:W12" } }, "contact"), false);
  assert.equal(confirmsSheetsSubmission(202, { ...contactReceipt, deliveryStatus: { sheets: "delivered", sheetsRowReference: "Leads!A12:W13" } }, "contact"), false);
});

test("accepts only a 202 response with the persisted Sheets receipt for Talent", () => {
  assert.equal(confirmsSheetsSubmission(202, talentReceipt, "talent"), true);
  assert.equal(confirmsSheetsSubmission(202, { ...talentReceipt, deliveryStatus: { sheets: "delivered", sheetsRowReference: "Leads!A2:W2" } }, "talent"), false);
  assert.equal(confirmsSheetsSubmission(202, { ...talentReceipt, applicationId: "", deliveryStatus: { sheets: "delivered", sheetsRowReference: "Talentos!A2:X2" } }, "talent"), false);
  assert.equal(confirmsSheetsSubmission(202, { ok: true, applicationId: "application-123", status: "accepted" }, "talent"), false);
});
