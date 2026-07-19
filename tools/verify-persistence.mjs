import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const baseUrl = process.env.BASE_URL || "http://localhost:3000";

if (!process.env.DATABASE_URL?.trim()) {
  throw new Error("DATABASE_URL is required for persistence verification.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

const testRunId = randomUUID();
const ids = { contact: null, talent: null, onboarding: null };

const request = async (path, payload, idempotencyKey) => {
  const response = await fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(payload)
  });
  assert.equal(response.status, 202, `${path} returned ${response.status}`);
  return response.json();
};

const assertReplay = async (path, payload, responseKey, exposesReplayFlag = true) => {
  const idempotencyKey = `STAGING_TEST:${testRunId}:${responseKey}`;
  const first = await request(path, payload, idempotencyKey);
  const second = await request(path, payload, idempotencyKey);

  assert.equal(first.ok, true, `${path} did not accept the initial request`);
  assert.equal(second.ok, true, `${path} did not accept the replay`);
  assert.equal(first[responseKey], second[responseKey], `${path} created a duplicate record`);
  if (exposesReplayFlag) {
    assert.equal(first.replayed, false, `${path} marked the initial request as replayed`);
    assert.equal(second.replayed, true, `${path} did not mark the repeated request as replayed`);
  }
  return first[responseKey];
};

const countRows = async (table, id, expectedDeliveries) => {
  const recordCount = await pool.query(`SELECT count(*)::int AS count FROM ${table} WHERE id = $1`, [id]);
  const deliveryCount = await pool.query(
    "SELECT count(*)::int AS count FROM integration_deliveries WHERE aggregate_id = $1",
    [id]
  );
  assert.equal(recordCount.rows[0].count, 1, `${table} was not persisted exactly once`);
  assert.equal(deliveryCount.rows[0].count, expectedDeliveries, `${table} outbox delivery count is invalid`);
};

try {
  ids.contact = await assertReplay(
    "/api/contact",
    {
      name: "STAGING TEST",
      company: "TAG08 Verification",
      whatsapp: "+5500000000000",
      email: "staging-test-contact@example.test",
      service: "verification",
      stage: "staging_test",
      message: "Synthetic persistence verification.",
      consent: true,
      consentVersion: "staging-test",
      locale: "pt",
      source: "STAGING_TEST",
      utm: { source: "staging_test" }
    },
    "leadId"
  );
  await countRows("contact_leads", ids.contact, 1);

  ids.talent = await assertReplay(
    "/api/talent-applications",
    {
      vacancyId: "staging-test-vacancy",
      vacancyTitle: "STAGING TEST",
      name: "STAGING TEST",
      email: "staging-test-talent@example.test",
      phone: "+5500000000000",
      linkedin: "https://www.linkedin.com/in/staging-test",
      portfolio: "https://example.test/portfolio",
      coverLetter: "Synthetic persistence verification.",
      consent: true,
      consentVersion: "staging-test",
      locale: "pt",
      source: "STAGING_TEST",
      utm: { source: "staging_test" }
    },
    "applicationId"
  );
  await countRows("talent_applications", ids.talent, 2);

  ids.onboarding = await assertReplay(
    "/api/onboarding",
    {
      clientData: { companyName: "TAG08 Verification", preferredLanguage: "pt" },
      projectContacts: {
        responsibleName: "STAGING TEST",
        role: "Verification",
        email: "staging-test-onboarding@example.test",
        whatsapp: "+5500000000000"
      },
      selectedServices: ["verification"],
      businessMoment: { momentPhrase: "Synthetic verification" },
      generalBriefing: {},
      serviceSpecificBriefing: {},
      filesAndLinks: {},
      consent: { truthChecked: true, useChecked: true, noPasswordsChecked: true },
      submittedAt: new Date().toISOString(),
      source: "STAGING_TEST",
      status: "received",
      schemaVersion: 1,
      meta: { queueEntryId: `STAGING_TEST:${testRunId}` }
    },
    "submissionId",
    false
  );
  await countRows("onboarding_submissions", ids.onboarding, 2);

  console.log(JSON.stringify({ event: "persistence_verification_passed" }));
} finally {
  const aggregateIds = Object.values(ids).filter(Boolean);
  if (aggregateIds.length) {
    await pool.query("DELETE FROM integration_deliveries WHERE aggregate_id = ANY($1::text[])", [aggregateIds]);
    await pool.query("DELETE FROM contact_leads WHERE id = ANY($1::text[])", [aggregateIds]);
    await pool.query("DELETE FROM talent_applications WHERE id = ANY($1::text[])", [aggregateIds]);
    await pool.query("DELETE FROM onboarding_submissions WHERE id = ANY($1::text[])", [aggregateIds]);
  }
  await pool.end();
}
