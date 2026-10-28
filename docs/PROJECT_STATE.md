# Estado do projeto — TAG08

> **Autoridade atual (2026-10-28):** este arquivo reúne registros de épocas diferentes. As seções antigas que descrevem `main`, o commit-base `5126504` ou arquitetura de integração anterior são snapshots históricos, não instruções de branch nem arquitetura vigente. O checkout observado nesta data está em `p2-home-cases-consolidation` (`d086c17e06bfc96bc426ff15d781299a71c8fbad`); isso não prova que um processo esteja ativo em `localhost:3101` (a porta estava sem listener na verificação). Contato/Talentos usam o caminho direto Sheets/ClickUp descrito nos registros operacionais mais recentes; Onboarding permanece desativado e conserva seu plano de controle PostgreSQL atual. Consulte o código, preflight e testes atuais antes de qualquer operação.

Atualizado em: `2026-10-27`

## Encerramento de bloqueios Sheets/Build — 2026-10-28

- A escrita operacional em Sheets consulta a coluna de Delivery ID antes do append. Um HTTP 2xx sem `updates.updatedRange` no formato de linha aprovado continua como resultado incerto (`outcomeUnknown`); o runner de staging pode fazer uma única repetição com a mesma chave, que volta a consultar o Delivery ID antes de tentar novo append. Isso evita replay cego; não oferece garantia distribuída contra concorrência.
- Não foi localizado relatório/log acessível com a resposta real do append anterior nem com seu run ID/Delivery ID. Nenhum replay ou novo append externo foi feito nesta missão. Antes de repetir aquela submissão, o operador precisa fornecer o run ID/Delivery ID original para uma consulta somente de leitura na aba de staging.
- Testes diretos com mocks: adaptador Sheets 10/10 e preflight/runner de staging 8/8. `npm run build` atual passou, incluindo `prisma generate` 7.8.0, TypeScript, Next build e standalone. O erro histórico em `127.0.0.1:9` ocorreu ao buscar checksum/binário do Prisma através do proxy local e não foi reproduzido no build atual; não é falha de conexão com banco. O launcher multi-arquivo `node --test` segue limitado por `spawn EPERM` no ambiente do agente.

## Validacao da missao atual

- Os assets aprovados da Darker Grotesque e sua licença OFL estão versionados; a integração tipográfica permanece pausada. A foundation cromática aprovada (`#DDF81D` institucional e `#3F5A00` funcional) foi reconciliada; o acento padrão dos avatares externos também usa o lime aprovado.
- A jornada de Contato foi estruturada para qualificar projetos, clientes atuais e parcerias; esta unidade não altera distribuição automática de leads. As demais alterações locais permanecem fora dela e ainda não foram consolidadas.
- Corrigido o foco de teclado do primeiro servico no painel agrupado do Header, usando a ordem renderizada.
- Corrigida a superficie de eventos do palco editorial da Home sem tornar a camada decorativa clicavel.
- Aplicado `ResilientImage` ao hero da Assessoria para tratar indisponibilidade temporaria do CDN.
- A suite critica foi reexecutada com o build atualizado: 89 testes aprovados em 2,9 minutos, incluindo as tres correcoes direcionadas.
- O gate de contratos foi atualizado para o novo fingerprint de `ClienteOnboarding.tsx`, mantendo `en` e `es` aprovados.
- A suíte `npm test` passou integralmente, incluindo contratos de rotas, localização, rastreamento, simuladores e APIs.
- O CTA hero de audiovisual foi incluído no `TrackedOutboundLink`, eliminando a última chamada direta de WhatsApp detectada pelo contrato.
- Remapeadas as superfícies neutras do design system para separar melhor canvas, cards, áreas sutis e bordas sem alterar o acento lime.
- Auditorias de cores, contrato visual e UX matrix passaram; a suíte crítica de navegador fechou em 89/89 após a alteração global de tokens.
- Padronizado o rótulo M-07 da Home para caixa alta, mantendo a convenção dos demais cards do bento.
- A primeira frente da página de Serviços recebeu uma superfície clara de destaque, com textos, tags, bordas e CTA remapeados para contraste sobre o canvas dark.
- A suíte crítica foi reexecutada após a alteração: 89/89 testes aprovados.
- Corrigido o contraste do CTA da superfície clara, incluindo texto e ícone sobre o botão escuro.
- No piloto da Home, 10 glows decorativos deixaram de usar o verde e passaram a usar neutros translúcidos; CTAs, foco e estados ativos foram preservados.

