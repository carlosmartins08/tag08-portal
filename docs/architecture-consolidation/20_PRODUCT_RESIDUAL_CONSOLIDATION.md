# P0.7C — Consolidação controlada dos resíduos de produto

**Data:** 2026-10-19
**Escopo:** Process Activation, Desenvolvimento Web, MiniCases, ServiceInsightsBridge e motion CSS associado.
**Branch/base:** `p2-home-cases-consolidation` / `2a7575e` (worktree já continha alterações locais antes desta missão).

## Decisões e implementação

### Seção comercial

A decisão humana foi preservar, nesta consolidação, a seção “Quando contratar nossa ativação sênior?”. O conteúdo e markup correspondem ao estado do `HEAD`; não foram reescritos conteúdo, números, critérios, claims ou CTA. Isso não equivale a aprovação estratégica/editorial definitiva. O diff final não remove mais essa seção.

### Motion do roadmap

Anime.js não foi adotado. O efeito simples do roadmap foi implementado em CSS em `src/index.css`: opacidade `0.72 → 1`, deslocamento vertical `8px → 0`, duração `220ms`, easing de saída e atraso incremental de `45ms` por fase. A lista recebe `key={activeLevel}` para reiniciar o efeito quando o nível muda. A media query `prefers-reduced-motion: reduce` desliga a animação e zera transform, preservando visibilidade.

Foram removidos os imports/uso de Anime.js e sua dependência local de `package.json`/`package-lock.json`; os dois manifests ficaram sem diff final. Motion e Lenis permanecem inalterados. `rg animejs` em código fonte, manifesto e lockfile não encontrou referências de runtime/dependência. Referências históricas em documentação/artefatos antigos não fazem parte do bundle nem desta unidade.

O probe de bundle documentado em `19_PRODUCT_RESIDUAL_VALIDATION.md` estimava +14.285 B gzip para o uso isolado de Anime.js e +22.576 B gzip para Motion isolado sobre um baseline hook-only; não era medição do chunk Next. A decisão por CSS se baseia no escopo pequeno do efeito e elimina JavaScript específico de animação, sem afirmar uma economia exata no chunk de produção.

## Arquivos de produto alterados

- `src/features/site/pages/ProcessActivation.tsx`: mantém as melhorias visuais locais existentes; remove Anime.js; adiciona entrada CSS/reentrada do roadmap; restaura a seção comercial do `HEAD`; opta explicitamente pela variante clara do bridge.
- `src/index.css`: adiciona somente keyframes/regra de entrada do roadmap e tratamento de movimento reduzido.
- `src/components/ServiceInsightsBridge.tsx`: mantém `legacy` como default; adiciona `editorial-light` opt-in e `layout="two-at-tablet"` opt-in para controlar a composição sem seletores internos frágeis.
- `src/features/site/pages/DesenvolvimentoWeb.tsx`: ajustes visuais residuais, opt-in explícito `editorial-light`/`two-at-tablet`; sem alteração de oferta, conteúdo comercial, SEO ou arquitetura. Diferenças de texto no diff são entidades HTML substituídas pelos caracteres equivalentes.
- `src/components/MiniCases.tsx`: adiciona classe contextual; consumidores sem contexto ancestral mantêm o caminho visual existente.

Não houve alteração final em `package.json` ou `package-lock.json`, pois as alterações locais referentes a Anime.js foram removidas junto com a integração.

## QA visual e interação

Foi usado Chromium com emulação de viewport, contra runtime local isolado em porta 3102, associado ao worktree atual e com `NEXT_PUBLIC_TAG08_CONTENT_REVIEW=0`. A porta 3101 já estava ocupada por processo não pertencente a esta execução e não foi tocada. Requisições `/api/*` e hosts externos de serviços foram bloqueados durante QA; não houve chamadas a integrações reais. Os screenshots temporários ficaram fora do repositório.

Foram verificadas 27 combinações rota/viewport (nove páginas × 390, 768 e 1440 px): Process Activation, Desenvolvimento Web e sete consumers legacy de ServiceInsightsBridge. Todas retornaram HTTP 200; não houve overflow horizontal em `document`/`body` nem erros de página. O bridge legacy conservou `data-variant="legacy"` e sua grade; Desenvolvimento Web apresentou uma, duas e três colunas nos breakpoints 390, 768 e 1440, respectivamente. Process Activation e Desenvolvimento Web renderizaram a variante editorial clara explicitamente.

