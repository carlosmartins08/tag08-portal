# P0.7B — Validação e destino dos resíduos de produto, motion e dependências

**Modo:** análise e validação; sem alteração de código.
**Baseline Git observado:** branch `p2-home-cases-consolidation`, HEAD `2a7575ed00201254d0789b61b013cc5a6caca75c`, upstream `origin/p2-home-cases-consolidation`, 11 commits à frente. Staging vazio. Os seis arquivos de escopo já estavam modificados no worktree antes desta missão; não foram alterados por ela.

## Veredito executivo

Os resíduos **não estão prontos para consolidação**. TypeScript e os testes específicos passaram, mas a auditoria visual obrigatória não pôde ser feita: não havia processo ouvindo na porta 3101, não havia screenshots baseline e iniciar o servidor/build poderia gerar artefatos fora do único arquivo autorizado para escrita. A remoção de “Quando contratar nossa ativação sênior?” é uma decisão comercial/editorial e permanece para decisão humana. O comportamento de animação é simples o bastante para CSS; a inclusão de Anime.js ainda não tem justificativa de produto que compense a nova dependência.

## Diagnóstico por arquivo

| Arquivo | Diff observado e dependências | Destino recomendado |
| --- | --- | --- |
| `src/features/site/pages/ProcessActivation.tsx` | Mistura mudanças de apresentação (cards e CTA claros), motion do roadmap e a remoção de uma seção comercial. O efeito Anime.js roda ao montar/trocar nível, anima `opacity` e `translateY` em 220 ms com stagger de 45 ms e não roda com `prefers-reduced-motion`. | **DIVIDIR.** Manter o hunk de conteúdo fora de qualquer consolidação até decisão humana. Layout pode ser avaliado como unidade própria; motion deve ser simplificado/decidido antes de consolidar. Sem commit agora. |
| `src/features/site/pages/DesenvolvimentoWeb.tsx` | Reorganiza visualmente várias seções, muda raios, tipografia, superfícies e espaçamentos, adiciona contextos claros, remove sombras e transforma os seis cards de critérios em itens separados por borda. Não encontrei mudança material nas alegações; conversões de entidades HTML para caracteres Unicode preservam o texto renderizado. Depende das mudanças compartilhadas em `MiniCases` e `ServiceInsightsBridge`. | **MANTER LOCAL** até QA visual. É separável de Process Activation, mas deve ser validado junto dos dois componentes compartilhados que determinam sua apresentação. |
| `src/components/MiniCases.tsx` | Única mudança: adiciona `tag08-contextual-section` ao elemento raiz. Há seis consumers atuais: Assessoria, Branding, Desenvolvimento Web, Process Activation, Process Intelligence e Produção Audiovisual. O default escuro permanece nos cinco usos sem ancestral de contexto; em Desenvolvimento Web o wrapper `context-default` faz o componente receber o tratamento contextual. | **MANTER LOCAL** com a unidade visual de Desenvolvimento Web; nenhum consumer atual não relacionado foi identificado como afetado. |
| `src/components/ServiceInsightsBridge.tsx` | Adiciona `variant` opcional (`legacy` por default; `editorial-light` opt-in) e classes contextuais. Há nove consumers atuais: Assessoria, Branding, Desenvolvimento Web, Gestão de Redes, Hospedagem, Process Activation, Process Intelligence, Programa de Afiliados e Produção Audiovisual. Process Activation escolhe explicitamente `editorial-light`; Desenvolvimento Web recebe contexto do wrapper. Os outros sete mantêm `legacy` sem contexto ancestral. | **MANTER LOCAL** até QA visual. A variante é opt-in e os defaults estão preservados; consolidar junto das páginas que a consomem. Dependência contextual via ancestral deve ser considerada parte do contrato visual. |
| `package.json` | Adiciona somente `animejs@^4.5.0`; `animejs` é usado apenas em `ProcessActivation.tsx`. `motion` e `lenis` já existiam e não foram alterados. | **MANTER LOCAL** enquanto a referência em Process Activation existir; não consolidar isoladamente. Recomendação técnica é remover Anime.js após substituir o efeito por CSS, em missão autorizada separada. |
| `package-lock.json` | Registra a mesma adição: pacote `animejs` 4.5.0, licença MIT; sem outras mudanças de dependência no diff. | **MANTER LOCAL** junto de `package.json` e da decisão de implementação do motion. Não reverter o lock isoladamente. |

### Conteúdo comercial removido em Process Activation

O diff remove integralmente a seção “Quando contratar nossa ativação sênior?”, incluindo o critério de faturamento anual superior a R$ 300 mil, equipe com mais de quatro pessoas e a afirmação de que TAG08 Activation seria o encaixe “perfeito”. Isso altera qualificação comercial e promessa da oferta; não é consequência visual. Não há evidência nesta missão para concluir se o conteúdo deve permanecer, ser corrigido ou sair.

