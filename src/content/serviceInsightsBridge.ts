import { BLOG_POSTS } from "../data";
import type { BlogPost } from "../types";

export type ServiceInsightsBridgeStatus = "published" | "planned";

export interface ServiceInsightsBridgePublishedItem {
  status: "published";
  postId: BlogPost["id"];
  note?: string;
}

export interface ServiceInsightsBridgePlannedItem {
  status: "planned";
  title: string;
  excerpt: string;
  note?: string;
}

export type ServiceInsightsBridgeItem =
  | ServiceInsightsBridgePublishedItem
  | ServiceInsightsBridgePlannedItem;

export interface ServiceInsightsBridgeConfig {
  servicePath: string;
  serviceTitle: string;
  title: string;
  intro: string;
  items: ServiceInsightsBridgeItem[];
  hubCtaLabel: string;
  hubPath: string;
}

export type ResolvedServiceInsightsBridgeItem =
  | (ServiceInsightsBridgePublishedItem & { post: BlogPost })
  | ServiceInsightsBridgePlannedItem;

const DEVELOPMENT_WEB_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/desenvolvimento-web",
  serviceTitle: "Desenvolvimento Web",
  title: "Leituras que ajudam a estruturar um site",
  intro:
    "A ponte editorial aqui existe para reduzir dúvida antes da conversa. Os temas abaixo tratam de estrutura, clareza, conteúdo e apoio ao comercial.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "importancia-velocidade-conversao-sites",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "negocios-ao-universo-online",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "Como decidir o papel de um site antes de desenhar a tela",
      excerpt:
        "Nem todo projeto começa no visual. Em muitos casos, o ponto crítico é definir se a página precisa apresentar, explicar, organizar ou apoiar a venda.",
      note: "Tema em preparação",
    },
    {
      status: "planned",
      title: "O que muda quando o site precisa sustentar conteúdo e contato",
      excerpt:
        "Quando existem redes, atendimento e outras frentes, a estrutura do site precisa reduzir atrito e deixar o próximo passo óbvio.",
      note: "Tema em preparação",
    },
  ],
};

const ASSESSORIA_MARKETING_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/assessoria-marketing-digital-estrategico",
  serviceTitle: "Assessoria de Marketing",
  title: "Leituras que ajudam a decidir melhor antes de executar",
  intro:
    "A ponte editorial aqui existe para reduzir dúvida antes da conversa. Os temas abaixo tratam de diagnóstico, objetivo, contexto e próximos passos de marketing.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "estrategia-antes-da-estetica",
    },
    {
      status: "published",
      postId: "definir-objetivo-marketing",
    },
    {
      status: "published",
      postId: "consideracao-no-funil",
    },
  ],
};

const PROCESS_INTELLIGENCE_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/process-intelligence",
  serviceTitle: "Process Intelligence",
  title: "Leituras que ajudam a organizar a operação antes de acelerar",
  intro:
    "A ponte editorial aqui existe para reduzir ruído antes da conversa. Os temas abaixo tratam de diagnóstico, ferramenta e clareza operacional para sustentar o crescimento.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "anatomia-do-caos-operacional",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "ferramentas-gratuitas-expansao",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "transformacao-digital-erros",
      note: "Publicado no Hub de Insights",
    },
  ],
};

const GESTAO_REDES_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/gestao-de-redes-sociais",
  serviceTitle: "Gestão de Redes Sociais",
  title: "Leituras que ajudam a sustentar presença com direção",
  intro:
    "A ponte editorial aqui existe para reduzir ruído antes da conversa. Os temas abaixo tratam de jornada, vídeo e intenção para que a presença nas redes tenha função real.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "jornada-do-consumidor-commerce-connections",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "facebook-vender-mais",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "Como definir uma frequência possível sem perder consistência",
      excerpt:
        "Nem toda marca precisa publicar mais. Em muitos casos, o ponto crítico é sustentar uma cadência realista que preserve clareza, revisão e coerência editorial.",
      note: "Tema em preparação",
    },
  ],
};

const BRANDING_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/branding-identidade",
  serviceTitle: "Branding e Identidade Visual",
  title: "Leituras para transformar identidade em uma marca utilizável",
  intro:
    "A identidade ganha valor quando deixa de ser apenas estética e passa a orientar comunicação, materiais e decisões. Estes temas ajudam a organizar essa passagem.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "estrategia-antes-da-estetica",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "O que um guia de marca precisa resolver no dia a dia",
      excerpt:
        "Um guia útil não serve para decorar. Ele reduz dúvida sobre aplicação, contraste, tipografia e prioridades nos pontos de contato da marca.",
      note: "Tema em preparação",
    },
    {
      status: "planned",
      title: "Como aplicar uma identidade sem transformar tudo de uma vez",
      excerpt:
        "A implantação funciona melhor quando começa pelos materiais e canais que mais representam a marca, com uma ordem clara de atualização.",
      note: "Tema em preparação",
    },
  ],
};

