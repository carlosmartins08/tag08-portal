import { PUBLIC_EVIDENCE, type PublicEvidenceKey } from "./publicEvidence";

export type PublicationContract = {
  route: string;
  section: string;
  evidenceKeys: readonly PublicEvidenceKey[];
  publicBehavior: "hide-when-empty" | "publish-approved-items";
  reviewBehavior: "show-all-except-removed";
};

const keysBy = (kind: (typeof PUBLIC_EVIDENCE)[PublicEvidenceKey]["kind"]): PublicEvidenceKey[] =>
  (Object.keys(PUBLIC_EVIDENCE) as PublicEvidenceKey[]).filter((key) => PUBLIC_EVIDENCE[key].kind === kind);

const miniCaseRoutes = [
  "/servicos/assessoria-marketing-digital-estrategico",
  "/servicos/branding-identidade",
  "/servicos/desenvolvimento-web",
  "/servicos/producao-audiovisual",
  "/servicos/process-intelligence",
  "/servicos/process-activation"
] as const;

export const PUBLICATION_CONTRACTS: readonly PublicationContract[] = [
  { route: "/sobre", section: "team-profiles", evidenceKeys: keysBy("team"), publicBehavior: "hide-when-empty", reviewBehavior: "show-all-except-removed" },
  { route: "/", section: "home-client-cases", evidenceKeys: keysBy("home-case"), publicBehavior: "hide-when-empty", reviewBehavior: "show-all-except-removed" },
  { route: "/", section: "home-portfolio-candidates", evidenceKeys: keysBy("portfolio-candidate"), publicBehavior: "hide-when-empty", reviewBehavior: "show-all-except-removed" },
  ...keysBy("case-study").map((evidenceKey) => ({
    route: PUBLIC_EVIDENCE[evidenceKey].allowedRoutes[0],
    section: "case-study-detail",
    evidenceKeys: [evidenceKey],
    publicBehavior: "publish-approved-items" as const,
    reviewBehavior: "show-all-except-removed" as const
  })),
  ...miniCaseRoutes.map((route) => ({ route, section: "mini-cases", evidenceKeys: keysBy("mini-case"), publicBehavior: "hide-when-empty" as const, reviewBehavior: "show-all-except-removed" as const })),
  { route: "/servicos/assessoria-marketing-digital-estrategico", section: "internal-testimonials", evidenceKeys: keysBy("internal-testimonial"), publicBehavior: "hide-when-empty", reviewBehavior: "show-all-except-removed" }
];
