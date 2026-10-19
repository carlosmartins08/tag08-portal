# P0.4 — Aplicação segura da decisão `INVESTIGAR`

**Data:** 2026-10-19  
**Decisão de origem:** `docs/architecture-consolidation/13_PUBLIC_EVIDENCE_APPROVAL_MATRIX.md` e `14_PUBLIC_EVIDENCE_DECISIONS.md`.

## Comportamento anterior

O helper `pending()` em `src/content/publicEvidence.ts` criava os 22 registros dos quatro grupos com `status: "approved"`. O gate público aceitava esses registros, e os consumidores podiam mostrá-los. Os três `CASE_STUDIES` passavam pela filtragem usada por `routeRegistry`, gerando rotas públicas, paths indexáveis e metadados para sitemap.

## Decisão humana e mudança aplicada

Os 22 registros têm decisão humana `INVESTIGAR`; isso não é autorização de publicação. O tipo `PublicEvidenceStatus` agora inclui `investigate`. Um helper explícito `investigate()` cria os 22 registros nessa condição. O helper `pending()` agora representa realmente `pending`, sem gerar aprovação, e recebe metadados de decisão vazios.

O gate público continua exigindo exatamente `approved`; `investigate`, `pending` e `remove` não são publicáveis. O modo `review` continua permitindo `investigate` nas rotas autorizadas do registro, mas nunca promove o status nem altera os conjuntos de rotas ou sitemap públicos. A revisão local usa um indicador distinto: “Em investigação — não publicado”.

## Estado editorial resultante

| Grupo | Quantidade | Estado |
| --- | ---: | --- |
| Equipe | 7 | `investigate` |
| Cases da Home | 6 | `investigate` |
| Candidatos de portfólio | 6 | `investigate` |
| Cases detalhados | 3 | `investigate` |
| **Total** | **22** | **não aprovados para publicação** |

Os metadados descritivos não substituem o estado: datas, owner, referências técnicas e presença em dados não satisfazem o gate público. Registros fora desses 22, inclusive os explicitamente `approved`, não foram reclassificados.

## Efeitos nos consumidores

- **Home:** os seis cases não passam por `getVisibleEvidence` em modo público. A seção mantém o tratamento existente para lista vazia; não foi introduzido conteúdo substituto nem alterado layout.
- **Sobre:** os sete perfis não passam pelo consumer público. O componente já trata zero perfis e usa a apresentação de capacidades existente; nenhum card fictício ou novo layout foi criado.
- **Cases detalhados:** os três itens deixam de integrar `publishedCaseStudies`, `publicRoutePaths`, `renderableRoutePaths`, `staticRouteSegments`, `indexedRoutePaths` e `routeSitemapMeta`. Acesso público direto segue o comportamento existente para case sem evidência pública (not-found/404), sem redirect ou página alternativa.
- **Sitemap:** não recebe as três URLs de case. O modo review não participa dos conjuntos de publicação ou sitemap.
- **Candidatos de portfólio:** continuam sem consumer público, mas o status `investigate` impede futura publicação automática por consumers que respeitem o gate.
- **Outros registros aprovados:** permanecem aprovados e visíveis segundo suas rotas autorizadas. `remove` continua oculto também no modo review.

## Review mode

As condições existentes de review permanecem restritas a `NODE_ENV=development` e `NEXT_PUBLIC_TAG08_CONTENT_REVIEW=1`. Nessas condições, os registros em investigação podem ser consultados nas rotas permitidas e recebem badge distinto de `pending`. A rota de case pode ser resolvida pelo mecanismo de review já existente, sem passar a ser pública, indexável ou listada no sitemap. Fora dessas condições, a visibilidade retorna ao modo público.

`hasPendingPublicEvidence()` continua significando somente estado `pending`. Foi adicionado `hasUnpublishedPublicEvidence()` para o aviso local cobrir tanto `pending` quanto `investigate`, sem confundir os estados.

## Arquivos alterados

- `src/content/publicEvidence.ts`
- `src/components/ContentReview.tsx`
- `tests/publicEvidence.test.ts`
- `tests/routeRegistry.test.ts`
- `tests/content-review/content-review.spec.ts`
- `tests/e2e/public-evidence.spec.ts`
- `docs/architecture-consolidation/14_PUBLIC_EVIDENCE_DECISIONS.md` (adendo, preservando o snapshot original)
- `docs/architecture-consolidation/15_P0_4_INVESTIGATE_IMPLEMENTATION.md`

## Validações

Preencher após execução nesta missão:

- Testes diretamente relacionados (`tests/publicEvidence.test.ts` e `tests/routeRegistry.test.ts`): **PASS**.
- `npm test` (rotas, contratos e continuidade): **PASS**.
- TypeScript (`node_modules/.bin/tsc --noEmit --incremental false`, sem lifecycle `prelint` ou cache incremental): **PASS**.
- Verificação source-matched de rotas/sitemap: `tests/routeRegistry.test.ts` dentro de `npm test`: **PASS**.
- E2E de review/publicação: atualizado, **NÃO EXECUTADO**; exige iniciar servidor Next/Playwright, fora dos gates solicitados nesta etapa e pode gerar artefatos de runtime. O modo review foi coberto por testes de contrato e renderização server-side do badge/banner.

## Riscos residuais e blockers

- Os 22 registros continuam exigindo investigação da origem, vínculo e autorização; esta mudança apenas impede publicação enquanto isso não for resolvido.
- URLs diretas dos três cases agora seguem o tratamento de rota ausente em produção. Não foi criado redirect nem política de preservação de URL.
- O owner técnico continua sendo um campo do contrato existente e não deve ser interpretado como comprovação externa de autorização.
- Não foi feita validação visual detalhada; o comportamento de lista vazia foi avaliado no código e os testes automatizados devem confirmar os estados.
- Mudanças preexistentes do worktree, inclusive staging e `next-env.d.ts`, estão fora do escopo e devem permanecer intactas.

## Rollback

Reverter somente os hunks desta P0.4 nos arquivos listados, restaurando os testes e documentos a partir do diff desta unidade. Não reverter commits nem alterações preexistentes. Um rollback reabilitaria o comportamento anterior, que tratava registros em investigação como publicáveis; portanto deve exigir decisão explícita e reavaliação do risco editorial.