| Viewport | Resultado |
| ---: | --- |
| 390 px | Pass nas páginas verificadas: sem overflow horizontal; composição responsiva observada. |
| 768 px | Pass: sem overflow; bridge opt-in de Desenvolvimento Web em duas colunas e consumers legacy preservados. |
| 1440 px | Pass: sem overflow; bridge opt-in em três colunas e consumers legacy preservados. |

Interações verificadas: foco por teclado no seletor de nível, seleção com Enter, atualização do roadmap, atraso escalonado e reinício ao trocar nível, hover de cards e `prefers-reduced-motion`. O CTA manteve foco visível. A seção comercial restaurada foi encontrada e visível no DOM renderizado. Não se observou layout shift perceptível. **Não houve medição formal de CLS nem auditoria numérica automatizada de contraste**; esses dois aspectos permanecem fora de um PASS quantitativo.

### Consumers compartilhados

- `MiniCases`: seis consumers identificados — Branding, Desenvolvimento Web, Process Activation, Process Intelligence, Produção Audiovisual e Assessoria. A classe contextual, sem ancestral de contexto, mantém o tratamento legado; cinco consumers não usam o novo contexto. Os casos em que a política `publicEvidence` não fornece itens não permitiram avaliar visualmente cards reais vazios/sem dados; isso não foi tratado como evidência de regressão.
- `ServiceInsightsBridge`: nove consumers identificados. Desenvolvimento Web e Process Activation são os opt-ins editoriais; os outros sete permanecem legacy. `legacy` é o default, sem migração implícita. Em Desenvolvimento Web, `layout="two-at-tablet"` elimina dependência de seletores direcionados aos nós internos do componente.

Não foi identificada regressão objetiva nos consumers verificados. Não foi feito redesign nem alteração de layout fora das mudanças residuais avaliadas.

## Testes e gates

| Gate | Resultado |
| --- | --- |
| `tests/processActivationSimulator.test.ts` | PASS |
| `tests/serviceInsightsBridge.test.ts` | PASS |
| `npm test` | PASS no ambiente autorizado; a primeira execução restrita falhou ao iniciar Git (`spawnSync git EPERM`), não por falha de produto. |
| `tsc --noEmit` | PASS |
| `npm run continuity:check` | PASS; emitiu apenas aviso de arquivos untracked locais preexistentes. |
| `npm run build` | PASS; build de produção, geração local Prisma via prebuild, sem migration/acesso a banco persistente. |
| QA Chromium + E2E de páginas afetadas | PASS para as verificações descritas, com endpoints API/externos bloqueados. |
| Integrations, workers, migrations, banco persistente | Não executados, conforme escopo. |

O build gerou somente artefatos locais ignorados. `next-env.d.ts` e arquivos gerados Prisma não apresentaram diff após o build.

## Riscos residuais e exclusões

- Emulação Chromium não substitui teste em dispositivos físicos ou outros engines.
- CLS e contraste não foram medidos numericamente; a observação foi visual.
- Consumers cuja evidência está atualmente bloqueada não puderam demonstrar cards preenchidos, embora o comportamento dos componentes tenha sido preservado.
- A validação da seção comercial confirma preservação do conteúdo, não sua aprovação estratégica.
- As outras mudanças locais — `.codex/hooks.json`, relatório Impeccable, snapshots `_AUDITORIA_*` e `17_PRE_PUSH_AUDIT.md` — são pré-existentes e permanecem fora desta consolidação.

## Consolidação Git

As mudanças de visual das páginas/componentes e o motion substituído estão funcionalmente relacionadas; separar em dois commits criaria dependência artificial. Recomenda-se um commit local único após revisão do staging explícito:

`refactor: consolidate service page visual treatments`

Escopo previsto: os cinco arquivos de produto listados acima e os documentos `19_PRODUCT_RESIDUAL_VALIDATION.md` (adendo) e este relatório. `package.json` e `package-lock.json` não entram porque não possuem diff. Não fazer push nesta missão.

Rollback: reverter o commit local da unidade completa. Isso restaura as implementações anteriores e não envolve migração de dados, integração externa ou mudança de schema.
