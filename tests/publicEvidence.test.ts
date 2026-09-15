import assert from "node:assert/strict";
import { PUBLICATION_CONTRACTS } from "../src/content/publicationContracts";
import { PUBLIC_EVIDENCE, getVisibleEvidence, isEvidenceVisible, type PublicEvidenceRecord, validatePublicEvidence } from "../src/content/publicEvidence";

assert.deepEqual(validatePublicEvidence(), [], "O registro público precisa estar estruturalmente válido");

for (const contract of PUBLICATION_CONTRACTS) {
  assert.ok(contract.evidenceKeys.length > 0, `${contract.route}:${contract.section} precisa ter itens registrados`);
  for (const key of contract.evidenceKeys) {
    assert.ok(PUBLIC_EVIDENCE[key], `${contract.route}:${contract.section} referencia uma chave inexistente: ${key}`);
    assert.ok(PUBLIC_EVIDENCE[key].allowedRoutes.includes(contract.route), `${key} não está autorizado para ${contract.route}`);
  }
}

const teamKeys = Object.keys(PUBLIC_EVIDENCE).filter((key) => key.startsWith("team/"));
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "public").length, 0, "Perfis pendentes não podem aparecer publicamente");
assert.equal(getVisibleEvidence(teamKeys, (key) => key, "/sobre", "review").length, 7, "A prévia local precisa mostrar todos os perfis pendentes");
assert.equal(isEvidenceVisible("team/carlos-henrique-martins", "/", "review"), false, "A prévia respeita o escopo autorizado da rota");

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
