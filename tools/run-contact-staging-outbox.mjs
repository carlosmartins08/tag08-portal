import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createOperationalSubmissionStore } from "../server/operationalSubmissionStore.mjs";
import { getGoogleSheetsAccessToken } from "../server/googleSheetsAuth.mjs";
import {
  CONTACT_STAGING_HEADERS, CONTACT_STAGING_SPREADSHEET_ID,
  CONTACT_TALENT_STAGING_CONFIRMATION, CONTACT_TALENT_STAGING_SYNTHETIC_MARKER,
  TALENT_STAGING_HEADERS
} from "./contactStagingGate.mjs";
import { evaluateIntegrationPreflight } from "./preflight-integrations.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(PROJECT_ROOT, ".env.staging.local");
const TAB_BY_FLOW = Object.freeze({ contact: "Leads", talent: "Talentos" });
const LAST_COLUMN_BY_FLOW = Object.freeze({ contact: "W", talent: "X" });
const SOURCE_COLUMN_BY_FLOW = Object.freeze({ contact: "O", talent: "P" });
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
  assert(env.GOOGLE_SHEETS_SPREADSHEET_ID === CONTACT_STAGING_SPREADSHEET_ID, "staging_sheet_mismatch");
  assert(env.CLICKUP_ENABLED === "false" && env.ONBOARDING_ENABLED === "false", "external_or_onboarding_delivery_must_remain_disabled");
  if (mode === "deliver") assert(Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()), "staging_sheets_credential_missing");
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
    { headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(15000) }, "staging_sheets_identity"
  );
  assert(spreadsheet.spreadsheetId === CONTACT_STAGING_SPREADSHEET_ID, "staging_sheets_id_mismatch");
  assert(spreadsheet.properties?.title === "TAG08 - Operacao Staging", "staging_sheets_title_mismatch");
  const tabs = new Set((spreadsheet.sheets || []).map(({ properties }) => properties?.title));
  assert(tabs.has("Leads") && tabs.has("Talentos"), "staging_sheets_tabs_missing");
  const [contactHeaders, talentHeaders] = await Promise.all([
    sheetValues(accessToken, "Leads!A1:W1"), sheetValues(accessToken, "Talentos!A1:X1")
  ]);
  assert(JSON.stringify(contactHeaders[0] || []) === JSON.stringify(CONTACT_STAGING_HEADERS), "staging_contact_headers_mismatch");
  assert(JSON.stringify(talentHeaders[0] || []) === JSON.stringify(TALENT_STAGING_HEADERS), "staging_talent_headers_mismatch");
  return accessToken;
};

const contactPayload = (marker) => ({
  name: "TAG08 QA Contact Synthetic", company: "TAG08 QA Synthetic", whatsapp: "+5500000000000",
  email: `contact-${marker.replace(/:/g, "-")}@synthetic.invalid`, service: "strategy", stage: "synthetic-test",
  requestType: "new_project", serviceInterests: ["strategy"], needsServiceGuidance: false,
  message: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}; NAO ATENDER NEM APROVAR.`, consent: true,
  consentVersion: "staging-synthetic-v1", locale: "pt", source: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`,
  utm: { source: "synthetic", medium: "", campaign: "", content: "", term: "" }
});

const talentPayload = (marker) => ({
  contractVersion: 2, interestAreas: ["design", "technology_development"], name: "TAG08 QA Talent Synthetic",
  email: `talent-${marker.replace(/:/g, "-")}@synthetic.invalid`, phone: "+5500000000000", linkedin: "", resumeUrl: "", portfolio: "",
  experienceSummary: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}`, availability: "synthetic-test",
  motivation: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER} ${marker}`, relevantProjects: "Synthetic project only",
  relevantExperience: "", consent: true, consentVersion: "staging-synthetic-v2", locale: "pt",
  source: `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`,
  utm: { source: "synthetic", medium: "", campaign: "", content: "", term: "" }
});

const deriveIdentity = (aggregateType, idempotencyKey) => ({
  recordId: `rec_${stableId(`${aggregateType}\0${idempotencyKey}`)}`,
  deliveryId: `del_${stableId(`${aggregateType}\0${idempotencyKey}\0GOOGLE_SHEETS`)}`
});

const findRowNumber = async (accessToken, flow, deliveryId) => {
  const tab = TAB_BY_FLOW[flow];
  const ids = await sheetValues(accessToken, `${tab}!A2:A${MAX_ROWS_TO_SCAN}`);
  const matches = ids.flatMap((row, index) => row?.[0] === deliveryId ? [index + 2] : []);
  if (matches.length === 0) throw new Error(`staging_${flow}_row_missing`);
  assert(matches.length === 1, `staging_${flow}_row_duplicate`);
  return matches[0];
};

const readRow = async (accessToken, flow, rowNumber) => {
  const tab = TAB_BY_FLOW[flow];
  const rows = await sheetValues(accessToken, `${tab}!A${rowNumber}:${LAST_COLUMN_BY_FLOW[flow]}${rowNumber}`);
  return rows[0] || [];
};

