import assert from "node:assert/strict";
import test from "node:test";
import { POST as postContact } from "../src/app/api/contact/route";
import { contactLeadSchema } from "../server/submissionContracts";
import { persistContactLeadWithClient } from "../server/submissionStore";
import { createContactPostHandler } from "../server/contactPostHandler";
import { appendToGoogleSheets, createClickUpTask } from "../server/integrationAdapters.mjs";

const payload = contactLeadSchema.parse({
  name: "Lead Sintético",
  company: "Empresa de Teste",
  whatsapp: "+5583999999999",
  email: "synthetic@example.test",
  service: "multiple",
  stage: "not_collected",
  requestType: "new_project",
  serviceInterests: ["technology", "branding"],
  needsServiceGuidance: false,
  message: "Registro sintético para teste de persistência.",
  consent: true,
  consentVersion: "contact-v1",
  locale: "pt",
  source: "contact-page:offer",
  utm: { source: "", medium: "", campaign: "", content: "", term: "" }
});

const createFakePrisma = () => {
  const leads: Array<{ id: string; idempotencyKey: string; payload: unknown; [key: string]: unknown }> = [];
  const deliveries: Array<{ id: string; idempotencyKey: string; target: string; aggregateType: string; aggregateId: string; payload: unknown; [key: string]: unknown }> = [];
  const tx = {
    contactLead: {
      findUnique: async ({ where }: { where: { idempotencyKey: string } }) => leads.find((lead) => lead.idempotencyKey === where.idempotencyKey) ?? null,
      create: async ({ data }: { data: (typeof leads)[number] }) => { leads.push(data); return data; }
    },
    integrationDelivery: {
      createMany: async ({ data }: { data: Array<(typeof deliveries)[number]> }) => { deliveries.push(...data); return { count: data.length }; }
    }
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx)
  };
  return { prisma: prisma as never, leads, deliveries };
};

test("contact persistence and both outbox deliveries share one transaction and record identity", async () => {
  const { prisma, leads, deliveries } = createFakePrisma();
  const result = await persistContactLeadWithClient(prisma, payload, "request-001");

  assert.equal(result.created, true);
  assert.equal(leads.length, 1);
  assert.deepEqual(deliveries.map(({ target }) => target).sort(), ["CLICKUP", "GOOGLE_SHEETS"]);
  assert.ok(deliveries.every((delivery) => delivery.aggregateType === "contact_lead" && delivery.aggregateId === result.id));
  assert.ok(deliveries.every((delivery) => (delivery.payload as { version: number }).version === 1));
  assert.ok(deliveries.every((delivery) => (delivery.payload as { data: { source: string } }).data.source === "contact-page:offer"));
  assert.ok(deliveries.every((delivery) => {
    const data = (delivery.payload as { data: Record<string, unknown> }).data;
    return !Object.hasOwn(data, "consent") && !Object.hasOwn(data, "website");
  }));
  assert.ok(deliveries.every((delivery) => delivery.idempotencyKey === `contact_lead:${result.id}:${delivery.target.toLowerCase()}`));
});

test("replay with same key and payload is idempotent; key reuse with changed payload conflicts", async () => {
  const { prisma, leads, deliveries } = createFakePrisma();
  const first = await persistContactLeadWithClient(prisma, payload, "request-001");
  const replay = await persistContactLeadWithClient(prisma, payload, "request-001");

  assert.equal(replay.id, first.id);
  assert.equal(replay.created, false);
  assert.equal(leads.length, 1);
  assert.equal(deliveries.length, 2);
  await assert.rejects(
    persistContactLeadWithClient(prisma, { ...payload, message: "Conteúdo alterado" }, "request-001"),
    /idempotency_key_conflict/
  );
});

test("same email with a distinct key can create a later legitimate contact", async () => {
  const { prisma, leads, deliveries } = createFakePrisma();
  const first = await persistContactLeadWithClient(prisma, payload, "request-001");
  const later = await persistContactLeadWithClient(prisma, { ...payload, message: "Nova necessidade em outro momento" }, "request-002");

  assert.notEqual(later.id, first.id);
  assert.equal(leads.length, 2);
  assert.equal(deliveries.length, 4);
});

test("contact API rejects absent or non-opaque idempotency keys before persistence", async () => {
  const requestFor = (key?: string) => new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {})
    },
    body: JSON.stringify(payload)
  });
  const missing = await postContact(requestFor());
  const personalData = await postContact(requestFor("ana@example.com"));

  assert.equal(missing.status, 400);
  assert.equal(personalData.status, 400);
  assert.equal((await missing.json()).error, "idempotency_key_required");
  assert.equal((await personalData.json()).error, "idempotency_key_required");
});

