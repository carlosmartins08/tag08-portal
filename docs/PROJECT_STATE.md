# Estado do projeto — TAG08

Atualizado em: `2026-09-15`

## Estado de integração

- Linha de trabalho esperada: `p0-routing-secret-containment`; o checkpoint de origem da reconciliação é `3314b39` (`2026-09-11`) e os checkpoints locais posteriores estão no histórico desta mesma linha.
- Destino de integração: `main`, no commit `7d8aafd` (`2026-07-21`).
- Commit-base de integração: `7d8aafd`.
- Relação: a branch atual contém as dez evoluções inicialmente identificadas após a `main`, mais os checkpoints locais desta reconciliação. Não há divergência da `main`, mas ela ainda não recebeu essa evolução.
- Regra ativa: não integrar por merge direto. Primeiro separar mudanças locais, classificar conflitos de conteúdo e executar as validações previstas em `docs/ROADMAP.md`.

## Checkpoint executável

- Última missão concluída: publicação autorizada da equipe em `/sobre` e das provas internas em `/servicos/assessoria-marketing-digital-estrategico`, com gates de CI portáveis entre Windows e Linux; Home, portfólio e cases indexáveis permanecem pendentes.
- Próxima missão autorizada: concluir a validação técnica da integração; a auditoria de imagens de `/sobre` foi alinhada ao uso obrigatório de `next/image`.
- Antes de desenvolver: `npm run continuity:status`. O comando confere branch, commit-base, missão e itens locais isolados; `npm run dev` e `npm run dev:content-review` executam essa conferência automaticamente.
- Antes de commitar: o hook local exige `docs/PROJECT_STATE.md` e `docs/CHANGELOG.md` no mesmo commit de qualquer alteração de comportamento. Para ativá-lo em uma instalação existente: `npm run setup:hooks`.
- CI: o workflow busca o histórico completo para validar o commit-base, pois um checkout raso não permite provar a ancestralidade da branch.
- Localização: as assinaturas de fonte são calculadas com quebras de linha normalizadas para evitar falso positivo entre Windows e Linux.
- Tipos de dados: `npm run lint` gera o cliente Prisma antes do TypeScript. Assim, uma instalação limpa no CI valida os mesmos imports que o ambiente local, sem depender de arquivos gerados anteriormente.

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