const AUDIOVISUAL_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/producao-audiovisual",
  serviceTitle: "Produção Audiovisual",
  title: "Leituras para dar função ao conteúdo em vídeo",
  intro:
    "Produção audiovisual não começa na câmera. Os temas abaixo ajudam a definir objetivo, contexto e uso do conteúdo antes da gravação.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "youtube-para-consideracao",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "O que definir antes de produzir um vídeo para a marca",
      excerpt:
        "Público, mensagem, canal, duração e próximo passo precisam ser definidos antes do roteiro para que o vídeo tenha função real.",
      note: "Tema em preparação",
    },
    {
      status: "planned",
      title: "Como reaproveitar uma produção sem perder coerência",
      excerpt:
        "Uma captação pode atender diferentes formatos quando a distribuição e os recortes são planejados desde o início.",
      note: "Tema em preparação",
    },
  ],
};

const PROCESS_ACTIVATION_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/servicos/process-activation",
  serviceTitle: "Process Activation",
  title: "Leituras para fazer o processo entrar na rotina",
  intro:
    "Ativar um processo exige mais do que documentar etapas. Estes temas ajudam a entender adesão, clareza e continuidade na operação.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "anatomia-do-caos-operacional",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "automacao-marketing-vendas",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "Como transformar um playbook em um hábito de equipe",
      excerpt:
        "A adoção depende de responsáveis, cadência de revisão e espaço para ajustar o processo sem voltar ao improviso.",
      note: "Tema em preparação",
    },
  ],
};

const HOSPEDAGEM_BRIDGE: ServiceInsightsBridgeConfig = {
  servicePath: "/hospedagem-manutencao-sites",
  serviceTitle: "Hospedagem e Manutenção",
  title: "Leituras para manter o site confiável depois do lançamento",
  intro:
    "A publicação é o início da operação. Estes temas ajudam a organizar manutenção, desempenho e decisões técnicas sem depender de urgência.",
  hubCtaLabel: "Abrir Hub de Insights",
  hubPath: "/insights",
  items: [
    {
      status: "published",
      postId: "boas-praticas-manutencao-site",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "published",
      postId: "importancia-velocidade-conversao-sites",
      note: "Publicado no Hub de Insights",
    },
    {
      status: "planned",
      title: "O que revisar depois de publicar um site",
      excerpt:
        "Backups, atualizações, links, formulários e desempenho precisam de rotina definida para que problemas não apareçam só quando já impactaram o negócio.",
      note: "Tema em preparação",
    },
  ],
};

export const SERVICE_INSIGHTS_BRIDGE_CONTENT: Record<
  string,
  ServiceInsightsBridgeConfig
> = {
  [ASSESSORIA_MARKETING_BRIDGE.servicePath]: ASSESSORIA_MARKETING_BRIDGE,
  [AUDIOVISUAL_BRIDGE.servicePath]: AUDIOVISUAL_BRIDGE,
  [BRANDING_BRIDGE.servicePath]: BRANDING_BRIDGE,
  [DEVELOPMENT_WEB_BRIDGE.servicePath]: DEVELOPMENT_WEB_BRIDGE,
  [GESTAO_REDES_BRIDGE.servicePath]: GESTAO_REDES_BRIDGE,
  [HOSPEDAGEM_BRIDGE.servicePath]: HOSPEDAGEM_BRIDGE,
  [PROCESS_ACTIVATION_BRIDGE.servicePath]: PROCESS_ACTIVATION_BRIDGE,
  [PROCESS_INTELLIGENCE_BRIDGE.servicePath]: PROCESS_INTELLIGENCE_BRIDGE,
};

export const getServiceInsightsBridgeConfig = (
  servicePath: string,
): ServiceInsightsBridgeConfig | null => {
  return SERVICE_INSIGHTS_BRIDGE_CONTENT[servicePath] ?? null;
};

export const resolveServiceInsightsBridgeItems = (
  config: ServiceInsightsBridgeConfig,
): ResolvedServiceInsightsBridgeItem[] => {
  return config.items.reduce<ResolvedServiceInsightsBridgeItem[]>((acc, item) => {
    if (item.status === "planned") {
      acc.push(item);
      return acc;
    }

    const post = BLOG_POSTS.find((entry) => entry.id === item.postId);
    if (!post) {
      return acc;
    }

    acc.push({ ...item, post });
    return acc;
  }, []);
};
