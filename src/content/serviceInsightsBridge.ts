import type { RouteLocale } from "../config/routeRegistry";
import type { EditorialSectionId } from "./editorialContentV1";

export interface ServiceInsightsBridgeConfig {
  servicePath: string;
  serviceTitle: string;
  sectionId: EditorialSectionId;
  title: string;
  intro: string;
}

export const editorialLocaleMatches = (contentLocale: string, routeLocale: RouteLocale): boolean =>
  contentLocale.trim().toLowerCase().split(/[-_]/, 1)[0] === routeLocale;

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
  locale: RouteLocale = "pt",
): ServiceInsightsBridgeConfig | null => {
  const source = SERVICE_INSIGHTS_BRIDGE_CONTENT[servicePath];
  if (!source || locale === "pt") return source ?? null;

  const translations: Partial<Record<string, Record<Exclude<RouteLocale, "pt">, Pick<ServiceInsightsBridgeConfig, "serviceTitle" | "title" | "intro">>>> = {
    "/servicos/desenvolvimento-web": {
      en: { serviceTitle: "Web Development", title: "Readings that help structure a website", intro: "This editorial bridge helps reduce uncertainty before a conversation. These topics cover structure, clarity, content, and support for business development." },
      es: { serviceTitle: "Desarrollo Web", title: "Lecturas para estructurar un sitio web", intro: "Este espacio editorial ayuda a reducir dudas antes de conversar. Los temas tratan sobre estructura, claridad, contenido y apoyo al desarrollo del negocio." }
    },
    "/servicos/assessoria-marketing-digital-estrategico": {
      en: { serviceTitle: "Strategic Marketing Advisory", title: "Readings to support better decisions before execution", intro: "This editorial bridge helps reduce uncertainty before a conversation. These topics cover diagnosis, goals, context, and next steps in marketing." },
      es: { serviceTitle: "Asesoría de Marketing Estratégico", title: "Lecturas para decidir mejor antes de ejecutar", intro: "Este espacio editorial ayuda a reducir dudas antes de conversar. Los temas tratan sobre diagnóstico, objetivos, contexto y próximos pasos de marketing." }
    },
    "/servicos/process-intelligence": {
      en: { serviceTitle: "Process Intelligence", title: "Readings to organize operations before accelerating", intro: "This editorial bridge helps reduce noise before a conversation. These topics cover diagnosis, tools, and operational clarity to support growth." },
      es: { serviceTitle: "Process Intelligence", title: "Lecturas para organizar la operación antes de acelerar", intro: "Este espacio editorial ayuda a reducir el ruido antes de conversar. Los temas tratan sobre diagnóstico, herramientas y claridad operativa para sostener el crecimiento." }
    },
    "/servicos/gestao-de-redes-sociais": {
      en: { serviceTitle: "Social Media Management", title: "Readings to sustain a purposeful presence", intro: "This editorial bridge helps reduce noise before a conversation. These topics cover customer journeys, video, and intent so social media has a clear role." },
      es: { serviceTitle: "Gestión de Redes Sociales", title: "Lecturas para sostener una presencia con dirección", intro: "Este espacio editorial ayuda a reducir el ruido antes de conversar. Los temas tratan sobre recorrido del cliente, vídeo e intención para dar una función clara a las redes." }
    },
    "/servicos/branding-identidade": {
      en: { serviceTitle: "Branding and Visual Identity", title: "Readings to make brand identity useful in practice", intro: "Identity creates value when it guides communication, materials, and decisions instead of remaining only visual. These topics help organize that transition." },
      es: { serviceTitle: "Branding e Identidad Visual", title: "Lecturas para convertir la identidad en una marca útil", intro: "La identidad aporta valor cuando orienta la comunicación, los materiales y las decisiones, y deja de ser solo estética. Estos temas ayudan a organizar esa transición." }
    },
    "/servicos/producao-audiovisual": {
      en: { serviceTitle: "Audiovisual Production", title: "Readings to give video content a clear purpose", intro: "Audiovisual production does not start with the camera. These topics help define goals, context, and how content will be used before recording." },
      es: { serviceTitle: "Producción Audiovisual", title: "Lecturas para dar propósito al contenido en vídeo", intro: "La producción audiovisual no empieza con la cámara. Estos temas ayudan a definir objetivos, contexto y uso del contenido antes de grabar." }
    },
    "/servicos/process-activation": {
      en: { serviceTitle: "Process Activation", title: "Readings to bring processes into everyday work", intro: "Activating a process takes more than documenting steps. These topics help explain adoption, clarity, and continuity in operations." },
      es: { serviceTitle: "Activación de Procesos", title: "Lecturas para integrar los procesos en la rutina", intro: "Activar un proceso exige más que documentar etapas. Estos temas ayudan a comprender la adopción, la claridad y la continuidad operativa." }
    },
    "/hospedagem-manutencao-sites": {
      en: { serviceTitle: "Website Hosting and Maintenance", title: "Readings to keep a website reliable after launch", intro: "Publication is the start of operation. These topics help organize maintenance, performance, and technical decisions without relying on urgency." },
      es: { serviceTitle: "Alojamiento y Mantenimiento Web", title: "Lecturas para mantener un sitio fiable después del lanzamiento", intro: "La publicación es el inicio de la operación. Estos temas ayudan a organizar el mantenimiento, el rendimiento y las decisiones técnicas sin depender de urgencias." }
    },
    "/programa-afiliados": {
      en: { serviceTitle: "Partnership Program", title: "Readings to refer opportunities with greater clarity", intro: "A useful referral starts by understanding the problem, timing, and next step for the business. These topics help qualify the conversation before contact." },
      es: { serviceTitle: "Programa de Alianzas", title: "Lecturas para recomendar oportunidades con más claridad", intro: "Una recomendación útil empieza por entender el problema, el momento y el siguiente paso de la empresa. Estos temas ayudan a preparar la conversación antes del contacto." }
    }
  };

  return { ...source, ...translations[servicePath]?.[locale] };
};
