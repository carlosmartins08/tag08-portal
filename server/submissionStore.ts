import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import type { ContactLeadInput, TalentApplicationInput } from "./submissionContracts";
import type { OnboardingPayload } from "./onboardingContract";

const require = createRequire(import.meta.url);

type QueryResult<Row = Record<string, unknown>> = { rows: Row[] };
type QueryClient = {
  query: (text: string, values?: unknown[]) => Promise<QueryResult>;
  release: () => void;
};
type QueryPool = {
  connect: () => Promise<QueryClient>;
};

const RETENTION_MONTHS = 12;
let pool: QueryPool | null = null;

const getPool = (): QueryPool => {
  if (!process.env.DATABASE_URL) {
    throw new Error("persistence_unavailable");
  }

  if (!pool) {
    const { Pool } = require("pg") as { Pool: new (config: Record<string, unknown>) => QueryPool };
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
};

const retentionUntil = () => {
  const until = new Date();
  until.setMonth(until.getMonth() + RETENTION_MONTHS);
  return until;
};

const transaction = async <T>(operation: (client: QueryClient) => Promise<T>) => {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const queueDelivery = async (
  client: QueryClient,
  target: "GOOGLE_SHEETS" | "CLICKUP",
  aggregateType: string,
  aggregateId: string,
  payload: unknown
) => {
  await client.query(
    `INSERT INTO integration_deliveries (
      id, idempotency_key, target, aggregate_type, aggregate_id, payload, status, next_attempt_at
    ) VALUES ($1, $2, $3::"DeliveryTarget", $4, $5, $6::jsonb, 'PENDING'::"DeliveryStatus", NOW())
    ON CONFLICT (idempotency_key) DO NOTHING`,
    [randomUUID(), `${aggregateType}:${aggregateId}:${target.toLowerCase()}`, target, aggregateType, aggregateId, JSON.stringify(payload)]
  );
};

type PersistResult = { id: string; created: boolean };

const existingByKey = async (client: QueryClient, table: string, idempotencyKey: string): Promise<string | null> => {
  const result = await client.query(`SELECT id FROM ${table} WHERE idempotency_key = $1`, [idempotencyKey]);
  return (result.rows[0]?.id as string | undefined) ?? null;
};

export const persistContactLead = async (payload: ContactLeadInput, idempotencyKey: string): Promise<PersistResult> =>
  transaction(async (client) => {
    const existingId = await existingByKey(client, "contact_leads", idempotencyKey);
    if (existingId) return { id: existingId, created: false };

    const id = randomUUID();
    await client.query(
      `INSERT INTO contact_leads (
        id, idempotency_key, payload, name, email, whatsapp, locale, consent_version, source, status, retention_until
      ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, 'ACCEPTED'::"SubmissionStatus", $10)`,
      [id, idempotencyKey, JSON.stringify(payload), payload.name, payload.email, payload.whatsapp, payload.locale, payload.consentVersion, payload.source, retentionUntil()]
    );
    await queueDelivery(client, "GOOGLE_SHEETS", "contact_lead", id, payload);
    return { id, created: true };
  });

export const persistTalentApplication = async (payload: TalentApplicationInput, idempotencyKey: string): Promise<PersistResult> =>
  transaction(async (client) => {
    const existingId = await existingByKey(client, "talent_applications", idempotencyKey);
    if (existingId) return { id: existingId, created: false };

    const id = randomUUID();
    await client.query(
      `INSERT INTO talent_applications (
        id, idempotency_key, payload, name, email, vacancy_id, locale, consent_version, source, status, retention_until
      ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, 'ACCEPTED'::"SubmissionStatus", $10)`,
      [id, idempotencyKey, JSON.stringify(payload), payload.name, payload.email, payload.vacancyId, payload.locale, payload.consentVersion, payload.source, retentionUntil()]
    );
    await queueDelivery(client, "GOOGLE_SHEETS", "talent_application", id, payload);
    await queueDelivery(client, "CLICKUP", "talent_application", id, payload);
    return { id, created: true };
  });

export const persistOnboardingSubmission = async (payload: OnboardingPayload, idempotencyKey: string): Promise<PersistResult> =>
  transaction(async (client) => {
    const existingId = await existingByKey(client, "onboarding_submissions", idempotencyKey);
    if (existingId) return { id: existingId, created: false };

    const id = randomUUID();
    const locale = payload.clientData.preferredLanguage || "pt";
    await client.query(
      `INSERT INTO onboarding_submissions (
        id, idempotency_key, payload, company_name, email, locale, schema_version, source, status, retention_until
      ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, 'ACCEPTED'::"SubmissionStatus", $9)`,
      [
        id,
        idempotencyKey,
        JSON.stringify(payload),
        payload.clientData.companyName || "",
        payload.projectContacts.email || "",
        locale,
        payload.schemaVersion || 1,
        payload.source,
        retentionUntil()
      ]
    );
    await queueDelivery(client, "GOOGLE_SHEETS", "onboarding_submission", id, payload);
    await queueDelivery(client, "CLICKUP", "onboarding_submission", id, payload);
    return { id, created: true };
  });

export const isPersistenceUnavailable = (error: unknown) =>
  error instanceof Error && error.message === "persistence_unavailable";

export const getOperationalMetrics = async () => {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      `SELECT
        (SELECT COUNT(*) FROM onboarding_submissions) AS onboarding_total,
        (SELECT COUNT(*) FROM onboarding_submissions WHERE status = 'ACCEPTED'::"SubmissionStatus") AS onboarding_accepted,
        (SELECT COUNT(*) FROM integration_deliveries WHERE status = 'FAILED'::"DeliveryStatus") AS failed_deliveries,
        (SELECT COUNT(*) FROM integration_deliveries WHERE status = 'PENDING'::"DeliveryStatus") AS pending_deliveries`
    );
    const row = result.rows[0] || {};
    return {
      onboardingTotal: Number(row.onboarding_total || 0),
      onboardingAccepted: Number(row.onboarding_accepted || 0),
      failedDeliveries: Number(row.failed_deliveries || 0),
      pendingDeliveries: Number(row.pending_deliveries || 0)
    };
  } finally {
    client.release();
  }
};
