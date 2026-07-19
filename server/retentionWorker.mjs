import { randomUUID } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const BATCH_SIZE = 100;
const AGGREGATE_ID_FILTER = process.env.RETENTION_AGGREGATE_ID?.trim() || null;
const RETENTION_TABLES = [
  { aggregateType: "contact_lead", table: "contact_leads" },
  { aggregateType: "talent_application", table: "talent_applications" },
  { aggregateType: "onboarding_submission", table: "onboarding_submissions" }
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the retention worker.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

const purgeExpiredRecords = async (client, { aggregateType, table }) => {
  await client.query("BEGIN");

  try {
    // Table names are fixed locally; all runtime values remain parameterized.
    const expired = await client.query(
      `SELECT id FROM ${table}
       WHERE retention_until < NOW()
         AND NOT EXISTS (
           SELECT 1 FROM integration_deliveries
           WHERE aggregate_type = $1
             AND aggregate_id = ${table}.id
             AND status = 'PROCESSING'::"DeliveryStatus"
         )
         AND ($2::text IS NULL OR ${table}.id = $2)
       ORDER BY retention_until ASC
       LIMIT $3
       FOR UPDATE SKIP LOCKED`,
      [aggregateType, AGGREGATE_ID_FILTER, BATCH_SIZE]
    );

    for (const record of expired.rows) {
      await client.query(
        "DELETE FROM integration_deliveries WHERE aggregate_type = $1 AND aggregate_id = $2",
        [aggregateType, record.id]
      );
      await client.query(
        `INSERT INTO retention_audits (id, aggregate_type, aggregate_id, action)
         VALUES ($1, $2, $3, 'retention_deleted')`,
        [randomUUID(), aggregateType, record.id]
      );
      await client.query(`DELETE FROM ${table} WHERE id = $1`, [record.id]);
    }

    await client.query("COMMIT");
    return expired.rowCount ?? 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};

const client = await pool.connect();

try {
  const deleted = [];
  for (const target of RETENTION_TABLES) {
    deleted.push(await purgeExpiredRecords(client, target));
  }

  console.log(JSON.stringify({
    event: "retention_completed",
    deleted: deleted.reduce((total, count) => total + count, 0),
    scoped: Boolean(AGGREGATE_ID_FILTER)
  }));
} finally {
  client.release();
  await pool.end();
}