## Missão em andamento

- Talentos: o formulário passou a aceitar múltiplas áreas e respostas adaptativas em contrato v2; o contrato v1 e o identificador legado de persistência foram preservados. TypeScript passou; testes de persistência e E2E foram adicionados/atualizados, mas não executaram neste ambiente devido a `spawn EPERM` no esbuild. Integrações externas continuam desativadas.

- Home: removida a vitrine redundante de portfólio em validação, refinado o mapa de soluções e mantida a navegação dos cases. O conteúdo EN/ES existe apenas como rascunho gated; a prontidão permanece pendente de revisão linguística. Build e 94 testes E2E críticos passaram.
- Onboarding: jornada autenticada por magic link para clientes de projetos/contratos confirmados; a interface pública não oferece modo de envio `tag08_team`, e a submissão permanece vinculada à sessão e à jornada autorizada. Contato e Banco de Talentos são canais públicos separados. EN/ES permanecem indisponíveis até revisão linguística. A validação posterior P1.2F.1 passou em 7/7 E2Es, com PostgreSQL sintético isolado.
- Refinada a experiência do Header sem alterar rotas ou contratos: navegação de serviços agrupada por decisão, CTA de contato visível no mobile, atalho de acessibilidade, foco/semântica revisados e redução de movimento respeitada. QA responsivo concluído em cópia isolada do HEAD (build oficial PASS) nos viewports 390, 768 e 1440 px: variantes, menu/CTA, teclado e foco, Escape, navegação e ausência de overflow aprovados. A identidade da antiga instância `localhost:3101` não foi comprovada; ela não foi usada como evidência.

## Estado de integração (snapshot histórico; não usar como estado corrente)

- Linha de trabalho esperada: `main`. Uma missão ativa deve usar uma branch curta no padrão `p<numero>-<tema>`, criada a partir desta base.
- Destino de integração: `main`, no commit `5126504` (`2026-09-15`).
- Commit-base de integração: `5126504`.
- Relação: a reconciliação da `p0-routing-secret-containment` foi integrada por PR #1. A `p0` permanece preservada como trilha de auditoria; a `p1-publication-ops` parte do novo `main` apenas para fechar a continuidade pós-merge.
- Regra ativa: não desenvolver diretamente em `main`. Cada missão começa em uma branch curta, passa pelos gates e volta por PR; o checkpoint aceita apenas `main` ou o padrão de missão registrado.

## Checkpoint executável

- Última missão concluída: PR #1 integrada em `main` no commit `5126504`, após CI verde para build, rotas HTTP, relatório de conteúdo, 142 cenários públicos e 3 cenários da prévia local. Home, portfólio e cases indexáveis permanecem pendentes.
- Próxima missão autorizada: configurar e validar um destino de staging/produção para o `main` integrado. A prévia local preserva a exigência de branch e aceita `detached HEAD` apenas no CI.
- Antes de desenvolver: `npm run continuity:status`. O comando confere branch, commit-base, missão e itens locais isolados; `npm run dev`, `npm run dev:content-review` e `npm run dev:public-preview` executam essa conferência automaticamente.
- Antes de commitar: o hook local exige `docs/PROJECT_STATE.md` e `docs/CHANGELOG.md` no mesmo commit de qualquer alteração de comportamento. Para ativá-lo em uma instalação existente: `npm run setup:hooks`.
- CI: o workflow busca o histórico completo para validar o commit-base, pois um checkout raso não permite provar a ancestralidade da branch.
- Localização: as assinaturas de fonte são calculadas com quebras de linha normalizadas para evitar falso positivo entre Windows e Linux.
- Tipos de dados: `npm run lint` gera o cliente Prisma antes do TypeScript. Assim, uma instalação limpa no CI valida os mesmos imports que o ambiente local, sem depender de arquivos gerados anteriormente.
- Rotas HTTP: `npm run verify:routes` sobe o build de produção em uma porta isolada quando `BASE_URL` não é informado; em staging, a mesma variável aponta para o ambiente real. A checagem não depende mais de um servidor local esquecido em `:3000`.
- Testes visuais: contratos de localização verificam URL canônica, idioma e título principal; não usam contagem de elementos de layout, que muda legitimamente quando a página evolui.
- Navegador local: `npm run test:browser` usa a porta `3211` e inicia o build atual, sem reutilizar um `next dev` em `:3000`. Para validar staging, usar explicitamente `E2E_BASE_URL`.
- Dono de cada runtime local: `npm run dev` e `npm run dev:content-review` abrem a referência editorial em `:3101` com `.next-review`; se ela já estiver ativa, o comando informa o endereço para reutilizar sem tentar iniciar uma segunda cópia. `npm run dev:public-preview` simula somente o conteúdo publicável em `:3212` com `.next-dev`; `npm run test:browser` usa `:3211`; Docker ocupa `127.0.0.1:3000` apenas para a imagem compilada. Não comparar mudanças locais em `:3000` nem iniciar duas prévias sobre o mesmo cache.
- Tailwind: `src/index.css` limita a descoberta de classes ao diretório `src`. Caches gerados (`.next`, `.next-dev` e `.next-review`) nunca podem entrar na varredura, pois isso realimenta CSS compilado e corrompe classes arbitrárias. `.next-review/` também é ignorado pelo Git.
- Higiene do repositório: `.lighthouseci/` contém relatórios gerados de auditoria e permanece fora do Git; os resultados devem ser tratados como artefatos de CI, não como fonte do produto.
- Assets públicos: `src/proxy.ts` deixa URLs com extensão de arquivo passarem sem reescrita de idioma. Isso preserva imagens da equipe e demais arquivos em `public/`.

