import {
  buildContactClickUpTask,
  findSheetRowReference,
  IntegrationDeliveryError,
  integrationHttpError,
  isCommercialContactRequest,
  resolveClickUpListId,
  unwrapDeliveryPayload
} from "./integrationDelivery.mjs";
import { buildContactSheetsV1Row } from "./contactSheetsProjection.mjs";

const MAX_CLICKUP_LOOKUP_PAGES = 100;

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

  const idRange = encodeURIComponent(`${tab}!A:A`);
  const existing = await fetchImpl(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${idRange}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!existing.ok) throw integrationHttpError("google_sheets_lookup_failed", existing.status);
  const existingBody = await existing.json();
  if (!existingBody || typeof existingBody !== "object" || (existingBody.values !== undefined && !Array.isArray(existingBody.values))) {
    throw new IntegrationDeliveryError("google_sheets_lookup_response_invalid");
  }
  const existingReference = findSheetRowReference(existingBody.range, existingBody.values || [], delivery.id);
  if (existingReference) return existingReference;

  const payload = unwrapDeliveryPayload(delivery.payload);
  const isContact = delivery.aggregate_type === "contact_lead";
  const range = encodeURIComponent(`${tab}!A:${isContact ? "P" : "D"}`);
  // D intentionally stays the legacy full JSON payload. Narrowing it requires
  // a separately approved/versioned consumer contract; E+ is the explicit v1 allowlist.
  const row = isContact
    ? buildContactSheetsV1Row(delivery, payload)
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
  const appended = await response.json();
  return appended.updates?.updatedRange || delivery.id;
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
  const payload = unwrapDeliveryPayload(delivery.payload);
  if (delivery.aggregate_type === "contact_lead" && !isCommercialContactRequest(payload.requestType)) {
    throw new IntegrationDeliveryError("clickup_contact_not_pre_sales");
  }

  const listId = resolveClickUpListId(delivery.aggregate_type, env);
  if (!apiToken) throw new IntegrationDeliveryError("clickup_not_configured");

  const contactTask = delivery.aggregate_type === "contact_lead" ? buildContactClickUpTask(delivery, payload) : null;
  const taskName = contactTask?.name || `${delivery.aggregate_type}:${delivery.id}`;
  const existingTaskId = await findClickUpTaskByName(listId, taskName, apiToken, fetchImpl);
  if (existingTaskId) return existingTaskId;

  const response = await fetchImpl(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: { Authorization: apiToken, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: taskName,
      description: contactTask?.description || JSON.stringify(payload),
      tags: contactTask?.tags || ["tag08", delivery.aggregate_type]
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw integrationHttpError("clickup_task_create_failed", response.status);
  const createdTask = await response.json().catch(() => null);
  if (!createdTask || typeof createdTask.id !== "string" || !createdTask.id) {
    throw new IntegrationDeliveryError("clickup_task_response_invalid");
  }
  return createdTask.id;
};
