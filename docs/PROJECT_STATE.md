# Estado do projeto — TAG08

Atualizado em: `2026-09-15`

## Estado de integração

- Branch de trabalho atual: `p0-routing-secret-containment` no commit `3314b39` (`2026-09-11`).
- Destino de integração: `main`, no commit `7d8aafd` (`2026-07-21`).
- Relação: a branch atual contém dez commits posteriores à `main`; não há divergência da `main`, mas ela ainda não recebeu essa evolução.
- Regra ativa: não integrar por merge direto. Primeiro separar mudanças locais, classificar conflitos de conteúdo e executar as validações previstas em `docs/ROADMAP.md`.

## Alterações locais a preservar e separar

- Discoverability: a implementação de `/llms.txt` está fora de commit e deve seguir em um commit focado. Ela substitui o antigo arquivo de raiz, corrige o `proxy` e atualiza a verificação de rotas.
- Ativos de clientes: `public/clients/` está fora de rastreamento. Os arquivos não estão associados a uso público no código e exigem validação de marca/direito de uso antes de serem incluídos em qualquer página.

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

- `/sobre`: o checkpoint de 02/09 descrevia competências sem pessoas; o commit de 11/09 reintroduziu sete perfis, cargos e fotos. O conteúdo permanece pendente de confirmação comercial e autorização de imagem.
- `/`: há cases, citações e imagens que precisam ser confrontados com a regra de prova registrada em 02/09. Não presumir que estarem no código equivale a autorização de publicação.
- Serviços históricos indexáveis: Assessoria, Process Intelligence, Process Activation e Hospedagem continuam no registry. A existência técnica da rota não confirma prioridade comercial atual.

## Fontes de decisão e continuidade

- Decisões ativas: `docs/DECISIONS.md`.
- Próximas fases: `docs/ROADMAP.md`.
- Rotas: `docs/ROUTES.md` e `src/config/routeRegistry.ts`.
- Arquitetura e contratos: `docs/ARCHITECTURE.md` e `server/onboardingContract.ts`.

## Regra para a próxima sessão

1. Conferir `git status --short`, branch e último commit.
2. Ler este arquivo e `docs/DECISIONS.md`.
3. Escolher uma única missão do roadmap.
4. Não reabrir conteúdo pendente sem evidência ou decisão registrada.
