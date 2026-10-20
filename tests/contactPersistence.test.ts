import assert from "node:assert/strict";
import test from "node:test";
import { POST as postContact } from "../src/app/api/contact/route";
import { contactLeadSchema } from "../server/submissionContracts";
import { persistContactLeadWithClient } from "../server/submissionStore";

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
