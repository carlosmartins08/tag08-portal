import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// This fallback is only the loopback-only Docker database declared in compose.yaml.
// Any staging or production environment must provide DATABASE_URL explicitly.
const databaseUrl = process.env.DATABASE_URL?.trim() || "postgresql://tag08:tag08_local_only@127.0.0.1:5432/tag08";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});
const runId = `OUTBOX_TEST:${randomUUID()}`;
const ids = [];

const runWorker = (extraEnv = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server/integrationWorker.mjs"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        INTEGRATIONS_ENABLED: "true",
        GOOGLE_SHEETS_ENABLED: "true",
        CLICKUP_ENABLED: "true",
        INTEGRATION_MOCK_MODE: "true",
        ...extraEnv
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(output) : reject(new Error(output || `worker exited ${code}`)));
  });

const createDelivery = async ({ target = "GOOGLE_SHEETS", status = "PENDING", processingStartedAt = null }) => {
  const id = randomUUID();
  ids.push(id);
  await pool.query(
    `INSERT INTO integration_deliveries
      (id, idempotency_key, target, aggregate_type, aggregate_id, payload, status, attempts, next_attempt_at, processing_started_at)
     VALUES ($1, $2, $3::"DeliveryTarget", 'outbox_verification', $1, $4::jsonb, $5::"DeliveryStatus", 0, NOW() - INTERVAL '1 second', $6)`,
    [id, `${runId}:${id}`, target, JSON.stringify({ runId, synthetic: true }), status, processingStartedAt]
  );
  return id;
};

const delivery = async (id) => (await pool.query("SELECT * FROM integration_deliveries WHERE id = $1", [id])).rows[0];

try {
  const successfulId = await createDelivery({});
  await runWorker({ INTEGRATION_DELIVERY_ID: successfulId });
  let successful = await delivery(successfulId);
  assert.equal(successful.status, "DELIVERED", "successful delivery was not marked delivered");
  assert.equal(successful.attempts, 1, "successful delivery attempt count is invalid");
  assert.equal(successful.external_reference, `mock:google_sheets:${successfulId}`, "external reference was not persisted");

  await runWorker({ INTEGRATION_DELIVERY_ID: successfulId });
  successful = await delivery(successfulId);
  assert.equal(successful.attempts, 1, "already delivered entry was processed again");

  const timeoutId = await createDelivery({ target: "CLICKUP" });
  await runWorker({ INTEGRATION_DELIVERY_ID: timeoutId, INTEGRATION_MOCK_FAILURE: "timeout" });
  let timedOut = await delivery(timeoutId);
  assert.equal(timedOut.status, "FAILED", "timeout was not retried through the outbox");
  assert.equal(timedOut.attempts, 1, "timeout attempt count is invalid");
  assert.equal(timedOut.last_error_code, "integration_mock_timeout", "timeout code is not traceable");

  await pool.query("UPDATE integration_deliveries SET next_attempt_at = NOW() - INTERVAL '1 second' WHERE id = $1", [timeoutId]);
  await runWorker({ INTEGRATION_DELIVERY_ID: timeoutId });
  timedOut = await delivery(timeoutId);
  assert.equal(timedOut.status, "DELIVERED", "retry did not deliver the entry");
  assert.equal(timedOut.attempts, 2, "retry did not preserve attempt history");

  const stalledId = await createDelivery({ status: "PROCESSING", processingStartedAt: new Date(Date.now() - 1_000_000) });
  await runWorker({ INTEGRATION_DELIVERY_ID: stalledId, INTEGRATION_PROCESSING_LEASE_SECONDS: "60" });
  const stalled = await delivery(stalledId);
  assert.equal(stalled.status, "DELIVERED", "expired lease was not reclaimed and delivered");
  assert.equal(stalled.attempts, 1, "reclaimed delivery should be claimed once after recovery");

  console.log(JSON.stringify({ event: "outbox_verification_passed", runId }));
} finally {
  if (ids.length) {
    await pool.query("DELETE FROM integration_deliveries WHERE id = ANY($1::text[])", [ids]);
  }
  await pool.end();
}
