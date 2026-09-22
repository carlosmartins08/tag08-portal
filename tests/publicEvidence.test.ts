import assert from "node:assert/strict";
import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import { PUBLIC_EVIDENCE, getVisibleEvidence, isEvidenceVisible, type PublicEvidenceRecord, validatePublicEvidence } from "../src/content/publicEvidence";

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
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "public").length, 0, "Perfis pendentes não podem aparecer publicamente na página Sobre");
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "review").length, 7, "A prévia local precisa preservar os perfis pendentes para revisão");
assert.equal(getVisibleEvidence(miniCaseKeys, (key) => key, "/servicos/assessoria-marketing-digital-estrategico", "public").length, 6, "Mini-cases aprovados precisam aparecer em Assessoria");
assert.equal(getVisibleEvidence(miniCaseKeys, (key) => key, "/servicos/branding-identidade", "public").length, 0, "Mini-cases não podem vazar para serviços fora do escopo aprovado");
assert.equal(isEvidenceVisible("team/carlos-henrique-martins", "/", "review"), false, "A prévia respeita o escopo autorizado da rota");
assert.equal(isEvidenceVisible("mini-case/clinica-alphaville", "/servicos/branding-identidade", "review"), false, "A prévia também respeita a autorização restrita da Assessoria");

assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/sobre", "public").length, 12, "Logos de clientes aprovados precisam aparecer publicamente em Sobre");
assert.equal(getVisibleEvidence(clientLogoKeys, (key) => key, "/", "public").length, 0, "Logos de clientes nÃ£o podem vazar para fora da rota autorizada");

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
