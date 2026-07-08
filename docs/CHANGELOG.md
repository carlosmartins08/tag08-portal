# CHANGELOG - TAG08

## 2026-07-06

- Fechada a decisão de conteúdo: `/insights` virou a rota canônica do hub editorial, e `/blog` ficou como alias legado.
- Atualizados links, breadcrumbs, sitemap e metadados para refletir o hub de insights como face pública principal.
- Ajustadas cópias auxiliares para reduzir o uso de "blog" onde o projeto já se posiciona como biblioteca de insights.
- Criada a base editorial com `BlogPost` ligado a serviço, note e CTA para suportar o reaproveitamento futuro dos conteúdos.
- Adicionado `docs/INSIGHTS_EDITORIAL_RULES.md` com regra de relacionamento, revisão humana e distribuição.

## 2026-07-03

- Corrigidos erros de JSX que impediam build em `AssessoriaMarketingDigitalEstrategico.tsx` e `ProducaoAudiovisual.tsx`.
- `npm run lint` e `npm run build` passaram novamente.
- `README.md` reescrito com instruções reais do projeto.
- `.env.example` alinhado ao fluxo de desenvolvimento local.
- `package.json` ganhou `npm run check` e um `clean` portátil para Windows.
- `.ai-agents/README.md` e `.ai-agents/05-crossdomain-seo-hub.md` foram reescritos com encoding correto.

## 2026-06-30

- Implementado controle de `alternates` no `App.tsx` para canonicals e `hreflang` dinâmicos.
- Adicionado `hreflang` estático em `index.html` para `pt-BR`, `en`, `es-ES` e `x-default`.
- Ajustado controle de canonical por idioma sem quebrar o roteador SPA.
- Atualizado o onboarding para contrato versionado, fila local e sincronização automática.
- Endpoint onboarding real em `server/index.ts` com contrato versionado (`server/onboardingContract.ts`) e métricas básicas.
- O onboarding client-side agora separa estados de envio confirmado, fallback local e erro técnico.
- Implementado fallback seguro em `localStorage` com retenção e retry controlado.
- `routeRegistry` confirmado como fonte canônica e usado por `App.tsx` e `generate-sitemap.ts`.
- Documentação operacional e de governança criada ou atualizada:
  - `docs/DECISION_MATRIX.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ROUTES.md`
  - `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md`
- Integração SEO cross-domain ajustada para o domínio principal e subdomínios do ecossistema.
- Resumo do TAG08 Knowledge System incorporado em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.

## Riscos abertos

- Ainda existem trechos de texto com encoding ruim em páginas longas do frontend.
- Falta automação de smoke test além do build.
- Landing pages externas seguem fora deste repositório.
