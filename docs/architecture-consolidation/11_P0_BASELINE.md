# P0 — Technical baseline and protection

**Captured:** 2026-10-19. **Mode:** baseline + characterization only. This work was performed on a worktree that already contained staged, unstaged and untracked changes. None of those pre-existing changes was reset, unstaged, committed, reorganized or discarded. `next-env.d.ts` was treated as an existing generated artifact and was not edited.

## 1. Initial Git snapshot

| Field | Initial observation |
| --- | --- |
| Branch | `p2-home-cases-consolidation` |
| HEAD | `9a934e46ac21` |
| Upstream | `origin/p2-home-cases-consolidation` |
| Integration base recorded in `docs/PROJECT_STATE.md` | `5126504` |
| Ahead of upstream | 7 local commits |
| Worktree state | Not clean; pre-existing staged, unstaged and untracked entries |
| Staged | `.codex/hooks.json`; `.impeccable/critique/2026-10-06T23-25-45Z__src-features-site-pages-clienteonboarding-tsx.md`; `package-lock.json`; `package.json`; `src/components/MiniCases.tsx`; `src/components/ServiceInsightsBridge.tsx`; `src/features/site/pages/DesenvolvimentoWeb.tsx`; `src/features/site/pages/ProcessActivation.tsx` |
| Unstaged tracked | `next-env.d.ts` only at initial capture |
| Untracked groups | `_AUDITORIA_ESTRUTURAL_TAG08/` and `.zip`; `_AUDITORIA_TAG08/` and `.zip`; `docs/architecture-consolidation/` (the 10-file baseline package already existed before this P0) |
| Unpublished local commits | `9a934e4` remove per-commit continuity doc gate; `8e82573` onboarding resolved locale; `fb95415` official avatar accent; `b3701af` Home journey/locale drafts; `8d85bb2` client onboarding; `22bee39` retired project documentation; `f0c0ae1` onboarding E2E tests |

The continuity checker later reported 260 untracked paths at the time it ran. Its count includes the contents of the existing audit packages and this untracked documentation directory; it is not a count of top-level entries. The checker also reported 11 tracked changes after this P0 added two test-file edits to the initial nine tracked status entries.

## 2. Routing and rendering

**Canonical routes observed** (`src/config/routeRegistry.ts:61-305`):

`/`; `/sobre`; `/servicos`; `/servicos/process-intelligence`; `/servicos/process-activation`; `/servicos/desenvolvimento-web`; `/servicos/branding-identidade`; `/servicos/gestao-de-redes-sociais`; `/servicos/producao-audiovisual`; `/contato`; `/trabalhe-conosco`; `/insights`; `/casos/:id` (dynamic and evidence-filtered); `/cliente/onboarding`; `/sebraetec-impulsionando-empreendedores`; `/programa-afiliados`; `/hospedagem-manutencao-sites`; `/servicos/assessoria-marketing-digital-estrategico`; `/404` (registry entry with `not-found` key).

Aliases observed: `/process-intelligence` → `/servicos/process-intelligence`; `/process-activation` → `/servicos/process-activation`; `/desenvolvimento-web` → `/servicos/desenvolvimento-web`; `/branding` → `/servicos/branding-identidade`; `/gestao-redes-sociais` → `/servicos/gestao-de-redes-sociais`; `/blog` → `/insights`; `/assessoria-marketing-digital-estrategico` → `/servicos/assessoria-marketing-digital-estrategico`. Catch-all canonicalizes aliases and permanently redirects (`src/config/routeRegistry.ts:318-349`; `src/app/[locale]/[[...segments]]/page.tsx:93-95`).

`routeRegistry` owns route metadata and `RouteContent` owns explicit renderer dispatch. Static renderable paths exclude `not-found`; case routes are dynamic and only become routable when included in the evidence-filtered case set (`routeRegistry.ts:308-316,376-487`). A route-to-renderer characterization check was added to `tests/routeRegistry.test.ts`; current indexable public routes are exercised by the existing E2E loop in `tests/e2e/critical-pages.spec.ts` when that browser suite is run.

### `/404` finding — behavior unchanged

