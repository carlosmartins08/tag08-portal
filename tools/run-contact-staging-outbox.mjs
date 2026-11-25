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

export const parseStagingRunnerArgs = (args) => {
  const values = Object.fromEntries(args.filter((arg) => arg.startsWith("--") && arg.includes("="))
    .map((arg) => { const [key, ...rest] = arg.slice(2).split("="); return [key, rest.join("=")]; }));
  const flow = values.flow || null;
  assert(flow === null || Object.hasOwn(TAB_BY_FLOW, flow), "staging_flow_invalid");
  return { mode: values.mode || "inspect", confirmation: values.confirm || "", flow };
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

export const deriveStagingIdentity = (aggregateType, idempotencyKey) => ({
  recordId: `rec_${stableId(`${aggregateType}\0${idempotencyKey}`)}`,
  deliveryId: `del_${stableId(`${aggregateType}\0${idempotencyKey}\0GOOGLE_SHEETS`)}`
});

const assertStagingTarget = (spreadsheetId) => {
  assert(spreadsheetId === CONTACT_STAGING_SPREADSHEET_ID, "staging_sheet_mismatch");
};

const assertKnownFlow = (flow) => {
  assert(Object.prototype.hasOwnProperty.call(TAB_BY_FLOW, flow), "staging_flow_invalid");
};

export const findStagingRowNumbers = async ({
  accessToken, flow, deliveryId, spreadsheetId = CONTACT_STAGING_SPREADSHEET_ID, readValues = sheetValues
}) => {
  assertStagingTarget(spreadsheetId);
  assertKnownFlow(flow);
  const tab = TAB_BY_FLOW[flow];
  const ids = await readValues(accessToken, `${tab}!A2:A`);
  return ids.flatMap((row, index) => row?.[0] === deliveryId ? [index + 2] : []);
};

const readStagingRow = async ({ accessToken, flow, rowNumber, readValues = sheetValues }) => {
  assertKnownFlow(flow);
  const tab = TAB_BY_FLOW[flow];
  const rows = await readValues(accessToken, `${tab}!A${rowNumber}:${LAST_COLUMN_BY_FLOW[flow]}${rowNumber}`);
  return rows[0] || [];
};

const clearSyntheticRow = async (accessToken, flow, rowNumber, spreadsheetId = CONTACT_STAGING_SPREADSHEET_ID) => {
  assertStagingTarget(spreadsheetId);
  assertKnownFlow(flow);
  const tab = TAB_BY_FLOW[flow];
  const range = encodeURIComponent(`${tab}!A${rowNumber}:${LAST_COLUMN_BY_FLOW[flow]}${rowNumber}`);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`, {
    method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: "{}", signal: AbortSignal.timeout(15000)
  }).catch(() => null);
  assert(response?.ok, `staging_cleanup_${flow}_row_clear_failed`);
};

export const cleanupSyntheticStagingRecord = async ({
  accessToken, flow, key, sourceMarker, spreadsheetId = CONTACT_STAGING_SPREADSHEET_ID,
  readValues = sheetValues, clearRow = clearSyntheticRow
}) => {
  assertStagingTarget(spreadsheetId);
  assertKnownFlow(flow);
  assert(typeof sourceMarker === "string" && sourceMarker.length > 0, "staging_cleanup_marker_missing");
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const { recordId, deliveryId } = deriveStagingIdentity(aggregateType, key);
  const expectedSource = `${CONTACT_TALENT_STAGING_SYNTHETIC_MARKER}:${sourceMarker}`;
  const findRows = () => findStagingRowNumbers({ accessToken, flow, deliveryId, spreadsheetId, readValues });
  let clearedRowNumber;

  // Re-locate immediately before clearing; never trust the append response's row number.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const matches = await findRows();
    assert(matches.length > 0, `staging_cleanup_${flow}_row_missing`);
    assert(matches.length === 1, `staging_cleanup_${flow}_row_ambiguous`);
    const rowNumber = matches[0];
    const row = await readStagingRow({ accessToken, flow, rowNumber, readValues });
    if (row[0] !== deliveryId) continue;
    assert(row[1] === recordId, `staging_cleanup_${flow}_identity_mismatch`);
    assert(row[SOURCE_COLUMN_BY_FLOW[flow].charCodeAt(0) - 65] === expectedSource, `staging_cleanup_${flow}_marker_mismatch`);

    const currentMatches = await findRows();
    assert(currentMatches.length > 0, `staging_cleanup_${flow}_row_missing`);
    assert(currentMatches.length === 1, `staging_cleanup_${flow}_row_ambiguous`);
    if (currentMatches[0] !== rowNumber) continue;

    const confirmedRow = await readStagingRow({ accessToken, flow, rowNumber: currentMatches[0], readValues });
    if (confirmedRow[0] !== deliveryId) continue;
    assert(confirmedRow[1] === recordId, `staging_cleanup_${flow}_identity_mismatch`);
    assert(confirmedRow[SOURCE_COLUMN_BY_FLOW[flow].charCodeAt(0) - 65] === expectedSource, `staging_cleanup_${flow}_marker_mismatch`);

    await clearRow(accessToken, flow, currentMatches[0], spreadsheetId);
    const remaining = await findRows();
    assert(remaining.length === 0, `staging_cleanup_${flow}_delivery_id_remains`);
    const after = await readStagingRow({ accessToken, flow, rowNumber: currentMatches[0], readValues });
    assert(after.length === 0 || after.every((cell) => cell === ""), `staging_cleanup_${flow}_row_not_empty`);
    clearedRowNumber = currentMatches[0];
    break;
  }

  assert(clearedRowNumber, `staging_cleanup_${flow}_row_moved_repeatedly`);
  return { flow, deliveryId, recordId, rowNumber: clearedRowNumber, cleared: true };
};

const createStore = (env, fetchImpl = globalThis.fetch) => ({ store: createOperationalSubmissionStore({ env, fetchImpl }) });

const deliverFlow = async ({ store, accessToken, flow, marker, key }) => {
  const aggregateType = flow === "contact" ? "contact_lead" : "talent_application";
  const payload = flow === "contact" ? contactPayload(marker) : talentPayload(marker);
  const submit = flow === "contact" ? store.persistContactLead : store.persistTalentApplication;
  const first = await submitWithUnconfirmedSheetsAppendRecovery(submit, payload, key);
  const { recordId, deliveryId } = deriveStagingIdentity(aggregateType, key);
  assert(first.id === recordId, `staging_${flow}_record_identity_mismatch`);
  const matches = await findStagingRowNumbers({ accessToken, flow, deliveryId });
  assert(matches.length > 0, `staging_${flow}_row_missing`);
  assert(matches.length === 1, `staging_${flow}_row_duplicate`);
  const rowNumber = matches[0];
  const row = await readStagingRow({ accessToken, flow, rowNumber });
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
};

const run = async () => {
  const { mode, confirmation, flow } = parseStagingRunnerArgs(process.argv.slice(2));
  assert(["inspect", "deliver"].includes(mode), "staging_mode_must_be_inspect_or_deliver");
  if (mode === "deliver") assert(confirmation === CONTACT_TALENT_STAGING_CONFIRMATION, "staging_write_confirmation_required");
  const env = await readEnv();
  validateConfig(env, mode);
  assert(env.ONBOARDING_ENABLED === "false", "onboarding_must_remain_disabled");
  const accessToken = await verifyDestinations(env);
  safeLog("direct_staging_sheets_destinations_verified", { spreadsheetId: CONTACT_STAGING_SPREADSHEET_ID, mode, flow: flow || "all" });
  if (mode === "inspect") return;

  const runId = randomUUID();
  const runEnv = { ...env, SUBMISSIONS_ENABLED: "true", INTEGRATIONS_ENABLED: "true", GOOGLE_SHEETS_ENABLED: "true", CLICKUP_ENABLED: "false" };
  const appendAttempts = { contact: 0, talent: 0 };
  let activeFlow = null;
  const { store } = createStore(runEnv, (url, init) => {
    if (activeFlow && init?.method === "POST" && String(url).includes("sheets.googleapis.com/v4/spreadsheets/") && String(url).includes(":append?")) {
      appendAttempts[activeFlow] += 1;
    }
    return globalThis.fetch(url, init);
  });
  const availableFlows = [
    { flow: "contact", marker: `${runId}:contact` }, { flow: "talent", marker: `${runId}:talent` }
  ];
  const flows = flow ? availableFlows.filter((item) => item.flow === flow) : availableFlows;
  const cleanupTargets = [];
  let resultError = null;
  try {
    for (const { flow, marker } of flows) {
      activeFlow = flow;
      const key = `${IDENTITY_PREFIX}:${runId}:${flow}`;
      cleanupTargets.push({ flow, sourceMarker: marker, key });
      await deliverFlow({ store, accessToken, flow, marker, key });
      safeLog("direct_staging_append_attempts_counted", { flow, appendAttempts: appendAttempts[flow] });
      activeFlow = null;
    }
    safeLog("direct_staging_sheets_only_homologation_passed", { runId, flows: flows.map(({ flow }) => flow) });
  } catch (error) {
    resultError = error;
    if (activeFlow) {
      safeLog("direct_staging_flow_blocked", {
        flow: activeFlow,
        appendAttempts: appendAttempts[activeFlow],
        code: error instanceof Error && /^[a-z0-9_-]+$/i.test(error.message) ? error.message : "staging_flow_failed"
      });
    }
  } finally {
    let cleanupFailed = false;
    for (const item of cleanupTargets) {
      try {
        const cleanup = await cleanupSyntheticStagingRecord({ accessToken, ...item });
        safeLog("direct_staging_synthetic_cleanup_passed", cleanup);
      } catch (error) {
        cleanupFailed = true;
        const aggregateType = item.flow === "contact" ? "contact_lead" : "talent_application";
        const identity = deriveStagingIdentity(aggregateType, item.key);
        safeLog("direct_staging_synthetic_cleanup_blocked", {
          flow: item.flow,
          ...identity,
          sourceMarker: item.sourceMarker,
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