const clearSyntheticRow = async (accessToken, flow, rowNumber) => {
  const tab = TAB_BY_FLOW[flow];
  const range = encodeURIComponent(`${tab}!A${rowNumber}:${LAST_COLUMN_BY_FLOW[flow]}${rowNumber}`);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONTACT_STAGING_SPREADSHEET_ID}/values/${range}:clear`, {
    method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: "{}", signal: AbortSignal.timeout(15000)
  }).catch(() => null);
  assert(response?.ok, `staging_cleanup_${flow}_row_clear_failed`);
};

const cleanupFlow = async ({ accessToken, flow, key, sourceMarker }) => {
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const { recordId, deliveryId } = deriveIdentity(aggregateType, key);
  const rowNumber = await findRowNumber(accessToken, flow, deliveryId).catch((error) => {
    if (error?.message === `staging_${flow}_row_missing`) return null;
    throw error;
  });
  if (!rowNumber) return;
  const row = await readRow(accessToken, flow, rowNumber);
  assert(row[0] === deliveryId && row[1] === recordId, `staging_cleanup_${flow}_identity_mismatch`);
  assert(row[SOURCE_COLUMN_BY_FLOW[flow].charCodeAt(0) - 65] === `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${sourceMarker}`, `staging_cleanup_${flow}_marker_mismatch`);
  await clearSyntheticRow(accessToken, flow, rowNumber);
  const after = await readRow(accessToken, flow, rowNumber);
  assert(after.length === 0 || after.every((cell) => cell === ""), `staging_cleanup_${flow}_row_not_empty`);
};

const createStore = (env) => ({ store: createOperationalSubmissionStore({ env }) });

const deliverFlow = async ({ store, accessToken, flow, marker, runId }) => {
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const key = `${IDENTITY_PREFIX}:${runId}:${flow}`;
  const payload = flow === "contact" ? contactPayload(marker) : talentPayload(marker);
  const submit = flow === "contact" ? store.persistContactLead : store.persistTalentApplication;
  const first = await submitWithUnconfirmedSheetsAppendRecovery(submit, payload, key);
  const { deliveryId } = deriveIdentity(aggregateType, key);
  const rowNumber = await findRowNumber(accessToken, flow, deliveryId);
  const row = await readRow(accessToken, flow, rowNumber);
  assert(row[0] === deliveryId && row[1] === first.id, `staging_${flow}_identity_mismatch`);
  assert(row[SOURCE_COLUMN_BY_FLOW[flow].charCodeAt(0) - 65] === `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${marker}`, `staging_${flow}_marker_missing`);
  const metadataStart = 4 + (flow === "contact" ? CONTACT_STAGING_HEADERS.length - 4 - 7 : TALENT_STAGING_HEADERS.length - 4 - 7);
  assert(row[metadataStart + 1] === "NOT_ROUTED", `staging_${flow}_legacy_route_not_disabled`);
  assert(!row[metadataStart + 2], `staging_${flow}_legacy_task_id_present`);
  assert(Number(row[metadataStart + 3] || 0) === 0, `staging_${flow}_legacy_attempts_present`);

  const replay = await submit(payload, key);
  assert(replay.created === false && replay.id === first.id, `staging_${flow}_replay_not_idempotent`);
  assert(replay.sheetsRowReference === first.sheetsRowReference, `staging_${flow}_row_changed_on_replay`);
  safeLog("direct_staging_sheets_only_flow_passed", {
    flow, recordId: first.id, deliveryId, sheetsRowReference: first.sheetsRowReference,
    rowNumber, replayIdempotent: true, clickUp: "not_used"
  });
  return { flow, key, marker };
};

const run = async () => {
  const { mode, confirmation } = parseArgs(process.argv.slice(2));
  assert(["inspect", "deliver"].includes(mode), "staging_mode_must_be_inspect_or_deliver");
  if (mode === "deliver") assert(confirmation === CONTACT_TALENT_STAGING_CONFIRMATION, "staging_write_confirmation_required");
  const env = await readEnv();
  validateConfig(env, mode);
  assert(env.ONBOARDING_ENABLED === "false", "onboarding_must_remain_disabled");
  const accessToken = await verifyDestinations(env);
  safeLog("direct_staging_sheets_destinations_verified", { spreadsheetId: CONTACT_STAGING_SPREADSHEET_ID, mode });
  if (mode === "inspect") return;

  const runId = randomUUID();
  const runEnv = { ...env, SUBMISSIONS_ENABLED: "true", INTEGRATIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true", CLICKUP_ENABLED: "false" };
  const { store } = createStore(runEnv);
  const flows = [
    { flow: "contact", marker: `${runId}:contact` }, { flow: "talent", marker: `${runId}:talent` }
  ];
  const created = flows.map(({ flow, marker }) => ({ flow, marker, key: `${IDENTITY_PREFIX}:${runId}:${flow}` }));
  let resultError = null;
  try {
    for (const { flow, marker } of flows) await deliverFlow({ store, accessToken, flow, marker, runId });
    safeLog("direct_staging_sheets_only_homologation_passed", { runId, flows: flows.map(({ flow }) => flow) });
  } catch (error) {
    resultError = error;
  } finally {
    let cleanupFailed = false;
    for (const item of created) {
      try {
        await cleanupFlow({ accessToken, ...item });
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
  try { await run(); }
  catch (error) {
    const code = error instanceof Error && /^[a-z0-9_-]+$/i.test(error.message) ? error.message : "direct_staging_runner_failed";
    safeLog("direct_staging_blocked", { code });
    process.exitCode = 1;
  }
}