## Alterações locais a preservar e separar

- Discoverability: `/llms.txt` é servido por uma rota estática do Next. O checkpoint focado inclui a remoção do arquivo de raiz, a exclusão no `proxy` e a verificação de rota.
- Ativos de clientes: os SVGs em `public/clients/` estão versionados. As 12 marcas autorizadas para `/sobre` são controladas por `src/content/publicEvidence.ts`; qualquer novo logo exige a mesma aprovação por item e rota.
- Evidências públicas: o gate em `src/content/publicEvidence.ts` libera somente mini-cases e depoimentos internos em Assessoria. Os perfis da equipe em `/sobre` permanecem preservados, mas pendentes e fora da renderização pública. Home, portfólio e cases indexáveis continuam bloqueados; os cases pendentes também não geram rota ou sitemap. `npm run content:status` torna cada supressão visível e `npm run dev:content-review` permite revisão local identificada, sem publicação.
- Referência editorial interna: a prévia em `http://localhost:3101`, identificada por “REVISÃO LOCAL — NÃO PUBLICADO”, é a versão completa aprovada para evolução e revisão. A prévia pública em `:3212` continua sendo a simulação estrita do que pode ser publicado hoje; suas supressões não equivalem à perda do trabalho editorial.

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

- `/sobre`: o checkpoint de 02/09 descrevia competências sem pessoas; o commit de 11/09 reintroduziu sete perfis, cargos e fotos. Os perfis ficam preservados para revisão, mas voltaram a ficar fora da renderização pública para manter a versão editorial aprovada nesta sessão.
- `/`: há cases, citações e imagens que precisam ser confrontados com a regra de prova registrada em 02/09. Não presumir que estarem no código equivale a autorização de publicação.
- Serviços históricos indexáveis: Assessoria, Process Intelligence, Process Activation e Hospedagem continuam no registry. A existência técnica da rota não confirma prioridade comercial atual.

## Fontes de decisão e continuidade (mapas de consolidação são evidência histórica)

- Baseline e estado atual observado: `docs/architecture-consolidation/01_CURRENT_STATE_MAP.md` e `11_P0_BASELINE.md`.
- Reconciliação histórica entre arquiteturas: `docs/architecture-consolidation/02_CANONICAL_VS_PARALLEL.md` e `10_CONSOLIDATION_WAVES.md`; consultar como evidência datada, não como descrição automática da arquitetura atual.
- Próximas fases de saneamento: `docs/architecture-consolidation/10_CONSOLIDATION_WAVES.md`.
- Rotas e indexação: `docs/architecture-consolidation/03_ROUTE_AND_PAGE_INVENTORY.md` e `src/config/routeRegistry.ts`.
- Evidências públicas: `docs/architecture-consolidation/13_PUBLIC_EVIDENCE_APPROVAL_MATRIX.md`, `14_PUBLIC_EVIDENCE_DECISIONS.md` e `15_P0_4_INVESTIGATE_IMPLEMENTATION.md`.
- Integrações e riscos: `docs/architecture-consolidation/07_INTEGRATION_MAP.md` e `09_RISK_REGISTER.md`.
- Arquitetura, conteúdo e contratos: `docs/architecture-consolidation/01_CURRENT_STATE_MAP.md`, `05_CONTENT_SOURCE_MAP.md`, `07_INTEGRATION_MAP.md` e os contratos em `server/`.

