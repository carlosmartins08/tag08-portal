import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";
import { evaluateIntegrationPreflight } from "./preflight-integrations.mjs";
import {
  buildOneContactWorkerEnvironment,
  CONTACT_STAGING_CONFIRMATION,
  CONTACT_STAGING_RETRY_ERROR,
  validateContactDeliveryRows
} from "./contactStagingGate.mjs";

const { Pool } = pg;
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STAGING_ENV_FILE = path.join(PROJECT_ROOT, ".env.staging.local");
const MOCK_FAILURE_CODE = "contact_staging_transient";
const DELIVERY_SQL = `
  SELECT id, target::text AS target, aggregate_type, aggregate_id, status::text AS status,
         attempts, next_attempt_at, last_error_code, external_reference, payload
  FROM integration_deliveries
  WHERE aggregate_type = 'contact_lead' AND aggregate_id = $1
  ORDER BY target`;

const parseArgs = (args) => {
  const values = Object.fromEntries(args.filter((arg) => arg.startsWith("--") && arg.includes("="))
    .map((arg) => { const [key, ...value] = arg.slice(2).split("="); return [key, value.join("=")]; }));
  const flags = new Set(args.filter((arg) => arg.startsWith("--") && !arg.includes("=")));
  return { aggregateId: values["aggregate-id"], mode: values.mode, confirmation: values["confirm-staging-write"], flags };
};

const safeLog = (event, details = {}) => console.log(JSON.stringify({ event, ...details }));
const assert = (condition, code) => { if (!condition) throw new Error(code); };

const readStagingEnv = async () => {
  let text;
  try { text = await readFile(STAGING_ENV_FILE); } catch { throw new Error("contact_staging_env_file_missing"); }
  return dotenv.parse(text);
};

const validateConfig = (env, mode) => {
  const result = evaluateIntegrationPreflight(env, "contact", mode);
  assert(result.missing.length === 0 && result.invalid.length === 0, "contact_staging_preflight_failed");
  assert(env.INTEGRATIONS_ENABLED === "false" && env.GOOGLE_SHEETS_ENABLED === "false" && env.CLICKUP_ENABLED === "false",
    "contact_staging_persistent_integrations_must_remain_disabled");
  if (mode === "deliver") {
    assert(Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()), "contact_staging_sheets_credential_missing");
    assert(Boolean(env.CLICKUP_API_TOKEN?.trim()), "contact_staging_clickup_credential_missing");
    assert(!/replace_me|placeholder/i.test(env.CLICKUP_API_TOKEN), "contact_staging_clickup_credential_placeholder");
  }
};

const getDeliveries = async (pool, aggregateId) => {
  const { rows } = await pool.query(DELIVERY_SQL, [aggregateId]);
  return rows;
};

const sanitizedWorkerLog = (output) => output.split(/\r?\n/).flatMap((line) => {
  try {
    const item = JSON.parse(line);
    const allowed = ["event", "deliveryId", "target", "aggregateType", "count", "scoped", "code", "retryScheduled", "terminal"];
    return [Object.fromEntries(Object.entries(item).filter(([key]) => allowed.includes(key)))];
  } catch { return []; }
});

const runWorker = (env, delivery, mode) => {
  const childEnv = buildOneContactWorkerEnvironment(env, delivery.target, delivery.id, mode);
  const child = spawnSync(process.execPath, [path.join(PROJECT_ROOT, "server", "integrationWorker.mjs")], {
    cwd: PROJECT_ROOT,
    env: childEnv,
    encoding: "utf8",
    windowsHide: true
  });
  if (child.error || child.status !== 0) {
    safeLog("contact_staging_worker_exit", {
      deliveryId: delivery.id,
      target: delivery.target,
      exitCode: child.status ?? null,
      workerEvents: sanitizedWorkerLog(`${child.stdout || ""}\n${child.stderr || ""}`)
    });
    throw new Error("contact_staging_worker_failed");
  }
  safeLog("contact_staging_worker_finished", {
    deliveryId: delivery.id,
    target: delivery.target,
    mode,
    workerEvents: sanitizedWorkerLog(child.stdout || "")
  });
};

