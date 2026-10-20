# P0.6 — Auditoria pré-push e fechamento da branch

**Data:** 2026-10-19

**Modo:** auditoria somente leitura; sem commit, push ou reorganização do índice.
**Veredito:** **BLOCKED — não publicar a branch ainda.**

## Estado observado

Branch `p2-home-cases-consolidation`, HEAD `c6ba459c284d0a77334f360f873333fe753e4661`, upstream `origin/p2-home-cases-consolidation` em `93adc98`; 10 commits à frente e nenhum atrás. No início desta auditoria não havia arquivos staged. O worktree já continha sete arquivos modificados e cinco grupos de artefatos não rastreados (os dois diretórios e dois ZIPs de auditoria, além do relatório Impeccable). A análise foi feita sobre esse worktree preexistente; nada além deste relatório foi alterado.

## 1. Revisão dos dez commits

| Commit | Intenção, arquivos/natureza e dependências | Coerência, cobertura e risco | Recomendação |
|---|---|---|---|
| `f0c0ae1` Add end-to-end tests for onboarding flow using Playwright | Embora o assunto diga onboarding, altera `Contato.tsx`, contratos de submissão, tipos, CSS e testes E2E/contratuais de Contato, além dos documentos de continuidade. Não depende das alterações residuais listadas. | A cobertura adicionada corresponde a Contato; o título é impreciso e o E2E não foi executado nesta missão. Revisar o nome/histórico apenas em outra decisão, sem reescrita automática. | **MANTER COM OBSERVAÇÃO** |
| `22bee39` chore: remove retired project documentation | Remove 78 documentos, aproximadamente 29.392 linhas, incluindo arquitetura, rotas, decisões, governança de design system, fontes/workflows editoriais e material de conhecimento. | **Blocker:** documentos atuais ainda apontam para `docs/DECISIONS.md`, `ROADMAP.md`, `CONTENT_EVIDENCE_INVENTORY.md`, `INTEGRATION_AUDIT.md`, `ROUTES.md` e `ARCHITECTURE.md`; `PROJECT_STATE.md` ainda orienta ler `DECISIONS.md`. `tools/generate-editorial-review.mjs` tenta enumerar diretórios `docs/tag08-content-*` removidos e gravar um dossiê no diretório `docs` removido. O baseline 01–16 não prova substituição integral. Há decisão humana posterior de preservar os docs, em conflito com uma mensagem anterior sobre não os usar; resolver explicitamente antes do push. | **NÃO PUBLICAR AINDA** |
| `8d85bb2` feat: guide client onboarding intake | Introduz jornada guiada, contrato/estado, locale, registro de rota e testes de onboarding; depende do estado anterior de rotas e docs. | Coerente com onboarding retomável e publicação linguística controlada; possui teste contratual e E2E, mas este último não foi executado nesta auditoria. A amplitude da página exige validação antes da publicação. | **MANTER COM OBSERVAÇÃO** |
| `b3701af` feat: refine home journey and gate locale drafts | Atualiza Home, introduz `homeCopy.ts`, contratos/publication gates e cobertura E2E das páginas críticas. | A separação entre PT publicado e drafts EN/ES é coerente com decisões atuais. Mudança de Home é ampla; falta execução E2E e validação visual cross-breakpoint. | **MANTER COM OBSERVAÇÃO** |
| `fb95415` fix: align official avatar accent with brand lime | Atualiza cor padrão em `src/lib/officialContent.ts` de `#D4FF00` para `#DDF81D` e registra continuidade. | Alinha-se à cor aprovada e já reconciliada na linha base; não foi encontrado conflito com a série. | **MANTER** |
| `8e82573` fix(onboarding): pass resolved locale to journey | Passa locale resolvido por `RouteContent.tsx` à jornada; depende do onboarding em `8d85bb2`. | Correção coesa com locale explícito; testar junto do fluxo de onboarding, sem regressão de redirects. | **MANTER** |
| `9a934e4` fix: remove per-commit continuity doc gate | Remove o requisito de incluir `PROJECT_STATE` e `CHANGELOG` em cada commit de comportamento; mantém validações de branch/base. Também repete checker com flag `--staged`. | A motivação operacional é coerente com a remoção documental, mas o checker ignora `--staged`, tornando a invocação repetida semanticamente enganosa. Não há motivo para reescrever histórico nesta missão. Revisar o contrato do checker depois do blocker documental. | **MANTER COM OBSERVAÇÃO** |
| `095f935` docs: add architecture consolidation baseline | Adiciona baseline de arquitetura 01–15. | É útil para P1, mas não substitui integralmente os 78 documentos apagados nem corrige referências quebradas. | **MANTER COM OBSERVAÇÃO** |
| `bf9de5f` fix: enforce investigate state for public evidence | Introduz estado editorial `investigate`, aplica a decisão humana aos 22 registros e ajusta consumers/rotas/sitemap/review mode e testes relacionados. | Coerente com decisão documentada P0.3/P0.4; testes diretos foram aprovados na consolidação anterior. Preserva registros e restringe publicação pública. | **MANTER** |
| `c6ba459` docs: record P0 repository consolidation | Adiciona `16_REPOSITORY_CONSOLIDATION.md`. | Registro útil, mas não relata a remoção de 78 documentos nem as referências agora quebradas. É lacuna de continuidade, não justificativa suficiente para alterar o commit aqui. | **MANTER COM OBSERVAÇÃO** |

