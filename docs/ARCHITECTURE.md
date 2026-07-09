# TAG08 Web Architecture - Baseline

## Objetivo

- Manter o portal publico, o fluxo de onboarding e a rede cross-domain previsiveis para SEO, conversao e operacao.

## Base estrategica institucional

- A direcao de produto, copy, ofertas e onboarding deve seguir `docs/TAG08_KNOWLEDGE_SYSTEM.md`.
- A orquestracao de agentes e skills segue `docs/AGENTOS_BRIDGE.md`.
- Arquitetura de texto, oferta e relacionamento deve preservar diagnostico, escopo claro e relacao de longo prazo.
- Evitar promessas de entrega rapida, promessas absolutas de resultado e discurso de "fazemos qualquer coisa".

## Escopo atual

- SPA Vite + React para as paginas publicas e o fluxo de onboarding.
- `vite.config.ts` centraliza alias, plugins e proxy local de `/api` para `ONBOARDING_PORT`.
- Endpoint backend em `server/index.ts` para `POST /api/onboarding`.
- Endpoint de conteudo oficial em `GET /api/official-content`.
- Registro unico de rotas em `src/config/routeRegistry.ts`.
- Sitemap em `generate-sitemap.ts` derivado do registry.

## Fluxo de desenvolvimento local

- `npm run dev` sobe apenas o frontend.
- `npm run dev:backend` sobe apenas a API local.
- `npm run dev:with-backend` sobe frontend e backend em paralelo.
- O frontend conversa com o backend local via proxy do Vite.

## Rede de dominio TAG08

- Dominio principal: `https://tag08.com.br`
- LPs de entrada por propriedade:
  - `https://hospedagem.tag08.com.br`
  - `https://influenciador.tag08.com.br`
  - `https://processo.tag08.com.br`
  - `https://processos.tag08.com.br`
  - `https://plano-base.tag08.com.br`
- Idiomas ativos da rede: PT-BR, EN, ES
- Fonte unica de rede: `src/config/siteNetwork.ts`

### Regra de SEO cross-domain

- Cada LP aponta canonical para seu proprio dominio.
- Rodapes e blocos devem linkar apenas propriedades ativas e reais.
- `rel="alternate"` segue a linguagem atual com `x-default`.
- Documentacao de governanca em `docs/ROUTES.md` e `docs/AGENTOS_BRIDGE.md`.

## Camada de contrato e ingestao

- Fonte de contrato: `server/onboardingContract.ts`.
- Versao do contrato: `ONBOARDING_PAYLOAD_VERSION`.
- Endpoint principal: `POST /api/onboarding`.
- Resposta padrao: `{ ok, submissionId, status, receivedAt, schemaVersion }`.
- Status aceitos: `received`, `accepted`, `queued`, `failed`.
- Validacao minima: empresa, responsavel principal, email valido, whatsapp, servicos escolhidos e consentimentos.
- Normalizacao: telefone, email, textos e limites de texto.
- Observabilidade: `GET /api/onboarding/metrics`.

## Camada de fila local no cliente

- Queue local: `localStorage` com chave `tag08_onboarding_queue`.
- Estados da fila: `pending`, `retrying`, `sent`, `error`.
- Retencao por:
  - `ONBOARDING_QUEUE_MAX_RETRIES`
  - `ONBOARDING_QUEUE_MAX_AGE_DAYS`
  - `ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS`
- Sincronizacao por evento `online`, intervalo por janela e retry exponencial.

## Routing e SEO interno

- `src/App.tsx` usa `canonicalizeRoute` e `getRouteByPath`.
- `routeRegistry` centraliza canonical, aliases e metadados de SEO.
- `generate-sitemap.ts` usa apenas metadata de `routeRegistry`.
- SEO dinamico ajusta canonical, hreflang, og e schema no runtime.
- Monitoramento Google segue `docs/GOOGLE-MONITORING-GUIDE.md`, com `page_view`, `scroll_depth`, `engagement_time` e eventos de conversao centralizados em `src/lib/analytics.ts`.

## Riscos conhecidos

- Existe texto quebrado em algumas secoes do frontend e dos documentos legados.
- A proximidade entre conteudo editorial e conteudo oficial exige disciplina de fallback.

## Integracao da base TAG08

- O projeto reconhece formalmente o Knowledge System da TAG08 como referencia de governanca de decisao.
- Qualquer ajuste de tom, posicionamento ou proposta comercial fora desse sistema exige revisao explicita.
- A camada visual segue `docs/DESIGN-SYSTEM-GOVERNANCE.md`.
- A camada tipografica segue `docs/TYPOGRAPHY-GOVERNANCE.md`.
- A camada de agentes segue `docs/AGENTOS_BRIDGE.md` e os registros externos em `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents`.

## Revisao

- Atualizacao: `2026-07-09`
- Proxima revisao: `2026-08-01` ou troca de contrato
