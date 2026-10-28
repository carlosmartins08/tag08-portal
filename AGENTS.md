# TAG08 — instruções oficiais para agentes

Este arquivo é a entrada única de instruções de trabalho para agentes neste repositório. Leia também `docs/PROJECT_STATE.md` antes de uma mudança e consulte documentos de domínio somente quando forem relevantes.

## Fontes de verdade

- Requisitos e decisões de produto: documentos oficiais aprovados (BRM, TRD e Product Flows, quando disponíveis para a tarefa).
- Interface e conteúdo: implementação vigente em `src/`, respeitando o Design System e os gates editoriais existentes.
- Contratos e comportamento técnico: código ativo em `src/`, `server/`, `tools/`, `tests/`, `package.json` e configurações chamadas por esses pontos de entrada.
- Estado de continuidade: `docs/PROJECT_STATE.md`, interpretado como registro temporal. Para o estado atual, prevalecem evidências mais recentes de código e testes; seções explicitamente históricas não são decisões vigentes.
- `docs/architecture-consolidation/` contém evidências e decisões históricas de consolidação. Não usar automaticamente seus mapas antigos como arquitetura atual; confirmar qualquer afirmação no estado atual e nos contratos executáveis.

Quando fontes aprovadas divergirem, não escolha silenciosamente: registre a divergência e use a evidência mais recente apenas para descrever implementação, não para substituir aprovação de produto.

## Estado técnico conhecido em 2026-10-28

- Checkout observado: branch `p2-home-cases-consolidation`, HEAD `d086c17e06bfc96bc426ff15d781299a71c8fbad`. Confirme branch, HEAD e alterações locais antes de trabalhar; não presuma que o processo histórico em `localhost:3101` ainda esteja ativo.
- Na verificação desta data, a porta 3101 não tinha listener. O checkout é a fonte de trabalho escolhida, mas isso não comprova a identidade de um runtime ativo.
- Nesta release, Contato e Talentos persistem diretamente no Google Sheets; não usam ClickUp, tarefas ClickUp, token/lista ClickUp nem outbox SQL. As colunas ClickUp legadas permanecem compatíveis, sem estado pendente artificial. ClickUp/worker e PostgreSQL permanecem somente para consumidores independentes, incluindo o Onboarding desativado. Flags públicas continuam fechadas por padrão.
- Onboarding permanece desativado para publicação (`ONBOARDING_ENABLED=false`). Seu código e controle de acesso devem ser preservados. A jornada ainda depende do plano de controle PostgreSQL atual; não habilitar nem remover essa dependência por inferência.
- O README e scripts são orientação operacional somente quando compatíveis com o preflight e os contratos atuais. Banco, migrations e workers não são passos genéricos para publicar o site público com Onboarding desativado.

## Escopo de leitura e preservação

- Buscas rotineiras devem focar em código-fonte, configurações ativas, contratos, testes e documentação vigente necessária à tarefa.
- Excluir da busca ampla, salvo investigação diretamente relacionada: `node_modules/`, `.next/`, `.next-dev/`, `.next-review/`, `build/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `.lighthouseci/`, `.audit*/`, `backups/` e artefatos gerados. São caches, resultados, cópias ou evidências; não os apague como parte de uma limpeza de código.
- Não pesquisar nem imprimir conteúdo de `.env*`; consulte somente nomes e presença de variáveis quando indispensável. Nunca revele credenciais.
- Preserve `next-env.d.ts`, `.codex/`, `.impeccable/`, histórico de auditoria, documentos estratégicos e alterações locais preexistentes, salvo pedido explícito e evidência de segurança.
- Antes de remover ou consolidar arquivos, verifique imports estáticos/dinâmicos, rotas, scripts, automações, consumidores externos plausíveis, testes e uso operacional. Ausência de import não prova que asset público ou ferramenta manual esteja sem consumidor.
- Não altere experiência aprovada, contratos, destinos, credenciais ou integrações fora do escopo. Não faça deploy, migrations, gravações externas, limpeza destrutiva ou operações Git destrutivas sem autorização.

## Fluxo obrigatório

1. Confira `git status --short`, branch e HEAD; preserve alterações locais.
2. Leia o código e a instrução de domínio necessária antes de editar.
3. Faça a menor mudança coerente e mantenha um único autor por superfície de escrita.
4. Execute somente testes proporcionais às áreas alteradas; reporte como bloqueado o que não foi executado.
5. Revise o diff completo e não misture alterações preexistentes em commits.