## 2. Sequência como um todo

A ordem funcional é inteligível: mudanças de Contato, onboarding e Home; correção de locale da jornada; reconciliação da cor; decisões P0 de publicação; documentação de baseline/consolidação. `8e82573` depende de `8d85bb2`; `bf9de5f` depende das decisões e caracterizações anteriores. Não foi identificada reversão comportamental evidente entre os commits.

O risco intermediário mais importante é `22bee39`: a remoção antecede novos commits que continuam atualizando documentos de continuidade, mas deixa links e ferramentas apontando a caminhos inexistentes. Os documentos 01–16 registram arquitetura e decisões mais recentes, porém não são sucessores integrais do material removido. A alteração do hook de continuidade em `9a934e4` também reduz o gate por commit e deve ser entendida junto desse histórico. Não há razão técnica demonstrada para squash/rebase; a revisão não recomenda reescrever os dez commits.

## 3. Alterações residuais — recomendação, não execução

| Arquivo(s) | Diferença e relação | Anime.js / dependência | Destino recomendado |
|---|---|---|---|
| `package.json`, `package-lock.json` | Adicionam `animejs@^4.5.0` / `4.5.0`, com lock e integridade. | A única importação encontrada é em `ProcessActivation.tsx`; manter os manifests emparelhados com a mudança funcional, se aprovada. | **DIVIDIR** da publicação até revisão do conjunto de motion e da seção removida. |
| `src/features/site/pages/ProcessActivation.tsx` | Acrescenta animação escalonada à seleção de fase, muda surfaces/CTA e adota variante editorial-light; remove a seção “Quando contratar nossa ativação sênior?”. | Único consumidor de Anime.js. A remoção de conteúdo comercial precisa validação de negócio; animação/layout precisam QA visual. | **DIVIDIR**: conteúdo/layout e dependência/motion requerem análise e aprovação próprias; manter local. |
| `src/components/ServiceInsightsBridge.tsx` | Adiciona variante opcional `editorial-light`, preservando `legacy` como padrão. Consumido por várias páginas; a variante nova é adotada explicitamente em Process Activation. | Não importa Anime.js. Dependência visual entre componente compartilhado e página experimental. | **DIVIDIR** adoção da página da definição compartilhada; manter local até validação multi-consumer. |
| `src/components/MiniCases.tsx` | Acrescenta classe contextual à seção compartilhada, consumida por várias páginas. | Sem Anime.js; depende do CSS/contexto em `src/index.css`. | **MANTER LOCAL** até comprovar aparência em todos os consumers. |
| `src/features/site/pages/DesenvolvimentoWeb.tsx` | Atualiza wrappers/contexto e styling editorial em vários blocos; usa `Subtle3DCanvas`. | Não usa Anime.js diretamente. Correlaciona com classes do componente compartilhado; necessita QA visual 390/768/1440. | **MANTER LOCAL** até validação visual e revisão de escopo. |
| `.codex/hooks.json` | Remove os hooks `PostToolUse` (Edit/Write/apply_patch) e `Stop`, que chamavam instrução Impeccable por caminho absoluto local. | Sem relação com Anime.js. Impacta governança e verificações locais. | **INVESTIGAR / MANTER LOCAL** até decidir se configuração é institucional ou específica do usuário; caminho absoluto não é portátil. |
| `.impeccable/critique/2026-10-06T23-25-45Z__src-features-site-pages-clienteonboarding-tsx.md` | Relatório de crítica gerado, score 23/40, quatro achados P1; fingerprint anterior às mudanças da jornada. | Nenhuma dependência runtime. Algumas recomendações podem ter sido superadas pelas decisões posteriores. | **MANTER LOCAL**; revalidar achados individualmente, não versionar o relatório bruto. |

