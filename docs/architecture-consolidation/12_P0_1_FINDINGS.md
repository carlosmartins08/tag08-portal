# P0.1 — Fechamento do baseline

**Data:** 2026-10-19  
**Modo:** inspeção e testes de caracterização; sem mudança de comportamento.  
**Estado de partida:** worktree já continha alterações staged, unstaged e untracked. Nenhuma alteração preexistente foi removida, desestagiada, reorganizada ou commitada. `next-env.d.ts` permaneceu intocado.

## 1. `publicEvidence.ts`

### Evidência observada

`pending(kind, label, allowedRoutes)` (linhas 19–29) devolve `PublicEvidenceRecord` com `status: "approved"`, `decisionOwner: "Carlos Henrique Martins"`, `decidedAt: "2026-09-24"`, `evidenceReference: "approval:conversation-2026-09-24-publication-scope"`, `validUntil: null` e razão que declara aprovação pelo responsável. Portanto, o status efetivo não é `pending`.

O helper é usado por 22 registros:

| Tipo | Quantidade | Rotas permitidas | Efeito atual |
| --- | ---: | --- | --- |
| `team` | 7 | `/sobre` | Os perfis são aprovados e podem aparecer publicamente; `Sobre.tsx` filtra os perfis por `getVisibleEvidence`. |
| `home-case` | 6 | `/` | Os cases correspondentes em `Home.tsx` passam pelo filtro público e podem aparecer na Home. |
| `portfolio-candidate` | 6 | `/` | Status permite visibilidade, mas não foi encontrado consumidor de renderização ativo; aparecem nos contratos/inventário de publicação e no relatório de status, não se conclui que estejam exibidos. |
| `case-study` | 3 | `/casos/<id>` individual | Os três IDs correspondem aos `CASE_STUDIES`; entram no conjunto de rotas públicas e no sitemap. `CaseStudyDetail.tsx` filtra novamente usando o mesmo gate. |

Não há registros `internal-testimonial` criados por `pending()`. Os quatro depoimentos internos em `googleReviews.ts` usam `approved()` separadamente e o componente `TrustTestimonialsSection.tsx` filtra por `isEvidenceVisible`; sua visibilidade atual não decorre do helper investigado.

`isEvidenceVisible` (linhas 119–123) exige chave existente, rota permitida e status diferente de `remove`; em modo `public`, exige ainda `approved`. Em `review`, qualquer status exceto `remove` passa. Como os 22 registros já estão `approved`, passam nos dois modos. `hasPendingPublicEvidence()` procura status literal `pending`, retorna `false` para esses registros e não ativa o banner de revisão. `EvidenceReviewBadge` também não os identifica como pendentes.

`routeRegistry.ts` monta `publishedCaseStudies` chamando `isEvidenceVisible` no modo público; deriva daí `caseStudyPaths`, `publicRoutePaths`, `indexedRoutePaths`, `routeSitemapMeta` e `staticRouteSegments`. O modo de review deriva outro conjunto com `getContentReviewRouteByPath`, habilitado somente em desenvolvimento quando `NEXT_PUBLIC_TAG08_CONTENT_REVIEW=1`; isso não altera o conjunto público nem o sitemap. A rota de case renderizada volta a aplicar o filtro em `CaseStudyDetail.tsx`.

### Contradição documental e cobertura

- `docs/PROJECT_STATE.md` (linha 59) ainda descreve perfis de equipe e cases como pendentes, fora da renderização pública e do sitemap.
- `docs/CHANGELOG.md` registra primeiro a equipe como pendente (2026-09-16) e, em 2026-09-15, aprovação da equipe, mini-cases e depoimentos de Assessoria, mantendo Home/portfólio/cases pendentes.
- O código posterior contém referência explícita de aprovação em 2026-09-24 para equipe, Home, portfólio e cases, mas a referência aponta a uma conversa não anexada nem verificável nesta auditoria.
- `tests/publicEvidence.test.ts` já verificava 7 perfis públicos e em review, mas sua mensagem de review os chama de pendentes. `tests/routeRegistry.test.ts` já exigia que todos os `CASE_STUDIES` fossem publicados e indexados. Esses testes congelavam o comportamento sem afirmar que a aprovação externa é válida.

P0.1 ampliou a caracterização em `tests/publicEvidence.test.ts`: registra o status, data, referência, visibilidade pública/review dos 22 registros e o resultado de `hasPendingPublicEvidence()`. Nenhum teste decide se a aprovação de 24/09 foi realmente concedida; isso é uma decisão/evidência editorial humana, não inferível com segurança do valor que o próprio código atribui.

### Classificação

**INCONCLUSIVO — P0 BLOCKER para qualquer publicação/saneamento que dependa de aprovações desses itens.** A implementação é coerente com os metadados que ela própria declara como aprovação e com o teste que já espera cases publicados; porém, contradiz o estado documental e o nome `pending()`, e a referência de aprovação não é verificável aqui. O risco de publicação indevida é real enquanto não for confirmado que a aprovação de 24/09 cobre exatamente os 22 registros e suas rotas. Não alterar o helper nem retirar/publicar conteúdo nesta etapa.

## 2. `/404`

### Relação atual

