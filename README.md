# TAG08 Site

Portal institucional TAG08 em Next.js App Router. As paginas publicas sao geradas estaticamente a partir do registry de rotas; os endpoints permanecem no mesmo servico Next.

## Arquitetura ativa

- Rotas, aliases, idiomas e sitemap: `src/config/routeRegistry.ts`
- App Router: `src/app/[locale]/[[...segments]]/page.tsx`
- Shell e interacoes de cliente: `src/features/site/SiteShell.tsx`
- API de onboarding: `src/app/api/onboarding/route.ts`
- Conteudo oficial: `src/app/api/official-content/route.ts`
- SEO: `src/lib/seo.ts`, `src/app/sitemap.ts` e `src/app/robots.ts`

## Requisitos

- Node.js 20+

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## Variaveis locais

Copie `.env.example` para `.env.local`. Use `NEXT_PUBLIC_GA4_ID` e `NEXT_PUBLIC_GSC_VERIFICATION` para analytics e Search Console; as demais variaveis preservam os contratos atuais de onboarding e conteudo oficial.

## Regras de manutencao

- Nao crie rotas fora de `routeRegistry.ts`.
- Nao altere os contratos em `server/onboardingContract.ts` sem compatibilidade explicita.
- Alias devem redirecionar para a URL canonica, nunca renderizar uma segunda pagina.
- O deploy deve executar `npm run check` antes de ir para staging.
