import assert from "node:assert/strict";
import test from "node:test";
import { contactLeadSchema, talentApplicationSchema } from "../server/submissionContracts";

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
  assert.equal(contactLeadSchema.safeParse({ ...validContact, consent: false }).success, false);
});

test("talent contract requires professional links and consent", () => {
  const parsed = talentApplicationSchema.parse(validTalent);
  assert.equal(parsed.email, "ana@example.com");
  assert.equal(talentApplicationSchema.safeParse({ ...validTalent, linkedin: "not-a-url" }).success, false);
  assert.equal(talentApplicationSchema.safeParse({ ...validTalent, consent: false }).success, false);
});
