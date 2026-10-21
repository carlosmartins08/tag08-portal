CREATE TYPE "OnboardingJourneyStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CLOSED');

CREATE TABLE "onboarding_journeys" (
  "id" TEXT NOT NULL,
  "commercial_reference" TEXT NOT NULL,
  "status" "OnboardingJourneyStatus" NOT NULL DEFAULT 'ACTIVE',
  "draft" JSONB,
  "completed_at" TIMESTAMPTZ,
  "access_revoked_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "onboarding_journeys_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "onboarding_magic_links" (
  "id" TEXT NOT NULL,
  "journey_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "issued_by" TEXT NOT NULL,
  "commercial_reference" TEXT NOT NULL,
  "issued_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "used_at" TIMESTAMPTZ,
  "revoked_at" TIMESTAMPTZ,
  CONSTRAINT "onboarding_magic_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "onboarding_sessions" (
  "id" TEXT NOT NULL,
  "journey_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "revoked_at" TIMESTAMPTZ,
  "expired_at" TIMESTAMPTZ,
  CONSTRAINT "onboarding_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "onboarding_audit_events" (
  "id" TEXT NOT NULL,
  "journey_id" TEXT,
  "event" TEXT NOT NULL,
  "actor" TEXT,
  "commercial_reference" TEXT,
  "reason" TEXT,
  "result" TEXT NOT NULL,
  "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "onboarding_audit_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "onboarding_magic_links_token_hash_key" ON "onboarding_magic_links"("token_hash");
CREATE INDEX "onboarding_magic_links_journey_id_expires_at_idx" ON "onboarding_magic_links"("journey_id", "expires_at");
CREATE UNIQUE INDEX "onboarding_sessions_token_hash_key" ON "onboarding_sessions"("token_hash");
CREATE INDEX "onboarding_sessions_journey_id_expires_at_idx" ON "onboarding_sessions"("journey_id", "expires_at");
CREATE INDEX "onboarding_journeys_status_updated_at_idx" ON "onboarding_journeys"("status", "updated_at");
CREATE INDEX "onboarding_audit_events_journey_id_occurred_at_idx" ON "onboarding_audit_events"("journey_id", "occurred_at");
CREATE INDEX "onboarding_audit_events_event_occurred_at_idx" ON "onboarding_audit_events"("event", "occurred_at");

ALTER TABLE "onboarding_submissions" ADD COLUMN "journey_id" TEXT;
CREATE UNIQUE INDEX "onboarding_submissions_journey_id_key" ON "onboarding_submissions"("journey_id");

ALTER TABLE "onboarding_magic_links"
  ADD CONSTRAINT "onboarding_magic_links_journey_id_fkey"
  FOREIGN KEY ("journey_id") REFERENCES "onboarding_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onboarding_sessions"
  ADD CONSTRAINT "onboarding_sessions_journey_id_fkey"
  FOREIGN KEY ("journey_id") REFERENCES "onboarding_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onboarding_audit_events"
  ADD CONSTRAINT "onboarding_audit_events_journey_id_fkey"
  FOREIGN KEY ("journey_id") REFERENCES "onboarding_journeys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "onboarding_submissions"
  ADD CONSTRAINT "onboarding_submissions_journey_id_fkey"
  FOREIGN KEY ("journey_id") REFERENCES "onboarding_journeys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