`/404` resolves as a registry route with `indexable: false` and `includeInSitemap: false`, but is omitted from `renderableRoutePaths`. The catch-all still resolves it as a route rather than calling Next `notFound()`; `RouteContent` has no `/404` dispatch branch and returns an error boundary around `null` (`routeRegistry.ts:296-305,430-439`; `RouteContent.tsx:27-52`; catch-all `page.tsx:32-39,86-115`). A separate framework not-found route exists at `src/app/[locale]/not-found.tsx` and renders `NotFoundRoute`. Therefore, direct `/404` is a **routing/rendering anomaly** distinct from the working unmatched-path not-found flow. It was documented, not changed or locked in as desired behavior.

## 3. Indexing, sitemap, canonical and robots

- `indexable` and `includeInSitemap` are separate route-registry flags. `publicRoutePaths` derives from `indexable`; `indexedRoutePaths` and `routeSitemapMeta` derive from `includeInSitemap` (`routeRegistry.ts:418-487`). Onboarding and `/404` have both flags false; `not-found` is also excluded from renderable paths.
- Dynamic cases enter public paths and sitemap only from `publishedCaseStudies`; the case route metadata is generated from the filtered case list.
- `src/app/sitemap.ts` maps sitemap metadata to absolute localized URLs and published locales. `src/app/robots.ts` permits crawling broadly and advertises `https://tag08.com.br/sitemap.xml`; page-level `robots` metadata supplies `noindex` for non-indexable/unpublished routes.
- Catch-all metadata builds canonical URLs from the canonical route and locale, emits locale alternates, Open Graph/Twitter metadata and JSON-LD. For unpublished locale/route it sets `robots.index=false` (`src/app/[locale]/[[...segments]]/page.tsx:52-82`).
- Runtime canonical/sitemap agreement was **not live-verified** in P0 because the available `.next/standalone/server.js` artifact’s source/commit provenance was not established. The live verification scripts need a trusted build/runtime baseline.

## 4. Locale contract

- Route locales: `pt`, `en`, `es`; routes without explicit locale resolve to PT. `INDEXABLE_LOCALES` contains only PT (`src/config/routeRegistry.ts:5-14,351-374`).
- `getPublishedLocales` requires route-allowed locale and `localizationReadiness`; EN/ES need approved state plus a matching source fingerprint (`src/i18n/localizationReadiness.ts:19-60`). Current entries use the pending helper, and onboarding explicitly declares PT only.
- Unpublished locale pages redirect to the Portuguese canonical route; metadata is noindex and sitemap emits only published locales (`page.tsx:68,97-102`; `src/app/sitemap.ts`).
- Existing E2E locale coverage: `tests/e2e/localization.spec.ts`; unit contract coverage: `tests/localePublishing.test.ts`, `tests/localizationReadiness.test.ts`, `tests/localizedRouteContent.test.ts`, `tests/proxy.test.ts`, `tests/translationContract.test.ts`.
- The P0 unit test was strengthened to assert every registered non-not-found route remains PT-only and EN/ES do not bypass readiness. It passed in `npm test`.

## 5. Public evidence

`isEvidenceVisible` requires a matching key, allowed route and status other than `remove`; public mode additionally requires `approved`, whereas review mode permits non-removed records (`src/content/publicEvidence.ts:119-142`). `routeRegistry` filters case routes with public mode and may resolve review-only cases when local review mode is enabled (`routeRegistry.ts:308-316,406-410`). Existing tests cover route scope and visibility for team, client logos and mini-cases (`tests/publicEvidence.test.ts`); case-route assertions are in `tests/routeRegistry.test.ts`.

**Anomaly to resolve in a later mission:** the helper named `pending()` in `publicEvidence.ts` currently returns `status: "approved"` with a dated approval reference. Thus records created through that helper (including the listed case studies) are approved at runtime despite their helper name and prior documentation sometimes describing them as pending. Existing tests assert all current `CASE_STUDIES` are routable/indexed. P0 does not reinterpret the approvals or change them. New characterization asserts an unregistered case ID does not resolve, so presence of an arbitrary case path alone cannot create a route.

## 6. Public journeys and APIs

| Journey | Public route | Main API / contract |
| --- | --- | --- |
| Contact / lead | `/contato` | `POST /api/contact`; `contactLeadSchema` |
| Talent application | `/trabalhe-conosco` | `POST /api/talent-applications`; `talentApplicationSchema` |
| Client onboarding | `/cliente/onboarding` | `POST /api/onboarding`; versioned `parseAndValidatePayload` |
| Official content | Home and relevant editorial pages | `GET /api/official-content` (YouTube / Google Business with fallbacks) |
| Onboarding operations | Internal | `GET /api/onboarding/health`, `GET /api/onboarding/metrics` |
| Integration reprocess | Internal | `POST /api/internal/integrations/reprocess` |