Nenhuma classificação acima foi aplicada no Git. Nenhum arquivo residual foi stageado, removido ou modificado pela auditoria.

## 4. Motion e bibliotecas

| Item | Uso observado | Antes / depois e avaliação |
|---|---|---|
| `motion` (`motion/react`) | Importado amplamente em páginas/componentes; também fornece `useReducedMotion`. | Biblioteca transversal e ativa, não duplicação comprovada. |
| `lenis` | Instanciado globalmente em `SiteShell.tsx` para rolagem suave. | Responsabilidade distinta da animação de elementos. Confirmar política de reduced-motion do scroll em revisão própria; não é blocker demonstrado por este diff. |
| `animejs` | Uma importação em `ProcessActivation.tsx`; stagger de opacidade/translateY na troca do nível do roadmap. | `motion` poderia potencialmente implementar transição semelhante, mas não há comparação de bundle nem requisito provando equivalência suficiente. **Anime.js deve permanecer sob investigação**, sem remoção nesta missão. |
| `ThreeDimensionalTilt` | Motion, transform/glare via interação, com `useReducedMotion`. | Interação distinta do roadmap; não é consumer de Anime.js. |
| `Subtle3DCanvas` / `Subtle3DCanvasScene` | Canvas/scene SVG/CSS carregada sob condição; desktop e reduced-motion são considerados. | Elemento decorativo distinto, não substituto da animação de estado do roadmap. |

**Revisão de motion:** o efeito de Anime.js observado é curto (220 ms), usa opacidade/transform e interrompe a animação se `useReducedMotion` estiver ativo; cleanup reverte a instância. A implementação específica não mostra motivo evidente de acessibilidade para reprovação. **A decisão de adicionar uma dependência** segue sem prova mensurável: faltam tamanho de bundle/chunk e comparação de custo com Motion/CSS. Não foi feita medição. Portanto, motion localizado pode ser considerado aceitável provisoriamente, mas a dependência não está pronta para inclusão em commit/push separado sem essa validação e sem aprovação do conteúdo removido.

## 5. Hooks e relatório Impeccable

- `.codex/hooks.json`: foram removidos os hooks `PostToolUse` e `Stop`. O hook de edição chamava comando com caminho absoluto `C:\Users\leobe\.agents\...`, portanto era específico ao ambiente; sua remoção desativa também a chamada automática da crítica visual. Não há evidência suficiente para instituir a remoção no repositório compartilhado. Recomenda-se **não versionar agora** e obter decisão explícita sobre governança portátil vs. configuração individual.
- Relatório Impeccable: é saída de ferramenta datada, não fonte normativa. Recomenda-se **manter local** e aproveitar apenas achados revalidados na implementação atual; excluir somente numa futura ação autorizada após confirmar que conhecimento útil foi absorvido.

## 6. Pacotes de auditoria

- `_AUDITORIA_ESTRUTURAL_TAG08/` e `_AUDITORIA_ESTRUTURAL_TAG08.zip`: o ZIP corresponde ao conteúdo da pasta (242/242 hashes); os 242 caminhos existem no repositório. 235 arquivos batem com o estado atual; os sete restantes são versões anteriores à P0.4 e correspondem ao estado do commit `9a934e4`, recuperável do Git. **Duplicação/reconstruível**; candidato mais seguro para remoção futura, após autorização e nova checagem de conteúdo.
- `_AUDITORIA_TAG08/` e `_AUDITORIA_TAG08.zip`: o ZIP corresponde aos 20 arquivos do diretório. Contêm fotografia histórica de Git e inventário Docker (contexto, configuração efetiva e metadados de container/volume). O material 01–16 não reproduz essa fotografia operacional histórica. Há **informação única**; não remover ainda. Como compose/inspect podem conter valores sensíveis, restringir compartilhamento e verificar sanitização antes de arquivar/publicar.

## 7. Testes e prontidão

O `npm test` e o TypeScript check passaram na consolidação P0.5, antes dos resíduos atuais; essa evidência não cobre os resíduos nem substitui os gates de pré-push. Nenhum teste/browser foi executado nesta P0.6, conforme solicitado.

**Obrigatório antes de push:**

