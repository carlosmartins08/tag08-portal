import {
  CONTACT_STAGING_CLICKUP_INITIAL_STATUS,
  CONTACT_STAGING_CLICKUP_LIST_ID,
  unwrapDeliveryPayload
} from "../server/integrationDelivery.mjs";

export const CONTACT_STAGING_SPREADSHEET_ID = "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE";
export const CONTACT_STAGING_RETRY_ERROR = "integration_mock_contact_staging_transient";
export const CONTACT_STAGING_CONFIRMATION = "TAG08_CONTACT_STAGING";

export const isSyntheticContactPayload = (payloadValue) => {
  let payload;
  try { payload = unwrapDeliveryPayload(payloadValue); } catch { return false; }
  return payload?.requestType === "new_project" &&
    payload?.name === "TAG08 QA Contact Synthetic" &&
    payload?.company === "TAG08 QA Synthetic" &&
    typeof payload?.email === "string" && /^tag08-contact-[a-z0-9-]+@example\.test$/i.test(payload.email) &&
    payload?.whatsapp === "+5500000000000" &&
    payload?.message === "SIMULACAO SINTETICA TAG08 \u2014 NAO ATENDER NEM APROVAR.";
};

export const validateContactDeliveryRows = (rows, aggregateId, { requireState } = {}) => {
  if (!Array.isArray(rows) || rows.length !== 2) throw new Error("contact_staging_expected_exactly_two_deliveries");
  const byTarget = new Map(rows.map((row) => [row.target, row]));
  if (byTarget.size !== 2 || !byTarget.has("GOOGLE_SHEETS") || !byTarget.has("CLICKUP")) {
    throw new Error("contact_staging_delivery_targets_mismatch");
  }
  for (const row of rows) {
    if (row.aggregate_type !== "contact_lead" || row.aggregate_id !== aggregateId || !isSyntheticContactPayload(row.payload)) {
      throw new Error("contact_staging_delivery_is_not_the_synthetic_contact");
    }
    if (requireState && (row.status !== requireState.status || Number(row.attempts) !== requireState.attempts)) {
      throw new Error("contact_staging_delivery_state_mismatch");
    }
  }
  return byTarget;
};

export const buildOneContactWorkerEnvironment = (stagingEnv, target, deliveryId, mode, inherited = process.env) => {
  if (!["GOOGLE_SHEETS", "CLICKUP"].includes(target)) throw new Error("contact_staging_target_invalid");
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(deliveryId)) throw new Error("contact_staging_delivery_id_invalid");
  if (!["simulate-failure", "deliver"].includes(mode)) throw new Error("contact_staging_mode_invalid");

  const childEnv = {};
  for (const key of ["PATH", "SystemRoot", "WINDIR", "TEMP", "TMP"]) {
    if (inherited[key]) childEnv[key] = inherited[key];
  }
  for (const key of [
    "DATABASE_URL", "DATABASE_SSL", "GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SERVICE_ACCOUNT_JSON",
    "CLICKUP_API_TOKEN", "CLICKUP_PRE_SALES_LIST_ID", "INTEGRATION_PROCESSING_LEASE_SECONDS"
  ]) {
    if (stagingEnv[key] !== undefined) childEnv[key] = stagingEnv[key];
  }
  childEnv.INTEGRATIONS_ENABLED = "true";
  childEnv.GOOGLE_SHEETS_ENABLED = target === "GOOGLE_SHEETS" ? "true" : "false";
  childEnv.CLICKUP_ENABLED = target === "CLICKUP" ? "true" : "false";
  childEnv.INTEGRATION_DELIVERY_ID = deliveryId;
  childEnv.INTEGRATION_MOCK_MODE = mode === "simulate-failure" ? "true" : "false";
  childEnv.INTEGRATION_MOCK_FAILURE = mode === "simulate-failure" ? "contact_staging_transient" : "";
  return childEnv;
};

export const getContactStagingExpected = () => ({
  spreadsheetId: CONTACT_STAGING_SPREADSHEET_ID,
  clickUpListId: CONTACT_STAGING_CLICKUP_LIST_ID,
  clickUpInitialStatus: CONTACT_STAGING_CLICKUP_INITIAL_STATUS
});
