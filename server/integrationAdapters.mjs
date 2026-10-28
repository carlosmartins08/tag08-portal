import { createHash } from "node:crypto";
import {
  IntegrationDeliveryError,
  findSheetRowReference,
  integrationHttpError,
  resolveClickUpListId,
  unwrapDeliveryPayload
} from "./integrationDelivery.mjs";
import {
  buildOnboardingClickUpDeliveryProjection,
  buildOnboardingSheetsDeliveryProjection
} from "./onboardingDeliveryProjection.mjs";
import {
  buildContactSheetsV1Row,
  buildMinimalSheetsPayloadEnvelope,
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  buildTalentSheetsV1Projection,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS
} from "./contactSheetsProjection.mjs";

const MAX_CLICKUP_LOOKUP_PAGES = 100;

const matchesOperationalPayload = (storedValue, payload) => {
  if (typeof storedValue !== "string") return false;
  try {
    const stored = JSON.parse(storedValue);
    if (stored?.envelopeVersion === 2) {
      const canonicalHash = JSON.parse(buildMinimalSheetsPayloadEnvelope(payload)).payloadSha256;
      // Rows produced by the preceding v2 implementation hashed insertion-order JSON.
      const previousV2Hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
      return stored.payloadSha256 === canonicalHash || stored.payloadSha256 === previousV2Hash;
    }
  } catch {
    return false;
  }
  // Rows written before the operational envelope contain the legacy raw JSON.
  return storedValue === JSON.stringify(payload);
};

/**
 * @param {object} delivery
 * @param {{ spreadsheetId?: string, accessToken: string, fetchImpl?: typeof fetch }} options
 */
export const appendToGoogleSheets = async (delivery, {
  spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  accessToken,
  fetchImpl = globalThis.fetch
} = {}) => {
  if (!spreadsheetId) throw new IntegrationDeliveryError("google_sheets_not_configured");
  if (!accessToken) throw new IntegrationDeliveryError("google_service_account_not_configured");

  const tabs = {
    contact_lead: "Leads",
    onboarding_submission: "Onboarding",
    talent_application: "Talentos"
  };
  const tab = tabs[delivery.aggregate_type];
  if (!tab) throw new IntegrationDeliveryError("google_sheet_tab_not_configured");

  const operationalMode = delivery.operational_mode === true;
  const expectedHeaders = delivery.aggregate_type === "contact_lead"
    ? [...CONTACT_SHEETS_V1_HEADERS, ...CONTACT_DELIVERY_HEADERS]
    : delivery.aggregate_type === "talent_application"
      ? [...TALENT_SHEETS_V1_HEADERS, ...TALENT_DELIVERY_HEADERS]
      : null;
  const lookupEndColumn = operationalMode ? "ZZ" : "A";
  const idRange = encodeURIComponent(`${tab}!A:${lookupEndColumn}`);
  const existing = await fetchImpl(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${idRange}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!existing.ok) throw integrationHttpError("google_sheets_lookup_failed", existing.status);
  const existingBody = await existing.json();
  if (!existingBody || typeof existingBody !== "object" || (existingBody.values !== undefined && !Array.isArray(existingBody.values))) {
    throw new IntegrationDeliveryError("google_sheets_lookup_response_invalid");
  }

  const existingRows = existingBody.values || [];
  if (operationalMode) {
    const headers = existingRows[0] || [];
    if (!expectedHeaders || JSON.stringify(headers.slice(4, 4 + expectedHeaders.length)) !== JSON.stringify(expectedHeaders)) {
      throw new IntegrationDeliveryError("google_sheets_operational_schema_mismatch");
    }
  }

  const existingIndex = existingRows.findIndex((row) => row?.[0] === delivery.id);
  const existingIndexes = existingRows.reduce((indexes, row, index) => {
    if (row?.[0] === delivery.id) indexes.push(index);
    return indexes;
  }, []);
  if (operationalMode && existingIndexes.length > 1) {
    throw new IntegrationDeliveryError("google_sheets_delivery_duplicate_requires_reconciliation");
  }
  const lastColumn = operationalMode
    ? columnName(3 + expectedHeaders.length)
    : delivery.aggregate_type === "contact_lead" ? "P" : "D";
  if (existingIndex >= 0) {
    const existingRow = existingRows[existingIndex];
    const payload = unwrapDeliveryPayload(delivery.payload);
    if (operationalMode && (existingRow[1] !== delivery.aggregate_id || !matchesOperationalPayload(existingRow[3], payload))) {
      throw new IntegrationDeliveryError("google_sheets_idempotency_conflict");
    }
    const startRow = Number(existingBody.range?.match(/![A-Z]+(\d+)/i)?.[1] || 1);
    const rowNumber = startRow + existingIndex;
    if (!operationalMode) return findSheetRowReference(existingBody.range, existingRows, delivery.id);
    return {
      rowReference: `${tab}!A${rowNumber}:${operationalMode ? lastColumn : "D"}${rowNumber}`,
      rowNumber,
      existing: true,
      createdAt: existingRow[2]
    };
  }

  const unwrappedPayload = unwrapDeliveryPayload(delivery.payload);
  const payload = delivery.aggregate_type === "onboarding_submission"
    ? buildOnboardingSheetsDeliveryProjection(unwrappedPayload)
    : unwrappedPayload;
  const isContact = delivery.aggregate_type === "contact_lead";
  const isTalent = delivery.aggregate_type === "talent_application";
  const range = encodeURIComponent(`${tab}!A:${operationalMode ? lastColumn : isContact ? "P" : "D"}`);
  // Legacy workers retain their raw D payload; direct operational rows use a
  // versioned digest envelope to avoid duplicating personal data.
  const metadata = operationalMode
    ? ["", "NOT_ROUTED", "", 0, "", "DELIVERED", delivery.created_at]
    : [];
  const row = isContact
    ? [...buildContactSheetsV1Row(delivery, payload, { minimalEnvelope: operationalMode }), ...metadata]
    : operationalMode && isTalent
      ? [delivery.id, delivery.aggregate_id, delivery.created_at, buildMinimalSheetsPayloadEnvelope(payload), ...buildTalentSheetsV1Projection(payload), ...metadata]
      : [delivery.id, delivery.aggregate_id, delivery.created_at, JSON.stringify(payload)];
  const response = await fetchImpl(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [row] }),
      signal: AbortSignal.timeout(15000)
    }
  );
  if (!response.ok) throw integrationHttpError("google_sheets_append_failed", response.status);
  const appended = await response.json().catch(() => null);
  const updatedRange = appended?.updates?.updatedRange;
  if (!operationalMode) return updatedRange || delivery.id;
  const rowMatch = typeof updatedRange === "string" ? updatedRange.match(new RegExp(`^${tab}!A([1-9]\\d*):${lastColumn}\\1$`)) : null;
  if (!rowMatch) throw new IntegrationDeliveryError("google_sheets_append_unconfirmed", true, true);
  const rowNumber = Number(rowMatch[1]);
  if (rowNumber < 2) throw new IntegrationDeliveryError("google_sheets_append_unconfirmed", true, true);
  return { rowReference: updatedRange, rowNumber, existing: false, createdAt: delivery.created_at };
};

