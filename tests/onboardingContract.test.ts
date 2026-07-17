import assert from "node:assert/strict";
import { ONBOARDING_PAYLOAD_VERSION, parseAndValidatePayload } from "../server/onboardingContract";

const validPayload = {
  clientData: { companyName: "TAG08 Teste", preferredLanguage: "pt" },
  projectContacts: { responsibleName: "Responsável", email: "teste@tag08.com.br", whatsapp: "+5583999999999" },
  selectedServices: ["Process Intelligence"],
  businessMoment: {},
  generalBriefing: {},
  serviceSpecificBriefing: {},
  filesAndLinks: {},
  consent: { truthChecked: true, useChecked: true, noPasswordsChecked: true },
  submittedAt: new Date().toISOString(),
  source: "test"
};

const accepted = parseAndValidatePayload(validPayload);
assert.equal(accepted.errors.length, 0);
assert.equal(accepted.payload.schemaVersion, ONBOARDING_PAYLOAD_VERSION);

const rejected = parseAndValidatePayload({ ...validPayload, projectContacts: { ...validPayload.projectContacts, email: "invalid" } });
assert.ok(rejected.errors.length > 0);
