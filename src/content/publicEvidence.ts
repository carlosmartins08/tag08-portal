export type PublicEvidenceStatus = "approved" | "pending" | "remove";
export type PublicEvidenceKind = "team" | "home-case" | "portfolio-candidate" | "case-study" | "mini-case" | "internal-testimonial";
export type EvidenceVisibilityMode = "public" | "review";

export const CONTENT_REVIEW_ENV_KEY = "NEXT_PUBLIC_TAG08_CONTENT_REVIEW";

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
  reason: "Aguardando autorização e evidência verificável para publicação."
});

const approved = (kind: PublicEvidenceKind, label: string, allowedRoutes: readonly string[], reason: string): PublicEvidenceRecord => ({
  kind,
  label,
  allowedRoutes,
  status: "approved",
  decisionOwner: "Carlos Henrique Martins",
  decidedAt: "2026-09-15",
  evidenceReference: "approval:conversation-2026-09-15-publication-scope",
  validUntil: null,
  reason
});

/** Fonte executável de publicação; referências nunca guardam documentos sensíveis no repositório. */
export const PUBLIC_EVIDENCE = {
  "team/carlos-henrique-martins": approved("team", "Carlos Henrique Martins", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/ignacio-quiroz": approved("team", "Ignacio Quiroz", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/pedro-felix": approved("team", "Pedro Félix", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/daniel-lopes": approved("team", "Daniel Lopes", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/guilherme-gomes": approved("team", "Guilherme Gomes", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/amazing-design": approved("team", "Amazing Design", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "team/andreia-braga": approved("team", "Andréia Braga", ["/sobre"], "Aprovado para a seção de equipe da página Sobre."),
  "home-case/alan-rocha": pending("home-case", "Alan Rocha", ["/"]),
  "home-case/le-visage": pending("home-case", "Clínica Le Visage", ["/"]),
  "home-case/luciana-gadelha": pending("home-case", "Luciana Gadelha", ["/"]),
  "home-case/doctor-play": pending("home-case", "Doctor Play", ["/"]),
  "home-case/legal-lab": pending("home-case", "Legal Lab", ["/"]),
  "home-case/squalis": pending("home-case", "Squalis Educação", ["/"]),
  "portfolio-candidate/lavar-roupa": pending("portfolio-candidate", "LavarRoupa S.A.", ["/"]),
  "portfolio-candidate/alugue-por-temporada": pending("portfolio-candidate", "Alugue por Temporada", ["/"]),
  "portfolio-candidate/centro-de-olhos": pending("portfolio-candidate", "Centro de Olhos", ["/"]),
  "portfolio-candidate/le-visage": pending("portfolio-candidate", "LeVisage", ["/"]),
  "portfolio-candidate/luciana-gadelha": pending("portfolio-candidate", "Luciana Gadelha", ["/"]),
  "portfolio-candidate/espaco-glau-campos": pending("portfolio-candidate", "Espaço Glau Campos", ["/"]),
  "case-study/case-clinica-alphaville": pending("case-study", "Clínica Médica Alphaville", ["/casos/case-clinica-alphaville"]),
  "case-study/case-saas-process": pending("case-study", "ProcessFlow SaaS", ["/casos/case-saas-process"]),
  "case-study/case-branding-advocacia": pending("case-study", "Nunes & Associados", ["/casos/case-branding-advocacia"]),
  "mini-case/clinica-alphaville": approved("mini-case", "Clínica Alphaville", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
  "mini-case/processflow-erp": approved("mini-case", "ProcessFlow ERP", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
  "mini-case/nunes-associados": approved("mini-case", "Nunes & Associados", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
  "mini-case/grupo-medeiros": approved("mini-case", "Grupo Medeiros", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
  "mini-case/zenith-corporativo": approved("mini-case", "Zenith Corporativo", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
  "mini-case/vanguard-sec": approved("mini-case", "Vanguard Sec", ["/servicos/assessoria-marketing-digital-estrategico"], "Aprovado somente para a página de Assessoria de Marketing Estratégico."),
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

export const isContentReviewMode = (): boolean =>
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_TAG08_CONTENT_REVIEW === "1";

export const getEvidenceVisibilityMode = (): EvidenceVisibilityMode =>
  isContentReviewMode() ? "review" : "public";

export const isEvidenceVisible = (evidenceKey: string, route: string, mode: EvidenceVisibilityMode = "public"): boolean => {
  const evidence = getPublicEvidence(evidenceKey);
  if (!evidence || !evidence.allowedRoutes.includes(route) || evidence.status === "remove") return false;
  return mode === "review" || evidence.status === "approved";
};

export const getVisibleEvidence = <T>(items: readonly T[], getEvidenceKey: (item: T) => string, route: string, mode: EvidenceVisibilityMode = "public"): T[] =>
  items.filter((item) => isEvidenceVisible(getEvidenceKey(item), route, mode));

export const getEvidenceStatusLabel = (evidenceKey: string): PublicEvidenceStatus | "unknown" =>
  getPublicEvidence(evidenceKey)?.status ?? "unknown";

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
