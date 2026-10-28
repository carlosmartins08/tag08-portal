# TAG08 — instruções oficiais para agentes

Este arquivo é a entrada única de instruções de trabalho para agentes neste repositório. Leia também `docs/PROJECT_STATE.md` antes de uma mudança e consulte documentos de domínio somente quando forem relevantes.

## Fontes de verdade

- Requisitos e decisões de produto: documentos oficiais aprovados (BRM, TRD e Product Flows, quando disponíveis para a tarefa).
- Interface e conteúdo: implementação vigente em `src/`, respeitando o Design System e os gates editoriais existentes.
- Contratos e comportamento técnico: código ativo em `src/`, `server/`, `tools/`, `tests/`, `package.json` e configurações chamadas por esses pontos de entrada.
- Estado de continuidade: `docs/PROJECT_STATE.md`, interpretado como registro temporal. Para o estado atual, prevalecem evidências mais recentes de código e testes; seções explicitamente históricas não são decisões vigentes.
- `docs/architecture-consolidation/` contém evidências e decisões históricas de consolidação. Não usar automaticamente seus mapas antigos como arquitetura atual; confirmar qualquer afirmação no estado atual e nos contratos executáveis.

Quando fontes aprovadas divergirem, não escolha silenciosamente: registre a divergência e use a evidência mais recente apenas para descrever implementação, não para substituir aprovação de produto.

## Decisões estáveis da release

- O novo site TAG08 não usa ClickUp para receber, rotear ou operar submissões. Google Sheets é a base canônica estruturada das submissões desta release; o CRM próprio é um projeto separado, com integração futura.
- Onboarding permanece desativado nesta release (`ONBOARDING_ENABLED=false`). Preserve sua implementação e controles de acesso; não o exponha nem trate seus consumidores legados como parte dos fluxos públicos habilitados.
- WordPress é o CMS editorial. GA4 mede uso e não substitui obrigações, bases legais ou controles de privacidade/LGPD.
- Preserve a versão visual aprovada pelo operador. Não faça redesign por iniciativa própria.
- `docs/PROJECT_STATE.md` registra o estado temporal. Confirme branch, HEAD, alterações locais e a identidade do runtime quando forem relevantes; nunca fixe um HEAD neste arquivo de instruções nem presuma que `localhost:3101` esteja ativo ou corresponda ao checkout.
- `main` é a linha oficial. `npm run dev` apresenta a experiência pública em `localhost:3101`; use `npm run dev:content-review` somente para revisão editorial explícita. O lançador informa checkout/branch/commit/estado do worktree/modo e falha se a porta estiver ocupada; não reutilize nem encerre processos sem verificar sua identidade.
- Scripts, workers e integrações legados só fazem parte de um fluxo ativo quando o código, a configuração e os testes atuais comprovarem isso. Não remova código do Onboarding por ele estar desativado.

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