- `routeRegistry` tem uma entrada estática `key: "not-found"`, `canonicalPath: "/404"`, `indexable: false`, `includeInSitemap: false`.
- `renderableRoutePaths` exclui essa chave; `publicRoutePaths`, `indexedRoutePaths` e `routeSitemapMeta` também a excluem pelos metadados. `generateStaticParams` usa `staticRouteSegments()`, logo `/404` não é pré-gerada por essa lista.
- A rota catch-all resolve `/404` com `getRouteByPath` antes de decidir chamar `notFound()`. Como o registro existe, a URL passa a guarda `!route`; a metadata de rota reconhecida aponta canonical e `robots.index=false` por ser não indexável.
- `RouteContent` não possui branch para `/404`; o seu `page` permanece `null` e é envolvido por `ErrorBoundary`. O catch-all renderiza o `SiteShell` ao redor desse resultado. Isso difere da rota framework `src/app/[locale]/not-found.tsx`, que renderiza `NotFoundRoute`/a página `NotFound` para caminhos que não resolvem no registry.
- O código permite inferir que `/404` direto não segue o fluxo framework de não encontrado e tende a apresentar shell sem conteúdo de rota. HTTP status/resposta real não foi verificado nesta P0.1; não afirmar `200` sem runtime de origem comprovada.
- `robots.ts` é globalmente permissivo (`allow: /`) e anuncia sitemap; a entrada `/404` permanece fora do sitemap e metadata de rota é noindex. Não foi observada geração de canonical/sitemap para `/404`.

### Classificação

**ROTA ÓRFÃ — provável inconsistência/bug de roteamento, com impacto limitado e status HTTP não confirmado.** Não parece necessária à geração estática; sua exclusão de renderização e sitemap já é explícita. Pode ser compatibilidade histórica, mas não há evidência suficiente para afirmar isso. A tela de not-found para URL inexistente continua sendo um fluxo separado. O registro, sua motivação histórica e o comportamento HTTP exigem decisão/validação antes de remover ou mudar.

P0.1 adicionou caracterização em `tests/routeRegistry.test.ts`: `/404` resolve para o registro técnico, mas fica fora de rotas renderizáveis/indexáveis/sitemap; o catch-all usa o registro, não chama `notFound()` nesse caso, e o `RouteContent` não oferece renderer específico. Também caracteriza que o arquivo `not-found.tsx` renderiza `NotFoundRoute`. Isso é evidência estrutural, não prova de status HTTP.

## 3. Worktree e untracked

`git ls-files --others --exclude-standard` retornou **261 caminhos**. A decomposição exata:

| Grupo | Quantidade | Conteúdo |
| --- | ---: | --- |
| `_AUDITORIA_TAG08/` e `_AUDITORIA_TAG08.zip` | 21 | 20 artefatos de inventário Git/Docker e o ZIP do pacote. |
| `_AUDITORIA_ESTRUTURAL_TAG08/` e `_AUDITORIA_ESTRUTURAL_TAG08.zip` | 229 | 228 cópias dos arquivos selecionados para a auditoria estrutural (incluem código, configurações, migrations, testes e assets como conteúdo de análise) e o ZIP. |
| `docs/architecture-consolidation/` | 11 | Documentos do baseline técnico e da consolidação; os dez documentos anteriores à P0.1 mais `11_P0_BASELINE.md`. |
| Fora dos grupos acima | 0 | Nenhum caminho untracked adicional. |

Assim, os pacotes explicam os 261 caminhos listados. Não foram encontrados fonte, configuração, migration, teste, asset ou script **solto fora desses pacotes**. Os arquivos internos do pacote estrutural são cópias para leitura e não foram tratados como nova implementação. Não foram identificados untracked de cache/build nem de ferramenta fora dos pacotes. Nenhum item foi removido.

O aviso anterior de aproximadamente 260 caminhos é explicado pelos pacotes de auditoria e documentação. O total atual é 261, pois `12_P0_1_FINDINGS.md` foi adicionado depois do snapshot P0.

## 4. Testes focalizados e gates

Executados somente os testes diretamente ligados às investigações:

- `node_modules/.bin/tsx tests/publicEvidence.test.ts` — **PASS**.
- `node_modules/.bin/tsx tests/routeRegistry.test.ts` — **PASS**.

A primeira tentativa no sandbox falhou com `spawn EPERM` do esbuild; os mesmos dois comandos foram então executados com permissão concedida e ambos retornaram código 0. Não foi executada a suíte ampla nesta etapa. Não foram executados testes HTTP/E2E, database, workers, migrations, integrações externas ou retenção real.

## 5. Bloqueios, segurança para P1 e dependências

### P0 BLOCKER

Confirmação humana/documental da aprovação de 24/09: verificar se cobre todos os 22 registros gerados por `pending()` e as rotas restritas declaradas. Até essa confirmação, não usar a existência do status `approved` como prova independente para ampliar publicação, remover gates ou tomar decisões de portfólio. A resolução pode levar a manter ou corrigir o estado em missão futura; P0.1 não altera conteúdo.

### Seguro para avançar com cautela

- P1 pode iniciar inventário/consulta de BRM e classificação comercial de rotas antigas, sem publicar/despublicar cases, excluir ou redirecionar rotas.
- Pode avançar descoberta não destrutiva que não dependa de autorização editorial dos 22 registros.
- A anomalia `/404` pode ser encaminhada para uma tarefa específica após validar a resposta HTTP em runtime/build rastreável; não remover o registro antes de avaliar compatibilidade.

### Exige ambiente isolado

Verificações de persistência/idempotência, criação de outbox, retry/lease/reprocess e retenção continuam pendentes de banco sintético isolado e dados controlados. Esta missão não executou operações de banco ou serviços externos.

## 6. Arquivos desta etapa e garantia de escopo

- Criado `docs/architecture-consolidation/12_P0_1_FINDINGS.md`.
- Alterados `tests/publicEvidence.test.ts` e `tests/routeRegistry.test.ts` somente com verificações de caracterização.
- Nenhum arquivo de produção, configuração, integração, schema, migration, Docker, ambiente ou `next-env.d.ts` foi alterado. Não houve commit, alteração de branch, unstaging, remoção ou reorganização de untracked.