1. Resolver o blocker de continuidade: decidir/preservar os documentos removidos ou reconstruir referências e ferramentas, sem assumir que `01–16` substituem todos os contratos; executar `npm run continuity:check`.
2. Reexecutar `npm test` e TypeScript check no estado final que se pretende publicar.
3. Executar `npm run verify:readiness` (inclui verificações de build/rotas/SEO/publicação configuradas no projeto) e gates de conteúdo/locale (`npm run content:status` e verificações aplicáveis).
4. Executar os E2E locais relevantes: `tests/e2e/contact-experience.spec.ts`, `tests/e2e/onboarding-flow.spec.ts`, `tests/e2e/critical-pages.spec.ts`, `tests/e2e/public-evidence.spec.ts` e o fluxo de content review. Executá-los em ambiente local/isolado e sem integrações reais.
5. Se Process Activation/DevWeb e componentes compartilhados forem incluídos, adicionar validação visual/responsiva em 390, 768 e 1440 e verificar service pages que usam `ServiceInsightsBridge`/`MiniCases`.

**Desejável antes de P1:** comparar tamanho de bundle/chunk de Anime.js e avaliar fallback/reduced motion do Lenis; revisar variantes compartilhadas em todas as páginas. **Pode esperar:** E2E integral de jornadas não alteradas e validação de integrações reais, que não deve ser executada como parte deste push sem ambiente controlado.

## 8. Blockers e plano recomendado

1. **Bloqueador de continuidade/documentação:** obter resolução explícita para as 78 remoções (`22bee39`), sanar referências a docs ausentes e decidir o destino dos diretórios consumidos por `tools/generate-editorial-review.mjs`. Não executar o gerador enquanto suas entradas estiverem ausentes.
2. **Resíduos sem gate de produto:** manter os diffs de Process Activation, DevWeb e variantes/componentes compartilhados fora do push até revisão visual e decisão sobre a seção removida; não misturar com commits P0 já publicados localmente.
3. **Dependência e hooks:** decidir Anime.js após medir bundle e comparar alternativa já instalada; decidir se a mudança de hooks é institucional ou local.
4. **Artefatos:** preservar o snapshot Git/Docker até seu valor histórico ser arquivado com segurança; a cópia estrutural pode ser removida em etapa separada autorizada.
5. Após fechar esses pontos, executar os gates listados, revisar `git diff`/`git diff --cached` por arquivo e só então propor uma unidade de push. Não há recomendação para squash/rebase dos commits existentes.

## Veredito final

**BLOCKED — não realizar push agora.** O principal blocker é a série de remoções documentais não reconciliada, com referências e ferramenta editorial apontando para caminhos ausentes. Além disso, os diffs residuais de páginas/components e a inclusão de Anime.js ainda carecem de validação visual/decisão de escopo. Os dez commits não apresentam, isoladamente, evidência suficiente para reescrever o histórico; manter a história atual é preferível a squash sem benefício funcional.

### Handoff

- **O que preservar:** dez commits existentes, assets e alterações locais; não usar operação destrutiva para “limpar” a branch.
- **O que não alterar nesta auditoria:** conteúdo, status do índice, commits, branches, dependências e artefatos.
- **Próxima missão recomendada:** decisão documental explícita + plano de reparo de referências/gerador; depois validar os resíduos de UI e motion em tarefa separada.
- **Push:** aguardar resolução dos blockers e execução dos gates obrigatórios.

### Nota histórica — encerramento posterior dos blockers P0 (2026-10-19)

As conclusões acima são a fotografia válida da auditoria pré-push naquele momento e não foram reescritas. O fechamento posterior registrou as resoluções sem alterar retroativamente os achados:

- O blocker de referências/documentação aposentada foi reconciliado em `18_DOCUMENTATION_RECONCILIATION.md`.
- Os resíduos visuais/motion foram validados e consolidados em `19_PRODUCT_RESIDUAL_VALIDATION.md` e `20_PRODUCT_RESIDUAL_CONSOLIDATION.md`; a seção comercial foi preservada, Anime.js não foi adotado e a unidade entrou no commit `7a59b347`.
- As decisões públicas de evidência e o estado `investigate` aplicado ao runtime permanecem documentados nos relatórios P0.2–P0.4; os gates finais e limites desta branch serão registrados em `21_P0_FINAL_RELEASE_GATE.md`.

Esta nota atualiza somente o status posterior dos blockers; não modifica o conteúdo, a classificação ou o veredito histórico da auditoria original.