Submission handlers parse bounded JSON, reject honeypot input, validate contracts, use idempotency keys and return accepted/error status (`src/app/api/*/route.ts`; `server/submissionContracts.ts`; `server/onboardingContract.ts`). Existing unit tests protect schema/consent/normalization and request parser behavior. They do **not** prove real persistence or outbox atomicity in a database.

## 7. Persistence, outbox, workers and integrations

- PostgreSQL is the current data store; Prisma schema defines `ContactLead`, `TalentApplication`, `OnboardingSubmission`, `IntegrationDelivery` and `RetentionAudit` (`prisma/schema.prisma:1-126`). Application access uses Prisma/Postgres adapter; workers use `pg`.
- `submissionStore.ts` writes submissions and outbox deliveries transactionally, checks existing records by unique idempotency key, and stores the 12-month retention deadline. Current delivery targets: contact → Google Sheets only; talent and onboarding → Google Sheets + generic ClickUp target. This P0 documents but does not change the approved Contact → ClickUp gap.
- Outbox states are `PENDING`, `PROCESSING`, `DELIVERED`, `FAILED`; delivery rows track attempt count, due time, lease timestamp, external reference and error code/time. `integrationWorker.mjs` claims due records, recovers expired processing leases, delivers Sheets/ClickUp and retries. Internal reprocess resets failed delivery state.
- `retentionWorker.mjs` deletes expired records and writes `retention_audits`; it protects aggregates with active delivery leases. The 12-month policy was not changed.
- Existing database-backed verification tools: `tools/verify-persistence.mjs`, `tools/verify-outbox.mjs`, `tools/verify-retention.mjs`, `tools/verify-db-restore.mjs`. Outbox/retention tools create and clean synthetic records but still write to the configured database. They were not executed because no isolated test database was verified; using the default persistent Docker database was not considered safe for P0.

## 8. Existing tests and P0 additions

| Contract | Existing coverage | P0 disposition |
| --- | --- | --- |
| Route aliases/canonicalization | `tests/routeRegistry.test.ts`, `tests/proxy.test.ts` | Reused; alias assertions already existed. |
| Renderable routes have renderers | E2E covers all `publicRoutePaths`; route unit test did not compare registry to `RouteContent`. | Extended `tests/routeRegistry.test.ts` with a static route-to-dynamic-renderer contract. `/404` is separately recorded as anomaly, not treated as a valid renderer. |
| Indexability/sitemap flags | Some route/sitemap checks existed; excluded routes were not comprehensively asserted. | Extended `tests/routeRegistry.test.ts` to protect excluded paths and unknown case path. |
| Canonical, page robots, sitemap HTTP output | `tools/verify-seo.mjs` verifies live HTML/robots/sitemap; `tests/e2e/*` cover selected routes. | **Not run**: runtime/build provenance not established. Static policy is covered by unit tests but live output remains unverified. |
| PT-only publication and EN/ES readiness | `localePublishing`, `localizationReadiness`, translation contract, proxy and locale E2E. | Extended `tests/localePublishing.test.ts` across all registered routes; run via `npm test`, passed. |
| Evidence/public vs review | `tests/publicEvidence.test.ts`, route registry test and E2E `public-evidence.spec.ts`. | Reused; added unknown/unregistered case route assertion. Helper-name/status inconsistency recorded. |
| Contact/Talent validation | `tests/submissionContracts.test.ts`; API body/honeypot/CORS `tests/apiResponse.test.ts`. | Reused; no safe need for another schema test. Persistence/outbox still need isolated DB verification. |
| Onboarding validation/version/team consent | `tests/onboardingContract.test.ts`. | Reused; passed in `npm test`. |
| Persistence/idempotency/outbox creation | Unique schema keys and implementation exist; `tools/verify-persistence.mjs` checks persistent behavior with test records. | **Insufficient safe automated evidence in this run**: no DB-backed test run; requires isolated synthetic DB. |
| Outbox state/retry/lease/external reference/reprocess | `tools/verify-outbox.mjs` covers mock deliveries, retry, stalled lease and external reference; internal route checks auth/reset. | **Not run**: tool writes rows to configured DB; isolated DB not confirmed. |
| Retention 12 months/lease protection/audit | code and `tools/verify-retention.mjs` synthetic fixture test. | **Not run**: worker deletes data; requires isolated synthetic DB. Policy remains unchanged. |

