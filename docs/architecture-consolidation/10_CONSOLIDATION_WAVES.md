# Consolidation waves — planning only

No implementation is authorized by this plan. Each wave starts with a fresh Git status and baseline and must not absorb unrelated staged/unstaged work. **ATUAL**, **ALVO APROVADO** and **GAP** stay distinct. The target architecture is already approved; P6 is progressive implementation, not open architecture selection.

## P0 — Baseline and protection

- **Goal:** record behavior, decisions and commit boundaries before cleanup.
- **Likely files:** this directory, route/locale/evidence tests; continuity documentation only in a separately approved documentation task.
- **Must not change:** routes, publication, content visibility, persistence, integrations or current local changes.
- **Tests:** route/public-evidence/locale contracts, `npm test`, readiness/CI, baseline sitemap/canonical/robots and E2E where relevant.
- **Acceptance:** reproducible baseline, code-vs-target gaps recorded, no unrelated work mixed.
- **Rollback:** revert only the baseline docs/tests commit; no runtime/data migration.
- **Dependencies:** confirm canonical branch/worktree/commit boundary; carry approved target decisions forward without reopening.

## P1 — Business and route policy

- **Goal:** confront historical commercial route presence with the BRM and record keep/redirect/noindex disposition. ClickUp CRM and destination intent are already approved and are not a P1 business question.
- **Likely files:** route registry, navigation/footer links, business copy and route tests; `publicEvidence.ts` only when an item-level approval changes.
- **Must not change:** historical URLs without explicit disposition/redirect plan; evidence permissions; records or integration endpoints.
- **Tests:** route/alias/metadata/sitemap, public evidence, live route checks and acquisition analytics/backlinks.
- **Acceptance:** BRM disposition for each historical route and owner for each active offer; no inferred route deletion.
- **Rollback:** restore prior route/link behavior and verify canonical/redirect/index state.
- **Dependencies:** BRM and commercial owner, SEO evidence, content authorization. CRM decision remains frozen.

## P2 — Routing and content ownership

- **Goal:** reduce route-policy/render-dispatch drift and establish content ownership without changing public output.
- **Likely files:** `routeRegistry.ts`, `RouteContent.tsx`, `src/data.ts`, `src/content/*`, pages and contracts.
- **Must not change:** paths, copy, canonical/sitemap, evidence gate, review mode, locale publication.
- **Tests:** route-renderer completeness, page/content contracts, public-vs-review visibility, SEO/sitemap and critical E2E.
- **Acceptance:** auditable route-to-renderer relationship and item-level source ownership with parity tests.
- **Rollback:** revert bounded route/content work independently; preserve IDs and URL contracts.
- **Dependencies:** P0/P1 and content-owner approval for any source-of-truth decision.

## P3 — Large page/component boundaries

- **Goal:** make large modules easier to evolve while preserving visible and functional behavior.
- **Likely files:** `Home.tsx`, `ClienteOnboarding.tsx`, `Contato.tsx`, large service pages and shared components.
- **Must not change:** form/API contracts, analytics names, SEO, visuals, consent, evidence or keyboard behavior.
- **Tests:** route/contract suites, page E2E, visual breakpoints and focus/accessibility checks.
- **Acceptance:** bounded modules with clear ownership; baseline behavior preserved; tests pass.
- **Rollback:** page-scoped reversible commits, no multi-page rewrite.
- **Dependencies:** P0/P2, tests for each flow and single-writer ownership.

## P4 — Internationalization

- **Goal:** align catalog, page copy, generated candidate and editorial approval ownership.
- **Likely files:** `src/i18n/*`, page dictionaries, `tools/i18n-*`, translation service and locale tests.
- **Must not change:** PT-first publication, EN/ES review gate, fingerprints, redirects, canonical/robots/sitemap or legal/consent semantics.
- **Tests:** translation contract/readiness/fingerprint, localized routes/SEO, language switching, review mode and fallback.
- **Acceptance:** every locale source has owner/state and only reviewed matching fingerprints publish; machine output alone never releases locale.
- **Rollback:** retain prior approved artifacts and route gate; disable candidate release without losing source material.
- **Dependencies:** editorial review; historical PROJECT_STATE onboarding-approval wording is treated as outdated versus runtime unless newer explicit approval exists.

