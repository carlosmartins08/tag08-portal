import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";
import {
  createClickUpTask,
  findExistingClickUpTask
} from "../server/integrationAdapters.mjs";
import { buildContactClickUpTask } from "../server/integrationDelivery.mjs";
import { buildTalentClickUpTask } from "../server/integrationAdapters.mjs";
import { getGoogleSheetsAccessToken } from "../server/googleSheetsAuth.mjs";
import {
  CONTACT_STAGING_HEADERS,
  CONTACT_STAGING_SPREADSHEET_ID,
  CONTACT_TALENT_STAGING_CONFIRMATION,
  CONTACT_TALENT_STAGING_SYNTHETIC_MARKER,
  TALENT_STAGING_HEADERS
} from "./contactStagingGate.mjs";
import { CONTACT_STAGING_TARGETS, evaluateIntegrationPreflight } from "./preflight-integrations.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(PROJECT_ROOT, ".env.staging.local");
const TAB_BY_FLOW = Object.freeze({ contact: "Leads", talent: "Talentos" });
const IDENTITY_PREFIX = "tag08-contact-talent-staging";
const MAX_ROWS_TO_SCAN = 1003;
const assert = (ok, code) => { if (!ok) throw new Error(code); };
const safeLog = (event, data = {}) => console.log(JSON.stringify({ event, ...data }));
const stableId = (value) => createHash("sha256").update(value).digest("hex");

export const submitWithUnconfirmedSheetsAppendRecovery = async (submit, payload, key) => {
  try {
    return await submit(payload, key);
  } catch (error) {
    if (error?.code !== "google_sheets_append_unconfirmed" || error?.outcomeUnknown !== true) throw error;
    return submit(payload, key);
  }
};

const parseArgs = (args) => {
  const values = Object.fromEntries(args.filter((arg) => arg.startsWith("--") && arg.includes("="))
    .map((arg) => { const [key, ...rest] = arg.slice(2).split("="); return [key, rest.join("=")]; }));
  return { mode: values.mode || "inspect", confirmation: values.confirm || "" };
};

const readEnv = async () => {
  let contents;
  try { contents = await readFile(ENV_FILE, "utf8"); }
  catch { throw new Error("staging_env_file_missing"); }
  return dotenv.parse(contents);
};

const validateConfig = (env, mode) => {
  const result = evaluateIntegrationPreflight(env, "contact-talent", mode);
  assert(result.missing.length === 0 && result.invalid.length === 0, "direct_staging_preflight_failed");
  assert(env.CLICKUP_PRE_SALES_LIST_ID === CONTACT_STAGING_TARGETS.clickUpContactListId, "staging_contact_list_mismatch");
  assert(env.CLICKUP_TALENT_LIST_ID === CONTACT_STAGING_TARGETS.clickUpTalentListId, "staging_talent_list_mismatch");
  assert(env.GOOGLE_SHEETS_SPREADSHEET_ID === CONTACT_STAGING_SPREADSHEET_ID, "staging_sheet_mismatch");
  if (mode === "deliver") {
    assert(Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()), "staging_sheets_credential_missing");
    assert(Boolean(env.CLICKUP_API_TOKEN?.trim()), "staging_clickup_credential_missing");
  }
};

const readJson = async (url, init, code) => {
  let response;
  try { response = await fetch(url, init); }
  catch { throw new Error(`${code}_network_error`); }
  if (!response.ok) throw new Error(`${code}_http_${response.status}`);
  try { return await response.json(); }
  catch { throw new Error(`${code}_response_invalid`); }
};

const sheetValues = async (accessToken, range) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONTACT_STAGING_SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  const body = await readJson(url, { headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(15000) }, "staging_sheets_read");
  return body.values || [];
};

