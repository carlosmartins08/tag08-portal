export type ReviewSource = "google-business-profile" | "internal";

export type GoogleReview = {
  evidenceKey: string;
  name: string;
  role: string;
  avatar: string;
  time: string;
  tagline: string;
  text: string;
  category: string;
  source: ReviewSource;
};

export const TRUST_REVIEWS: GoogleReview[] = [
  {
    evidenceKey: "internal-testimonial/roberta-chaves",
    name: "Dra. Roberta Chaves",
    role: "Clínica de Odontologia",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    time: "há 2 semanas",
    tagline: "Clareza no posicionamento",
    text: "Fizemos o reposicionamento estético da nossa clínica e o novo site estruturado com a TAG08. Estou impactada com a precisão do design. Nosso volume de pacientes particulares de alto padrão aumentou muito porque finalmente nossa comunicação condiz com o nosso tratamento.",
    category: "BRANDING ATIVO",
    source: "internal",
  },
  {
    evidenceKey: "internal-testimonial/marcus-azevedo",
    name: "Marcus Azevedo",
    role: "CEO, Azevedo Asset",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Acompanhamento do processo",
    text: "Trabalho impecável de Process Intelligence. Eles auditaram nossa estrutura e desenharam um hub assíncrono que acabou com a bagunça no WhatsApp. O time hoje sabe exatamente o que fazer com playbooks dinâmicos. Economia gigantesca de tempo de gerência.",
    category: "PROCESSES",
    source: "internal",
  },
  {
    evidenceKey: "internal-testimonial/juliana-reis",
    name: "Juliana Reis",
    role: "Sócia Fundadora, Le Visage Spa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "há 3 semanas",
    tagline: "Coerência entre promessa e entrega",
    text: "A assessoria de redes sociais e conteúdo da TAG08 é magnifica. Eles planejam os carrosséis e roteiros de reels com foco em elegância e sofisticação, fugindo daquilo que as agências comuns entregam. Elevou nossa marca no mercado de luxo local.",
    category: "REDES SOCIAIS",
    source: "internal",
  },
  {
    evidenceKey: "internal-testimonial/beatriz-nogueira",
    name: "Beatriz Nogueira",
    role: "Diretora de Marketing, Grupo BN",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    time: "há 1 mês",
    tagline: "Diagnóstico com mais clareza",
    text: "O diagnóstico inicial deles foi melhor do que muitas consultorias pagas que já contratamos. Eles mostram os furos exatos na estrutura de branding e oferecem um plano claro. Implementamos tudo e o caminho ficou mais claro.",
    category: "DIAGNÓSTICO",
    source: "internal",
  },
];
