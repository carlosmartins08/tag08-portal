# P0.5 — Consolidação e higiene do repositório Git

**Data:** 2026-10-19
**Modo:** consolidação controlada; sem push.

## Estado inicial

- Branch: `p2-home-cases-consolidation`.
- HEAD: `9a934e46ac21ef50bac75677fe680e044698bd8b`.
- Upstream: `origin/p2-home-cases-consolidation`.
- Divergência inicial: 7 commits à frente, 0 atrás.
- O baseline foi capturado sobre um worktree que já continha mudanças staged, unstaged e untracked anteriores a esta missão; nenhuma delas foi presumida como originada na P0.5.
- Staged inicial (8 arquivos, 426 inserções / 245 remoções): `.codex/hooks.json`, um relatório em `.impeccable/critique/`, `package.json`, `package-lock.json`, `MiniCases.tsx`, `ServiceInsightsBridge.tsx`, `DesenvolvimentoWeb.tsx` e `ProcessActivation.tsx`.
- Unstaged inicial (8 arquivos, 215 inserções / 67 remoções): `next-env.d.ts`, `ContentReview.tsx`, `publicEvidence.ts` e os testes `content-review`, `e2e/public-evidence`, `localePublishing`, `publicEvidence` e `routeRegistry`.
- Untracked inicial: documentação `docs/architecture-consolidation/`, dois pacotes de auditoria (diretórios e ZIPs) e caminhos de ferramenta; o checker de continuidade reportava 265 caminhos untracked antes da consolidação.
- Os 7 commits que já estavam à frente do upstream foram preservados, sem amend, squash, rebase ou reescrita.

## Referência de segurança

Criada antes da reorganização:

`backup/pre-p1-consolidation-2026-10-19` → `9a934e46ac21ef50bac75677fe680e044698bd8b`

A referência permanece apontando para o HEAD original da missão; ela não foi movida para acompanhar os commits novos.

## Classificação e ações

| Grupo | Classificação | Ação e motivo |
| --- | --- | --- |
| `docs/architecture-consolidation/01` a `15` | P0 / baseline e public evidence | Consolidado em commit documental próprio; contém baseline, achados, decisões humanas e registro de aplicação P0.4. |
| `ContentReview.tsx`, `publicEvidence.ts` e testes de publicação/rotas/locales/review | Public evidence / investigate; testes de caracterização | Consolidados juntos, pois os testes cobrem o comportamento novo e não devem ser separados da implementação que os satisfaz. |
| `next-env.d.ts` | Artefato gerado | A diferença apontava para `./.next-review/dev/types/routes.d.ts`, contrariava o aviso do próprio arquivo de que não deve ser editado e não continha decisão manual identificável. Restaurado somente este arquivo ao HEAD; nenhuma outra alteração foi restaurada. |
| `.codex/hooks.json` | Configuração/ferramenta — intenção pendente | Preservado fora de commit. A remoção/alteração dos hooks não tem intenção aprovada identificável nesta missão. |
| `.impeccable/critique/*.md` | Artefato temporário de ferramenta | Preservado fora de commit; não é fonte de produto nem houve autorização para descartá-lo. |
| `package.json`, `package-lock.json`, `ProcessActivation.tsx` | Dependência + alteração de produto anterior à auditoria | O diff adiciona `animejs@4.5.0`, usado por `animate`/`stagger` em `ProcessActivation.tsx`; são dependentes e foram mantidos fora de commit. A página também contém mudanças visuais e remoção de conteúdo, sem validação/decisão suficiente para consolidar nesta missão. Nenhum pacote foi instalado ou removido. |
| `MiniCases.tsx`, `ServiceInsightsBridge.tsx`, `DesenvolvimentoWeb.tsx` | Alteração de produto anterior à auditoria | Preservados fora de commit como unidade visual relacionada; não foram misturados com P0 e requerem validação própria antes de consolidação. |
| `_AUDITORIA_TAG08/`, `_AUDITORIA_TAG08.zip`, `_AUDITORIA_ESTRUTURAL_TAG08/`, `_AUDITORIA_ESTRUTURAL_TAG08.zip` | Artefatos temporários de auditoria | Preservados, não commitados e não removidos. Os pacotes contêm snapshots brutos de Git, runtime/Docker e cópias de arquivos; a documentação consolidada não reproduz integralmente esses dados. Portanto, não foi possível provar que sua remoção preservaria toda informação única. |
| Alterações não listadas acima | Incerto | Não foram identificadas alterações adicionais além dos itens classificados no status capturado. |

## Commits criados

1. `095f935` — `docs: add architecture consolidation baseline`
   Inclui exclusivamente os documentos `docs/architecture-consolidation/01` a `15`.
2. `bf9de5f` — `fix: enforce investigate state for public evidence`
   Inclui `src/components/ContentReview.tsx`, `src/content/publicEvidence.ts` e os testes relacionados de review, publicação pública, locale e rotas.
3. O registro desta consolidação (`16_REPOSITORY_CONSOLIDATION.md`) é mantido como unidade documental separada; seu commit é identificável no histórico Git.

Os hooks de pre-commit foram executados normalmente nos commits acima; não houve bypass. O hook aceitou o contexto da branch e registrou avisos sobre arquivos untracked não classificados, sem bloquear os commits.

## Validações

- `npm test`: passou integralmente quando executado com permissão para o teste de continuidade iniciar subprocessos Git. A primeira execução no sandbox foi interrompida por `spawnSync git EPERM`; a repetição autorizada passou.
- TypeScript: `node_modules/.bin/tsc --noEmit --incremental false` passou.
- `git diff --cached --check`: sem problemas nos arquivos do commit funcional. Nos documentos, apontou espaços finais usados como quebras Markdown e linhas em branco finais; foram preservados para não reformatar conteúdo nesta consolidação.
- Testes E2E com navegador, integração externa, migrations, workers, banco real e deploy não foram executados nesta missão.

## Estado final e recomendação

- Branch de trabalho preservada; dois commits P0 foram adicionados aos 7 commits locais preexistentes.
- Nenhum push foi executado.
- Mudanças preexistentes de UI/dependência, configuração Codex, crítica Impeccable e pacotes de auditoria continuam fora dos commits e preservadas no worktree.
- A existência dessas mudanças de produto não consolidadas e de vários caminhos untracked impede declarar o worktree limpo ou recomendar push automático. Os dois commits P0 são unidades locais coerentes e foram validados; antes do push, revisar o estado residual e confirmar que os 7 commits anteriores pertencem à mesma linha de publicação.
- Próxima ação recomendada: revisão humana do conteúdo residual e da relação dos 9 commits à frente com o destino remoto; não iniciar P1 sobre arquivos com mudanças visuais sobrepostas até decidir como isolá-las.
