import assert from "node:assert/strict";
import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import {
  PUBLIC_EVIDENCE,
  getVisibleEvidence,
  hasPendingPublicEvidence,
  hasUnpublishedPublicEvidence,
  isEvidenceVisible,
  type PublicEvidenceRecord,
  type PublicEvidenceStatus,
  validatePublicEvidence
} from "../src/content/publicEvidence";

assert.deepEqual(validatePublicEvidence(), [], "Public evidence records remain structurally valid");

for (const contract of PUBLICATION_CONTRACTS) {
  assert.ok(contract.evidenceKeys.length > 0, `${contract.route}:${contract.section} must track evidence`);
  for (const key of contract.evidenceKeys) assert.ok(PUBLIC_EVIDENCE[key], `${contract.route} references unknown evidence ${key}`);
}

const keys = (prefix: string) => Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith(prefix));
const teamKeys = keys("team/");
const clientLogoKeys = keys("client-logo/");
const assessoria = "/servicos/assessoria-marketing-digital-estrategico";

assert.equal(teamKeys.length, 7);
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre").length, 5, "Only approved profiles render on Sobre");
assert.equal(PUBLICATION_CONTRACTS.some((contract) => contract.section === "mini-cases"), false, "Mini-case sections are no longer part of public route contracts");
assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/sobre").length, 12);
assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/").length, 2);

const investigateKeys = keys("").filter((key) => {
  const record = PUBLIC_EVIDENCE[key as keyof typeof PUBLIC_EVIDENCE];
  return record.status === "investigate" && ["team/", "home-case/", "portfolio-candidate/", "case-study/"].some((prefix) => key.startsWith(prefix));
});
assert.equal(investigateKeys.length, 25);
assert.equal(investigateKeys.filter((key) => key.startsWith("team/")).length, 2);
assert.equal(investigateKeys.filter((key) => key.startsWith("home-case/")).length, 0);
assert.equal(investigateKeys.filter((key) => key.startsWith("portfolio-candidate/")).length, 6);
assert.equal(investigateKeys.filter((key) => key.startsWith("case-study/")).length, 17);

for (const key of investigateKeys) {
  const record = PUBLIC_EVIDENCE[key as keyof typeof PUBLIC_EVIDENCE];
  assert.equal(record.status, "investigate", `${key} keeps its editorial status`);
  assert.equal(isEvidenceVisible(key, record.allowedRoutes[0]), false, `${key} must not render before approval`);
}

const approvedHomeCases = Object.entries(PUBLIC_EVIDENCE).filter(([key, record]) => key.startsWith("home-case/") && record.status === "approved");
assert.equal(approvedHomeCases.length, 14, "The 14 source-grounded case summaries are authorized for the Home only");
assert.ok(approvedHomeCases.every(([key]) => isEvidenceVisible(key, "/")), "Approved Home summaries render on the Home");
assert.ok(approvedHomeCases.every(([, record]) => !record.allowedRoutes.some((route) => route.startsWith("/casos/"))), "Home approval does not publish detail pages");
assert.equal(hasPendingPublicEvidence(), false);
assert.equal(hasUnpublishedPublicEvidence(), true, "Editorial status reporting still detects unpublished decisions");

assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre"), true);
assert.equal(isEvidenceVisible("client-logo/cayuca", "/"), false);
assert.equal(isEvidenceVisible("client-logo/alugue-por-temporada", "/"), true, "The matching local logo is authorized only as part of its Home case");
assert.equal(isEvidenceVisible("client-logo/luciana-gadelha", "/"), true, "The matching local logo is authorized only as part of its Home case");
const approvedRecord = PUBLIC_EVIDENCE["client-logo/cayuca"] as { status: PublicEvidenceStatus };
try {
  approvedRecord.status = "remove";
  assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre"), false);
} finally {
  approvedRecord.status = "approved";
}

const incompleteApproval: Record<string, PublicEvidenceRecord> = {
  "team/example": {
    kind: "team",
    label: "Exemplo",
    allowedRoutes: ["/sobre"],
    status: "approved",
    decisionOwner: "Carlos Henrique Martins",
    decidedAt: null,
    evidenceReference: null,
    validUntil: null,
    reason: "Teste"
  }
};
assert.ok(validatePublicEvidence(incompleteApproval).some((error) => error.includes("aprovação exige")));
