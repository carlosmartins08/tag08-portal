import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentReviewBanner, EvidenceReviewBadge } from "../src/components/ContentReview";
import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import { PUBLIC_EVIDENCE, getVisibleEvidence, hasPendingPublicEvidence, hasUnpublishedPublicEvidence, isEvidenceVisible, type PublicEvidenceRecord, type PublicEvidenceStatus, validatePublicEvidence } from "../src/content/publicEvidence";

assert.deepEqual(validatePublicEvidence(), [], "O registro público precisa estar estruturalmente válido");

for (const contract of PUBLICATION_CONTRACTS) {
  assert.ok(contract.evidenceKeys.length > 0, `${contract.route}:${contract.section} precisa ter itens registrados`);
  for (const key of contract.evidenceKeys) {
    assert.ok(PUBLIC_EVIDENCE[key], `${contract.route}:${contract.section} referencia uma chave inexistente: ${key}`);
  }
}

const teamKeys = Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("team/"));
const clientLogoKeys = Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("client-logo/"));
const miniCaseKeys = Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("mini-case/"));
assert.equal(teamKeys.length, 7, "The seven decided team profiles remain covered");
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "public").length, 0, "Perfis em investigação não podem aparecer publicamente na página Sobre");
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "review").length, 7, "A prévia local pode preservar os perfis em investigação para revisão");
assert.equal(getVisibleEvidence(miniCaseKeys, (key) => key, "/servicos/assessoria-marketing-digital-estrategico", "public").length, 6, "Mini-cases aprovados precisam aparecer em Assessoria");
assert.equal(getVisibleEvidence(miniCaseKeys, (key) => key, "/servicos/branding-identidade", "public").length, 0, "Mini-cases não podem vazar para serviços fora do escopo aprovado");
assert.equal(isEvidenceVisible("team/carlos-henrique-martins", "/", "review"), false, "A prévia respeita o escopo autorizado da rota");
assert.equal(isEvidenceVisible("mini-case/clinica-alphaville", "/servicos/branding-identidade", "review"), false, "A prévia também respeita a autorização restrita da Assessoria");

assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/sobre", "public").length, 12, "Logos de clientes aprovados precisam aparecer publicamente em Sobre");
assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/", "public").length, 0, "Logos de clientes nÃ£o podem vazar para fora da rota autorizada");

const investigateKeys = Object.keys(PUBLIC_EVIDENCE).filter((key) =>
  key.startsWith("team/") || key.startsWith("home-case/") || key.startsWith("portfolio-candidate/") || key.startsWith("case-study/")
);
assert.equal(investigateKeys.length, 22, "All human-investigation decisions remain explicitly enumerated");
assert.equal(investigateKeys.filter((key) => key.startsWith("home-case/")).length, 6, "All six decided Home cases remain covered");
assert.equal(investigateKeys.filter((key) => key.startsWith("portfolio-candidate/")).length, 6, "All six decided portfolio candidates remain covered");
assert.equal(investigateKeys.filter((key) => key.startsWith("case-study/")).length, 3, "All three decided detailed cases remain covered");
for (const key of investigateKeys) {
  const evidence = PUBLIC_EVIDENCE[key as keyof typeof PUBLIC_EVIDENCE];
  assert.equal(evidence.status, "investigate", `${key} retains the explicit investigation state`);
  assert.equal(isEvidenceVisible(key, evidence.allowedRoutes[0], "public"), false, `${key} is hidden on its allowed route in public mode`);
  assert.equal(isEvidenceVisible(key, evidence.allowedRoutes[0], "review"), true, `${key} is also visible on its allowed route in review mode`);
}
assert.equal(getVisibleEvidence(Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("home-case/")), (key) => key, "/", "public").length, 0, "All six investigated Home cases are excluded by the public consumer gate");
assert.equal(getVisibleEvidence(Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("portfolio-candidate/")), (key) => key, "/", "public").length, 0, "All six investigated portfolio candidates fail the public gate");
assert.equal(hasPendingPublicEvidence(), false, "Investigation is not conflated with pending");
assert.equal(hasUnpublishedPublicEvidence(), true, "Investigation is still represented in the local review warning");

const originalNodeEnv = process.env.NODE_ENV;
const originalReviewFlag = process.env.NEXT_PUBLIC_TAG08_CONTENT_REVIEW;
const mutableEnvironment = process.env as unknown as Record<string, string | undefined>;
try {
  mutableEnvironment.NODE_ENV = "development";
  mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW = "1";
  const investigateBadge = renderToStaticMarkup(createElement(EvidenceReviewBadge, { evidenceKey: "team/carlos-henrique-martins" }));
  const homeInvestigateBadge = renderToStaticMarkup(createElement(EvidenceReviewBadge, { evidenceKey: "home-case/alan-rocha" }));
  assert.match(homeInvestigateBadge, /Em investiga/, "Home cases under investigation use the review-only status instead of an approval claim");
  assert.match(investigateBadge, /Em investigação — não publicado/, "Review mode labels investigate distinctly from approved");
  assert.equal(renderToStaticMarkup(createElement(EvidenceReviewBadge, { evidenceKey: "client-logo/cayuca" })), "", "Approved records do not receive an investigation badge");
  assert.match(renderToStaticMarkup(createElement(ContentReviewBanner)), /content-review-banner/, "Review mode signals unpublished investigations");
} finally {
  if (originalNodeEnv === undefined) delete mutableEnvironment.NODE_ENV;
  else mutableEnvironment.NODE_ENV = originalNodeEnv;
  if (originalReviewFlag === undefined) delete mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW;
  else mutableEnvironment.NEXT_PUBLIC_TAG08_CONTENT_REVIEW = originalReviewFlag;
}

const approvedRecord = PUBLIC_EVIDENCE["client-logo/cayuca"];
assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre", "public"), true, "Explicitly approved records remain public");
const mutableApprovedRecord = approvedRecord as { status: PublicEvidenceStatus };
try {
  mutableApprovedRecord.status = "remove";
  assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre", "public"), false, "Removed records remain hidden in public mode");
  assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre", "review"), false, "Removed records remain hidden in review mode");
} finally {
  mutableApprovedRecord.status = "approved";
}
assert.equal(isEvidenceVisible("client-logo/cayuca", "/sobre", "public"), true, "The synthetic remove-state characterization restores the original approved record");
for (const [key, evidence] of Object.entries(PUBLIC_EVIDENCE)) {
  if (evidence.status !== "approved") continue;
  for (const route of evidence.allowedRoutes) {
    assert.equal(isEvidenceVisible(key, route, "public"), true, `${key} remains visible on its explicitly allowed route`);
  }
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
assert.ok(validatePublicEvidence(incompleteApproval).some((error) => error.includes("aprovação exige")), "Aprovação sem registro verificável precisa falhar");