## Regra para a próxima sessão

1. Conferir `git status --short`, branch e último commit.
2. Ler este arquivo e `docs/architecture-consolidation/10_CONSOLIDATION_WAVES.md`; consultar `docs/architecture-consolidation/14_PUBLIC_EVIDENCE_DECISIONS.md` quando a tarefa envolver publicação de evidências.
3. Escolher uma única missão do roadmap.
4. Não reabrir conteúdo pendente sem evidência ou decisão registrada.
5. Antes de aprovar ou revisar conteúdo, rodar `npm run content:status`; para interface, usar `npm run dev` (ou o alias `npm run dev:content-review`).

## Operational submission architecture (2026-10-27)

- Contact and Talent API routes now persist directly to Google Sheets when SUBMISSIONS_ENABLED=true and GOOGLE_SHEETS_ENABLED=true; they do not fall back to PostgreSQL. Both flags are false in .env.example, and ClickUp remains disabled by the existing flags. No external write was performed in this mission.
- The A:D envelope remains intact. Contact keeps its existing E:P projection and uses Q:W for the Sheets row reference, ClickUp status/task reference, attempts, safe error code, Sheets status, and update time. Talent adds a v1 projection in E:Q (including the complete v2 interestAreas[]) and uses R:X for the same delivery state. The adapters reject missing or mismatched E+ headers before appending; operators must prepare/approve those headers before any activation.
- Record and Sheets Delivery IDs are stable SHA-256-derived values from submission type plus the idempotency key. Exact replay reuses the row; changed payload returns HTTP 409. ClickUp is routed only for commercial Contact (new_project) and Talent; other Contact intents remain in Sheets without Pre-sales routing. ClickUp Talent projection omits professional links, consent and UTM and labels the record for human evaluation.
- Sheets is authoritative for Contact/Talent canonical submissions; ClickUp state is an independent delivery state. The implementation does not claim a distributed transaction or exactly-once delivery. Same-process requests are serialized; concurrent writers across multiple app instances can still race. A retry requires replay with the same idempotency key; failed/pending rows need reconciliation.
- Onboarding remains on the existing PostgreSQL control-plane and submission transaction because link redemption, session ownership, revocation, draft/resume, and authorized completion rely on database constraints/transactions. Sheets cannot safely replace those controls. A direction decision is still needed for how to retain that security boundary while removing PostgreSQL from submission persistence; no Onboarding code was changed.
- PostgreSQL models, migrations and the SQL integration worker remain for Onboarding and legacy consumers; removal is deferred until each consumer has a verified replacement. No P4 files, external services, or next-env.d.ts were changed.

## Integracoes operacionais Sheets/ClickUp - 2026-10-27

- Contato e Talentos gravam submissoes operacionais no Google Sheets, preservando A:D e usando em D o envelope v2 com SHA-256 do payload canonico. As projecoes estruturadas E+ mantem os campos implementados. Replay le JSON legado e o digest v2 anterior sem regravar o historico.
- Record ID e Delivery ID permanecem estaveis pela chave de idempotencia. IDs duplicados na planilha bloqueiam para reconciliacao; append sem referencia de linha confirmada nao e tratado como concluido. Atualizacao de estado exige confirmacao da linha e intervalo exatos.
- ClickUp recebe somente novos projetos de Contato e Talentos. Resultado incerto apos possivel criacao fica UNKNOWN; replay procura a tarefa pelo nome deterministico e nao cria outra se nao puder confirmar sua existencia. Replays tem limite de oito tentativas e nao rodam automaticamente em background.
- Talentos exige chave de idempotencia; chave ausente e rejeitada antes da persistencia. Todas as areas continuam estruturadas em E+.
- Transmissoes permanecem desativadas. Testes usam adaptadores simulados; nenhuma escrita externa ocorreu.
- Limites: Sheets e ClickUp nao oferecem transacao conjunta; o lock cobre somente o processo atual e escritores distribuidos ainda podem concorrer. O hash em D e pseudonimo correlacionavel, nao anonimato. Consumidores externos do D legado, allowlist/finalidade/acesso/retencao e cabecalhos reais de staging precisam de confirmacao antes da ativacao.
- Validacao: testes operacionais diretos passaram 29/29; npx tsc --noEmit passou. O runner agregado node --test falhou por spawn EPERM, mas os mesmos tres arquivos .mjs passaram executados diretamente. O teste TypeScript do handler e o build atualizado permanecem pendentes por bloqueio de subprocesso. Nao homologado em staging.

