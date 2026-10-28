import { createHash } from "node:crypto";
import { appendToGoogleSheets } from "./integrationAdapters.mjs";
import { getGoogleSheetsAccessToken } from "./googleSheetsAuth.mjs";
import { buildContactDeliveryPayload, IntegrationDeliveryError } from "./integrationDelivery.mjs";

const locks = new Map();
const tabByType = Object.freeze({ contact_lead: "Leads", talent_application: "Talentos" });

const withKeyLock = async (key, action) => {
  const previous = locks.get(key) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  const tail = previous.then(() => current);
  locks.set(key, tail);
  await previous;
  try {
    return await action();
  } finally {
    release();
    if (locks.get(key) === tail) locks.delete(key);
  }
};

const digest = (value) => createHash("sha256").update(value).digest("hex");

/**
 * Google Sheets is the canonical store for Contact and Talent submissions.
 * Delivery identity and row references make retries idempotent; this process
 * does not dispatch to ClickUp or claim cross-process/Sheets transactionality.
 */
export const createOperationalSubmissionStore = ({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  tokenProvider = getGoogleSheetsAccessToken,
  appendSheet = appendToGoogleSheets
} = {}) => {
  const submit = async (aggregateType, input, idempotencyKey) => {
    if (!tabByType[aggregateType]) throw new IntegrationDeliveryError("submission_type_not_supported");
    if (env.SUBMISSIONS_ENABLED !== "true" || env.INTEGRATIONS_ENABLED !== "true" || env.GOOGLE_SHEETS_ENABLED !== "true") {
      throw new IntegrationDeliveryError("submission_store_disabled");
    }
    if (typeof idempotencyKey !== "string" || idempotencyKey.length === 0) {
      throw new IntegrationDeliveryError("idempotency_key_required");
    }

    const payload = aggregateType === "contact_lead" ? buildContactDeliveryPayload(input) : input;
    const recordId = `rec_${digest(`${aggregateType}\0${idempotencyKey}`)}`;
    const deliveryId = `del_${digest(`${aggregateType}\0${idempotencyKey}\0GOOGLE_SHEETS`)}`;

    return withKeyLock(deliveryId, async () => {
      const accessToken = await tokenProvider({ env, fetchImpl });
      const delivery = {
        id: deliveryId,
        aggregate_id: recordId,
        aggregate_type: aggregateType,
        created_at: now().toISOString(),
        payload: { version: 1, data: payload },
        operational_mode: true
      };
      let stored;
      try {
        stored = await appendSheet(delivery, {
          spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
          accessToken,
          fetchImpl
        });
      } catch (error) {
        if (error?.code === "google_sheets_idempotency_conflict") throw new Error("idempotency_key_conflict");
        throw error;
      }
      if (!stored || !Number.isSafeInteger(stored.rowNumber) || stored.rowNumber < 2 ||
          typeof stored.rowReference !== "string" || !stored.rowReference.startsWith(`${tabByType[aggregateType]}!A`)) {
        throw new IntegrationDeliveryError("google_sheets_row_reference_invalid");
      }

      return {
        id: recordId,
        created: !stored.existing,
        sheetsRowReference: stored.rowReference
      };
    });
  };

  return Object.freeze({
    persistContactLead: (payload, idempotencyKey) => submit("contact_lead", payload, idempotencyKey),
    persistTalentApplication: (payload, idempotencyKey) => submit("talent_application", payload, idempotencyKey)
  });
};

const defaultStore = createOperationalSubmissionStore();
export const persistContactLeadToSheets = (payload, idempotencyKey) => defaultStore.persistContactLead(payload, idempotencyKey);
export const persistTalentApplicationToSheets = (payload, idempotencyKey) => defaultStore.persistTalentApplication(payload, idempotencyKey);
