export const TALENT_INTEREST_AREAS = [
  { value: "design", label: "Design" },
  { value: "social_media", label: "Social Media" },
  { value: "content_copywriting", label: "Conte\u00fado e Copywriting" },
  { value: "audiovisual_production", label: "Produ\u00e7\u00e3o Audiovisual" },
  { value: "paid_traffic", label: "Tr\u00e1fego Pago" },
  { value: "technology_development", label: "Tecnologia e Desenvolvimento" },
  { value: "planning_projects", label: "Planejamento e Projetos" },
  { value: "account_management", label: "Atendimento e Gest\u00e3o de Contas" },
  { value: "sales_sdr", label: "Comercial e SDR" },
  { value: "data_analytics", label: "Dados e Analytics" },
  { value: "administrative_operations", label: "Administrativo e Opera\u00e7\u00f5es" },
  { value: "other_specialties", label: "Outras Especialidades" }
] as const;

export const TALENT_INTEREST_AREA_VALUES = TALENT_INTEREST_AREAS.map(({ value }) => value) as [
  (typeof TALENT_INTEREST_AREAS)[number]["value"],
  ...(typeof TALENT_INTEREST_AREAS)[number]["value"][]
];

export type TalentInterestArea = (typeof TALENT_INTEREST_AREAS)[number]["value"];

export const TALENT_CREATIVE_TECHNICAL_AREAS: readonly TalentInterestArea[] = [
  "design",
  "social_media",
  "content_copywriting",
  "audiovisual_production",
  "paid_traffic",
  "technology_development",
  "data_analytics"
];

export const TALENT_COMMERCIAL_OPERATIONAL_AREAS: readonly TalentInterestArea[] = [
  "planning_projects",
  "account_management",
  "sales_sdr",
  "administrative_operations"
];
