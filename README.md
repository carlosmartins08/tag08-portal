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

Copie `.env.example` para `.env`. Use `NEXT_PUBLIC_GTM_ID` e `NEXT_PUBLIC_GSC_VERIFICATION` para mensuração e Search Console. GA4, Meta Pixel, Pinterest Tag e LinkedIn Insight Tag são configurados somente no GTM; nunca duplique snippets no aplicativo. GA4 é mensuração: não substitui aviso de privacidade, base legal, consentimento aplicável ou outros controles de LGPD. As demais variáveis preservam os contratos atuais de Onboarding e conteúdo oficial. Nunca versione `.env`.

## Sequencia de deploy

Para publicar o site e os fluxos habilitados, execute na raiz da aplicacao, com as variaveis do ambiente ja configuradas e `ONBOARDING_ENABLED=false`:

```bash
npm ci
npm run preflight:deploy -- --production
npm run build
npm run verify:routes
npm run verify:seo
npm run verify:security-headers
npm run start
```

O preflight de produção deve ser chamado com `npm run preflight:deploy -- --production`. Contato e Talentos usam Google Sheets como único destino operacional quando explicitamente habilitados; não dependem de ClickUp, tarefas ClickUp ou outbox SQL. ClickUp não integra os fluxos operacionais do novo site. O CRM próprio é um projeto separado, com integração futura. Mantenha os envios externos desligados por padrão e só os habilite após aprovação de campos, finalidade, permissões e retenção.

`npm run db:migrate`, `npm run worker:integrations` e `npm run worker:retention` pertencem aos consumidores PostgreSQL existentes, incluindo o controle de acesso do Onboarding. Nao sao passos genericos do deploy publico e nao devem ser executados enquanto Onboarding permanecer desativado. Preservar esses componentes; qualquer ativacao exige homologacao e autorizacao especificas.

`npm run dev` abre a referência editorial completa em `http://localhost:3101`, identificada por “REVISÃO LOCAL — NÃO PUBLICADO”, com o cache `.next-review`. É o comando padrão para evoluir o projeto.

`npm run dev:public-preview` abre em `http://localhost:3212` apenas o recorte que pode ser publicado hoje e usa `.next-dev`. O comando confere a continuidade e se recusa a limpar um cache ainda em uso.

`http://127.0.0.1:3000` pertence somente ao container Docker local. Ele é uma imagem compilada e não deve ser usado para revisar alterações do diretório de trabalho; atualize-o apenas por um rebuild explícito.

Mantenha `INTEGRATIONS_ENABLED=false`, `GOOGLE_SHEETS_ENABLED=false` e `CLICKUP_ENABLED=false` no primeiro deploy. `npm run verify:staging` ainda agrega verificacoes de banco, persistencia e outbox SQL, alem das rotas; use-o somente em um ambiente QA com PostgreSQL descartavel autorizado e com escopo que inclua esses consumidores. Ele nao e prova isolada dos fluxos diretos de Contato/Talentos. Para estes, use o preflight `tools/preflight-integrations.mjs` com escopo e modo explicitamente definidos, seguido de homologacao sintética autorizada.

A Content Security Policy e aplicada por padrao. Antes de incluir uma nova origem externa, valide-a em staging com `CSP_REPORT_ONLY=true`, ajuste a allowlist em `next.config.ts` e volte a `false` antes da liberacao.

Os jobs abaixo são consumidores legados de banco/outbox. Não os agende como parte da operação pública desta release: Onboarding está desativado e o site não encaminha submissões ao ClickUp. Preserve os scripts enquanto houver consumidores, mas só execute ou agende esses jobs em um escopo operacional autorizado e compatível:

```bash
npm run worker:integrations
npm run worker:retention
```

O agendamento e a ativação desses jobs dependem de uma decisão operacional futura específica; não são pré-requisitos para publicar as jornadas públicas habilitadas.

## Pacote de staging

Use o servidor standalone. Para validar apenas o site publico, Contato e Talentos, mantenha Onboarding e integracoes fechados e siga o procedimento aprovado para esses fluxos. O template `.env.staging.example` descreve variaveis do ambiente; nao copie valores de producao nem habilite transmissao por preencher o template. Os verificadores agregados que usam PostgreSQL/outbox aplicam-se somente quando o ambiente QA descartavel e o escopo correspondente estiverem autorizados.

## Regras de manutencao

- Nao crie rotas fora de `routeRegistry.ts`.
- Nao altere os contratos em `server/onboardingContract.ts` sem compatibilidade explicita.
- Alias devem redirecionar para a URL canonica, nunca renderizar uma segunda pagina.
- O deploy deve executar `npm run check`, `npm run verify:routes` e `npm run verify:seo` antes de ir para staging.
- Execute o preflight correspondente ao destino antes da publicacao. Migrations nao fazem parte do caminho de publicacao enquanto Onboarding estiver desativado. Integracoes externas exigem aprovacao e homologacao especificas; nao habilite flags apenas para fazer o preflight passar.