const verifyDestinations = async (env) => {
  const accessToken = await getGoogleSheetsAccessToken({ env });
  const spreadsheet = await readJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${CONTACT_STAGING_SPREADSHEET_ID}`,
    { headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(15000) },
    "staging_sheets_identity"
  );
  assert(spreadsheet.spreadsheetId === CONTACT_STAGING_SPREADSHEET_ID, "staging_sheets_id_mismatch");
  assert(spreadsheet.properties?.title === "TAG08 - Operacao Staging", "staging_sheets_title_mismatch");
  const tabs = new Map((spreadsheet.sheets || []).map(({ properties }) => [properties?.title, properties?.sheetId]));
  assert(tabs.has("Leads") && tabs.has("Talentos"), "staging_sheets_tabs_missing");

  const clickUpList = await readJson(
    `https://api.clickup.com/api/v2/list/${CONTACT_STAGING_TARGETS.clickUpContactListId}`,
    { headers: { Authorization: env.CLICKUP_API_TOKEN }, signal: AbortSignal.timeout(15000) },
    "staging_clickup_identity"
  );
  assert(String(clickUpList.id) === CONTACT_STAGING_TARGETS.clickUpContactListId, "staging_clickup_id_mismatch");
  assert(clickUpList.name === "TAG08 - Integrações Staging", "staging_clickup_name_mismatch");

  const [contactHeaders, talentHeaders] = await Promise.all([
    sheetValues(accessToken, "Leads!A1:W1"),
    sheetValues(accessToken, "Talentos!A1:X1")
  ]);
  assert(JSON.stringify(contactHeaders[0] || []) === JSON.stringify(CONTACT_STAGING_HEADERS), "staging_contact_headers_mismatch");
  assert(JSON.stringify(talentHeaders[0] || []) === JSON.stringify(TALENT_STAGING_HEADERS), "staging_talent_headers_mismatch");
  return accessToken;
};

const contactPayload = (marker) => ({
  name: "TAG08 QA Contact Synthetic",
  company: "TAG08 QA Synthetic",
  whatsapp: "+5500000000000",
  email: `contact-${marker.replace(/:/g, "-")}@synthetic.invalid`,
  service: "strategy",
  stage: "synthetic-test",
  requestType: "new_project",
  serviceInterests: ["strategy"],
  needsServiceGuidance: false,
  message: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}; NAO ATENDER NEM APROVAR.`,
  consent: true,
  consentVersion: "staging-synthetic-v1",
  locale: "pt",
  source: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`,
  utm: { source: "synthetic", medium: "", campaign: "", content: "", term: "" }
});

