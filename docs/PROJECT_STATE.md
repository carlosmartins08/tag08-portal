# Estado do projeto — TAG08

Atualizado em: `2026-09-15`

## Estado de integração

- Linha de trabalho esperada: `main`. Uma missão ativa deve usar uma branch curta no padrão `p<numero>-<tema>`, criada a partir desta base.
- Destino de integração: `main`, no commit `5126504` (`2026-09-15`).
- Commit-base de integração: `5126504`.
- Relação: a reconciliação da `p0-routing-secret-containment` foi integrada por PR #1. A `p0` permanece preservada como trilha de auditoria; a `p1-publication-ops` parte do novo `main` apenas para fechar a continuidade pós-merge.
- Regra ativa: não desenvolver diretamente em `main`. Cada missão começa em uma branch curta, passa pelos gates e volta por PR; o checkpoint aceita apenas `main` ou o padrão de missão registrado.

## Checkpoint executável

- Última missão concluída: PR #1 integrada em `main` no commit `5126504`, após CI verde para build, rotas HTTP, relatório de conteúdo, 142 cenários públicos e 3 cenários da prévia local. Home, portfólio e cases indexáveis permanecem pendentes.
- Próxima missão autorizada: configurar e validar um destino de staging/produção para o `main` integrado. A prévia local preserva a exigência de branch e aceita `detached HEAD` apenas no CI.
- Antes de desenvolver: `npm run continuity:status`. O comando confere branch, commit-base, missão e itens locais isolados; `npm run dev` e `npm run dev:content-review` executam essa conferência automaticamente.
- Antes de commitar: o hook local exige `docs/PROJECT_STATE.md` e `docs/CHANGELOG.md` no mesmo commit de qualquer alteração de comportamento. Para ativá-lo em uma instalação existente: `npm run setup:hooks`.
- CI: o workflow busca o histórico completo para validar o commit-base, pois um checkout raso não permite provar a ancestralidade da branch.
- Localização: as assinaturas de fonte são calculadas com quebras de linha normalizadas para evitar falso positivo entre Windows e Linux.
- Tipos de dados: `npm run lint` gera o cliente Prisma antes do TypeScript. Assim, uma instalação limpa no CI valida os mesmos imports que o ambiente local, sem depender de arquivos gerados anteriormente.
- Rotas HTTP: `npm run verify:routes` sobe o build de produção em uma porta isolada quando `BASE_URL` não é informado; em staging, a mesma variável aponta para o ambiente real. A checagem não depende mais de um servidor local esquecido em `:3000`.
- Testes visuais: contratos de localização verificam URL canônica, idioma e título principal; não usam contagem de elementos de layout, que muda legitimamente quando a página evolui.
- Navegador local: `npm run test:browser` usa a porta `3211` e inicia o build atual, sem reutilizar um `next dev` em `:3000`. Para validar staging, usar explicitamente `E2E_BASE_URL`.

## Alterações locais a preservar e separar

- Discoverability: `/llms.txt` é servido por uma rota estática do Next. O checkpoint focado inclui a remoção do arquivo de raiz, a exclusão no `proxy` e a verificação de rota.
- Ativos de clientes: `public/clients/` está fora de rastreamento. Os arquivos não estão associados a uso público no código e exigem validação de marca/direito de uso antes de serem incluídos em qualquer página.
- Evidências públicas: o gate em `src/content/publicEvidence.ts` libera apenas equipe em `/sobre`, mini-cases e depoimentos internos em Assessoria, conforme aprovação registrada. Home, portfólio e cases indexáveis continuam bloqueados; os cases pendentes também não geram rota ou sitemap. `npm run content:status` torna cada supressão visível e `npm run dev:content-review` permite revisão local identificada, sem publicação.

## Onde o conteúdo realmente vive

| Camada | Responsabilidade | Fonte principal |
| --- | --- | --- |
| Tela por rota | Estrutura e maior parte do texto visível | `src/features/site/pages/` |
| Resolução de rota | Escolhe qual tela renderizar | `src/features/site/RouteContent.tsx` |
| URL, metadata, sitemap e idioma | Canonical, SEO e publicação por idioma | `src/config/routeRegistry.ts` |
| Dados editoriais estruturados | Cases, posts, serviços e dados compartilhados | `src/data.ts` e `src/content/` |
| Interface global | Navegação, rodapé, WhatsApp, breadcrumbs e diálogos | `src/components/` e `src/features/site/SiteShell.tsx` |
| Conteúdo multilíngue | Catálogos, paridade e tradução | `src/i18n/` |
| Conteúdo oficial externo | YouTube e avaliações Google, com origem identificada | `src/lib/officialContent.ts` e `server/officialContent.ts` |

## Conflitos que exigem decisão de negócio

- `/sobre`: o checkpoint de 02/09 descrevia competências sem pessoas; o commit de 11/09 reintroduziu sete perfis, cargos e fotos. A publicação foi autorizada somente nesta rota.
- `/`: há cases, citações e imagens que precisam ser confrontados com a regra de prova registrada em 02/09. Não presumir que estarem no código equivale a autorização de publicação.
- Serviços históricos indexáveis: Assessoria, Process Intelligence, Process Activation e Hospedagem continuam no registry. A existência técnica da rota não confirma prioridade comercial atual.

## Fontes de decisão e continuidade

- Decisões ativas: `docs/DECISIONS.md`.
- Próximas fases: `docs/ROADMAP.md`.
- Inventário de evidências públicas: `docs/CONTENT_EVIDENCE_INVENTORY.md`.
- Auditoria e sequência de integração: `docs/INTEGRATION_AUDIT.md`.
- Rotas: `docs/ROUTES.md` e `src/config/routeRegistry.ts`.
- Arquitetura e contratos: `docs/ARCHITECTURE.md` e `server/onboardingContract.ts`.

## Regra para a próxima sessão

1. Conferir `git status --short`, branch e último commit.
2. Ler este arquivo e `docs/DECISIONS.md`.
3. Escolher uma única missão do roadmap.
4. Não reabrir conteúdo pendente sem evidência ou decisão registrada.
5. Antes de aprovar ou revisar conteúdo, rodar `npm run content:status`; para interface, usar apenas `npm run dev:content-review`.
