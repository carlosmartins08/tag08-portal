export type PublicEvidenceStatus = "approved" | "pending" | "investigate" | "remove";
export type PublicEvidenceKind = "team" | "client-logo" | "home-case" | "portfolio-candidate" | "case-study" | "internal-testimonial";
export type PublicEvidenceRecord = {
  kind: PublicEvidenceKind;
  label: string;
  allowedRoutes: readonly string[];
  status: PublicEvidenceStatus;
  decisionOwner: "Carlos Henrique Martins";
  decidedAt: string | null;
  evidenceReference: string | null;
  validUntil: string | null;
  reason: string;
};

const pending = (kind: PublicEvidenceKind, label: string, allowedRoutes: readonly string[]): PublicEvidenceRecord => ({
  kind,
  label,
  allowedRoutes,
  status: "pending",
  decisionOwner: "Carlos Henrique Martins",
  decidedAt: null,
  evidenceReference: null,
  validUntil: null,
  reason: "Aguardando decisão editorial."
});

const investigate = (kind: PublicEvidenceKind, label: string, allowedRoutes: readonly string[]): PublicEvidenceRecord => ({
  kind,
  label,
  allowedRoutes,
  status: "investigate",
  decisionOwner: "Carlos Henrique Martins",
  decidedAt: "2026-10-19",
  evidenceReference: "decision:docs/architecture-consolidation/14_PUBLIC_EVIDENCE_DECISIONS.md",
  validUntil: null,
  reason: "Decisão humana: investigar origem, vínculo e autorização antes de publicação."
});

const caseStudyCandidate = (label: string, detailRoute: string): PublicEvidenceRecord =>
  investigate("case-study", label, [detailRoute]);

const approved = (
  kind: PublicEvidenceKind,
  label: string,
  allowedRoutes: readonly string[],
  reason: string,
  approval: Pick<PublicEvidenceRecord, "decidedAt" | "evidenceReference"> = {
    decidedAt: "2026-09-15",
    evidenceReference: "approval:conversation-2026-09-15-publication-scope"
  }
): PublicEvidenceRecord => ({
  kind,
  label,
  allowedRoutes,
  status: "approved",
  decisionOwner: "Carlos Henrique Martins",
  decidedAt: approval.decidedAt,
  evidenceReference: approval.evidenceReference,
  validUntil: null,
  reason
});

const clientLogoApproval = {
  decidedAt: "2026-09-18",
  evidenceReference: "approval:conversation-2026-09-18-client-logo-publication"
} as const;

const teamProfilesApproval = {
  decidedAt: "2026-10-29",
  evidenceReference: "approval:conversation-2026-10-29-team-profiles-publication"
} as const;

const homeCaseCurationApproval = {
  decidedAt: "2026-11-24",
  evidenceReference: "approval:conversation-2026-11-24-static-home-case-curation"
} as const;

const homeCaseLogoApproval = {
  decidedAt: "2026-11-24",
  evidenceReference: "approval:conversation-2026-11-24-case-logos-on-home"
} as const;

const homeCase = (label: string): PublicEvidenceRecord => approved(
  "home-case",
  label,
  ["/"],
  "Síntese factual estática baseada no material de case consultado no Google Drive e autorizada para exibição na Home; páginas de detalhe continuam bloqueadas.",
  homeCaseCurationApproval
);