const talentPayload = (marker) => ({
  contractVersion: 2,
  interestAreas: ["design", "technology_development"],
  name: "TAG08 QA Talent Synthetic",
  email: `talent-${marker.replace(/:/g, "-")}@synthetic.invalid`,
  phone: "+5500000000000",
  linkedin: "",
  resumeUrl: "",
  portfolio: "",
  experienceSummary: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}`,
  availability: "synthetic-test",
  motivation: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}`,
  relevantProjects: "Synthetic project only",
  relevantExperience: "",
  consent: true,
  consentVersion: "staging-synthetic-v2",
  locale: "pt",
  source: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`,
  utm: { source: "synthetic", medium: "", campaign: "", content: "", term: "" }
});

const deriveIdentity = (aggregateType, idempotencyKey) => ({
  recordId: `rec_${stableId(`${aggregateType}\0${idempotencyKey}`)}`,
  deliveryId: `del_${stableId(`${aggregateType}\0${idempotencyKey}\0GOOGLE_SHEETS`)}`
});

const clickUpTaskShape = (flow, delivery, payload) => flow === "contact"
  ? buildContactClickUpTask(delivery, payload)
  : buildTalentClickUpTask(delivery, payload);

const readTracking = async (accessToken, flow, rowNumber) => {
  const tab = TAB_BY_FLOW[flow];
  const sourceColumn = flow === "contact" ? "O" : "P";
  const metadataRange = flow === "contact" ? `Q${rowNumber}:W${rowNumber}` : `R${rowNumber}:X${rowNumber}`;
  const [identity, source, metadata] = await Promise.all([
    sheetValues(accessToken, `${tab}!A${rowNumber}:B${rowNumber}`),
    sheetValues(accessToken, `${tab}!${sourceColumn}${rowNumber}`),
    sheetValues(accessToken, `${tab}!${metadataRange}`)
  ]);
  return { identity: identity[0] || [], source: source[0]?.[0] || "", metadata: metadata[0] || [] };
};

const findRowNumber = async (accessToken, flow, deliveryId) => {
  const tab = TAB_BY_FLOW[flow];
  const ids = await sheetValues(accessToken, `${tab}!A2:A${MAX_ROWS_TO_SCAN}`);
  const matches = ids.flatMap((row, index) => row?.[0] === deliveryId ? [index + 2] : []);
  if (matches.length === 0) throw new Error(`staging_${flow}_row_missing`);
  assert(matches.length === 1, `staging_${flow}_row_duplicate`);
  return matches[0];
};

const deleteTaskById = async (env, taskId, expectedName) => {
  const task = await readJson(
    `https://api.clickup.com/api/v2/task/${encodeURIComponent(taskId)}`,
    { headers: { Authorization: env.CLICKUP_API_TOKEN }, signal: AbortSignal.timeout(15000) },
    "staging_cleanup_task_read"
  );
  assert(task.name === expectedName, "staging_cleanup_task_name_mismatch");
  assert(String(task.list?.id || task.list_id || "") === CONTACT_STAGING_TARGETS.clickUpContactListId, "staging_cleanup_task_list_mismatch");
  assert(typeof task.description === "string" && task.description.includes(CONTACT_TALENT_STAGING_SYNTHETIC_MARKER), "staging_cleanup_task_not_synthetic");
  const response = await fetch(`https://api.clickup.com/api/v2/task/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    headers: { Authorization: env.CLICKUP_API_TOKEN },
    signal: AbortSignal.timeout(15000)
  }).catch(() => null);
  assert(response?.ok, "staging_cleanup_task_delete_failed");
};

const clearSyntheticRow = async (accessToken, flow, rowNumber) => {
  const tab = TAB_BY_FLOW[flow];
  const lastColumn = flow === "contact" ? "W" : "X";
  const range = encodeURIComponent(`${tab}!A${rowNumber}:${lastColumn}${rowNumber}`);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONTACT_STAGING_SPREADSHEET_ID}/values/${range}:clear`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(15000)
  }).catch(() => null);
  assert(response?.ok, `staging_cleanup_${flow}_row_clear_failed`);
};

const cleanupFlow = async ({ env, accessToken, flow, key, sourceMarker }) => {
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const { recordId, deliveryId } = deriveIdentity(aggregateType, key);
  const rowNumber = await findRowNumber(accessToken, flow, deliveryId).catch((error) => {
    if (error?.message === `staging_${flow}_row_missing`) return null;
    throw error;
  });
  const tracking = rowNumber ? await readTracking(accessToken, flow, rowNumber) : null;
  if (tracking) {
    assert(tracking.identity[0] === deliveryId && tracking.identity[1] === recordId, `staging_cleanup_${flow}_identity_mismatch`);
    assert(tracking.source === `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${sourceMarker}`, `staging_cleanup_${flow}_marker_mismatch`);
  }
  const taskTemplate = clickUpTaskShape(flow, { aggregate_id: recordId, id: deliveryId }, flow === "contact" ? contactPayload(sourceMarker) : talentPayload(sourceMarker));
  const taskId = tracking?.metadata[2] || "";
  const foundTaskId = taskId || await findExistingClickUpTask({
    id: deliveryId,
    aggregate_id: recordId,
    aggregate_type: aggregateType,
    payload: { version: 1, data: flow === "contact" ? contactPayload(sourceMarker) : talentPayload(sourceMarker) }
  }, { env });
  if (taskId && foundTaskId && taskId !== foundTaskId) throw new Error(`staging_cleanup_${flow}_task_reference_mismatch`);
  if (foundTaskId) await deleteTaskById(env, foundTaskId, taskTemplate.name);
  if (!rowNumber) return;
  await clearSyntheticRow(accessToken, flow, rowNumber);
};

