import "dotenv/config";
import { createSign } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const MAX_BATCH_SIZE = 20;
const MAX_RETRY_SECONDS = 3600;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the integration worker.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

const toBase64Url = (value) => Buffer.from(value).toString("base64url");

const getGoogleAccessToken = async () => {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("google_service_account_not_configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = `${toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${toBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const assertion = `${unsignedToken}.${signer.sign(serviceAccount.private_key, "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  if (!response.ok) throw new Error("google_token_exchange_failed");
  return (await response.json()).access_token;
};

const appendToSheet = async (delivery) => {
  if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) throw new Error("google_sheets_not_configured");
  const tabs = {
    contact_lead: "Leads",
    onboarding_submission: "Onboarding",
    talent_application: "Talentos"
  };
  const tab = tabs[delivery.aggregate_type];
  if (!tab) throw new Error("google_sheet_tab_not_configured");

  const token = await getGoogleAccessToken();
  const range = encodeURIComponent(`${tab}!A:D`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [[delivery.id, delivery.aggregate_id, delivery.created_at, JSON.stringify(delivery.payload)]] })
    }
  );
  if (!response.ok) throw new Error("google_sheets_append_failed");
};

const createClickUpTask = async (delivery) => {
  const listId = delivery.aggregate_type === "talent_application"
    ? process.env.CLICKUP_TALENT_LIST_ID
    : process.env.CLICKUP_ONBOARDING_LIST_ID;
  if (!process.env.CLICKUP_API_TOKEN || !listId) throw new Error("clickup_not_configured");

  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: {
      Authorization: process.env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: `${delivery.aggregate_type}:${delivery.aggregate_id}`,
      description: JSON.stringify(delivery.payload),
      tags: ["tag08", delivery.aggregate_type]
    })
  });
  if (!response.ok) throw new Error("clickup_task_create_failed");
};

const claimDeliveries = async (client) => {
  const result = await client.query(
    `WITH candidates AS (
      SELECT id FROM integration_deliveries
      WHERE status IN ('PENDING'::"DeliveryStatus", 'FAILED'::"DeliveryStatus")
        AND next_attempt_at <= NOW()
      ORDER BY created_at
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE integration_deliveries d
    SET status = 'PROCESSING'::"DeliveryStatus", attempts = attempts + 1, updated_at = NOW()
    FROM candidates
    WHERE d.id = candidates.id
    RETURNING d.*`,
    [MAX_BATCH_SIZE]
  );
  return result.rows;
};

const markDelivered = (client, id) =>
  client.query(
    `UPDATE integration_deliveries
     SET status = 'DELIVERED'::"DeliveryStatus", delivered_at = NOW(), last_error_code = NULL, last_error_at = NULL, updated_at = NOW()
     WHERE id = $1`,
    [id]
  );

const markFailed = (client, delivery, code) => {
  const retrySeconds = Math.min(2 ** Math.min(Number(delivery.attempts), 12), MAX_RETRY_SECONDS);
  return client.query(
    `UPDATE integration_deliveries
     SET status = 'FAILED'::"DeliveryStatus", next_attempt_at = NOW() + ($2 * INTERVAL '1 second'), last_error_code = $3, last_error_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [delivery.id, retrySeconds, code]
  );
};

const processDelivery = async (delivery) => {
  if (process.env.INTEGRATIONS_ENABLED !== "true") return "disabled";
  if (delivery.target === "GOOGLE_SHEETS") await appendToSheet(delivery);
  if (delivery.target === "CLICKUP") await createClickUpTask(delivery);
  return "delivered";
};

const client = await pool.connect();
try {
  await client.query("BEGIN");
  const deliveries = await claimDeliveries(client);
  await client.query("COMMIT");

  for (const delivery of deliveries) {
    try {
      const outcome = await processDelivery(delivery);
      if (outcome === "delivered") await markDelivered(client, delivery.id);
      if (outcome === "disabled") {
        await client.query(`UPDATE integration_deliveries SET status = 'PENDING'::"DeliveryStatus", updated_at = NOW() WHERE id = $1`, [delivery.id]);
      }
    } catch (error) {
      await markFailed(client, delivery, error instanceof Error ? error.message : "integration_delivery_failed");
    }
  }
} finally {
  client.release();
  await pool.end();
}