## 9. Quality gates executed

| Gate | Result | Safety note |
| --- | --- | --- |
| `npm test` | **PASS** | Existing unit/contract route and contract suites; includes continuity checks, which reported 260 untracked paths but did not fail. No DB/external integration workers were invoked. |
| `node_modules/.bin/tsc --noEmit` | **PASS** | Direct compiler invocation avoids `npm run lint`’s `prelint` Prisma-generation step. |
| `node_modules/.bin/tsx tools/i18n-check.ts` | **SKIPPED by gate** (`translations_autopublish_disabled`) | Script is read-only, but configured mode disables artifact publication checks. Locale/readiness unit tests did run. |
| Route HTTP verification | **NOT EXECUTED — runtime provenance unverified** | `verify-routes-live.mjs` starts `.next/standalone/server.js`; existing artifact commit/source is unknown. Rebuild would write generated output. |
| SEO/publication HTTP verification | **NOT EXECUTED — trusted runtime unavailable** | `verify-seo.mjs` requires a running instance; no source-matched runtime was established. |
| Outbox/persistence verification | **NOT EXECUTED — requires isolated synthetic database** | Existing tools insert/update/delete synthetic fixture rows in configured PostgreSQL. |
| Retention verification | **NOT EXECUTED — requires isolated synthetic database** | Test invokes a deletion worker, despite fixture scoping and cleanup. |
| Browser E2E | **NOT EXECUTED** | Would require a source-matched browser runtime; no build/runtime created in this P0. |

An initial sandbox attempt to run individual `tsx` commands returned `spawn EPERM` from esbuild. `npm test` was then run under the permitted test execution and passed. This was an environment execution restriction, not a product test failure.

## 10. ATUAL vs. ALVO APROVADO

| Area | ATUAL | ALVO APROVADO | GAP / P0 boundary |
| --- | --- | --- | --- |
| Contact CRM | PostgreSQL + outbox, Sheets-only delivery. | ClickUp Pré-venda is CRM; Sheets is staging/support. | Known implementation gap; explicitly not changed in P0. |
| Talent / onboarding | PostgreSQL + Sheets and generic ClickUp target. | ClickUp Banco de Talentos / Onboarding Novos. | List-specific deployed config not proven; no changes in P0. |
| Architecture | Next.js + React + TypeScript, PostgreSQL/Prisma, outbox/retry/retention; Compose present. | Evolve current system; WordPress headless/editorial-only; Typesense secondary index; Railway preferred with portability; secure magic-link onboarding resume, no full portal/password now. | Future targets not established as current integrations; no architecture implementation in P0. |
| Locales | PT published; EN/ES gated by readiness/fingerprint. | PT initial; EN/ES only after editorial approval. | Aligned; preserve gate. Historical PROJECT_STATE statement that onboarding EN/ES are approved is outdated against current runtime unless a newer explicit approval appears. |
| Historical routes | Routes remain in registry and some are indexable. | Do not remove/redirect automatically; disposition through BRM before P1. | P0 records, does not decide route disposition. |

## 11. P0 scope exclusions

No production behavior, route disposition, contact ClickUp delivery, schema/migration, retention duration, Docker, environment, secrets, dependency, deployment, publish state, external integration, architectural target, visual design or business policy was changed. No DB, worker, browser E2E, live route/SEO service, deploy or external service was invoked. No pre-existing staged change was altered; no commit/branch/stash/reset/checkout operation was performed.

## 12. P0 files changed

- `docs/architecture-consolidation/11_P0_BASELINE.md` — this baseline.
- `tests/routeRegistry.test.ts` — route-to-renderer, sitemap exclusion and unregistered case characterization.
- `tests/localePublishing.test.ts` — expanded PT-only / EN-ES-gated assertions across registered routes.

No production source or configuration was changed. Final Git status is reported in the handoff; it includes these P0 documentation/test changes in addition to the pre-existing worktree changes above.