**Decisão recomendada: PRECISA DECISÃO HUMANA.** Até a decisão, não consolidar esse hunk como parte de um ajuste visual.

### Independência entre páginas

Desenvolvimento Web pode ser uma unidade distinta de Process Activation. Porém, sua apresentação depende das classes contextuais de `MiniCases` e do comportamento de `ServiceInsightsBridge`; o componente de Insights também é consumido em Process Activation. Portanto, qualquer futura separação por commits deve manter a alteração da API/variante compartilhada coerente com seus dois consumers, sem congelar um estado visual não verificado.

## Motion e custo de bundle

### Comportamento atual

Em `ProcessActivation.tsx` (efeito próximo às linhas 34–51), cada mudança de `activeLevel` anima as fases do roadmap: opacidade `0.72 → 1`, deslocamento vertical `8 → 0`, duração de 220 ms, stagger de 45 ms e easing `out(3)`. Com quatro fases, a última termina aproximadamente 355 ms após o início. A preferência por movimento reduzido evita iniciar a animação; a limpeza chama `revert()`.

O efeito é determinístico e não usa timeline, gesto ou sequência complexa. CSS atende opacity/translateY e stagger; para repetir quando a seleção muda, a lista pode ser remontada por estado e usar atraso curto por item, com movimento removido sob `prefers-reduced-motion`. Motion também já está instalado e é usado no próprio componente para `useReducedMotion`, além de vários componentes e do `SiteShell`.

### Medição reproduzível em memória

Como o runtime Next estava parado e `next build` tem `prebuild` com geração Prisma, foi feita uma comparação isolada com o esbuild instalado, usando saída em memória (sem arquivos de bundle): probe tree-shaken com a mesma animação e baseline contendo `useReducedMotion`.

| Probe | JavaScript minificado | Gzip | Delta gzip sobre baseline |
| --- | ---: | ---: | ---: |
| Baseline (`useReducedMotion`) | 8.815 B | 3.470 B | — |
| Anime.js (`animate` + `stagger`) | 45.035 B | 17.755 B | **+14.285 B** |
| Motion (`animate` via `motion/react`) | 72.186 B | 26.046 B | **+22.576 B** |

Essa é uma medição de probe, **não** do chunk real do Next. Ela não reproduz a divisão/caching de chunks já compartilhados pelo site; por isso não permite afirmar o delta real de Motion na rota. O resultado indica que o uso tree-shaken de Anime.js adiciona cerca de 14 KB gzip no probe, enquanto a alternativa Motion isolada adiciona mais nesse cenário; o custo marginal do Motion pode ser menor no app por já fazer parte do bundle compartilhado. CSS acrescenta **0 B de JavaScript de biblioteca** (sem contar o CSS gerado), sendo a alternativa de menor peso para esta animação simples.

**Recomendação:** evitar a nova dependência e preferir uma animação CSS de entrada/reentrada com `prefers-reduced-motion`. Se CSS não reproduzir o reinício do estado com complexidade equivalente na implementação real, usar Motion existente e medir o chunk Next em ambiente seguro antes de escolher. Não manter Anime.js apenas com base no probe, nem afirmar que Motion é menor sem medição do chunk de produção.

| Critério | Anime.js atual | Motion existente | CSS/transição |
| --- | --- | --- | --- |
| Opacity, translateY e stagger | Direto via `animate`/`stagger` | Viável; Motion já existe | Viável com classes, key por estado e atraso por item |
| Reduced motion | Guard explícito no efeito; pula o movimento | `useReducedMotion` já disponível | `prefers-reduced-motion` nativo |
| Manutenção | Pequeno efeito, mas adiciona biblioteca exclusiva desta rota | Reusa dependência, API e runtime já presentes | Menor runtime; requer tratamento explícito de reentrada da lista |
| Tree-shaking / custo | Probe: +14.285 B gzip | Probe: +22.576 B gzip sobre hook-only; marginal real não medido e potencialmente menor por compartilhamento | Sem runtime JS de animação |
| Duplicação | Segundo motor de animação instalado para um efeito simples | Usa motor já presente | Não duplica motor |

`lenis` permanece fora desta decisão: é usado pelo `SiteShell` para smooth scrolling de desktop e respeita `prefers-reduced-motion` e telas abaixo de 768 px; não foi adicionado nem modificado nesta unidade. `motion` também permanece fora de qualquer remoção: tem consumidores existentes além destas páginas.

## Componentes compartilhados e blast radius

