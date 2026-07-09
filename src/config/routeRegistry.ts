export type RouteKey =
  | "home"
  | "sobre"
  | "servicos"
  | "servicos-process-intelligence"
  | "servicos-process-activation"
  | "servicos-desenvolvimento-web"
  | "servicos-branding-identidade"
  | "servicos-gestao-redes-sociais"
  | "servicos-producao-audiovisual"
  | "servicos-assessoria-marketing-digital-estrategico"
  | "contato"
  | "trabalhe-conosco"
  | "insights"
  | "cliente-onboarding"
  | "sebraetec-impulsionando-empreendedores"
  | "programa-afiliados"
  | "hospedagem-manutencao-sites"
  | "not-found";

export type RouteCategory = "page" | "service" | "tooling" | "aux";

export type RouteChangeFreq = "daily" | "weekly" | "monthly";

export interface RouteDefinition {
  key: RouteKey;
  canonicalPath: string;
  aliases?: string[];
  routeCategory: RouteCategory;
  indexable: boolean;
  includeInSitemap: boolean;
  changefreq: RouteChangeFreq;
  priority: string;
  title: string;
  description: string;
  isServicePage?: boolean;
}

export const routeRegistry: RouteDefinition[] = [
  {
    key: "home",
    canonicalPath: "/",
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "daily",
    priority: "1.0",
    title: "TAG08 | Marketing Estratégico, Posicionamento e Performance",
    description:
      "Agência de marketing estratégico focada em posicionamento, estruturação de processos e performance. Transformamos presença digital de marcas que querem crescer com direção."
  },
  {
    key: "sobre",
    canonicalPath: "/sobre",
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Sobre a TAG08 | Clareza e Estratégia para Marcas com Propósito",
    description:
      "Conheça a TAG08. Trazemos clareza, direção e consistência para marcas comprometidas com seu próprio propósito de crescimento sustentável."
  },
  {
    key: "servicos",
    canonicalPath: "/servicos",
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.9",
    title: "Soluções e Serviços | TAG08 Marketing Estratégico",
    description:
      "Descubra como transformar presença digital em posicionamento, estrutura e performance através de nossas soluções integradas.",
    isServicePage: true
  },
  {
    key: "servicos-process-intelligence",
    canonicalPath: "/servicos/process-intelligence",
    aliases: ["/process-intelligence"],
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Process Intelligence | Organização e Clareza para Crescer - TAG08",
    description:
      "Transforme o caos operacional em clareza por meio de diagnóstico ativo, playbooks estruturados e inteligência de processos para dar escala à sua marca.",
    isServicePage: true
  },
  {
    key: "servicos-process-activation",
    canonicalPath: "/servicos/process-activation",
    aliases: ["/process-activation"],
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Process Activation | Governança Operacional e Execução Real - TAG08",
    description:
      "Ative, ensine e sustente seus processos operacionais com acompanhamento estratégico focado em execução real e performance consistente.",
    isServicePage: true
  },
  {
    key: "servicos-desenvolvimento-web",
    canonicalPath: "/servicos/desenvolvimento-web",
    aliases: ["/desenvolvimento-web"],
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Desenvolvimento Web | Sites que Posicionam, Explicam e Convertem - TAG08",
    description:
      "Websites corporativos, portais institucionais leves e landing pages de conversão de alta performance moldados com design estratégico.",
    isServicePage: true
  },
  {
    key: "servicos-branding-identidade",
    canonicalPath: "/servicos/branding-identidade",
    aliases: ["/branding"],
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Branding e Identidade Visual | Comunique Valor de Marca - TAG08",
    description:
      "Construção de marcas com clareza, posicionamento e identidade visual estratégica de valor para comunicar o real propósito com consistência.",
    isServicePage: true
  },
  {
    key: "servicos-gestao-redes-sociais",
    canonicalPath: "/servicos/gestao-de-redes-sociais",
    aliases: ["/gestao-redes-sociais"],
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Gestão de Redes Sociais | Conteúdo, Estratégia e Posicionamento - TAG08",
    description:
      "Desenvolvemos o posicionamento ideal para sua marca nas redes sociais com planejamento editorial estratégico e narrativas autorais que engajam e convertem.",
    isServicePage: true
  },
  {
    key: "servicos-producao-audiovisual",
    canonicalPath: "/servicos/producao-audiovisual",
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Produção Audiovisual & Cobertura de Eventos Corporativos | TAG08",
    description:
      "Não fazemos apenas registro bonito. Posicionamos sua marca com tomadas cinematográficas táticas, roteiros integrados e pós-produção ágil.",
    isServicePage: true
  },
  {
    key: "contato",
    canonicalPath: "/contato",
    routeCategory: "aux",
    indexable: true,
    includeInSitemap: true,
    changefreq: "monthly",
    priority: "0.7",
    title: "Contato | Fale com a TAG08",
    description:
      "Entenda o melhor caminho estratégico para o crescimento de sua marca com clareza, responsabilidade e evolução constante."
  },
  {
    key: "trabalhe-conosco",
    canonicalPath: "/trabalhe-conosco",
    routeCategory: "aux",
    indexable: true,
    includeInSitemap: true,
    changefreq: "monthly",
    priority: "0.6",
    title: "Trabalhe Conosco | Direção e Evolução Constante - TAG08",
    description:
      "Faça parte de uma equipe que acredita em direção, responsabilidade e evolução constante. Candidate-se a nossas vagas em marketing e processos."
  },
  {
    key: "insights",
    canonicalPath: "/insights",
    aliases: ["/blog"],
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "daily",
    priority: "0.9",
    title: "Insights Estratégicos | TAG08",
    description:
      "Insights originais de marketing estratégico, identidade de marca, desenvolvimento web de alta performance e otimização de processos operacionais."
  },
  {
    key: "cliente-onboarding",
    canonicalPath: "/cliente/onboarding",
    routeCategory: "tooling",
    indexable: true,
    includeInSitemap: true,
    changefreq: "monthly",
    priority: "0.4",
    title: "Assistente de Onboarding | TAG08",
    description: "Organize o início de seu projeto de forma leve, fluida e estratégica de forma rápida e conversacional."
  },
  {
    key: "sebraetec-impulsionando-empreendedores",
    canonicalPath: "/sebraetec-impulsionando-empreendedores",
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.7",
    title: "Sebraetec: Impulsionando Empreendedores | TAG08",
    description:
      "Inove na sua empresa com o programa Sebraetec da TAG08. Identidade visual, canais e websites de alto padrão com até 70% de subsídio financeiro."
  },
  {
    key: "programa-afiliados",
    canonicalPath: "/programa-afiliados",
    routeCategory: "page",
    indexable: true,
    includeInSitemap: true,
    changefreq: "monthly",
    priority: "0.6",
    title: "Programa de Afiliados: Indique e Ganhe Conexões | TAG08",
    description:
      "Ganhe até 10% de repasses em comissões únicas ou recorrentes indicando clientes para websites, de luxo, branding e gestão de redes sociais na TAG08."
  },
  {
    key: "hospedagem-manutencao-sites",
    canonicalPath: "/hospedagem-manutencao-sites",
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "monthly",
    priority: "0.7",
    title: "Hospedagem e Manutenção de Sites: Soluções Completas para o Sucesso Online - Agência TAG08",
    description:
      "Descubra soluções inovadoras em hospedagem e manutenção de sites com a Agência TAG08. Expertise, segurança e suporte personalizado para elevar seu negócio no mundo digital."
  },
  {
    key: "servicos-assessoria-marketing-digital-estrategico",
    canonicalPath: "/servicos/assessoria-marketing-digital-estrategico",
    routeCategory: "service",
    indexable: true,
    includeInSitemap: true,
    changefreq: "weekly",
    priority: "0.8",
    title: "Assessoria de Marketing Digital Estratégico | TAG08",
    description:
      "Eleve sua atração comercial com direção e performance sênior. Acesse o diagnóstico inteligente e mude o posicionamento do seu marketing digital.",
    isServicePage: true,
    aliases: ["/assessoria-marketing-digital-estrategico"]
  },
  {
    key: "not-found",
    canonicalPath: "/404",
    routeCategory: "aux",
    indexable: false,
    includeInSitemap: false,
    changefreq: "monthly",
    priority: "0.1",
    title: "Caminho não encontrado - TAG08",
    description: "A página indicada não se encontra em nosso escopo de navegação."
  }
];

