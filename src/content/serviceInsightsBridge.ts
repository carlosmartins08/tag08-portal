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

export const SERVICE_INSIGHTS_BRIDGE_CONTENT: Record<
  string,
  ServiceInsightsBridgeConfig
> = {
  [ASSESSORIA_MARKETING_BRIDGE.servicePath]: ASSESSORIA_MARKETING_BRIDGE,
  [DEVELOPMENT_WEB_BRIDGE.servicePath]: DEVELOPMENT_WEB_BRIDGE,
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
