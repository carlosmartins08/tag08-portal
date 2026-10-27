import { createHash } from "node:crypto";
import { appendToGoogleSheets, createClickUpTask, findExistingClickUpTask, updateGoogleSheetsDeliveryState } from "./integrationAdapters.mjs";
import { getGoogleSheetsAccessToken } from "./googleSheetsAuth.mjs";
import { buildContactDeliveryPayload, IntegrationDeliveryError, isCommercialContactRequest } from "./integrationDelivery.mjs";

const locks = new Map();
const MAX_CLICKUP_REPLAY_ATTEMPTS = 8;

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
const safeCode = (error) => {
  const code = error && typeof error === "object" && "code" in error ? error.code : "submission_delivery_failed";
  return typeof code === "string" && /^[a-z0-9_]+$/i.test(code) ? code : "submission_delivery_failed";
};

const clickUpRequired = (aggregateType, payload) => aggregateType === "talent_application" ||
  (aggregateType === "contact_lead" && isCommercialContactRequest(payload.requestType));

const tabByType = Object.freeze({ contact_lead: "Leads", talent_application: "Talentos" });

/**
 * Google Sheets is the canonical submission store for Contact and Talent.
 * ClickUp is a separately recorded operational delivery. This deliberately
 * does not claim cross-system atomicity or distributed exactly-once behavior.
 */
export const createOperationalSubmissionStore = ({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  tokenProvider = getGoogleSheetsAccessToken,
  appendSheet = appendToGoogleSheets,
  updateSheetState = updateGoogleSheetsDeliveryState,
  createTask = createClickUpTask,
  findTask = findExistingClickUpTask
} = {}) => {
  const submit = async (aggregateType, input, idempotencyKey) => {
    if (!tabByType[aggregateType]) throw new IntegrationDeliveryError("submission_type_not_supported");
    if (env.SUBMISSIONS_ENABLED !== "true" || env.GOOGLE_SHEETS_ENABLED !== "true") {
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
          typeof stored.rowReference !== "string" || stored.rowReference.length === 0) {
        throw new IntegrationDeliveryError("google_sheets_row_reference_invalid");
      }

      const needsClickUp = clickUpRequired(aggregateType, payload);
      if (!needsClickUp || env.INTEGRATIONS_ENABLED !== "true" || env.CLICKUP_ENABLED !== "true") {
        const status = needsClickUp ? stored.clickupStatus || "PENDING" : "NOT_ROUTED";
        await updateSheetState(delivery, {
          rowNumber: stored.rowNumber,
          sheetsRowReference: stored.rowReference,
          clickupStatus: status,
          clickupTaskId: stored.clickupTaskId || "",
          clickupAttempts: Number.isSafeInteger(stored.clickupAttempts) ? stored.clickupAttempts : 0,
          clickupLastErrorCode: stored.clickupLastErrorCode || "",
          updatedAt: now().toISOString()
        }, { spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID, accessToken, fetchImpl });
        return { id: recordId, created: !stored.existing, clickUpStatus: status, sheetsRowReference: stored.rowReference };
      }

      if (stored.clickupStatus === "DELIVERED" && stored.clickupTaskId) {
        return { id: recordId, created: !stored.existing, clickUpStatus: "DELIVERED", clickUpTaskId: stored.clickupTaskId, sheetsRowReference: stored.rowReference };
      }

      const clickUpDelivery = { ...delivery, created_at: stored.createdAt || delivery.created_at };
      const currentAttempts = Number.isSafeInteger(stored.clickupAttempts) ? stored.clickupAttempts : 0;
      if (stored.clickupStatus === "UNKNOWN") {
        let recoveredTaskId = "";
        let reconciliationError = "";
        try {
          recoveredTaskId = await findTask(clickUpDelivery, { env, fetchImpl }) || "";
        } catch (error) {
          reconciliationError = safeCode(error);
        }
        const reconciledStatus = recoveredTaskId ? "DELIVERED" : "UNKNOWN";
        const lastError = recoveredTaskId ? "" : reconciliationError || stored.clickupLastErrorCode || "clickup_task_create_outcome_unknown";
        await updateSheetState(delivery, {
          rowNumber: stored.rowNumber,
          sheetsRowReference: stored.rowReference,
          clickupStatus: reconciledStatus,
          clickupTaskId: recoveredTaskId || stored.clickupTaskId || "",
          clickupAttempts: currentAttempts,
          clickupLastErrorCode: lastError,
          updatedAt: now().toISOString()
        }, { spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID, accessToken, fetchImpl });
        return {
          id: recordId,
          created: !stored.existing,
          clickUpStatus: reconciledStatus,
          sheetsRowReference: stored.rowReference,
          ...(recoveredTaskId ? { clickUpTaskId: recoveredTaskId } : {}),
          ...(lastError ? { clickUpLastErrorCode: lastError } : {})
        };
      }

      if (currentAttempts >= MAX_CLICKUP_REPLAY_ATTEMPTS) {
        const lastError = "clickup_attempt_limit_reached";
        await updateSheetState(delivery, {
          rowNumber: stored.rowNumber,
          sheetsRowReference: stored.rowReference,
          clickupStatus: "FAILED",
          clickupTaskId: stored.clickupTaskId || "",
          clickupAttempts: currentAttempts,
          clickupLastErrorCode: lastError,
          updatedAt: now().toISOString()
        }, { spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID, accessToken, fetchImpl });
        return { id: recordId, created: !stored.existing, clickUpStatus: "FAILED", sheetsRowReference: stored.rowReference, clickUpLastErrorCode: lastError };
      }

      const attempts = currentAttempts + 1;
      let clickUpTaskId = "";
      let clickUpStatus = "FAILED";
      let clickUpLastErrorCode = "";
      try {
        clickUpTaskId = await createTask(clickUpDelivery, { env, fetchImpl });
        if (typeof clickUpTaskId !== "string" || clickUpTaskId.length === 0) {
          throw new IntegrationDeliveryError("clickup_task_reference_missing");
        }
        clickUpStatus = "DELIVERED";
      } catch (error) {
        clickUpLastErrorCode = safeCode(error);
        if (error?.outcomeUnknown === true) clickUpStatus = "UNKNOWN";
      }

      await updateSheetState(delivery, {
        rowNumber: stored.rowNumber,
        sheetsRowReference: stored.rowReference,
        clickupStatus: clickUpStatus,
        clickupTaskId: clickUpTaskId,
        clickupAttempts: attempts,
        clickupLastErrorCode: clickUpLastErrorCode,
        updatedAt: now().toISOString()
      }, { spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID, accessToken, fetchImpl });

      return {
        id: recordId,
        created: !stored.existing,
        clickUpStatus,
        sheetsRowReference: stored.rowReference,
        ...(clickUpTaskId ? { clickUpTaskId } : {}),
        ...(clickUpLastErrorCode ? { clickUpLastErrorCode } : {})
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