## Onboarding security and persistence boundary - 2026-10-27

- The existing Onboarding completion transaction remains unchanged: it verifies the hashed session and active journey, handles idempotency, stores the submission, queues the two deliveries, closes the journey, clears the draft, and records the audit event.
- New SQL outbox deliveries now receive server-built, destination-specific projections. Sheets retains existing operational fields while excluding consent/auth metadata and untrusted browser-provided sheetPayload/clickupPayload. ClickUp also omits the tax identifier. The adapters apply the same projections when replaying older full-payload outbox entries. No external write occurred.
- Full removal of PostgreSQL is not safe with the approved guarantees and current constraints. Magic Link one-use, session expiry/revocation, draft ownership, cross-journey isolation, concurrent completion and idempotent closure rely on transactional state. Sheets has no conditional uniqueness or compare-and-set transaction to preserve these guarantees. No PostgreSQL code was removed and Onboarding remains dependent on it.
- Required decision to resume the full cutover: authorize a secure transactional mechanism for identity/session/revocation state that conforms to the no-database target, or revise the no-PostgreSQL constraint for the control plane. Do not weaken one-time use, revocation, isolation or completion guarantees to force a Sheets-only implementation.
- Validation: destination projection and existing operational adapter/store suites passed 32/32 with synthetic inputs; TypeScript passed. The updated isolated Next.js build stopped at process creation with spawn EPERM. No database, migration or external service was used; staging is not homologated.

## Release preparation - 2026-10-27

- Added the reversible `ONBOARDING_ENABLED` release gate. Production defaults closed; the page returns not-found and Onboarding APIs/administrative link operations return unavailable before database access unless explicitly enabled. Development retains the prior behavior when unset. This does not replace the PostgreSQL control plane or mark Onboarding complete.
- Deployment preflight now requires the flag explicitly and rejects enabling Onboarding for production. The staging template keeps it disabled. Contact and Talent routes are outside this gate; integrations remain independently disabled by their existing flags.
- Validation: availability policy and guarded-route checks passed by direct Node execution; TypeScript passed. `tsx` test execution was blocked by `spawn EPERM`. Isolated build and HTTP route checks remain unverified; no database, integration, or deployment operation was performed.

## Decisão operacional atual: Contato e Talentos somente Sheets — 2026-10-28

- Para esta release, as rotas `/api/contact` e `/api/talent-applications` validam e persistem diretamente nas abas `Leads` e `Talentos`. O Google Sheets é o único destino operacional desses fluxos; ClickUp não é consultado nem recebe tarefas, e os fluxos não usam PostgreSQL/outbox SQL.
- A identidade continua determinística por tipo de submissão e `Idempotency-Key`; o adapter procura o Delivery ID antes de append, verifica o payload, retorna a referência de linha e sinaliza conflito de chave/payload. Isso não promete exclusão de corrida entre múltiplos processos gravando simultaneamente no Sheets.
- Colunas ClickUp legadas permanecem no contrato para compatibilidade; novas linhas recebem `NOT_ROUTED`, sem Task ID, tentativas ou erros artificiais. O worker rejeita entregas SQL históricas de Contato/Talentos antes de chamar a API ClickUp.
- O preflight e o runner de staging não exigem credencial/lista ClickUp para Contato/Talentos. A configuração pública permanece desligada por padrão. Onboarding e seus consumidores independentes permanecem desativados/preservados.
- Validação externa desta missão: PASS em cópia isolada. `/api/contact` e `/api/talent-applications` retornaram 202; replay preservou Record ID e linha; linhas sintéticas foram limpas e confirmadas ausentes. ClickUp e banco não foram usados.