- **MiniCases:** seis consumers. A adição de classe sozinha preserva o aspecto legado quando não existe ancestral `.context-*`; na página de Desenvolvimento Web, o wrapper `.context-default` é um opt-in indireto que faz as regras existentes de contexto atingir o componente e seus cards. Isso é limitado aos usos observados, mas cria dependência do posicionamento ancestral. Os dados podem levar a `null` quando não há evidência visível; isso já é comportamento do componente e não foi alterado neste diff.
- **ServiceInsightsBridge:** nove consumers. `variant = "legacy"` preserva o contrato default; `editorial-light` é opt-in direto em Process Activation. Desenvolvimento Web recebe estilos contextuais por ancestral e ainda tem wrapper local com seletores arbitrários para neutralizar superfície/borda e ajustar o grid. Esse wrapper aumenta o acoplamento entre página e estrutura interna da bridge, mas está restrito a Desenvolvimento Web no estado observado.
- Não foi encontrado uso de `editorial-light` fora de Process Activation, nem outro consumer atual sob `.context-default`/`.context-*` além do trecho da página Desenvolvimento Web que inclui Insights e MiniCases. Portanto, não há side effect sistêmico confirmado em páginas não relacionadas; regressão visual continua **não verificada** sem runtime.

## QA visual — 390 / 768 / 1440 px

| Viewport | Resultado |
| ---: | --- |
| 390 px | **NÃO EXECUTADO — bloqueado.** Não havia listener na porta 3101 nem screenshot baseline. Overflow, wrapping, alvos, densidade, foco e hover não foram observados em browser. |
| 768 px | **NÃO EXECUTADO — bloqueado.** Mesmo impedimento; nenhum resultado visual é inferido do código. |
| 1440 px | **NÃO EXECUTADO — bloqueado.** Mesmo impedimento; alinhamento, proporção dos grids e integração de seções não foram confirmados visualmente. |

Hover/focus, movimento reduzido, CLS/layout shift e conteúdo renderizado também não foram exercitados. A causa para não iniciar um novo servidor é a restrição de não alterar arquivos além deste relatório: o script `npm run dev`/Next pode criar ou modificar cache/build no worktree. Assim, nenhum “PASS visual” é atribuído.

## Testes e gates

| Gate | Resultado | Observação |
| --- | --- | --- |
| `tests/processActivationSimulator.test.ts` | PASS — 2 testes | Roadmaps e durações seguem cobertos; não testa animação nem layout. |
| `tests/serviceInsightsBridge.test.ts` | PASS — 1 teste | Configuração/itens da bridge cobertos; não testa variantes visuais. |
| `npm test` | PARCIAL / FAIL ambiental | Os testes encadeados antes de `continuityCheck.test.ts` passaram, incluindo os testes diretamente relacionados. O último teste falhou com `spawnSync git EPERM` ao iniciar o checker; por causa do encadeamento, `test:contracts` não foi alcançado nessa invocação. |
| `npm run test:contracts` | PASS — 8 testes | Rodado separadamente após o encadeamento interrompido. |
| `tsc --noEmit` | PASS | Executado diretamente pelo binário local; sem `npm run lint`, cujo `prelint` executa Prisma generate. |
| Impeccable detector | 2 advisories | `ProcessActivation.tsx` reporta `text-[1.8rem]` e `text-[1.5rem]` fora da rampa documentada. `git show HEAD` confirma que ambos já existiam antes deste diff; são observações preexistentes, não regressões desta mudança. |
| Build / readiness / browser | NÃO EXECUTADOS | `build` chama `prebuild` (`db:generate`); `dev` pode produzir cache. Browser bloqueado pela ausência de runtime correspondente. |

**Regressões confirmadas:** nenhuma regressão funcional detectada pelos testes executados. **Regressões visuais:** inconclusivas, não equivalem a zero; dependem do QA pendente em browser.

## Destino por arquivo e critérios para desbloqueio

1. `ProcessActivation.tsx` — **DIVIDIR**; preservar a remoção comercial para decisão humana e não consolidar a dependência Anime.js sem substituir/justificar o efeito.
2. `DesenvolvimentoWeb.tsx` — **MANTER LOCAL** até QA visual; depois pode ser unidade independente de Process Activation, junto das mudanças compartilhadas necessárias.
3. `MiniCases.tsx` — **MANTER LOCAL** até validar o uso dentro do contexto claro de Desenvolvimento Web e confirmar o aspecto legado nos cinco outros consumers.
4. `ServiceInsightsBridge.tsx` — **MANTER LOCAL** até validar variante clara em Process Activation, contexto herdado em Desenvolvimento Web e default nos outros sete consumers.
5. `package.json` — **MANTER LOCAL** junto à decisão do efeito; recomendação posterior é remover Anime.js se o motion migrar para CSS.
6. `package-lock.json` — **MANTER LOCAL** sincronizado com `package.json`; não separar.

