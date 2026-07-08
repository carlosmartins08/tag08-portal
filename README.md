# TAG08 Site

Portal institucional da TAG08 com SPA em Vite, roteamento centralizado e fluxo de onboarding com backend local mínimo.

## O que roda aqui

- Frontend em `src/`
- API mínima de onboarding em `server/index.ts`
- API de conteúdo oficial em `GET /api/official-content`
- Sitemap gerado em `public/sitemap.xml` a partir de `src/config/routeRegistry.ts`
- Rede cross-domain em `src/config/siteNetwork.ts`
- Guia rápido de sincronização oficial em `docs/OFFICIAL-CONTENT-SYNC-SETUP.md`

## Requisitos

- Node.js 20+.

## Como rodar

1. Instale dependências:
   `npm install`
2. Configure variáveis locais:
   - copie `.env.example` para `.env.local`
   - ajuste `ONBOARDING_PORT` se precisar
   - use `VITE_USE_MOCK_ONBOARDING=1` quando quiser a API simulada no `vite`
   - preencha `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_HANDLE` para sincronizar o canal oficial
   - preencha as variáveis `GOOGLE_BUSINESS_*` para habilitar reviews reais do Google Business Profile
3. Suba o frontend:
   `npm run dev`
4. Suba o backend de onboarding em outro terminal:
   `npm run dev:backend`

## Verificação

- Typecheck: `npm run lint`
- Build completo: `npm run build`
- Verificação de ponta a ponta: `npm run check`

## Observações de produção

- O app usa `src/config/routeRegistry.ts` como fonte canônica de rotas.
- O onboarding não deve mascarar falha real de envio.
- O fallback local grava fila em `localStorage` e tenta reenviar quando a conexão volta.
- A Home consome `GET /api/official-content` e cai em fallback editorial se o canal oficial ainda não estiver configurado.
- `npm run clean` remove `dist` e `server.js` de forma portátil.

## Limitação atual

- O repositório não inclui as landing pages externas dos subdomínios; elas precisam ser validadas no próprio repositório ou ambiente de origem.
