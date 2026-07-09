# CHANGELOG - TAG08

## 2026-07-09

- Criado `docs/AGENT_ROUTER.md` para decidir o agente principal antes da escolha de skill.
- Criado `docs/AGENTOS_BRIDGE.md` para ligar o repositorio TAG08 ao AgentOS externo sem duplicar autoridade.
- Atualizadas as referencias de arquitetura e decisao para apontar para o bridge e para as fontes reais de agentes e skills.
- Adicionada camada explicita de orquestracao de agentes e skills em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.

## 2026-07-06

- Fechada a decisao de conteudo: `/insights` virou a rota canonica do hub editorial, e `/blog` ficou como alias legado.
- Atualizados links, breadcrumbs, sitemap e metadados para refletir o hub de insights como face publica principal.
- Ajustadas copias auxiliares para reduzir o uso de "blog" onde o projeto ja se posiciona como biblioteca de insights.
- Criada a base editorial com `BlogPost` ligado a servico, note e CTA para suportar o reaproveitamento futuro dos conteudos.
- Adicionado `docs/INSIGHTS_EDITORIAL_RULES.md` com regra de relacionamento, revisao humana e distribuicao.

## 2026-07-03

- Corrigidos erros de JSX que impediam build em `AssessoriaMarketingDigitalEstrategico.tsx` e `ProducaoAudiovisual.tsx`.
- `npm run lint` e `npm run build` passaram novamente.
- `README.md` reescrito com instrucoes reais do projeto.
- `.env.example` alinhado ao fluxo de desenvolvimento local.
- `package.json` ganhou `npm run check` e um `clean` portatil para Windows.
- Os registros externos do AgentOS foram reescritos com encoding correto.

## 2026-06-30

- Implementado controle de `alternates` no `App.tsx` para canonicals e `hreflang` dinamicos.
- Adicionado `hreflang` estatico em `index.html` para `pt-BR`, `en`, `es-ES` e `x-default`.
- Ajustado controle de canonical por idioma sem quebrar o roteador SPA.
- Atualizado o onboarding para contrato versionado, fila local e sincronizacao automatica.
- Endpoint onboarding real em `server/index.ts` com contrato versionado (`server/onboardingContract.ts`) e metricas basicas.
- O onboarding client-side agora separa estados de envio confirmado, fallback local e erro tecnico.
- Implementado fallback seguro em `localStorage` com retencao e retry controlado.
- `routeRegistry` confirmado como fonte canonica e usado por `App.tsx` e `generate-sitemap.ts`.
- Documentacao operacional e de governanca criada ou atualizada:
  - `docs/DECISION_MATRIX.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ROUTES.md`
  - `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md`
- Integracao SEO cross-domain ajustada para o dominio principal e subdominios do ecossistema.
- Resumo do TAG08 Knowledge System incorporado em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.

## Riscos abertos

- Ainda existem trechos de texto com encoding ruim em paginas longas do frontend.
- Falta automacao de smoke test alem do build.
- Landing pages externas seguem fora deste repositorio.
