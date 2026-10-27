import assert from "node:assert/strict";
import test from "node:test";
import { appendToGoogleSheets, createClickUpTask } from "../server/integrationAdapters.mjs";
import {
  buildOnboardingClickUpDeliveryProjection,
  buildOnboardingSheetsDeliveryProjection
} from "../server/onboardingDeliveryProjection.mjs";

const payload = () => ({
  schemaVersion: 1,
  clientData: { companyName: "Synthetic Co", cnpjCpf: "synthetic-tax-id", preferredLanguage: "pt", accessToken: "must-not-leak" },
  projectContacts: { responsibleName: "Synthetic Person", email: "synthetic@example.test", whatsapp: "+550000000000", sessionSecret: "must-not-leak" },
  selectedServices: ["Branding", "Web"],
  businessMoment: { priorityArea: "Synthetic", accessToken: "must-not-leak" },
  generalBriefing: { deadline: "Synthetic date", sessionToken: "must-not-leak" },
  serviceSpecificBriefing: { branding: { references: "Synthetic URL", password: "must-not-leak" } },
  filesAndLinks: { drive: "https://example.test/synthetic?access_token=synthetic-sensitive", references: "https://example.test/ref#session=synthetic-sensitive", magicLink: "must-not-leak" },
  submittedAt: "2026-10-27T12:00:00.000Z",
  source: "synthetic-test",
  consent: { truthChecked: true },
  submissionContext: { submittedBy: "client", clientAuthorizationConfirmed: true },
  meta: { queueEntryId: "private-queue-id" },
  sheetPayload: { row: { arbitrary: "untrusted-browser-projection" } },
  clickupPayload: { task: { description: "untrusted-browser-projection" } },
  accessToken: "must-not-leak"
});

test("Sheets projection preserves operational onboarding fields and excludes auth metadata and browser projections", () => {
  const original = payload();
  const projection = buildOnboardingSheetsDeliveryProjection(original);
  const serialized = JSON.stringify(projection);
  assert.deepEqual(projection.selectedServices, ["Branding", "Web"]);
  assert.equal(projection.clientData.cnpjCpf, "synthetic-tax-id");
  assert.equal(projection.projectContacts.responsibleName, "Synthetic Person");
  assert.equal(projection.generalBriefing.deadline, "Synthetic date");
  assert.equal(projection.serviceSpecificBriefing.branding.references, "Synthetic URL");
  assert.equal(projection.filesAndLinks.drive, "");
  assert.equal(projection.filesAndLinks.references, "");
  assert.doesNotMatch(serialized, /must-not-leak|untrusted-browser-projection|private-queue-id|consent|submissionContext/);
  assert.equal(original.accessToken, "must-not-leak", "projection must not mutate the persisted contract object");
});

test("ClickUp projection omits tax identifiers while retaining required operational context", () => {
  const projection = buildOnboardingClickUpDeliveryProjection(payload());
  const serialized = JSON.stringify(projection);
  assert.equal(projection.clientData.companyName, "Synthetic Co");
  assert.equal(projection.clientData.cnpjCpf, undefined);
  assert.equal(projection.projectContacts.email, "synthetic@example.test");
  assert.deepEqual(projection.selectedServices, ["Branding", "Web"]);
  assert.doesNotMatch(serialized, /must-not-leak|synthetic-tax-id|untrusted-browser-projection|private-queue-id|consent|submissionContext/);
});

test("existing Sheets and ClickUp adapters receive only server-built onboarding projections", async () => {
  const rawBrowserPayload = payload();
  const delivery = {
    id: "delivery-synthetic-onboarding",
    aggregate_id: "record-synthetic-onboarding",
    aggregate_type: "onboarding_submission",
    created_at: "2026-10-27T12:00:00.000Z"
  };
  let sheetRow;
  const sheetResult = await appendToGoogleSheets({ ...delivery, payload: { version: 1, data: rawBrowserPayload } }, {
    spreadsheetId: "synthetic-sheet",
    accessToken: "synthetic-token",
    fetchImpl: async (_url, init = {}) => {
      if (init.method === "POST") {
        sheetRow = JSON.parse(init.body).values[0];
        return new Response(JSON.stringify({ updates: { updatedRange: "Onboarding!A2:D2" } }), { status: 200 });
      }
      return new Response(JSON.stringify({ range: "Onboarding!A1:D1", values: [] }), { status: 200 });
    }
  });
  assert.equal(sheetResult, "Onboarding!A2:D2");
  assert.equal(JSON.parse(sheetRow[3]).clientData.cnpjCpf, "synthetic-tax-id");
  assert.doesNotMatch(sheetRow[3], /must-not-leak|untrusted-browser-projection|private-queue-id/);

  let clickUpBody;
  const taskId = await createClickUpTask({ ...delivery, payload: { version: 1, data: rawBrowserPayload } }, {
    env: { CLICKUP_ONBOARDING_LIST_ID: "900000000001", CLICKUP_API_TOKEN: "synthetic-token" },
    fetchImpl: async (url, init = {}) => {
      if (!init.method) return new Response(JSON.stringify({ tasks: [] }), { status: 200 });
      assert.match(url, /\/list\/900000000001\/task$/);
      clickUpBody = JSON.parse(init.body);
      return new Response(JSON.stringify({ id: "synthetic-task-id" }), { status: 200 });
    }
  });
  assert.equal(taskId, "synthetic-task-id");
  assert.doesNotMatch(clickUpBody.description, /must-not-leak|synthetic-tax-id|untrusted-browser-projection|private-queue-id/);
  assert.match(clickUpBody.description, /Synthetic Co/);
});
