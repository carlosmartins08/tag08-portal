import { createSign } from "node:crypto";
import pg from "pg";
import {
  getDeliveryFailure,
  IntegrationDeliveryError,
  integrationHttpError,
  MAX_AUTOMATIC_DELIVERY_ATTEMPTS,
  TERMINAL_RETRY_AT,
} from "./integrationDelivery.mjs";
import { appendToGoogleSheets, createClickUpTask } from "./integrationAdapters.mjs";

const { Pool } = pg;
const MAX_BATCH_SIZE = 20;
const PROCESSING_LEASE_SECONDS = Number.parseInt(process.env.INTEGRATION_PROCESSING_LEASE_SECONDS || "900", 10);
const DELIVERY_ID_FILTER = process.env.INTEGRATION_DELIVERY_ID?.trim() || null;
const MOCK_INTEGRATION_MODE = process.env.INTEGRATION_MOCK_MODE === "true";
const MOCK_INTEGRATION_FAILURE = process.env.INTEGRATION_MOCK_FAILURE?.trim() || null;

const validateIntegrationConfiguration = () => {
  if (process.env.INTEGRATIONS_ENABLED !== "true") return;

  const sheetsEnabled = process.env.GOOGLE_SHEETS_ENABLED === "true";
  const clickUpEnabled = process.env.CLICKUP_ENABLED === "true";
  if (!sheetsEnabled && !clickUpEnabled) throw new Error("integration_target_not_configured");
};

validateIntegrationConfiguration();

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
  const code = error && typeof error === "object" && "code" in error ? error.code : error instanceof Error ? error.message : "integration_delivery_failed";
  return /^[a-z0-9_]+$/i.test(code) ? code : "integration_delivery_failed";
};

const getGoogleAccessToken = async () => {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  } catch {
    throw new IntegrationDeliveryError("google_service_account_invalid");
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new IntegrationDeliveryError("google_service_account_not_configured");
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
    signal: AbortSignal.timeout(15000),
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  if (!response.ok) throw integrationHttpError("google_token_exchange_failed", response.status);
  const tokenResponse = await response.json().catch(() => null);
  if (!tokenResponse || typeof tokenResponse.access_token !== "string" || !tokenResponse.access_token) {
    throw new IntegrationDeliveryError("google_token_response_invalid");
  }
  return tokenResponse.access_token;
};

const appendToSheet = async (delivery) => {
  if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) throw new IntegrationDeliveryError("google_sheets_not_configured");
  const token = await getGoogleAccessToken();
  return appendToGoogleSheets(delivery, {
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    accessToken: token
  });
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
        AND attempts < $4
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
    [MAX_BATCH_SIZE, targets, DELIVERY_ID_FILTER, MAX_AUTOMATIC_DELIVERY_ATTEMPTS]
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

const markFailed = (client, delivery, error) => {
  const failure = getDeliveryFailure(error, Number(delivery.attempts));
  const retryAt = failure.retry ? failure.retryAt : TERMINAL_RETRY_AT;
  return client.query(
    `UPDATE integration_deliveries
     SET status = 'FAILED'::"DeliveryStatus", next_attempt_at = $2, processing_started_at = NULL, last_error_code = $3, last_error_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [delivery.id, retryAt, failure.code]
  );
};

const processDelivery = async (delivery) => {
  if (process.env.INTEGRATIONS_ENABLED !== "true") return "disabled";
  if (MOCK_INTEGRATION_MODE) {
    if (MOCK_INTEGRATION_FAILURE) {
      const error = new Error(`integration_mock_${MOCK_INTEGRATION_FAILURE}`);
      error.retryable = true;
      error.code = error.message;
      throw error;
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
        const failure = getDeliveryFailure(error, Number(delivery.attempts));
        await markFailed(client, delivery, error);
        logEvent("integration_delivery_failed", {
          deliveryId: delivery.id,
          target: delivery.target,
          aggregateType: delivery.aggregate_type,
          code,
          retryScheduled: failure.retry,
          terminal: !failure.retry
        });
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}
