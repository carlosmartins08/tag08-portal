ALTER TABLE "integration_deliveries"
ADD COLUMN "processing_started_at" TIMESTAMPTZ;

CREATE INDEX "integration_deliveries_status_processing_started_at_idx"
ON "integration_deliveries"("status", "processing_started_at");