/** Fonte executável de publicação; referências nunca guardam documentos sensíveis no repositório. */
export const PUBLIC_EVIDENCE = {
  "team/carlos-henrique-martins": approved("team", "Carlos Henrique Martins", ["/sobre"], "Retrato, apresentação profissional e link público aprovados para a página Sobre.", teamProfilesApproval),
  "team/ignacio-quiroz": approved("team", "Ignacio Quiroz", ["/sobre"], "Retrato, apresentação profissional e link público aprovados para a página Sobre.", teamProfilesApproval),
  "team/pedro-felix": approved("team", "Pedro Félix", ["/sobre"], "Retrato, apresentação profissional e link público aprovados para a página Sobre.", teamProfilesApproval),
  "team/daniel-lopes": approved("team", "Daniel Lopes", ["/sobre"], "Retrato, apresentação profissional e link público aprovados para a página Sobre.", teamProfilesApproval),
  "team/guilherme-gomes": investigate("team", "Guilherme Gomes", ["/sobre"]),
  "team/amazing-design": investigate("team", "Amazing Design", ["/sobre"]),
  "team/andreia-braga": approved("team", "Andréia Braga", ["/sobre"], "Retrato, apresentação de colaboração em projetos e link público aprovados para a página Sobre.", teamProfilesApproval),
  "client-logo/cayuca": approved("client-logo", "CaYuCa", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/wscom": approved("client-logo", "WSCOM", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/vr-imobiliaria": approved("client-logo", "VR Imobiliária", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/vaqrama": approved("client-logo", "Vaqrama", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/alugue-por-temporada": approved("client-logo", "Alugue por Temporada", ["/sobre", "/"], "Autorizado para uso institucional e identificacao do case correspondente na Home.", homeCaseLogoApproval),
  "client-logo/segura-epi": approved("client-logo", "Segura EPI", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/ruben-a": approved("client-logo", "Ruben A.", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/reavivare": approved("client-logo", "Reavivare", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/raquel-cordeiro": approved("client-logo", "Raquel Cordeiro", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/luciana-gadelha": approved("client-logo", "Luciana Gadelha", ["/sobre", "/"], "Autorizado para uso institucional e identificacao do case correspondente na Home.", homeCaseLogoApproval),
  "client-logo/home-office": approved("client-logo", "HomeOffice", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "client-logo/harmonic": approved("client-logo", "Harmonic", ["/sobre"], "Autorizado para apresentação institucional da TAG08.", clientLogoApproval),
  "home-case/lavarroupa-sa-branding-lavanderia-self-service": homeCase("LavarRoupa S.A."),
  "home-case/centro-de-olhos-rebranding-clinica-oftalmologica": homeCase("Centro de Olhos"),
  "home-case/levisage-branding-clinica-premium": homeCase("LeVisage"),
  "home-case/alugue-por-temporada-branding-produto-digital": homeCase("Alugue por Temporada"),
  "home-case/luciana-gadelha-marca-pessoal": homeCase("Luciana Gadelha"),
  "home-case/espaco-glau-campos-identidade-visual": homeCase("Espaço Glau Campos"),
  "home-case/unida-construtora-presenca-digital": homeCase("Unida Construtora"),
  "home-case/econotrip-modelagem-prototipo-mvp": homeCase("EconoTrip"),
  "home-case/personapp-evolucao-produto-digital": homeCase("PersonApp"),
  "home-case/liga-do-laser-preparacao-infoproduto": homeCase("Liga do Laser"),
  "home-case/sm-advocacia-marca-conteudo": homeCase("SM Advocacia"),
  "home-case/jl-corretora-rebranding": homeCase("JL Corretora de Seguros"),
  "home-case/chama-o-dermato-lancamentos": homeCase("Chama o Dermato"),
  "home-case/doctorplay-modelagem-marca-produto": homeCase("DoctorPlay"),
  "portfolio-candidate/lavar-roupa": investigate("portfolio-candidate", "LavarRoupa S.A.", ["/"]),
  "portfolio-candidate/alugue-por-temporada": investigate("portfolio-candidate", "Alugue por Temporada", ["/"]),
  "portfolio-candidate/centro-de-olhos": investigate("portfolio-candidate", "Centro de Olhos", ["/"]),
  "portfolio-candidate/le-visage": investigate("portfolio-candidate", "LeVisage", ["/"]),
  "portfolio-candidate/luciana-gadelha": investigate("portfolio-candidate", "Luciana Gadelha", ["/"]),
  "portfolio-candidate/espaco-glau-campos": investigate("portfolio-candidate", "Espaço Glau Campos", ["/"]),
  "case-study/case-clinica-alphaville": investigate("case-study", "Clínica Médica Alphaville", ["/casos/case-clinica-alphaville"]),
  "case-study/case-saas-process": investigate("case-study", "ProcessFlow SaaS", ["/casos/case-saas-process"]),
  "case-study/case-branding-advocacia": investigate("case-study", "Nunes & Associados", ["/casos/case-branding-advocacia"]),
  "case-study/lavarroupa-sa-branding-lavanderia-self-service": caseStudyCandidate("LavarRoupa S.A.", "/casos/lavarroupa-sa-branding-lavanderia-self-service"),
  "case-study/centro-de-olhos-rebranding-clinica-oftalmologica": caseStudyCandidate("Centro de Olhos", "/casos/centro-de-olhos-rebranding-clinica-oftalmologica"),
  "case-study/levisage-branding-clinica-premium": caseStudyCandidate("LeVisage", "/casos/levisage-branding-clinica-premium"),
  "case-study/alugue-por-temporada-branding-produto-digital": caseStudyCandidate("Alugue por Temporada", "/casos/alugue-por-temporada-branding-produto-digital"),
  "case-study/luciana-gadelha-marca-pessoal": caseStudyCandidate("Luciana Gadelha", "/casos/luciana-gadelha-marca-pessoal"),
  "case-study/espaco-glau-campos-identidade-visual": caseStudyCandidate("Espaço Glau Campos", "/casos/espaco-glau-campos-identidade-visual"),
  "case-study/unida-construtora-presenca-digital": caseStudyCandidate("Unida Construtora", "/casos/unida-construtora-presenca-digital"),
  "case-study/econotrip-modelagem-prototipo-mvp": caseStudyCandidate("EconoTrip", "/casos/econotrip-modelagem-prototipo-mvp"),
  "case-study/personapp-evolucao-produto-digital": caseStudyCandidate("PersonApp", "/casos/personapp-evolucao-produto-digital"),
  "case-study/liga-do-laser-preparacao-infoproduto": caseStudyCandidate("Liga do Laser", "/casos/liga-do-laser-preparacao-infoproduto"),
  "case-study/sm-advocacia-marca-conteudo": caseStudyCandidate("SM Advocacia", "/casos/sm-advocacia-marca-conteudo"),
  "case-study/jl-corretora-rebranding": caseStudyCandidate("JL Corretora de Seguros", "/casos/jl-corretora-rebranding"),
  "case-study/chama-o-dermato-lancamentos": caseStudyCandidate("Chama o Dermato", "/casos/chama-o-dermato-lancamentos"),
  "case-study/doctorplay-modelagem-marca-produto": caseStudyCandidate("DoctorPlay", "/casos/doctorplay-modelagem-marca-produto"),
  "internal-testimonial/roberta-chaves": approved("internal-testimonial", "Dra. Roberta Chaves", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado para os depoimentos internos da página de Assessoria."),
  "internal-testimonial/marcus-azevedo": approved("internal-testimonial", "Marcus Azevedo", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado para os depoimentos internos da página de Assessoria."),
  "internal-testimonial/juliana-reis": approved("internal-testimonial", "Juliana Reis", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado para os depoimentos internos da página de Assessoria."),
  "internal-testimonial/beatriz-nogueira": approved("internal-testimonial", "Beatriz Nogueira", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado para os depoimentos internos da página de Assessoria.")
} as const satisfies Record<string, PublicEvidenceRecord>;

export type PublicEvidenceKey = keyof typeof PUBLIC_EVIDENCE;
export const PUBLIC_EVIDENCE_STATUS: Record<PublicEvidenceKey, PublicEvidenceStatus> = Object.fromEntries(
  Object.entries(PUBLIC_EVIDENCE).map(([key, record]) => [key, record.status])
) as Record<PublicEvidenceKey, PublicEvidenceStatus>;

export const getPublicEvidence = (evidenceKey: string): PublicEvidenceRecord | undefined =>
  (PUBLIC_EVIDENCE as Record<string, PublicEvidenceRecord>)[evidenceKey];

export const isEvidenceVisible = (evidenceKey: string, route: string): boolean => {
  const evidence = getPublicEvidence(evidenceKey);
  return Boolean(evidence && evidence.status === "approved" && evidence.allowedRoutes.includes(route));
};

export const getVisibleEvidence = <T>(items: readonly T[], getEvidenceKey: (item: T) => string, route: string): T[] =>
  items.filter((item) => isEvidenceVisible(getEvidenceKey(item), route));

export const getEvidenceStatusLabel = (evidenceKey: string): PublicEvidenceStatus | "unknown" =>
  getPublicEvidence(evidenceKey)?.status ?? "unknown";

export const hasPendingPublicEvidence = (): boolean =>
  Object.values(PUBLIC_EVIDENCE).some((evidence) => evidence.status === "pending");

export const hasUnpublishedPublicEvidence = (): boolean =>
  Object.values(PUBLIC_EVIDENCE).some((evidence) => evidence.status === "pending" || evidence.status === "investigate");

export const validatePublicEvidence = (records: Record<string, PublicEvidenceRecord> = PUBLIC_EVIDENCE): string[] =>
  Object.entries(records).flatMap(([key, evidence]) => {
    const errors: string[] = [];
    if (!key.includes("/")) errors.push(`${key}: chave deve identificar o tipo e o item.`);
    if (!evidence.label.trim()) errors.push(`${key}: nome público ausente.`);
    if (!evidence.allowedRoutes.length || evidence.allowedRoutes.some((route) => !route.startsWith("/"))) errors.push(`${key}: rotas autorizadas inválidas.`);
    if (evidence.decisionOwner !== "Carlos Henrique Martins") errors.push(`${key}: responsável pela decisão inválido.`);
    if (evidence.status === "approved" && (!evidence.decidedAt || !evidence.evidenceReference)) errors.push(`${key}: aprovação exige data e referência verificável.`);
    if (evidence.status === "remove" && !evidence.decidedAt) errors.push(`${key}: remoção exige data de decisão.`);
    return errors;
  });