const columnName = (zeroBasedIndex) => {
  let value = zeroBasedIndex + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
};

const findClickUpTaskByName = async (listId, taskName, apiToken, fetchImpl) => {
  for (let page = 0; page < MAX_CLICKUP_LOOKUP_PAGES; page += 1) {
    const query = new URLSearchParams({ include_closed: "true", include_timl: "true", page: String(page) });
    const response = await fetchImpl(`https://api.clickup.com/api/v2/list/${listId}/task?${query}`, {
      headers: { Authorization: apiToken },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw integrationHttpError("clickup_task_lookup_failed", response.status);

    const body = await response.json().catch(() => null);
    if (!body || !Array.isArray(body.tasks)) throw new IntegrationDeliveryError("clickup_task_lookup_response_invalid");
    const existing = body.tasks.find((task) => task.name === taskName);
    if (existing?.id) return existing.id;
    if (body.tasks.length < 100 || body.last_page === true) return null;
  }
  throw new Error("clickup_task_lookup_page_limit_reached");
};

/**
 * @param {object} delivery
 * @param {{ env?: Record<string, string | undefined>, apiToken?: string, fetchImpl?: typeof fetch }} options
 */
export const createClickUpTask = async (delivery, {
  env = process.env,
  apiToken = env.CLICKUP_API_TOKEN,
  fetchImpl = globalThis.fetch
} = {}) => {
  if (delivery.aggregate_type !== "onboarding_submission") {
    throw new IntegrationDeliveryError("clickup_aggregate_not_supported");
  }
  const unwrappedPayload = unwrapDeliveryPayload(delivery.payload);
  const payload = buildOnboardingClickUpDeliveryProjection(unwrappedPayload);

  const listId = resolveClickUpListId(delivery.aggregate_type, env);
  if (!apiToken) throw new IntegrationDeliveryError("clickup_not_configured");

  const taskName = `${delivery.aggregate_type}:${delivery.id}`;
  const existingTaskId = await findClickUpTaskByName(listId, taskName, apiToken, fetchImpl);
  if (existingTaskId) return existingTaskId;

  const taskBody = {
    name: taskName,
    description: JSON.stringify(payload),
    tags: ["tag08", delivery.aggregate_type]
  };

  let response;
  try {
    response = await fetchImpl(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: "POST",
      headers: { Authorization: apiToken, "Content-Type": "application/json" },
      body: JSON.stringify(taskBody),
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    throw new IntegrationDeliveryError("clickup_task_create_outcome_unknown", true, true);
  }
  if (!response.ok) {
    if (response.status === 408 || response.status >= 500) {
      throw new IntegrationDeliveryError(`clickup_task_create_outcome_unknown_${response.status}`, true, true);
    }
    throw integrationHttpError("clickup_task_create_failed", response.status);
  }
  const createdTask = await response.json().catch(() => null);
  if (!createdTask || typeof createdTask.id !== "string" || !createdTask.id) {
    throw new IntegrationDeliveryError("clickup_task_create_outcome_unknown", true, true);
  }
  return createdTask.id;
};
