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
  image: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  results: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Estratégia" | "Branding" | "Performance" | "Processos" | "Web";
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
  service: string;
  stage: string;
  message: string;
}
