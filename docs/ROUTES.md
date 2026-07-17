# Rotas publicas TAG08

Fonte obrigatoria: `src/config/routeRegistry.ts`.

## Regras operacionais

- Toda rota publica, alias ou pagina dinamica deve estar no registry antes do deploy.
- `canonicalPath` define a URL indexavel; `aliases` geram redirecionamento permanente.
- `includeInSitemap=true` inclui a rota em `src/app/sitemap.ts` nos tres idiomas.
- PT-BR nao tem prefixo. EN usa `/en/...`; ES usa `/es/...`.
- Cases publicados usam `/casos/:id` e sao pregerados a partir de `CASE_STUDIES`.
- Rotas inexistentes retornam 404 sem indexacao.

## Pontos de implementacao

- Resolucao de pagina e metadata: `src/app/[locale]/[[...segments]]/page.tsx`
- Redirecionamento por `?lang=en|es`: `src/proxy.ts`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`

## Criterios de aceite

1. A URL canonica responde 200 com title, description, canonical e hreflang corretos.
2. Um alias responde redirecionando para a URL canonica localizada.
3. A rota entra no sitemap somente quando for indexavel e `includeInSitemap=true`.
4. Nenhuma pagina e adicionada por importacao direta fora do registry.
