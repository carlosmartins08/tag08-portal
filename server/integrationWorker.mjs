import { createSign } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const MAX_BATCH_SIZE = 20;
const MAX_RETRY_SECONDS = 3600;
const MAX_CLICKUP_LOOKUP_PAGES = 100;
const PROCESSING_LEASE_SECONDS = Number.parseInt(process.env.INTEGRATION_PROCESSING_LEASE_SECONDS || "900", 10);
const DELIVERY_ID_FILTER = process.env.INTEGRATION_DELIVERY_ID?.trim() || null;
const MOCK_INTEGRATION_MODE = process.env.INTEGRATION_MOCK_MODE === "true";
const MOCK_INTEGRATION_FAILURE = process.env.INTEGRATION_MOCK_FAILURE?.trim() || null;

if (!Number.isSafeInteger(PROCESSING_LEASE_SECONDS) || PROCESSING_LEASE_SECONDS < 60) {
  throw new Error("INTEGRATION_PROCESSING_LEASE_SECONDS must be an integer of at least 60 seconds.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the integration worker.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

const toBase64Url = (value) => Buffer.from(value).toString("base64url");
const logEvent = (event, details = {}) => console.log(JSON.stringify({ event, ...details }));
const safeErrorCode = (error) => {
  const code = error instanceof Error ? error.message : "integration_delivery_failed";
  return /^[a-z0-9_]+$/i.test(code) ? code : "integration_delivery_failed";
};

const getGoogleAccessToken = async () => {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("google_service_account_not_configured");
  }
  const privateKey = String(serviceAccount.private_key).replace(/\\n/g, "\n");

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
  const assertion = `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;
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
  const idRange = encodeURIComponent(`${tab}!A:A`);
  const existing = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/${idRange}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!existing.ok) throw new Error("google_sheets_lookup_failed");
  const existingValues = (await existing.json()).values || [];
  if (existingValues.some((row) => row[0] === delivery.id)) return delivery.id;

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
  return delivery.id;
};

const findClickUpTaskByDelivery = async (listId, taskName) => {
  for (let page = 0; page < MAX_CLICKUP_LOOKUP_PAGES; page += 1) {
    const query = new URLSearchParams({
      include_closed: "true",
      include_timl: "true",
      page: String(page)
    });
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task?${query}`, {
      headers: { Authorization: process.env.CLICKUP_API_TOKEN }
    });
    if (!response.ok) throw new Error("clickup_task_lookup_failed");

    const body = await response.json();
    const tasks = Array.isArray(body.tasks) ? body.tasks : [];
    const existing = tasks.find((task) => task.name === taskName);
    if (existing?.id) return existing.id;

    // The API returns at most 100 tasks. A shorter page is the end of this List.
    if (tasks.length < 100 || body.last_page === true) return null;
  }

  throw new Error("clickup_task_lookup_page_limit_reached");
};

const createClickUpTask = async (delivery) => {
  const listId = delivery.aggregate_type === "talent_application"
    ? process.env.CLICKUP_TALENT_LIST_ID
    : process.env.CLICKUP_ONBOARDING_LIST_ID;
  if (!process.env.CLICKUP_API_TOKEN || !listId) throw new Error("clickup_not_configured");

  const taskName = `${delivery.aggregate_type}:${delivery.id}`;
  const existingTaskId = await findClickUpTaskByDelivery(listId, taskName);
  if (existingTaskId) return existingTaskId;

  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: {
      Authorization: process.env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: taskName,
      description: JSON.stringify(delivery.payload),
      tags: ["tag08", delivery.aggregate_type]
    })
  });
  if (!response.ok) throw new Error("clickup_task_create_failed");
  return (await response.json()).id;
};

const enabledTargets = () => {
  if (process.env.INTEGRATIONS_ENABLED !== "true") return [];

  const targets = [];
  if (process.env.GOOGLE_SHEETS_ENABLED === "true") targets.push("GOOGLE_SHEETS");
  if (process.env.CLICKUP_ENABLED === "true") targets.push("CLICKUP");
  return targets;
};

