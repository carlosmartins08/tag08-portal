# Current state map — TAG08

**Baseline:** 2026-10-19. This is an evidence map, not an architecture decision or a change request. “Canonical” below means the observed implementation currently used by the repository, not approval to redesign it.

## Product and runtime

- Institutional site built with Next.js App Router, React and TypeScript. The localized catch-all page is `src/app/[locale]/[[...segments]]/page.tsx`; `src/features/site/SiteShell.tsx` wraps resolved public pages, and `RouteContent.tsx` dispatches to page components. Evidence: `README.md` “Arquitetura ativa”; catch-all lines 32–39, 86–115; `RouteContent.tsx` lines 27–52.
- App Router also hosts JSON APIs and metadata endpoints (`src/app/api/**`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`). Public page and API deployment are therefore coupled to the same Next service.
- Docker Compose declares `translation`, `postgres`, `web`, `migrate` and profile-gated `integration-worker` / `retention-worker` services. The local web service depends on Postgres and migration; translation has a separate internal network. Evidence: `compose.yaml` lines 1–141. Docker runtime configuration is distinct from the local Next development/review scripts in `package.json`.

## Domains and principal flows

| Domain | Current responsibility / evidence |
| --- | --- |
| Public site | Pages in `src/features/site/pages/`; route and SEO policy in `src/config/routeRegistry.ts` and `src/lib/seo.ts`. |
| Editorial content | Page-local copy plus structured services, cases and insights in `src/data.ts`; visibility/publication contracts in `src/content/`. |
| Contact / lead capture | `/contato` → `/api/contact` → `contactLeadSchema` → `persistContactLead` → PostgreSQL and outbox. (`src/app/api/contact/route.ts:18-46`; `server/submissionStore.ts:27-51`) |
| Talent applications | `/trabalhe-conosco` → `/api/talent-applications` → PostgreSQL and Google Sheets + ClickUp outbox targets. (`src/app/api/talent-applications/route.ts`; `server/submissionStore.ts:54-83`) |
| Customer onboarding | `/cliente/onboarding` → `/api/onboarding` → versioned onboarding contract → PostgreSQL and Google Sheets + ClickUp outbox targets. (`src/app/api/onboarding/route.ts:24-67`; `server/submissionStore.ts:86-114`) |
| Official external content | `/api/official-content` serves YouTube and Google Business review data, with cache/fallback; client hooks and static fallbacks also exist. (`src/app/api/official-content/route.ts`; `server/officialContent.ts:83-120,340-420`; `src/content/googleReviews.ts`) |
| Localization | Route locale gate, catalogs, page-local translations and generated catalogs coexist; translation tooling/service exists separately. See `06_I18N_ARCHITECTURE_MAP.md`. |
| Analytics / consent | One GTM loader/event facade gated by consent in `src/lib/analytics.ts`; events are called from pages and interaction helpers. `README.md` says GA4 and other tags are configured in GTM, not duplicated in app code. |

## Route and content control plane

`routeRegistry` stores canonical paths, aliases, route metadata, category, indexability and sitemap inclusion (`src/config/routeRegistry.ts:43-60,61-305`). It generates route resolution helpers, locale paths, static parameters and sitemap metadata. `RouteContent` separately imports and chooses the rendered page (`src/features/site/RouteContent.tsx:8-50`). Case-study paths are further filtered through `CASE_STUDIES` and `src/content/publicEvidence.ts:119-142`. This gives a clear route-policy source but leaves a second page-to-component dispatch table.

The catch-all page generates metadata/canonical URLs, redirects aliases and unpublished locales, applies robots policy and wraps content in `SiteShell` (`src/app/[locale]/[[...segments]]/page.tsx:52-115`). Sitemap uses `routeSitemapMeta` and published locales (`src/app/sitemap.ts:5-`). Only `pt` is currently in `INDEXABLE_LOCALES` (`routeRegistry.ts:5-14`); onboarding and `/404` are excluded by route flags. EN/ES route prefixes exist but route-level readiness gates their publication.

## Content sources

1. Page-local editorial and functional copy in `src/features/site/pages/` (e.g. `Home.tsx`, `Contato.tsx`, `ClienteOnboarding.tsx`).
2. Shared structured data in `src/data.ts` (services, simulator offerings and cases; examples at lines 36–214).
3. Content governance/data modules in `src/content/`: `publicEvidence.ts`, `publicationContracts.ts`, `serviceInsightsBridge.ts`, `simulatorInventory.ts`, `googleReviews.ts`.
4. Locale-specific copy in `src/i18n/`, including `siteI18n.ts`, `homeCopy.ts`, catalogs and generated catalogs.
5. External content APIs in `server/officialContent.ts`, with local fallback data in `src/content/googleReviews.ts` and page fallbacks such as the YouTube data consumed by Home.
6. Generated/derived translation artifacts in `src/i18n/generated/`; their publication is not automatic simply because generated files exist.

These are overlapping ownership models, not evidence that one can be deleted. See `05_CONTENT_SOURCE_MAP.md`.

## Backend, data and workers

- API handlers: contact, talent application, onboarding, onboarding metrics/health, official content, internal integration reprocess (`rg --files src/app/api`). Request validation is shared through `server/submissionContracts.ts`, `server/onboardingContract.ts` and `src/lib/api/response.ts`.
- PostgreSQL is accessed through Prisma (`prisma/schema.prisma`, `src/lib/server/prisma.ts`) and direct `pg` in workers. Schema includes lead/application/onboarding aggregates, simulator configuration, integration delivery outbox and retention audit (`schema.prisma:10-126`).
- `server/submissionStore.ts` persists each submission transactionally with outbox deliveries. `server/integrationWorker.mjs` handles Google Sheets / ClickUp delivery, retries and processing leases; `server/retentionWorker.mjs` removes expired records and writes technical audit rows.
- Migration history currently contains `202607160001_init` and `202607190001_outbox_processing_lease`; no migration was run for this baseline.
- `compose.yaml` declares a local Postgres volume plus a translation-model volume. Worker services are in the `jobs` profile, so the Compose declaration alone does not prove they are running in every environment.

## Quality gates

- `npm test` covers route/content/localization contracts and submission/API contracts (`package.json` scripts `test:routes`, `test:contracts`).
- TypeScript check is `npm run lint` (`tsc --noEmit`; with `prelint` Prisma generation).
- Readiness gate: tests, lint, build, interaction/image/encoding/UX audits and route verification (`package.json:verify:readiness`).
- Browser E2E: `test:browser`; content-review E2E is separate. CI runs continuity, readiness, content status and both browser suites (`.github/workflows/quality.yml:11-32`). Lighthouse is scheduled/manual (`.github/workflows/performance.yml:11-41`).
- Data and deployment gates include `preflight:deploy`, `verify:persistence`, `verify:outbox`, `verify:retention` and `verify:db-restore`.

## Documentation status and evidence boundary

`README.md` and `docs/PROJECT_STATE.md` describe the intended operating model, but they also reference files such as `docs/ARCHITECTURE.md`, `docs/ROUTES.md`, `docs/DECISIONS.md` and `docs/ROADMAP.md` that were not present in the inspected tracked-file listing. The README’s pre-commit description and PROJECT_STATE’s checkpoint should not be treated as verified runtime behavior without checking current hook/tool implementations. This baseline records the code and document mismatch, not a resolution.

## Approved architecture and business target (not current-state claims)

- **ALVO APROVADO:** evolve this repository, not rebuild. Next.js + React + TypeScript remain primary; PostgreSQL remains transactional source of truth; Prisma may remain; preserve/evolve outbox, retry and retention.
- **ALVO APROVADO:** ClickUp is CRM/operations; Sheets is staging/support. Contact → persistence/outbox → ClickUp Pré-venda; onboarding → ClickUp Onboarding Novos; talent → ClickUp Banco de Talentos. Sales progression to Vendas belongs to the human process. Current contact Sheets-only delivery is a **GAP DE IMPLEMENTAÇÃO**.
- **ALVO APROVADO:** WordPress headless/editorial-only; Typesense secondary search; Railway preferred initial infrastructure with portability; secure magic-link onboarding continuation, without full portal/permanent password in this phase. These are not represented here as already active integrations.
- **ALVO APROVADO:** PT initially published; EN/ES only after editorial review. Current readiness gates implement this policy; historical documentation claiming onboarding EN/ES approval is outdated against current runtime unless a later explicit approval is supplied.
- **ALVO APROVADO:** do not remove/redirect historical commercial routes automatically; confront each disposition with BRM before P1.