## P5 — Integrations and CRM

- **Goal:** implement the approved ClickUp/Sheets operating model and close current delivery/configuration gaps.
- **Likely files:** `server/submissionStore.ts`, `integrationWorker.mjs`, schema/migrations if required, API contracts, deployment config and tests/tools.
- **Must not change:** retention/consent without sign-off; idempotency; retry semantics; existing outbox history. Do not recreate Vendas pipeline.
- **Tests:** contracts, outbox, retry/lease/reprocess, retention, backup/restore and staging canary with synthetic records/reconciliation.
- **Acceptance:** contact → ClickUp Pré-venda; onboarding → Onboarding Novos; talent → Banco de Talentos; Sheets remains staging/support; retry and only relevant escalation; simulator tasks only for needed human action.
- **Rollback:** stop new routing without deleting outbox rows; no destructive migration; reconcile external duplicates.
- **Dependencies:** list-specific ClickUp configuration, external credential management, production worker schedule, and retention/privacy sign-off. P1.2D implements transactional creation of both ClickUp and Google Sheets deliveries in the outbox. On 23/10/2026, local worker/outbox processing was validated with the existing verifier against disposable PostgreSQL 16 and mock adapters: mock delivery, idempotency, timeout/retry, and expired-lease recovery passed (`outbox_verification_passed`). The first attempt, before the schema was available, failed with `42P01`; the later passing run supersedes that environmental failure, which is not evidence of a worker defect. The verifier does not explicitly assert the ClickUp mock reference after retry. Real ClickUp/Sheets delivery remains pending authorized staging homologation; staging and production were not validated in this run.

## P6 — Progressive implementation of approved architecture

- **Goal:** after P0–P5 make the base safe, progressively implement the architecture target already approved. This is not an open architecture-selection phase.
- **Target to implement:** evolve, do not rebuild; keep Next.js + React + TypeScript; PostgreSQL transactional source of truth; Prisma may remain; preserve/evolve outbox, retry and retention. WordPress headless/editorial-only. Typesense secondary search index. Railway preferred initial infrastructure while preserving portability. Secure magic-link onboarding resume, without full portal/permanent password in this phase.
- **Likely files:** only files needed for accepted gaps and bounded deliverables: editorial integration, search/indexing, deployment topology, onboarding continuation, backend contracts and tests.
- **Must not change:** WordPress is not CRM, onboarding/talent storage or operational source; Typesense is not transactional truth; do not replace approved stack or rebuild. Do not reopen approved decisions absent objective evidence of technical infeasibility and explicit approval. Avoid bundling database, routing and visual redesign.
- **Tests:** API/data contracts, privacy/security, performance, accessibility, migrations, E2E, operations/observability and rollback.
- **Acceptance:** each target boundary is implemented and verified with ownership, portability and rollback; no data/behavior regression. Config presence alone is not implementation.
- **Rollback:** per-deliverable release rollback; schema backward compatibility; preserve external records and search reindex/reconciliation plan.
- **Dependencies:** prior waves accepted. Frozen architecture decisions can be revisited only with objective incompatibility/infeasibility evidence and a new explicit decision.

## Sequencing rule

P0 precedes behavior changes. P1 route decisions use BRM. P2/P3 proceed in bounded areas. P4 preserves PT-first publication. P5 implements the already approved CRM model and is blocked on configuration/operations/privacy details, not CRM identity. P6 progressively implements the approved target; it does not reopen architectural choices. Confirm branch governance and active worktree/commit boundaries before any new branch or commit.
