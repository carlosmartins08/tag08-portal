# TAG08 Site

Portal institucional da TAG08 com SPA em Vite, proxy local para a API e fluxo de onboarding com backend proprio.

## O que roda aqui

- Frontend em `src/`
- Proxy de desenvolvimento em `vite.config.ts`
- API local de onboarding em `server/index.ts`
- API de conteudo oficial em `GET /api/official-content`
- Sitemap gerado em `public/sitemap.xml` a partir de `src/config/routeRegistry.ts`
- Rede cross-domain em `src/config/siteNetwork.ts`
- Guia de sincronizacao oficial em `docs/OFFICIAL-CONTENT-SYNC-SETUP.md`

## Requisitos

- Node.js 20+

## Como rodar

1. Instale dependencias:
   `npm install`
2. Configure variaveis locais:
   - copie `.env.example` para `.env.local`
   - ajuste `ONBOARDING_PORT` se precisar
   - preencha `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_HANDLE` para sincronizar o canal oficial
   - preencha as variaveis `GOOGLE_BUSINESS_*` para habilitar reviews reais do Google Business Profile
3. Suba a stack local completa:
   `npm run dev:with-backend`
4. Se preferir separar por terminal:
   - frontend: `npm run dev`
   - backend: `npm run dev:backend`

## Verificacao

- Typecheck: `npm run lint`
- Build completo: `npm run build`
- Verificacao de ponta a ponta: `npm run check`

## Observacoes operacionais

- O app usa `src/config/routeRegistry.ts` como fonte canonica de rotas.
- O Vite faz proxy de `/api` para `ONBOARDING_PORT` no desenvolvimento.
- O onboarding nao deve mascarar falha real de envio.
- O fallback local grava fila em `localStorage` e tenta reenviar quando a conexao volta.
- A Home consome `GET /api/official-content` e cai em fallback editorial se o canal oficial ainda nao estiver configurado.
- `npm run clean` remove `dist` e `server.js` de forma portatil.

## Limitacao atual

- O repositorio nao inclui as landing pages externas dos subdominios; elas precisam ser validadas no proprio repositorio ou ambiente de origem.