test("synthetic Contact request traverses API, fake persistence/outbox, and mocked adapters once", async () => {
  const { prisma, leads, deliveries } = createFakePrisma();
  const postWithFakePersistence = createContactPostHandler((data, key) => persistContactLeadWithClient(prisma, data, key));
  const requestFor = () => new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": "synthetic-request-001" },
    body: JSON.stringify(payload)
  });

  const firstResponse = await postWithFakePersistence(requestFor());
  const firstBody = await firstResponse.json();
  assert.equal(firstResponse.status, 202);
  assert.equal(firstBody.status, "accepted");
  assert.equal(firstBody.replayed, false);
  assert.equal(leads.length, 1);
  assert.deepEqual(deliveries.map(({ target }) => target).sort(), ["CLICKUP", "GOOGLE_SHEETS"]);

  const sheetsRows: unknown[][] = [];
  let sheetsPostCount = 0;
  const sheetsFetch = async (_url: string | URL | Request, init?: RequestInit) => {
    if (!init?.method) {
      return new Response(JSON.stringify({
        range: sheetsRows.length ? "Leads!A2:A2" : "Leads!A1:A1",
        values: sheetsRows.map((row) => [row[0]])
      }), { status: 200 });
    }
    sheetsPostCount += 1;
    sheetsRows.push(JSON.parse(String(init.body)).values[0]);
    return new Response(JSON.stringify({ updates: { updatedRange: "Leads!A2:P2" } }), { status: 200 });
  };

  // Adapter delivery shape uses the persisted target and aggregate fields explicitly.
  const persistedSheetsDelivery = deliveries.find(({ target }) => target === "GOOGLE_SHEETS")!;
  const workerSheetsDelivery = {
    id: persistedSheetsDelivery.id,
    aggregate_id: persistedSheetsDelivery.aggregateId,
    aggregate_type: persistedSheetsDelivery.aggregateType,
    created_at: "2026-10-26T12:00:00.000Z",
    payload: persistedSheetsDelivery.payload
  };
  assert.ok(workerSheetsDelivery);
  await appendToGoogleSheets(workerSheetsDelivery, {
    spreadsheetId: "synthetic-spreadsheet-id",
    accessToken: "synthetic-access-token",
    fetchImpl: sheetsFetch
  });
  await appendToGoogleSheets(workerSheetsDelivery, {
    spreadsheetId: "synthetic-spreadsheet-id",
    accessToken: "synthetic-access-token",
    fetchImpl: sheetsFetch
  });
  assert.equal(sheetsPostCount, 1);
  assert.equal(sheetsRows[0].length, 16);
  assert.equal(sheetsRows[0][0], persistedSheetsDelivery.id);
  assert.deepEqual(JSON.parse(String(sheetsRows[0][3])), (persistedSheetsDelivery.payload as { data: unknown }).data);
  assert.equal(sheetsRows[0].slice(4).includes("not_collected"), false);
  assert.equal(sheetsRows[0].slice(4).includes("contact-v1"), false);

  const persistedClickUpDelivery = deliveries.find(({ target }) => target === "CLICKUP")!;
  const workerClickUpDelivery = {
    id: persistedClickUpDelivery.id,
    aggregate_id: persistedClickUpDelivery.aggregateId,
    aggregate_type: persistedClickUpDelivery.aggregateType,
    created_at: "2026-10-26T12:00:00.000Z",
    payload: persistedClickUpDelivery.payload
  };
  const clickUpTasks: Array<{ id: string; name: string }> = [];
  let clickUpPostCount = 0;
  const clickUpFetch = async (_url: string | URL | Request, init?: RequestInit) => {
    if (!init?.method) return new Response(JSON.stringify({ tasks: clickUpTasks }), { status: 200 });
    clickUpPostCount += 1;
    const task = JSON.parse(String(init.body));
    clickUpTasks.push({ id: "synthetic-clickup-task-001", name: task.name });
    return new Response(JSON.stringify({ id: "synthetic-clickup-task-001" }), { status: 200 });
  };
  const clickUpOptions = {
    env: { CLICKUP_PRE_SALES_LIST_ID: "900700475931", CLICKUP_API_TOKEN: "synthetic-clickup-token" },
    fetchImpl: clickUpFetch
  };
  await createClickUpTask(workerClickUpDelivery, clickUpOptions);
  await createClickUpTask(workerClickUpDelivery, clickUpOptions);
  assert.equal(clickUpPostCount, 1);
  assert.equal(clickUpTasks.length, 1);

  const replayResponse = await postWithFakePersistence(requestFor());
  const replayBody = await replayResponse.json();
  assert.equal(replayBody.replayed, true);
  assert.equal(leads.length, 1);
  assert.equal(deliveries.length, 2);
});

test("non-commercial Contact requests remain on Sheets and are not routed to Pre-sales", async () => {
  for (const requestType of ["existing_client", "partnership", "unspecified"] as const) {
    const { prisma, deliveries } = createFakePrisma();
    const result = await persistContactLeadWithClient(prisma, { ...payload, requestType }, `synthetic-${requestType}`);
    assert.ok(result.created);
    assert.deepEqual(deliveries.map(({ target }) => target), ["GOOGLE_SHEETS"]);
  }
});
