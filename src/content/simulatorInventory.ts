export type SimulatorInventoryItem = {
  id: string;
  pagePath: string;
  kind: "calculation" | "diagnostic" | "planner";
  inputs: readonly string[];
  output: string;
  cta: string;
  version: number;
  configurationSource: "code_versioned" | "editorial_interaction";
  remoteConfigurationReady: boolean;
};

// Only versioned calculations are eligible for future parameter synchronization.
// Diagnostics and planners remain local until their scoring rules have an approved source.
export const SIMULATOR_INVENTORY: readonly SimulatorInventoryItem[] = [
  {
    id: "social_editorial_diagnostic",
    pagePath: "/servicos/gestao-de-redes-sociais",
    kind: "diagnostic",
    inputs: ["challenge", "routine", "channels", "priority", "formats", "moment"],
    output: "editorial recommendation",
    cta: "WhatsApp diagnostic follow-up",
    version: 1,
    configurationSource: "editorial_interaction",
    remoteConfigurationReady: false
  },
  {
    id: "hosting_price",
    pagePath: "/hospedagem-manutencao-sites",
    kind: "calculation",
    inputs: ["plan", "sites", "emails", "storageGb", "applyUpgrade"],
    output: "estimated monthly price",
    cta: "WhatsApp setup request",
    version: 1,
    configurationSource: "code_versioned",
    remoteConfigurationReady: true
  },
  {
    id: "affiliate_commission",
    pagePath: "/programa-afiliados",
    kind: "calculation",
    inputs: ["brandingProjects", "websiteProjects", "socialMediaContracts"],
    output: "one-time and recurring commission",
    cta: "affiliate registration",
    version: 1,
    configurationSource: "code_versioned",
    remoteConfigurationReady: true
  },
  {
    id: "process_intelligence_waste",
    pagePath: "/servicos/process-intelligence",
    kind: "calculation",
    inputs: ["collaborators", "hoursPerDay", "monthlySalary"],
    output: "annual waste and recoverable hours",
    cta: "diagnostic contact",
    version: 1,
    configurationSource: "code_versioned",
    remoteConfigurationReady: true
  },
  {
    id: "process_activation_maturity",
    pagePath: "/servicos/process-activation",
    kind: "diagnostic",
    inputs: ["activation level"],
    output: "implementation roadmap",
    cta: "activation contact",
    version: 1,
    configurationSource: "editorial_interaction",
    remoteConfigurationReady: false
  },
  {
    id: "audiovisual_scope_planner",
    pagePath: "/servicos/producao-audiovisual",
    kind: "planner",
    inputs: ["format", "deliverables"],
    output: "audiovisual scope context",
    cta: "WhatsApp planning request",
    version: 1,
    configurationSource: "editorial_interaction",
    remoteConfigurationReady: false
  },
  {
    id: "marketing_assessment_quiz",
    pagePath: "/servicos/assessoria-marketing-digital-estrategico",
    kind: "diagnostic",
    inputs: ["strategic assessment answers"],
    output: "marketing clarity level",
    cta: "strategic assessment contact",
    version: 1,
    configurationSource: "editorial_interaction",
    remoteConfigurationReady: false
  }
];
