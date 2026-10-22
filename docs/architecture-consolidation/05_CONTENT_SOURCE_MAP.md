# Content source map

## Sources observed

| Source | Type / current role | Consumers and overlap |
| --- | --- | --- |
| `src/features/site/pages/*.tsx` | Page-local copy, page composition and often interaction logic. | All pages are loaded through `RouteContent`; Home, onboarding, contact and major service pages have locale-specific or form-specific content embedded in large modules. |
| `src/data.ts` | Shared structured data, including service offerings, simulators, `CASE_STUDIES` and the `BLOG_POSTS` article records. For an insight, its record owns article content and the related-service target/label consumed by the article CTA. | Used by route registry, case detail, Insights and service/page components. Article/case records extend through this single large module. |
| `src/content/publicEvidence.ts` | Evidence/permission state for content items and allowed routes; public visibility requires approved state. | Filters case-study route generation and content; validation requires date/reference for approval (`:119-142`). |
| `src/content/publicationContracts.ts` | Publication-oriented contracts for page/content release. | Related to evidence status and route/sitemap inclusion; exact full dependency mapping remains a future task. |
| `src/content/serviceInsightsBridge.ts` | Owns service-page insight module curation: module title/intro, ordered published `postId` references and planned-topic presentation. It does not own or duplicate the referenced article records. | Consumed by service pages and editorial features; published article content remains in `src/data.ts`. |
| `src/content/simulatorInventory.ts` | Catalog of interactive simulators. | Simulator pages and tests use the inventory; `tests/simulatorInventory.test.ts` covers it. |
| `src/content/googleReviews.ts` | Local snapshot/fallback review content. | Fallback for official-content API when external source is unavailable; separate from live Google Business responses. |
| `src/i18n/siteI18n.ts`, `homeCopy.ts`, `notFoundCopy.ts` | Runtime global UI and page-specific locale copy. | Coexists with catalogs and dictionaries embedded directly in Home/Onboarding. |
| `src/i18n/catalogs/*.json`, `src/i18n/generated/*.json` | Source catalogs and generated locale artifacts for shared/not-found messages. | Consumed by catalog/i18n modules; tooling includes sync, check, health and release. Generated output is not a universal source for page copy. |
| `server/officialContent.ts` | Live official YouTube and Google Business fetches with timeout/cache/status. | `/api/official-content` and Home hooks. Environment values are not included in this audit. |
| `src/content/googleReviews.ts` and page fallback constants | Curated/static external-content fallback. | A second content source distinct from live APIs; freshness and approval policy should remain explicit. |
| LibreTranslate service | Translation engine, declared in Compose and called by server translation service. | Supports translation workflow, not the single authoritative runtime store. `server/translationService.ts`; `compose.yaml` translation service. |

## Hardcoded page copy and structured content

The majority of editorial text remains in page components, while reusable cases/services/simulator records live in `src/data.ts` and domain content modules. The current system therefore has no demonstrated single normalized CMS/content repository. This is descriptive, not a recommendation to externalize all copy: forms, consent, legal language and interaction labels may have different lifecycle requirements.

## Publication and evidence chain

For case studies and testimonials, `CASE_STUDIES` alone does not imply public permission. `routeRegistry.ts` filters case routes through `isEvidenceVisible`; `publicEvidence.ts` checks route allowance and status. Content-review mode is an additional local visibility mode. The same content can thus exist in data but be suppressed in public route/render/sitemap output.

## External and fallback consistency

Official content has a live API path and snapshot/fallback path. Home maintains YouTube fallback data and uses API response source status to decide whether to display live content. Reviews similarly use local data and live Google content. This creates purposeful resilience but also multiple freshness/translation paths; do not merge them without preserving source identity and attribution.

## Uncertainties

- Exact authoritative ownership for each insight article and service description is not declared in a central content schema.
- Whether all generated i18n files are reproducible from committed source catalogs is a tooling question; verify via generator/check contract before consolidation.
- CMS use or externally managed content beyond the code/API files was not evidenced in the repository scan; classify as **INCERTO**, not absent.

## P2.3 — Ownership and parity finding

The code establishes separate, complementary ownership: `BLOG_POSTS` in `src/data.ts` owns each structured insight and its related-service link/label; `serviceInsightsBridge.ts` owns the curated, ordered relationship shown on service pages, referencing published records by stable post ID and holding planned topics locally. `routeRegistry` resolves route policy/metadata and is not an editorial source. The bridge resolver omits an unknown published ID; the current bridge test checks canonical coverage and a minimum resolved count, not one-to-one resolution of every configured published reference. No missing reference was confirmed in this bounded review, so this remains a narrowly scoped coverage opportunity rather than a proven runtime defect.

This review found eight insight records linked to `/servicos/assessoria-marketing-digital-estrategico` whose CTA labels used the superseded “Assessoria de Marketing” name. They were aligned to the already approved Portuguese public name “Assessoria Estratégica de Negócios”; route, article body, bridge ordering, publication state and evidence gates were not changed. `tests/insightsEditorialStructure.test.ts` now protects this label parity, including the fallback field.

Evidence: `src/data.ts`; `src/content/*`; `src/features/site/pages/*`; `src/i18n/*`; `server/officialContent.ts`; `src/app/api/official-content/route.ts`.
