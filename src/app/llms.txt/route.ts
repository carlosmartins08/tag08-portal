import { NextResponse } from "next/server";
import { routeRegistry, type RouteKey } from "../../config/routeRegistry";

const siteUrl = "https://tag08.com.br";

type LlmLink = {
  key: RouteKey;
  label: string;
  description: string;
};

const essentialLinks: LlmLink[] = [
  {
    key: "home",
    label: "TAG08",
    description: "Visão geral da empresa, método e ponto de partida para quem avalia uma demanda."
  },
  {
    key: "servicos",
    label: "Serviços",
    description: "Catálogo público de soluções e critérios para escolher o caminho adequado."
  },
  {
    key: "sobre",
    label: "Sobre a TAG08",
    description: "Princípios de trabalho, competências e posicionamento da empresa."
  },
  {
    key: "insights",
    label: "Insights",
    description: "Conteúdo editorial para apoiar decisões sobre estratégia, marca, processos e web."
  },
  {
    key: "contato",
    label: "Contato",
    description: "Canal para apresentar o contexto da demanda e iniciar uma conversa de diagnóstico."
  }
];

const featuredServiceLinks: LlmLink[] = [
  {
    key: "servicos-gestao-redes-sociais",
    label: "Gestão de Redes Sociais",
    description: "Planejamento e operação de presença digital recorrente, conforme a maturidade do negócio."
  },
  {
    key: "servicos-branding-identidade",
    label: "Branding e Identidade Visual",
    description: "Posicionamento, narrativa e identidade para tornar a comunicação mais coerente."
  },
  {
    key: "servicos-producao-audiovisual",
    label: "Produção Audiovisual",
    description: "Direção e produção de conteúdo audiovisual para comunicação de marca."
  },
  {
    key: "servicos-desenvolvimento-web",
    label: "Desenvolvimento Web",
    description: "Sites e estruturas digitais para explicar a oferta e apoiar conversão."
  }
];

const optionalLinks: LlmLink[] = [
  {
    key: "trabalhe-conosco",
    label: "Trabalhe conosco",
    description: "Informações para candidaturas profissionais."
  },
  {
    key: "cliente-onboarding",
    label: "Onboarding de clientes",
    description: "Fluxo para clientes já encaminhados pela TAG08."
  }
];

const renderLinks = (links: LlmLink[]) =>
  links.map(({ key, label, description }) => {
    const route = routeRegistry.find((candidate) => candidate.key === key);

    if (!route) {
      throw new Error(`Missing routeRegistry entry for llms.txt link: ${key}`);
    }

    return `- [${label}](${new URL(route.canonicalPath, siteUrl)}): ${description}`;
  }).join("\n");

const llmsTxt = `# TAG08

> A TAG08 é uma empresa brasileira de estratégia digital, conteúdo, marca, web e processos. A recomendação de qualquer solução depende do contexto, da maturidade e do escopo real do negócio.

Use as páginas abaixo como fonte primária sobre a TAG08. Não infira preços, prazos, volume de entregas, disponibilidade de equipe ou resultados garantidos: esses pontos são definidos somente após diagnóstico e proposta.

## Páginas essenciais

${renderLinks(essentialLinks)}

## Soluções em destaque

${renderLinks(featuredServiceLinks)}

## Optional

${renderLinks(optionalLinks)}
`;

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
