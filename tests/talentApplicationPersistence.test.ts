import assert from "node:assert/strict";
import test from "node:test";
import { createTalentApplicationPostHandler } from "../server/talentApplicationPostHandler";
import { persistTalentApplicationWithClient } from "../server/submissionStore";
import { talentApplicationSchema } from "../server/submissionContracts";

const payload = talentApplicationSchema.parse({
  contractVersion: 2,
  interestAreas: ["sales_sdr", "design"],
  name: "Synthetic Candidate",
  email: "candidate@example.test",
  phone: "+5500000000000",
  linkedin: "",
  resumeUrl: "",
  portfolio: "",
  experienceSummary: "Synthetic experience for idempotency validation.",
  availability: "To be agreed",
  motivation: "Synthetic interest in future opportunities.",
  relevantProjects: "Synthetic design project.",
  relevantExperience: "Synthetic sales experience.",
  consent: true,
  consentVersion: "talent-v2",
  locale: "pt",
  source: "talent-test"
});

const createFakePrisma = () => {
  const applications: Array<{ id: string; idempotencyKey: string; payload: unknown; [key: string]: unknown }> = [];
  const deliveries: Array<{ id: string; idempotencyKey: string; target: string; aggregateType: string; aggregateId: string; payload: unknown; [key: string]: unknown }> = [];
  let uniqueCollisions = 0;
  const tx = {
    talentApplication: {
      findUnique: async ({ where }: { where: { idempotencyKey: string } }) => applications.find((application) => application.idempotencyKey === where.idempotencyKey) ?? null,
      create: async ({ data }: { data: (typeof applications)[number] }) => {
        if (applications.some((application) => application.idempotencyKey === data.idempotencyKey)) {
          uniqueCollisions += 1;
          throw Object.assign(new Error("unique constraint"), { code: "P2002" });
        }
        applications.push(data);
        return data;
      }
    },
    integrationDelivery: {
      createMany: async ({ data }: { data: Array<(typeof deliveries)[number]> }) => { deliveries.push(...data); return { count: data.length }; }
    }
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    talentApplication: tx.talentApplication
  };
  return { prisma: prisma as never, applications, deliveries, getUniqueCollisions: () => uniqueCollisions };
};

test("Talent replay with the same idempotency key and payload creates no duplicate", async () => {
  const { prisma, applications, deliveries } = createFakePrisma();
  const first = await persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-key");
  const replay = await persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-key");

  assert.equal(first.created, true);
  assert.equal(replay.id, first.id);
  assert.equal(replay.created, false);
  assert.equal(applications.length, 1);
  assert.equal(applications[0].vacancyId, "espontanea");
  assert.deepEqual((applications[0].payload as { interestAreas: string[] }).interestAreas, ["design", "sales_sdr"]);
  assert.deepEqual(deliveries.map(({ target }) => target).sort(), ["CLICKUP", "GOOGLE_SHEETS"]);
  assert.ok(deliveries.every(({ payload: deliveryPayload }) => (deliveryPayload as { contractVersion: number }).contractVersion === 2));
  assert.ok(deliveries.every(({ payload: deliveryPayload }) => (deliveryPayload as { interestAreas: string[] }).interestAreas.join(",") === "design,sales_sdr"));
});

test("legacy Talent v1 payload remains accepted and retains its vacancy identifier", async () => {
  const legacyPayload = talentApplicationSchema.parse({
    vacancyId: "copywriter",
    vacancyTitle: "Copywriter",
    name: "Legacy Candidate",
    email: "legacy@example.test",
    phone: "+5500000000000",
    linkedin: "https://www.linkedin.com/in/legacy-candidate",
    portfolio: "",
    coverLetter: "Legacy synthetic application kept for compatibility.",
    resumeFileName: "",
    consent: true,
    consentVersion: "talent-v1",
    locale: "pt",
    source: "legacy-test"
  });
  assert.equal("contractVersion" in legacyPayload, false);
  const { prisma, applications, deliveries } = createFakePrisma();
  await persistTalentApplicationWithClient(prisma, legacyPayload, "synthetic-talent-v1-key");
  assert.equal(applications[0].vacancyId, "copywriter");
  assert.equal((applications[0].payload as { vacancyTitle: string }).vacancyTitle, "Copywriter");
  assert.equal(deliveries.length, 2);
});

test("Talent rejects reuse of an idempotency key with a changed payload", async () => {
  const { prisma, applications, deliveries } = createFakePrisma();
  await persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-key");

  await assert.rejects(
    persistTalentApplicationWithClient(prisma, { ...payload, motivation: "Conteúdo alterado para o mesmo identificador." }, "synthetic-talent-key"),
    /idempotency_key_conflict/
  );
  assert.equal(applications.length, 1);
  assert.equal(deliveries.length, 2);
});

test("concurrent Talent requests with the same key and payload resolve to one record and two deliveries", async () => {
  const { prisma, applications, deliveries, getUniqueCollisions } = createFakePrisma();
  const results = await Promise.all([
    persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-concurrent-key"),
    persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-concurrent-key")
  ]);

  assert.equal(getUniqueCollisions(), 1);
  assert.equal(results[0].id, results[1].id);
  assert.deepEqual(results.map(({ created }) => created).sort(), [false, true]);
  assert.equal(applications.length, 1);
  assert.equal(deliveries.length, 2);
});

test("concurrent Talent requests with one key and different payloads conflict without duplicate deliveries", async () => {
  const { prisma, applications, deliveries, getUniqueCollisions } = createFakePrisma();
  const results = await Promise.allSettled([
    persistTalentApplicationWithClient(prisma, payload, "synthetic-talent-conflict-key"),
    persistTalentApplicationWithClient(prisma, { ...payload, motivation: "Conteúdo divergente na chamada concorrente." }, "synthetic-talent-conflict-key")
  ]);

  assert.equal(getUniqueCollisions(), 1);
  assert.equal(results.filter(({ status }) => status === "fulfilled").length, 1);
  const rejected = results.find(({ status }) => status === "rejected");
  assert.ok(rejected && rejected.status === "rejected");
  assert.match(String(rejected.reason), /idempotency_key_conflict/);
  assert.equal(applications.length, 1);
  assert.equal(deliveries.length, 2);
});

test("Talent API returns 409 for a changed-payload idempotency conflict", async () => {
  const { prisma } = createFakePrisma();
  const post = createTalentApplicationPostHandler((data, key) => persistTalentApplicationWithClient(prisma, data, key));
  const requestFor = (body: unknown) => new Request("http://localhost/api/talent-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": "synthetic-talent-key" },
    body: JSON.stringify(body)
  });

  const first = await post(requestFor(payload));
  const replay = await post(requestFor(payload));
  const conflict = await post(requestFor({ ...payload, motivation: "Conteúdo divergente na mesma chave." }));

  assert.equal(first.status, 202);
  assert.equal((await replay.json()).replayed, true);
  assert.equal(conflict.status, 409);
  assert.equal((await conflict.json()).error, "idempotency_key_conflict");
});
