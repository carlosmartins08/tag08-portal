import type { EditorialSectionId } from "./editorialContentV1";

export interface ServiceInsightsBridgeConfig {
  servicePath: string;
  serviceTitle: string;
  sectionId: EditorialSectionId;
  title: string;
  intro: string;
}

/**
 * Contextual placement is curated in the portal, while article metadata and
 * canonical URLs come from the blog's versioned editorial contract.
 * Empty or unavailable editorial data must not fall back to local fixtures.
 */
export const SERVICE_INSIGHTS_BRIDGE_CONTENT: Record<string, ServiceInsightsBridgeConfig> = {
  "/servicos/desenvolvimento-web": {
    servicePath: "/servicos/desenvolvimento-web",
    serviceTitle: "Desenvolvimento Web",
    sectionId: "service:web-development",
    title: "Leituras que ajudam a estruturar um site",
    intro:
      "A ponte editorial aqui existe para reduzir dúvida antes da conversa. Os temas abaixo tratam de estrutura, clareza, conteúdo e apoio ao comercial.",
  },
  "/servicos/assessoria-marketing-digital-estrategico": {
    servicePath: "/servicos/assessoria-marketing-digital-estrategico",
    serviceTitle: "Assessoria Estratégica de Negócios",
    sectionId: "service:strategic-marketing",
    title: "Leituras que ajudam a decidir melhor antes de executar",
    intro:
      "A ponte editorial aqui existe para reduzir dúvida antes da conversa. Os temas abaixo tratam de diagnóstico, objetivo, contexto e próximos passos de marketing.",
  },
  "/servicos/process-intelligence": {
    servicePath: "/servicos/process-intelligence",
    serviceTitle: "Process Intelligence",
    sectionId: "service:process-intelligence",
    title: "Leituras que ajudam a organizar a operação antes de acelerar",
    intro:
      "A ponte editorial aqui existe para reduzir ruído antes da conversa. Os temas abaixo tratam de diagnóstico, ferramenta e clareza operacional para sustentar o crescimento.",
  },
  "/servicos/gestao-de-redes-sociais": {
    servicePath: "/servicos/gestao-de-redes-sociais",
    serviceTitle: "Gestão de Redes Sociais",
    sectionId: "service:social-media",
    title: "Leituras que ajudam a sustentar presença com direção",
    intro:
      "A ponte editorial aqui existe para reduzir ruído antes da conversa. Os temas abaixo tratam de jornada, vídeo e intenção para que a presença nas redes tenha função real.",
  },
  "/servicos/branding-identidade": {
    servicePath: "/servicos/branding-identidade",
    serviceTitle: "Branding e Identidade Visual",
    sectionId: "service:branding",
    title: "Leituras para transformar identidade em uma marca utilizável",
    intro:
      "A identidade ganha valor quando deixa de ser apenas estética e passa a orientar comunicação, materiais e decisões. Estes temas ajudam a organizar essa passagem.",
  },
  "/servicos/producao-audiovisual": {
    servicePath: "/servicos/producao-audiovisual",
    serviceTitle: "Produção Audiovisual",
    sectionId: "service:audiovisual",
    title: "Leituras para dar função ao conteúdo em vídeo",
    intro:
      "Produção audiovisual não começa na câmera. Os temas abaixo ajudam a definir objetivo, contexto e uso do conteúdo antes da gravação.",
  },
  "/servicos/process-activation": {
    servicePath: "/servicos/process-activation",
    serviceTitle: "Process Activation",
    sectionId: "service:process-activation",
    title: "Leituras para fazer o processo entrar na rotina",
    intro:
      "Ativar um processo exige mais do que documentar etapas. Estes temas ajudam a entender adesão, clareza e continuidade na operação.",
  },
  "/hospedagem-manutencao-sites": {
    servicePath: "/hospedagem-manutencao-sites",
    serviceTitle: "Hospedagem e Manutenção",
    sectionId: "service:hosting-maintenance",
    title: "Leituras para manter o site confiável depois do lançamento",
    intro:
      "A publicação é o início da operação. Estes temas ajudam a organizar manutenção, desempenho e decisões técnicas sem depender de urgência.",
  },
  "/programa-afiliados": {
    servicePath: "/programa-afiliados",
    serviceTitle: "Programa de Parceria",
    sectionId: "program:partnership",
    title: "Leituras para indicar oportunidades com mais clareza",
    intro:
      "Uma indicação útil começa ao entender o problema, o momento e o próximo passo da empresa indicada. Estes conteúdos ajudam a qualificar a conversa antes do contato.",
  },
};

export const getServiceInsightsBridgeConfig = (
  servicePath: string,
): ServiceInsightsBridgeConfig | null => SERVICE_INSIGHTS_BRIDGE_CONTENT[servicePath] ?? null;