const waitUntilRetryable = async (row, maxWaitSeconds = 30) => {
  const waitMs = new Date(row.next_attempt_at).getTime() - Date.now();
  assert(Number.isFinite(waitMs) && waitMs <= maxWaitSeconds * 1000, "contact_staging_retry_not_due_within_safe_window");
  if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
};

const validateInitialRows = (rows, aggregateId) => {
  const byTarget = validateContactDeliveryRows(rows, aggregateId);
  for (const row of byTarget.values()) {
    assert(row.status === "PENDING" && Number(row.attempts) === 0 && !row.external_reference,
      "contact_staging_expected_new_pending_deliveries");
  }
  return byTarget;
};

const run = async () => {
  const { aggregateId, mode, confirmation } = parseArgs(process.argv.slice(2));
  assert(/^[A-Za-z0-9_-]{8,80}$/.test(aggregateId || ""), "contact_staging_aggregate_id_required");
  assert(["inspect", "simulate-failure", "deliver"].includes(mode), "contact_staging_mode_must_be_inspect_simulate-failure_or_deliver");
  if (mode === "deliver") assert(confirmation === CONTACT_STAGING_CONFIRMATION, "contact_staging_write_confirmation_required");

  const env = await readStagingEnv();
  validateConfig(env, mode);

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 10000
  });
  try {
    let rows = await getDeliveries(pool, aggregateId);
    let byTarget = validateContactDeliveryRows(rows, aggregateId);
    if (mode === "inspect") {
      safeLog("contact_staging_delivery_inspection", {
        aggregateId,
        deliveries: [...byTarget.values()].map(({ id, target, status, attempts, external_reference }) => ({
          id, target, status, attempts, externalReferencePresent: Boolean(external_reference)
        }))
      });
      return;
    }

    if (mode === "simulate-failure") {
      validateInitialRows(rows, aggregateId);
      for (const delivery of byTarget.values()) runWorker(env, delivery, "simulate-failure");
      rows = await getDeliveries(pool, aggregateId);
      byTarget = validateContactDeliveryRows(rows, aggregateId, { requireState: { status: "FAILED", attempts: 1 } });
      for (const row of byTarget.values()) {
        assert(row.last_error_code === CONTACT_STAGING_RETRY_ERROR && !row.external_reference,
          "contact_staging_mock_failure_state_invalid");
      }
      safeLog("contact_staging_retry_failure_prepared", { aggregateId, deliveryCount: byTarget.size, externalCalls: 0 });
      return;
    }

    byTarget = validateContactDeliveryRows(rows, aggregateId, { requireState: { status: "FAILED", attempts: 1 } });
    for (const row of byTarget.values()) {
      assert(row.last_error_code === CONTACT_STAGING_RETRY_ERROR && !row.external_reference,
        "contact_staging_delivery_not_in_expected_mock_failed_state");
      await waitUntilRetryable(row);
      runWorker(env, row, "deliver");
      const afterDelivery = await getDeliveries(pool, aggregateId);
      const current = validateContactDeliveryRows(afterDelivery, aggregateId).get(row.target);
      assert(current.status === "DELIVERED" && Number(current.attempts) === 2 && Boolean(current.external_reference),
        "contact_staging_external_delivery_not_confirmed");
    }

    rows = await getDeliveries(pool, aggregateId);
    byTarget = validateContactDeliveryRows(rows, aggregateId, { requireState: { status: "DELIVERED", attempts: 2 } });
    for (const row of byTarget.values()) {
      const referenceBeforeReplay = row.external_reference;
      runWorker(env, row, "deliver");
      const replayed = validateContactDeliveryRows(await getDeliveries(pool, aggregateId), aggregateId).get(row.target);
      assert(Number(replayed.attempts) === 2 && replayed.external_reference === referenceBeforeReplay,
        "contact_staging_delivery_replay_was_not_idempotent");
    }
    safeLog("contact_staging_homologation_passed", {
      aggregateId,
      deliveries: [...byTarget.values()].map(({ id, target, status, attempts, external_reference }) => ({
        id, target, status, attempts, externalReference: external_reference
      }))
    });
  } finally {
    await pool.end();
  }
};

try {
  await run();
} catch (error) {
  const code = error instanceof Error && /^[a-z0-9_-]+$/i.test(error.message) ? error.message : "contact_staging_runner_failed";
  safeLog("contact_staging_runner_blocked", { code });
  process.exitCode = 1;
}