const createStore = (env) => {
  const failFirstPost = new Set(["contact_lead", "talent_application"]);
  const createTask = (delivery, options) => createClickUpTask(delivery, {
    ...options,
    fetchImpl: async (url, init = {}) => {
      const body = init.body ? JSON.parse(init.body) : {};
      if (init.method === "POST" && failFirstPost.has(delivery.aggregate_type)) {
        failFirstPost.delete(delivery.aggregate_type);
        return new Response(JSON.stringify({ err: "synthetic staging failure" }), { status: 400 });
      }
      if (init.method === "POST") {
        body.description = `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${delivery.aggregate_type}\n${body.description || ""}`;
        return fetch(url, { ...init, body: JSON.stringify(body) });
      }
      return fetch(url, init);
    }
  });
  return { store: createOperationalSubmissionStore({ env, createTask }) };
};

const assertTracking = async (accessToken, flow, rowNumber, expectedStatus, expectedAttempts) => {
  const tracking = await readTracking(accessToken, flow, rowNumber);
  const statusOffset = 1;
  const attemptsOffset = 3;
  const taskIdOffset = 2;
  assert(tracking.metadata[statusOffset] === expectedStatus, `staging_${flow}_clickup_status_${expectedStatus}_expected`);
  assert(Number(tracking.metadata[attemptsOffset]) === expectedAttempts, `staging_${flow}_attempt_count_invalid`);
  return { taskId: tracking.metadata[taskIdOffset] || "", source: tracking.source };
};

const deliverFlow = async ({ store, accessToken, flow, marker, runId, env }) => {
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const key = `${IDENTITY_PREFIX}:${runId}:${flow}`;
  const payload = flow === "contact" ? contactPayload(marker) : talentPayload(marker);
  const submit = flow === "contact" ? store.persistContactLead : store.persistTalentApplication;

  const failed = await submitWithUnconfirmedSheetsAppendRecovery(submit, payload, key);
  assert(failed.clickUpStatus === "FAILED", `staging_${flow}_failure_path_not_observed`);
  const { deliveryId } = deriveIdentity(aggregateType, key);
  const rowNumber = await findRowNumber(accessToken, flow, deliveryId);
  await assertTracking(accessToken, flow, rowNumber, "FAILED", 1);

  const recovered = await submit(payload, key);
  assert(recovered.clickUpStatus === "DELIVERED" && recovered.clickUpTaskId, `staging_${flow}_recovery_failed`);
  assert(recovered.sheetsRowReference === failed.sheetsRowReference, `staging_${flow}_record_row_changed_on_replay`);
  const finalTracking = await assertTracking(accessToken, flow, rowNumber, "DELIVERED", 2);
  assert(finalTracking.taskId === recovered.clickUpTaskId, `staging_${flow}_task_reference_mismatch`);
  assert(finalTracking.source === `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`, `staging_${flow}_synthetic_marker_missing`);

  const replay = await submit(payload, key);
  assert(!replay.created && replay.clickUpStatus === "DELIVERED", `staging_${flow}_replay_not_idempotent`);
  assert(replay.clickUpTaskId === recovered.clickUpTaskId, `staging_${flow}_replay_task_changed`);

  const taskShape = clickUpTaskShape(flow, { aggregate_id: recovered.id, id: deliveryId }, payload);
  const task = await readJson(`https://api.clickup.com/api/v2/task/${encodeURIComponent(recovered.clickUpTaskId)}`, {
    headers: { Authorization: env.CLICKUP_API_TOKEN }, signal: AbortSignal.timeout(15000)
  }, `staging_${flow}_task_verify`);
  assert(task.name === taskShape.name, `staging_${flow}_task_name_mismatch`);
  assert(String(task.list?.id || task.list_id || "") === CONTACT_STAGING_TARGETS.clickUpContactListId, `staging_${flow}_task_destination_mismatch`);
  assert(typeof task.description === "string" && task.description.includes(`${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${aggregateType}`), `staging_${flow}_task_synthetic_marker_missing`);

  safeLog("staging_flow_delivered", {
    flow,
    recordId: recovered.id,
    deliveryId,
    sheetsRowReference: recovered.sheetsRowReference,
    clickUpTaskId: recovered.clickUpTaskId,
    failureRecovered: true,
    replayIdempotent: true
  });
  return { flow, key, marker, recordId: recovered.id, deliveryId, taskId: recovered.clickUpTaskId, rowNumber };
};

