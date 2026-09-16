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
npm ci
npm run dev
npm run dev:public-preview
npm run continuity:status
npm run setup:hooks
npm run lint
npm run build
npm run start
npm run preflight:deploy
npm run verify:staging
npm run verify:seo
npm run verify:persistence
```

## Continuidade de trabalho

Use `npm run continuity:status` antes de retomar uma missão. Ele mostra a branch esperada, o commit-base, a última entrega e alterações locais que precisam de classificação. `npm run dev` e `npm run dev:content-review` param se a branch não for a registrada em `docs/PROJECT_STATE.md`.

O hook instalado por `npm run setup:hooks` bloqueia commits de código, testes, automação ou configuração quando `docs/PROJECT_STATE.md` e `docs/CHANGELOG.md` não acompanham a mesma mudança. A qualidade completa continua obrigatória no pull request.

## Variaveis locais

Copie `.env.example` para `.env`. Use `NEXT_PUBLIC_GTM_ID` e `NEXT_PUBLIC_GSC_VERIFICATION` para mensuração e Search Console. GA4, Meta Pixel, Pinterest Tag e LinkedIn Insight Tag são configurados somente no GTM; nunca duplique snippets no aplicativo. As demais variáveis preservam os contratos atuais de onboarding e conteúdo oficial. Nunca versione `.env`.

## Sequencia de deploy

Execute na raiz da aplicacao, com as variaveis do ambiente ja configuradas:

```bash
npm ci
npm run preflight:deploy
npm run db:migrate
npm run build
npm run start
```

`npm run dev` abre a referência editorial completa em `http://localhost:3101`, identificada por “REVISÃO LOCAL — NÃO PUBLICADO”, com o cache `.next-review`. É o comando padrão para evoluir o projeto.

`npm run dev:public-preview` abre em `http://localhost:3212` apenas o recorte que pode ser publicado hoje e usa `.next-dev`. O comando confere a continuidade e se recusa a limpar um cache ainda em uso.

`http://127.0.0.1:3000` pertence somente ao container Docker local. Ele é uma imagem compilada e não deve ser usado para revisar alterações do diretório de trabalho; atualize-o apenas por um rebuild explícito.

Para producao, substitua o preflight por `npm run preflight:deploy -- --production`. Mantenha `INTEGRATIONS_ENABLED=false` no primeiro deploy. Em staging, rode `BASE_URL=https://seu-staging.example npm run verify:staging` para validar rotas, health do banco, protecao das metricas, SEO, os tres formularios, idempotencia e outbox com registros sinteticos removidos ao fim. Apos a aprovacao do staging, habilite um destino por vez e valide novamente com `npm run preflight:deploy -- --allow-integrations`.

A Content Security Policy e aplicada por padrao. Antes de incluir uma nova origem externa, valide-a em staging com `CSP_REPORT_ONLY=true`, ajuste a allowlist em `next.config.ts` e volte a `false` antes da liberacao.

Os jobs sao unitarios e devem ser acionados pelo agendador da hospedagem, nunca pelo processo web:

```bash
npm run worker:integrations
npm run worker:retention
```

Agende integracoes em intervalo curto e retencao uma vez ao dia. O primeiro usa lease, retries e idempotencia; o segundo remove apenas registros vencidos que nao estejam em processamento.

## Pacote de staging

O staging da hospedagem Node.js usa o servidor standalone e um PostgreSQL exclusivo. Copie somente os nomes de variaveis de `.env.staging.example` para o painel, preenchendo os valores reais diretamente no ambiente remoto. O procedimento de publicacao, cron e rollback esta em `docs/STAGING-HOSTING-CHECKLIST.md`.

## Regras de manutencao

- Nao crie rotas fora de `routeRegistry.ts`.
- Nao altere os contratos em `server/onboardingContract.ts` sem compatibilidade explicita.
- Alias devem redirecionar para a URL canonica, nunca renderizar uma segunda pagina.
- O deploy deve executar `npm run check`, `npm run verify:routes` e `npm run verify:seo` antes de ir para staging.
- Staging e producao devem executar o preflight antes de aplicar migrations. As integracoes exigem `--allow-integrations` somente apos aprovacao.