const claimDeliveries = async (client, targets) => {
  const result = await client.query(
    `WITH candidates AS (
      SELECT id FROM integration_deliveries
      WHERE status IN ('PENDING'::"DeliveryStatus", 'FAILED'::"DeliveryStatus")
        AND next_attempt_at <= NOW()
      AND target = ANY($2::"DeliveryTarget"[])
      AND ($3::text IS NULL OR id = $3)
      ORDER BY created_at
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE integration_deliveries d
    SET status = 'PROCESSING'::"DeliveryStatus", attempts = attempts + 1, processing_started_at = NOW(), updated_at = NOW()
    FROM candidates
    WHERE d.id = candidates.id
    RETURNING d.*`,
    [MAX_BATCH_SIZE, targets, DELIVERY_ID_FILTER]
  );
  return result.rows;
};

const reclaimStalledDeliveries = (client, targets) =>
  client.query(
    `UPDATE integration_deliveries
     SET status = 'FAILED'::"DeliveryStatus", next_attempt_at = NOW(), processing_started_at = NULL,
         last_error_code = 'processing_lease_expired', last_error_at = NOW(), updated_at = NOW()
     WHERE status = 'PROCESSING'::"DeliveryStatus"
       AND processing_started_at < NOW() - ($1 * INTERVAL '1 second')
       AND target = ANY($2::"DeliveryTarget"[])
       AND ($3::text IS NULL OR id = $3)
     RETURNING id, target, aggregate_type`,
    [PROCESSING_LEASE_SECONDS, targets, DELIVERY_ID_FILTER]
  );

const markDelivered = (client, id, externalReference) =>
  client.query(
    `UPDATE integration_deliveries
     SET status = 'DELIVERED'::"DeliveryStatus", delivered_at = NOW(), processing_started_at = NULL, external_reference = $2, last_error_code = NULL, last_error_at = NULL, updated_at = NOW()
     WHERE id = $1`,
    [id, externalReference]
  );

const markFailed = (client, delivery, code) => {
  const retrySeconds = Math.min(2 ** Math.min(Number(delivery.attempts), 12), MAX_RETRY_SECONDS);
  return client.query(
    `UPDATE integration_deliveries
     SET status = 'FAILED'::"DeliveryStatus", next_attempt_at = NOW() + ($2 * INTERVAL '1 second'), processing_started_at = NULL, last_error_code = $3, last_error_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [delivery.id, retrySeconds, code]
  );
};

const processDelivery = async (delivery) => {
  if (process.env.INTEGRATIONS_ENABLED !== "true") return "disabled";
  if (MOCK_INTEGRATION_MODE) {
    if (MOCK_INTEGRATION_FAILURE) {
      throw new Error(`integration_mock_${MOCK_INTEGRATION_FAILURE}`);
    }
    return `mock:${delivery.target.toLowerCase()}:${delivery.id}`;
  }
  if (delivery.target === "GOOGLE_SHEETS") {
    if (process.env.GOOGLE_SHEETS_ENABLED !== "true") return "disabled";
    return appendToSheet(delivery);
  }
  if (delivery.target === "CLICKUP") {
    if (process.env.CLICKUP_ENABLED !== "true") return "disabled";
    return createClickUpTask(delivery);
  }
  throw new Error("unsupported_delivery_target");
};

const targets = enabledTargets();

if (targets.length === 0) {
  logEvent("integration_worker_skipped", { reason: "no_enabled_targets" });
} else {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const reclaimed = await reclaimStalledDeliveries(client, targets);
    const deliveries = await claimDeliveries(client, targets);
    await client.query("COMMIT");

    if (reclaimed.rowCount) {
      logEvent("integration_deliveries_reclaimed", { count: reclaimed.rowCount });
    }
    logEvent("integration_deliveries_claimed", { count: deliveries.length, scoped: Boolean(DELIVERY_ID_FILTER) });

    for (const delivery of deliveries) {
      try {
        const outcome = await processDelivery(delivery);
        if (outcome === "disabled") {
          await client.query(`UPDATE integration_deliveries SET status = 'PENDING'::"DeliveryStatus", attempts = attempts - 1, processing_started_at = NULL, updated_at = NOW() WHERE id = $1`, [delivery.id]);
        } else {
          await markDelivered(client, delivery.id, outcome);
          logEvent("integration_delivery_delivered", { deliveryId: delivery.id, target: delivery.target, aggregateType: delivery.aggregate_type });
        }
      } catch (error) {
        const code = safeErrorCode(error);
        await markFailed(client, delivery, code);
        logEvent("integration_delivery_failed", { deliveryId: delivery.id, target: delivery.target, aggregateType: delivery.aggregate_type, code });
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}
