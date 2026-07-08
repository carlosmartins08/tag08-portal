# Rotas publicas TAG08 - registry unico

Fonte obrigatoria: `src/config/routeRegistry.ts`

## Regras operacionais
- Toda rota publica precisa existir no registry antes de deploy.
- `canonicalPath` define a rota canônica.
- `aliases` define redirecionamentos legados.
- `indexable=true` define se aparece em sitemap e navegacao primaria.
- `includeInSitemap=true` controla o XML de sitemap.
- Mudancas de rota exigem sincronizacao em:
  - `src/config/routeRegistry.ts`
  - `src/App.tsx`
  - `generate-sitemap.ts`
  - `docs/ARCHITECTURE.md` e `docs/ROUTES.md`

## Canonicos atuais
- `/`
- `/sobre`
- `/servicos`
- `/servicos/process-intelligence`
- `/servicos/process-activation`
- `/servicos/desenvolvimento-web`
- `/servicos/branding-identidade`
- `/servicos/gestao-de-redes-sociais`
- `/servicos/producao-audiovisual`
- `/servicos/assessoria-marketing-digital-estrategico`
- `/contato`
- `/trabalhe-conosco`
- `/insights` (Insights Estratégicos)
- `/cliente/onboarding`
- `/sebraetec-impulsionando-empreendedores`
- `/programa-afiliados`
- `/hospedagem-manutencao-sites`

## Alias / legado
- `/process-intelligence`
- `/process-activation`
- `/desenvolvimento-web`
- `/branding`
- `/gestao-redes-sociais`
- `/assessoria-marketing-digital-estrategico`
- `/blog` -> `/insights`

## Rotas dinamicas
- `/casos/:id` - mantida em `renderActivePage` com `CaseStudyDetail`.
- Se rota nao estiver no registry, o fallback deve ir para `/404`.

## Mapa de conectividade cross-domain
- Dominio principal: `https://tag08.com.br` (registro em `routeRegistry`).
- LPs por propriedade:
  - `https://hospedagem.tag08.com.br/` (hospedagem e manutencao)
  - `https://influenciador.tag08.com.br/` (gestao de influenciadores)
  - `https://processo.tag08.com.br/` (process intelligence)
  - `https://processos.tag08.com.br/` (process activation)
  - `https://plano-base.tag08.com.br/` (plano base)
- Linguas: PT-BR/EN/ES (sem FR).
- Critérios de validacao:
  - canonical da LP aponta para o proprio dominio.
  - blocos de ecossistema incluem apenas URLs reais, indexaveis e conhecidas.
  - quando existir `alternate`, inclui pt/en/es + x-default.

## Criterios de aceite de rota
1. Toda rota publica importante aparece no registry.
2. Toda rota indexavel rende componente valido em `App.tsx` ou rota dinamica tratada.
3. Toda rota indexavel tem `title` e `description`.
4. Toda entrada com `includeInSitemap=true` esta em `sitemap.xml`.
5. Nao existem rotas fantasma sem destino.

## Responsabilidades
- Product owner de rota: `product-delivery + engineering`.
- Conteudo/SEO: `marketing`.
- Execucao tecnica: `frontend lead`.

## Revisao
- Atualizado: `2026-06-30`
- Revisar por sprint ou mudanca de contrato.


## Handoff executivo - LPs fora do escopo do repositório local

- LandingPage_plano-base-_TAG08
- LPs referenciadas por LP_*_TAG08 que não têm código fonte versionado neste repositório.

Critérios de entrega para cada LP externa:
- Canonical por idioma alinhado ao domínio alvo.
- hreflang com x-default, pt-BR, en-US, es-ES.
- alternate/crosslink documentado no siteNetwork e sem rota inexistente local.
- Bloco de LGPD e banner de cookies com labels por idioma consistentes.
- Checklist de aprovação jurídica/comercial para promessas e prazo de entrega.

