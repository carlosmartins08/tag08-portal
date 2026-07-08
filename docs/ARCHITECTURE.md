# TAG08 Web Architecture - Baseline

## Objetivo
- Manter o portal publico, o fluxo de onboarding e a rede cross-domain em estado previsivel para SEO, conversao e operacao.

## Base estratégica institucional
- A direção de produto, copy, ofertas e onboarding devem seguir `docs/TAG08_KNOWLEDGE_SYSTEM.md`.
- Arquétipos, posicionamento e regras comerciais partem do conjunto `01_TAG08_DNA_MASTER`, `02_POSICIONAMENTO_ESTRATEGICO`, `03_TOM_DE_VOZ_E_LINGUAGEM`, `06_FILOSOFIA_COMERCIAL`, `07_FILOSOFIA_OPERACIONAL` e `08_GOVERNANCA_E_DECISAO`.
- Decisões de texto, oferta e relacionamento devem preservar diagnóstico, escopo claro e relação de longo prazo.
- Evitar promessas de entrega rápida, promessas absolutas de resultado e discurso de "faremos qualquer coisa".

## Escopo atual
- SPA Vite + React para as paginas publicas e fluxo de onboarding.
- Endpoint backend em `server/index.ts` para `POST /api/onboarding`.
- Proxy/ambiente local em `vite.config.ts` com `VITE_USE_MOCK_ONBOARDING=1` apenas para desenvolvimento.
- Registro unico de rotas em `src/config/routeRegistry.ts`.
- Sitemap em `generate-sitemap.ts` derivado do registry.

## Rede de dominio TAG08 (SEO + interligacoes)
- Dominio principal: `https://tag08.com.br`
- LPs de entrada por propriedade:
  - `https://hospedagem.tag08.com.br`
  - `https://influenciador.tag08.com.br`
  - `https://processo.tag08.com.br`
  - `https://processos.tag08.com.br`
  - `https://plano-base.tag08.com.br`
- Idiomas ativos da rede: PT-BR (default), EN, ES.
- Fonte unica de rede: `src/config/siteNetwork.ts`.

### Regra de SEO cross-domain
- Cada LP aponta canonical para seu proprio dominio.
- Rodapes/blocos devem linkar apenas propriedades ativas e reais.
- Link rel="alternate" segue a linguagem atual (pt/en/es), com x-default.
- Documentacao de governanca em `docs/ROUTES.md` e `.ai-agents/05-crossdomain-seo-hub.md`.

## Camada de contrato e ingestao
- Fonte de contrato: `server/onboardingContract.ts`.
- Versao do contrato: `ONBOARDING_PAYLOAD_VERSION`.
- Endpoint principal: `POST /api/onboarding`.
- Resposta padrao: `{ ok, submissionId, status, receivedAt, schemaVersion }`.
- Status aceitos: `received`, `accepted`, `queued`, `failed`.
- Validacao minima: empresa, responsavel principal, email valido, whatsapp, servicos escolhidos, consentimentos.
- Normalizacao: telefone, email, textos e limites de texto.
- Observabilidade: `GET /api/onboarding/metrics`.

## Camada de fila local no cliente
- Queue local: `localStorage` com chave `tag08_onboarding_queue`.
- Estados da fila: `pending`, `retrying`, `sent`, `error`.
- Retencao por:
  - `ONBOARDING_QUEUE_MAX_RETRIES`
  - `ONBOARDING_QUEUE_MAX_AGE_DAYS`
  - `ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS`
- Sincronizacao:
  - evento `online`
  - intervalo por janela configurada
  - retry exponencial por tentativa com limite de tentativas

## Routing e SEO interno
- `src/App.tsx` usa `canonicalizeRoute` e `getRouteByPath`.
- `routeRegistry` centraliza canonical, aliases e metadados de SEO.
- `generate-sitemap.ts` usa apenas metadata de `routeRegistry`.
- SEO dinâmico ajusta canonical, hreflang, og, e schema no runtime.
- Monitoramento Google segue `docs/GOOGLE-MONITORING-GUIDE.md`, com `page_view`, `scroll_depth`, `engagement_time` e eventos de conversão centralizados em `src/lib/analytics.ts`.

## Riscos conhecidos
- Texto com acentos ainda aparece quebrado em varias secoes de frontend.
- Fase 3 deve normalizar PT-BR/EN/ES com revisão de negócio.

## Integração da base TAG08
- O projeto reconhece formalmente o Knowledge System da TAG08 como referência para governança de decisão.
- Qualquer ajuste de tom/posicionamento/proposta comercial fora desse sistema exige revisão explícita de responsabilidade.
- A camada visual segue `docs/DESIGN-SYSTEM-GOVERNANCE.md` como regra de tokens, contraste e exceções permitidas.
- A camada tipografica segue `docs/TYPOGRAPHY-GOVERNANCE.md` como regra de familias, uso semantico e excecoes.

## Governanca
- Arquitetura produto: `time produto`.
- Rota/SEO: `marketing + produto`.
- Onboarding e operacional: `produto + engenharia`.
- SEO cross-domain: `marketing`.

## Revisão
- Atualização: `2026-06-30`
- Próxima revisão: `2026-08-01` ou troca de contrato.


## Handoff executivo - LPs fora do escopo do repositório local

- LandingPage_plano-base-_TAG08
- LPs referenciadas por LP_*_TAG08 que não têm código fonte versionado neste repositório.

Critérios de entrega para cada LP externa:
- Canonical por idioma alinhado ao domínio alvo.
- hreflang com x-default, pt-BR, en-US, es-ES.
- alternate/crosslink documentado no siteNetwork e sem rota inexistente local.
- Bloco de LGPD e banner de cookies com labels por idioma consistentes.
- Checklist de aprovação jurídica/comercial para promessas e prazo de entrega.