const legacyAliases: Record<string, string> = {};

routeRegistry.forEach((route) => {
  route.aliases?.forEach((alias) => {
    legacyAliases[alias] = route.canonicalPath;
  });
});

const normalizePath = (inputPath: string): string => {
  if (!inputPath || inputPath === "/") return "/";

  let normalized = inputPath.split("?")[0].split("#")[0];
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }

  if (normalized.length > 1 && !normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
};

export const canonicalizeRoute = (inputPath: string): string => {
  const path = normalizePath(inputPath);
  const aliasNormalized = legacyAliases[path] || path;
  const exact = routeRegistry.find((route) => route.canonicalPath === aliasNormalized);
  return exact ? exact.canonicalPath : aliasNormalized;
};

export const getRouteByPath = (path: string): RouteDefinition | undefined => {
  return routeRegistry.find((route) => route.canonicalPath === path);
};

export const publicRoutePaths = routeRegistry.filter((route) => route.indexable).map((route) => route.canonicalPath);

export const indexedRoutePaths = routeRegistry.filter((route) => route.includeInSitemap).map((route) => route.canonicalPath);

export const routeSitemapMeta = routeRegistry.filter((route) => route.includeInSitemap).map((route) => ({
  path: route.canonicalPath,
  changefreq: route.changefreq,
  priority: route.priority,
  title: route.title,
  description: route.description
}));
