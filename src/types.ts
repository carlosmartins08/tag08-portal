export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  category: "presence" | "branding" | "performance" | "web" | "processes";
  description: string;
  forWhom: string;
  deliverables: string[];
  slug: string;
}

export interface PlanFeature {
  name: string;
  start: boolean | string;
  base: boolean | string;
  performance: boolean | string;
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  indicative: string;
  deliverables: string[];
  ctaText: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  image?: string;
    clientLogo?: string;
    clientLogoEvidenceKey?: string;
  metaTitle?: string;
  metaDescription?: string;
  summary?: string;
  projectStatus?: string;
  searchIntent?: string;
  relatedServicePath?: string;
  relatedServiceTitle?: string;
  metric?: string;
  metricLabel?: string;
  challenge: string;
  solution: string;
  deliverables?: string[];
  results?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Estratégia" | "Conteúdo e Redes" | "Processos" | "Web e Tecnologia" | "Aquisição e Mídia" | "Marca";
  serviceTitle: string;
  servicePath: string;
  serviceNote: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  requestType: "new_project" | "diagnostic" | "existing_client" | "partnership" | "";
  serviceInterests: string[];
  needsServiceGuidance: boolean;
  /** Legacy fields retained for queued submissions and existing integrations. */
  service: string;
  stage: string;
  message: string;
}

export const PARTNERSHIP_MODALITY_VALUES = ["referral", "active_commercial"] as const;
export type PartnershipModality = typeof PARTNERSHIP_MODALITY_VALUES[number];
