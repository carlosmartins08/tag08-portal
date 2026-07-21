import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for retention verification.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

const runId = `RETENTION_TEST:${randomUUID()}`;
const fixtures = [];

const runRetentionWorker = (aggregateId) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server/retentionWorker.mjs"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        RETENTION_AGGREGATE_ID: aggregateId
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(output) : reject(new Error(output || `retention worker exited ${code}`)));
  });

const insertFixture = async (table, aggregateType) => {
  const id = randomUUID();
  fixtures.push({ id, table, aggregateType });
  const common = [
    id,
    `${runId}:${aggregateType}:${id}`,
    JSON.stringify({ synthetic: true, runId }),
    "STAGING_TEST",
    "staging-retention@example.test",
    "pt",
    "staging-test",
    "STAGING_TEST"
  ];

  if (table === "contact_leads") {
    await pool.query(
      `INSERT INTO contact_leads
        (id, idempotency_key, payload, name, email, whatsapp, locale, consent_version, source, status, retention_until)
       VALUES ($1, $2, $3::jsonb, $4, $5, '+5500000000000', $6, $7, $8, 'ACCEPTED'::"SubmissionStatus", NOW() - INTERVAL '1 day')`,
      common
    );
  } else if (table === "talent_applications") {
    await pool.query(
      `INSERT INTO talent_applications
        (id, idempotency_key, payload, name, email, vacancy_id, locale, consent_version, source, status, retention_until)
       VALUES ($1, $2, $3::jsonb, $4, $5, 'staging-retention-vacancy', $6, $7, $8, 'ACCEPTED'::"SubmissionStatus", NOW() - INTERVAL '1 day')`,
      common
    );
  } else {
    await pool.query(
      `INSERT INTO onboarding_submissions
        (id, idempotency_key, payload, company_name, email, locale, schema_version, source, status, retention_until)
       VALUES ($1, $2, $3::jsonb, 'TAG08 STAGING TEST', $4, $5, 1, $6, 'ACCEPTED'::"SubmissionStatus", NOW() - INTERVAL '1 day')`,
      [id, `${runId}:${aggregateType}:${id}`, JSON.stringify({ synthetic: true, runId }), "staging-retention@example.test", "pt", "STAGING_TEST"]
    );
  }

  return id;
};

const count = async (table, id) => (await pool.query(`SELECT count(*)::int AS count FROM ${table} WHERE id = $1`, [id])).rows[0].count;

try {
  for (const target of [
    { table: "contact_leads", aggregateType: "contact_lead" },
    { table: "talent_applications", aggregateType: "talent_application" },
    { table: "onboarding_submissions", aggregateType: "onboarding_submission" }
  ]) {
    const id = await insertFixture(target.table, target.aggregateType);
    await runRetentionWorker(id);
    assert.equal(await count(target.table, id), 0, `${target.table} retained an expired synthetic record`);
    const audit = await pool.query(
      "SELECT count(*)::int AS count FROM retention_audits WHERE aggregate_type = $1 AND aggregate_id = $2 AND action = 'retention_deleted'",
      [target.aggregateType, id]
    );
    assert.equal(audit.rows[0].count, 1, `${target.table} did not record the technical retention audit`);
  }

  const protectedId = await insertFixture("contact_leads", "contact_lead");
  const deliveryId = randomUUID();
  await pool.query(
    `INSERT INTO integration_deliveries
      (id, idempotency_key, target, aggregate_type, aggregate_id, payload, status, attempts, next_attempt_at, processing_started_at)
     VALUES ($1, $2, 'GOOGLE_SHEETS'::"DeliveryTarget", 'contact_lead', $3, $4::jsonb, 'PROCESSING'::"DeliveryStatus", 1, NOW(), NOW())`,
    [deliveryId, `${runId}:processing:${deliveryId}`, protectedId, JSON.stringify({ synthetic: true, runId })]
  );
  await runRetentionWorker(protectedId);
  assert.equal(await count("contact_leads", protectedId), 1, "retention deleted a record with an active delivery lease");

  console.log(JSON.stringify({ event: "retention_verification_passed", fixtures: 4 }));
} finally {
  const ids = fixtures.map(({ id }) => id);
  if (ids.length) {
    await pool.query("DELETE FROM integration_deliveries WHERE aggregate_id = ANY($1::text[])", [ids]);
    await pool.query("DELETE FROM retention_audits WHERE aggregate_id = ANY($1::text[])", [ids]);
    await pool.query("DELETE FROM contact_leads WHERE id = ANY($1::text[])", [ids]);
    await pool.query("DELETE FROM talent_applications WHERE id = ANY($1::text[])", [ids]);
    await pool.query("DELETE FROM onboarding_submissions WHERE id = ANY($1::text[])", [ids]);
  }
  await pool.end();
}
