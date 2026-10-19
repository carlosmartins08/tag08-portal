# i18n architecture map

This document distinguishes **ATUAL** runtime behavior, **ALVO APROVADO** publication decisions and **GAP**.

## Approved target

- PT is the primary and initially published locale.
- EN and ES are part of the architecture, but may be published only after editorial review and explicit approval.
- Machine-generated content is not editorial approval.
- Preserve `localizationReadiness`, source fingerprints, redirects, canonical metadata, `robots` and sitemap rules.

## Current locale and publication contract

- Locale union is `pt`, `en`, `es` (`src/config/routeRegistry.ts:5-6`). Paths without an explicit locale resolve to Portuguese; localized paths use `/{locale}/...` (`:351-374`).
- **ATUAL:** `INDEXABLE_LOCALES` is `['pt']` (`routeRegistry.ts:14`). Onboarding also declares `publishedLocales: ['pt']` (`:233-243`). This matches the approved PT-first policy.
- `localizationReadiness.ts` provides per-route EN/ES state and source fingerprints. Its `pending()` helper initializes both languages as pending and each route uses it (`src/i18n/localizationReadiness.ts:19-53`). Publication requires approved state and matching source fingerprints (`:53-60`).
- Catch-all metadata excludes unpublished locales from indexing and page rendering redirects an unpublished locale to the Portuguese canonical URL (`src/app/[locale]/[[...segments]]/page.tsx:68,97-102`). Sitemap enumerates published locales (`src/app/sitemap.ts:5-`).

## Current translation/content mechanisms

| Mechanism | Current role | Evidence |
| --- | --- | --- |
| Shared UI dictionary | Navigation, controls, consent and global interface strings in PT/EN/ES. | `src/i18n/siteI18n.ts:1-28,288,492`. |
| Page-local copy | Route-specific language/copy; dictionaries and inline copy remain in pages. | `Home.tsx` `HOME_PILOT_COPY`; `ClienteOnboarding.tsx` `translations`. |
| Source catalogs | Structured source for shared/not-found translations. | `src/i18n/catalogs/global.pt.json`, `not-found.pt.json`. |
| Generated catalogs | Derived EN/ES JSON files for catalog-managed strings. | `src/i18n/generated/global.*.json`, `not-found.*.json`. |
| Translation contract/readiness | Checks source/target locale and review fingerprint for publication. | `src/i18n/translationContract.ts`, `localizationReadiness.ts`. |
| LibreTranslate | Machine-translation service used by server/tools; not an approval authority. | `server/translationService.ts`; Compose `translation`; `tools/i18n-sync.ts`, `i18n-health.ts`, `i18n-check.ts`, `release-i18n.mjs`. |
| External-content localization | Localizes selected YouTube/Google review fields with a hash-keyed in-memory cache, distinct from editorial catalogs. | `server/externalContentTranslation.ts`. |

## Parallel ownership and actual gaps

1. Shared global strings use catalogs, while large pages retain dictionaries and inline text. Route readiness is page-level and does not prove that every string is extracted or reviewed.
2. Machine translation, manual page copy, source catalogs and generated files have distinct lifecycles. Generated output must not be treated as editorial approval.
3. External video/review localization is a separate path from catalog translation and route readiness; its live/cache/fallback behavior does not approve page content.
4. **Historical documentation drift:** `docs/PROJECT_STATE.md` says onboarding EN/ES are approved, but current `localizationReadiness.ts` sets them pending and has no fingerprints. Runtime therefore does not publish them. The approved PT-first policy agrees with current runtime; the historical approval statement is outdated unless a newer explicit approval is supplied.
5. **GAP:** content source/translation review ownership spans several mechanisms. Any later consolidation must keep the human review gate intact.
6. README says generated locale artifacts are verified for production. Actual deployment flags and current environment configuration were not inspected; production artifact generation/release remains **INCERTO**.

## Guardrails for future consolidation

- Treat a visible locale switch as language selection, not publication approval.
- Keep URL redirect, canonical, robots, sitemap and locale copy behavior as separate acceptance criteria.
- Do not merge page dictionaries into shared catalogs until dynamic copy, legal/consent content, source fingerprints and review ownership are mapped.
- EN/ES remain supported architecture targets but unpublished until the editorial approval contract passes.

Evidence: `routeRegistry.ts:5-14,233-243,351-487`; `localizationReadiness.ts:19-60`; catch-all page `:52-102`; `src/i18n/*`; `server/translationService.ts`; `server/externalContentTranslation.ts`; `tools/i18n-*`.