const run = async () => {
  const { mode, confirmation } = parseArgs(process.argv.slice(2));
  assert(["inspect", "deliver"].includes(mode), "staging_mode_must_be_inspect_or_deliver");
  if (mode === "deliver") assert(confirmation === CONTACT_TALENT_STAGING_CONFIRMATION, "staging_write_confirmation_required");

  const env = await readEnv();
  validateConfig(env, mode);
  assert(env.ONBOARDING_ENABLED === "false", "onboarding_must_remain_disabled");

  const accessToken = await verifyDestinations(env);
  safeLog("direct_staging_destinations_verified", {
    spreadsheetId: CONTACT_STAGING_SPREADSHEET_ID,
    clickUpListId: CONTACT_STAGING_TARGETS.clickUpContactListId,
    mode
  });
  if (mode === "inspect") return;

  const runId = randomUUID();
  const runEnv = {
    ...env,
    SUBMISSIONS_ENABLED: "true",
    INTEGRATIONS_ENABLED: "true",
    GOOGLE_SHEETS_ENABLED: "true",
    CLICKUP_ENABLED: "true"
  };
  const { store } = createStore(runEnv);
  const flows = [
    { flow: "contact", marker: `${runId}:contact` },
    { flow: "talent", marker: `${runId}:talent` }
  ];
  const cleanup = flows.map(({ flow, marker }) => ({
    flow,
    sourceMarker: marker,
    key: `${IDENTITY_PREFIX}:${runId}:${flow}`
  }));
  let resultError = null;

  try {
    const completed = [];
    for (const { flow, marker } of flows) {
      completed.push(await deliverFlow({ store, accessToken, flow, marker, runId, env: runEnv }));
    }
    safeLog("direct_staging_homologation_passed", {
      runId,
      flows: completed.map(({ flow, recordId, deliveryId, taskId, rowNumber }) => ({ flow, recordId, deliveryId, taskId, rowNumber })),
      concurrentWrites: false
    });
  } catch (error) {
    resultError = error;
  } finally {
    let cleanupFailed = false;
    for (const item of cleanup) {
      try {
        await cleanupFlow({ env: runEnv, accessToken, ...item });
        safeLog("direct_staging_synthetic_cleanup_passed", { flow: item.flow });
      } catch (error) {
        cleanupFailed = true;
        safeLog("direct_staging_synthetic_cleanup_blocked", {
          flow: item.flow,
          code: error instanceof Error && /^[a-z0-9_-]+$/i.test(error.message) ? error.message : "cleanup_failed"
        });
      }
    }
    if (cleanupFailed && !resultError) resultError = new Error("staging_synthetic_cleanup_incomplete");
  }

  if (resultError) throw resultError;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await run();
  } catch (error) {
    const code = error instanceof Error && /^[a-z0-9_-]+$/i.test(error.message) ? error.message : "direct_staging_runner_failed";
    safeLog("direct_staging_blocked", { code });
    process.exitCode = 1;
  }
}
