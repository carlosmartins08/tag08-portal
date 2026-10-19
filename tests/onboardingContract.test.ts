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

const acceptedTeamSubmission = parseAndValidatePayload({
  ...validPayload,
  submissionContext: {
    submittedBy: "tag08_team",
    operatorName: "  Ana TAG08  ",
    clientAuthorizationConfirmed: true
  },
  consent: {
    ...validPayload.consent,
    authorizationConfirmedByOperator: true
  }
});
assert.equal(acceptedTeamSubmission.errors.length, 0);
assert.equal(acceptedTeamSubmission.payload.submissionContext?.operatorName, "Ana TAG08");

const rejectedUnconfirmedTeamSubmission = parseAndValidatePayload({
  ...validPayload,
  submissionContext: { submittedBy: "tag08_team", operatorName: "Ana TAG08", clientAuthorizationConfirmed: false }
});
assert.ok(rejectedUnconfirmedTeamSubmission.errors.some((error) => error.includes("autorização confirmada")));

const rejectedAnonymousTeamSubmission = parseAndValidatePayload({
  ...validPayload,
  submissionContext: { submittedBy: "tag08_team", operatorName: "", clientAuthorizationConfirmed: true },
  consent: { ...validPayload.consent, authorizationConfirmedByOperator: true }
});
assert.ok(rejectedAnonymousTeamSubmission.errors.some((error) => error.includes("autorização confirmada")));

const rejected = parseAndValidatePayload({ ...validPayload, projectContacts: { ...validPayload.projectContacts, email: "invalid" } });
assert.ok(rejected.errors.length > 0);
