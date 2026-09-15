export type PublicEvidenceStatus = "approved" | "pending" | "remove";

/**
 * Single publication gate for public claims that require commercial evidence
 * or authorization. Pending items remain in the codebase for review but are
 * not eligible for rendering, routes, or the sitemap.
 */
export const PUBLIC_EVIDENCE_STATUS = {
  "team/carlos-henrique-martins": "pending",
  "team/ignacio-quiroz": "pending",
  "team/pedro-felix": "pending",
  "team/daniel-lopes": "pending",
  "team/guilherme-gomes": "pending",
  "team/amazing-design": "pending",
  "team/andreia-braga": "pending",
  "home-case/alan-rocha": "pending",
  "home-case/le-visage": "pending",
  "home-case/luciana-gadelha": "pending",
  "home-case/doctor-play": "pending",
  "home-case/legal-lab": "pending",
  "home-case/squalis": "pending",
  "portfolio-candidate/lavar-roupa": "pending",
  "portfolio-candidate/alugue-por-temporada": "pending",
  "portfolio-candidate/centro-de-olhos": "pending",
  "portfolio-candidate/le-visage": "pending",
  "portfolio-candidate/luciana-gadelha": "pending",
  "portfolio-candidate/espaco-glau-campos": "pending",
  "case-study/case-clinica-alphaville": "pending",
  "case-study/case-saas-process": "pending",
  "case-study/case-branding-advocacia": "pending",
  "mini-case/clinica-alphaville": "pending",
  "mini-case/processflow-erp": "pending",
  "mini-case/nunes-associados": "pending",
  "mini-case/grupo-medeiros": "pending",
  "mini-case/zenith-corporativo": "pending",
  "mini-case/vanguard-sec": "pending",
  "internal-testimonial/roberta-chaves": "pending",
  "internal-testimonial/marcus-azevedo": "pending",
  "internal-testimonial/juliana-reis": "pending",
  "internal-testimonial/beatriz-nogueira": "pending"
} as const satisfies Record<string, PublicEvidenceStatus>;

export const isPublicEvidenceApproved = (evidenceKey: string): boolean =>
  (PUBLIC_EVIDENCE_STATUS as Record<string, PublicEvidenceStatus>)[evidenceKey] === "approved";

export const getApprovedEvidence = <T>(items: readonly T[], getEvidenceKey: (item: T) => string): T[] =>
  items.filter((item) => isPublicEvidenceApproved(getEvidenceKey(item)));
