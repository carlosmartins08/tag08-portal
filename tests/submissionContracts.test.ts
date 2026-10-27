import assert from "node:assert/strict";
import test from "node:test";
import { contactIdempotencyKeySchema, contactLeadSchema, talentApplicationSchema } from "../server/submissionContracts";

const validContact = {
  name: "Ana Pessoa",
  company: "Empresa Teste",
  whatsapp: "+55 (83) 99999-9999",
  email: "ANA@EXAMPLE.COM",
  service: "branding",
  stage: "estrutura",
  message: "Precisamos organizar o posicionamento.",
  consent: true,
  consentVersion: "contact-v1",
  locale: "pt",
  source: "test"
};

const validTalent = {
  vacancyId: "copywriter",
  vacancyTitle: "Copywriter",
  name: "Ana Pessoa",
  email: "ANA@EXAMPLE.COM",
  phone: "+55 (83) 99999-9999",
  linkedin: "https://www.linkedin.com/in/ana-pessoa",
  portfolio: "https://portfolio.example.com/ana",
  coverLetter: "Experiencia comprovada em projetos de conteudo e estrategia.",
  resumeFileName: "",
  consent: true,
  consentVersion: "talent-v1",
  locale: "pt",
  source: "test"
};

test("contact contract normalizes fields and requires consent", () => {
  const parsed = contactLeadSchema.parse(validContact);
  assert.equal(parsed.email, "ana@example.com");
  assert.equal(parsed.whatsapp, "+5583999999999");
  assert.equal(parsed.requestType, "unspecified");
  assert.deepEqual(parsed.serviceInterests, []);
  assert.equal(parsed.needsServiceGuidance, false);
  assert.equal(contactLeadSchema.safeParse({ ...validContact, consent: false }).success, false);
});

test("contact contract accepts guided intake and bounds service interests", () => {
  const parsed = contactLeadSchema.parse({
    ...validContact,
    requestType: "new_project",
    serviceInterests: ["branding", "desenvolvimento-web"],
    needsServiceGuidance: false
  });
  assert.equal(parsed.requestType, "new_project");
  assert.deepEqual(parsed.serviceInterests, ["branding", "desenvolvimento-web"]);
  assert.equal(contactLeadSchema.safeParse({ ...validContact, serviceInterests: [" "] }).success, false);
  assert.equal(contactLeadSchema.safeParse({ ...validContact, serviceInterests: Array(10).fill("branding") }).success, false);
  assert.equal(contactLeadSchema.safeParse({ ...validContact, serviceInterests: ["branding", "branding"] }).success, false);
});

test("contact idempotency key is required, bounded and opaque", () => {
  assert.equal(contactIdempotencyKeySchema.safeParse("4d46c90e-c774-4d4d-b48d-8ddeae33fd54").success, true);
  assert.equal(contactIdempotencyKeySchema.safeParse("STAGING_TEST:run:contact").success, true);
  assert.equal(contactIdempotencyKeySchema.safeParse(null).success, false);
  assert.equal(contactIdempotencyKeySchema.safeParse("ana@example.com").success, false);
  assert.equal(contactIdempotencyKeySchema.safeParse("key with spaces").success, false);
  assert.equal(contactIdempotencyKeySchema.safeParse("k".repeat(129)).success, false);
});

test("contact contract preserves contextual source and multiple intentions", () => {
  const parsed = contactLeadSchema.parse({
    ...validContact,
    source: "contact-page:offer",
    serviceInterests: ["technology", "branding"]
  });
  assert.equal(parsed.source, "contact-page:offer");
  assert.deepEqual(parsed.serviceInterests, ["technology", "branding"]);
});

test("partnership modality is structured and versioned while legacy partnership payloads remain valid", () => {
  const legacy = contactLeadSchema.parse({ ...validContact, requestType: "partnership" });
  assert.equal(legacy.partnershipApplication, undefined);

  for (const modality of ["referral", "active_commercial"] as const) {
    const parsed = contactLeadSchema.parse({
      ...validContact,
      requestType: "partnership",
      partnershipApplication: { version: 1, modality }
    });
    assert.deepEqual(parsed.partnershipApplication, { version: 1, modality });
  }

  assert.equal(contactLeadSchema.safeParse({
    ...validContact,
    requestType: "partnership",
    partnershipApplication: { version: 2, modality: "referral" }
  }).success, false);
  assert.equal(contactLeadSchema.safeParse({
    ...validContact,
    requestType: "partnership",
    partnershipApplication: { version: 1, modality: "unapproved" }
  }).success, false);
  assert.equal(contactLeadSchema.safeParse({
    ...validContact,
    requestType: "new_project",
    partnershipApplication: { version: 1, modality: "referral" }
  }).success, false);
});

test("talent contract requires professional links and consent", () => {
  const parsed = talentApplicationSchema.parse(validTalent);
  assert.equal(parsed.email, "ana@example.com");
  assert.equal(talentApplicationSchema.safeParse({ ...validTalent, linkedin: "not-a-url" }).success, false);
  assert.equal(talentApplicationSchema.safeParse({ ...validTalent, consent: false }).success, false);
});