### Blockers restantes

- Decisão humana sobre a seção comercial removida de Process Activation.
- QA real em browser nos três viewports, incluindo `prefers-reduced-motion`, foco/hover, overflow e comportamento após trocar níveis.
- Escolha de implementação do roadmap motion e medição do chunk real se Motion for adotado. O probe isolado não substitui análise de bundle Next.
- `npm test` integral sem o impedimento sandbox `spawnSync git EPERM`.

**Conclusão:** resíduos não prontos para consolidação/push. Pode-se avançar somente após separar a decisão editorial e fechar os gates visuais/de animação; nenhuma reversão ou commit foi executado nesta missão.

## Adendo de execução — P0.7C (2026-10-19)

Este adendo registra a resolução das decisões e gates que estavam pendentes na auditoria original acima. O diagnóstico original foi preservado como fotografia anterior; os resultados abaixo são o estado posterior da consolidação.

- A seção comercial **“Quando contratar nossa ativação sênior?”** foi restaurada com o conteúdo e o markup do `HEAD`; não houve revisão de copy, critérios, claims ou CTA.
- O efeito de entrada do roadmap agora usa CSS (`opacity`, `translateY(8px)`, duração 220 ms e stagger de 45 ms). A lista é remontada ao trocar o nível para reiniciar a entrada. `prefers-reduced-motion: reduce` desativa a animação e mantém os itens visíveis. Não há import de Anime.js no código, manifesto ou lockfile; Motion e Lenis não foram alterados.
- O custo comparativo anterior continua sendo uma estimativa de probe esbuild, não uma medição do chunk de produção. A escolha por CSS foi confirmada pelo comportamento simples observado e por não introduzir runtime JS de animação.
- QA Chromium foi executado para Process Activation, Desenvolvimento Web e sete páginas consumidoras do bridge, em 390, 768 e 1440 px (27 combinações de rota/viewport). Todas responderam 200, sem overflow horizontal em `document`/`body` e sem erros de página. Os screenshots são emulação de viewport, não dispositivos físicos.
- Foram exercitados troca de nível por teclado, reinício/stagger do roadmap, `prefers-reduced-motion` e hover dos cards. O foco visível do controle permaneceu presente; a animação respeitou reduced motion. Não se observou deslocamento perceptível do layout. Não foi feita medição formal de CLS nem auditoria numérica de contraste; esses resultados não são declarados como gates quantitativos aprovados.
- `ServiceInsightsBridge` mantém `legacy` como default. Os sete consumidores legacy mantiveram `data-variant="legacy"` e a grade anterior. `editorial-light` ficou opt-in explícito em Desenvolvimento Web e Process Activation. A variante de layout `two-at-tablet` substitui seletores direcionados à estrutura interna do bridge em Desenvolvimento Web.
- Os seis consumers de `MiniCases` foram identificados. A classe contextual adicionada não altera a apresentação sem contexto ancestral; os cinco consumers fora do contexto editorial novo não renderizaram sob contexto novo. Onde a evidência pública atual suprime os itens, a equivalência visual do conteúdo vazio não pôde ser inferida como screenshot de cards; a implementação/default foi preservada.
- Em Desenvolvimento Web, as diferenças de conteúdo observadas no diff são normalizações de entidades HTML para caracteres equivalentes; não foram alteradas oferta, claims, SEO ou arquitetura da página. A mudança visual foi validada nos viewports acima.
- Regressões objetivas: nenhuma encontrada nos gates executados. A primeira tentativa de alguns checks visuais continha seletores/esperas inadequados; a verificação final foi repetida com seletores de controle e espera por hidratação. Essa limitação do harness não é atribuída ao produto.

**Gates posteriores:** `npm test` (PASS, executado no ambiente autorizado), testes específicos `processActivationSimulator` e `serviceInsightsBridge` (incluídos; PASS), `tsc --noEmit` (PASS), `npm run continuity:check` (PASS, com aviso de arquivos locais untracked preexistentes) e `npm run build` (PASS). O build executou geração local do Prisma conforme `prebuild`; não houve migration, acesso ao banco persistente, integração externa ou worker.

**Destino posterior recomendado:** `ProcessActivation.tsx`, `DesenvolvimentoWeb.tsx`, `MiniCases.tsx`, `ServiceInsightsBridge.tsx` e o trecho de motion em `src/index.css` formam a unidade funcional aprovada para consolidação. `package.json` e `package-lock.json` não têm diff final e não precisam entrar no commit. Os arquivos locais `.codex/hooks.json`, relatório Impeccable, pacotes `_AUDITORIA_*` e `17_PRE_PUSH_AUDIT.md` permanecem fora da unidade.
