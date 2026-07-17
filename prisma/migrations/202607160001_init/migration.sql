CREATE TYPE "SubmissionStatus" AS ENUM ('RECEIVED', 'ACCEPTED', 'FAILED', 'RETAINED', 'DELETED');
CREATE TYPE "DeliveryTarget" AS ENUM ('GOOGLE_SHEETS', 'CLICKUP');
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED');

CREATE TABLE "contact_leads" (
  "id" TEXT PRIMARY KEY,
  "idempotency_key" TEXT NOT NULL UNIQUE,
  "payload" JSONB NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "consent_version" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
  "retention_until" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "talent_applications" (
  "id" TEXT PRIMARY KEY,
  "idempotency_key" TEXT NOT NULL UNIQUE,
  "payload" JSONB NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "vacancy_id" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "consent_version" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
  "retention_until" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "onboarding_submissions" (
  "id" TEXT PRIMARY KEY,
  "idempotency_key" TEXT NOT NULL UNIQUE,
  "payload" JSONB NOT NULL,
  "company_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "schema_version" INTEGER NOT NULL,
  "source" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
  "retention_until" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "simulator_config_versions" (
  "id" TEXT PRIMARY KEY,
  "version" INTEGER NOT NULL UNIQUE,
  "parameters" JSONB NOT NULL,
  "source" TEXT NOT NULL,
  "valid" BOOLEAN NOT NULL DEFAULT TRUE,
  "activated_at" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "integration_deliveries" (
  "id" TEXT PRIMARY KEY,
  "idempotency_key" TEXT NOT NULL UNIQUE,
  "target" "DeliveryTarget" NOT NULL,
  "aggregate_type" TEXT NOT NULL,
  "aggregate_id" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "next_attempt_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "delivered_at" TIMESTAMPTZ,
  "external_reference" TEXT,
  "last_error_code" TEXT,
  "last_error_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "integration_deliveries_status_next_attempt_at_idx" ON "integration_deliveries"("status", "next_attempt_at");

CREATE TABLE "retention_audits" (
  "id" TEXT PRIMARY KEY,
  "aggregate_type" TEXT NOT NULL,
  "aggregate_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "retention_audits_aggregate_type_aggregate_id_idx" ON "retention_audits"("aggregate_type", "aggregate_id");
