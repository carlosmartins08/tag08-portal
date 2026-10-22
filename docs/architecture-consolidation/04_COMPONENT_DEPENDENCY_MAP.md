# Component dependency map

This is a focused responsibility/reachability map, not a dead-code verdict. Import search and directory presence alone cannot prove runtime use or safe removal.

## Shared shell and high-reuse components

| Component / module | Observed role and dependents | Coupling / caution |
| --- | --- | --- |
| `src/features/site/SiteShell.tsx` | Shared global page shell; receives canonical path and locale from catch-all (`page.tsx:113-114`). | High blast radius: navigation, global controls and page-level wrappers. Inspect consumers through App Router rather than looking for direct page imports. |
| `src/components/Header.tsx` | Global navigation and service links; ~649 lines. | Depends on route destinations, locale choices, responsive behavior and shared tokens. |
| `src/components/Footer.tsx` | Global site links/contact channels; ~1,152 lines. | High content/route coupling; includes link destinations that may not mirror registry automatically. |
| `src/components/WhatsAppButton.tsx` | Global contact action; ~273 lines. | Consent/tracking and contact destination are separate concerns; inspect both before changes. |
| `src/components/ErrorBoundary.tsx` | Wraps route rendering (`RouteContent.tsx:5,52`). | Route failure boundary; removal affects all dispatched routes. |
| `src/components/Breadcrumbs.tsx` | Navigation/structured route context; ~151 lines. | Must remain aligned with canonical paths and localization. |
| `src/components/TrackedOutboundLink.tsx` | Reused outbound click tracking; ~40 lines. | Couples CTA semantics to analytics and locale props. |
| `src/components/ResilientImage.tsx` | Image loading fallback; imported by multiple editorial pages/components. | Shared fallback behavior can affect many visual surfaces. |
| `src/components/FocusManagedDialog.tsx` | Dialog/focus behavior; shared accessibility primitive. | Focus trap/restoration and keyboard contracts matter. |
| `src/components/VisualPrimitives.tsx` | Shared small visual primitives. | Low-level visual API; avoid creating parallel one-off primitives without checking usage. |

## Reuse-heavy / feature components

- `MiniCases.tsx` (~274 lines) and `ServiceInsightsBridge.tsx` (~169) appear in service/editorial flows; the latter has search matches across multiple files. Current staged changes touch both files, so this map is observational and must not imply consolidation now.
- `ThreeDimensionalTilt.tsx`, `Subtle3DCanvas.tsx` and `Subtle3DCanvasScene.tsx` form a visual/motion cluster. `animejs`, `motion` and `lenis` are present in package dependencies; exact ownership across the cluster needs an import graph and runtime verification before any dependency reduction.
- `TrustTestimonialsSection.tsx`, `DiagnosticDiagram.tsx`, `HeroEditorialStage.tsx` and `ContentReview.tsx` combine content/visual behavior. The visible content may be filtered by `publicEvidence.ts`; component presence is not equivalent to public display.
- `CountryFlag.tsx` is referenced across several source files and is not safe to classify from its small size alone.

## Large page-level modules (not shared primitives)

Current line counts: `Home.tsx` 3,978; `ClienteOnboarding.tsx` 3,291; `HospedagemManutencaoSites.tsx` 2,061; `Branding.tsx` 1,440; `GestaoRedesSociais.tsx` 1,388; `ProducaoAudiovisual.tsx` 1,299; `Contato.tsx` 1,032. These files mix page copy and interactive behavior to differing degrees. Large size is a refactoring risk indicator, not proof of defects or a mandate to split.

## Potential duplication and reachability limits

- Route registry vs. `RouteContent` dispatch is a synchronized pair rather than an identical duplicate; see `02_CANONICAL_VS_PARALLEL.md`.
- Content may be loaded by data keys, dynamic imports, CSS selectors, route generation or API endpoints. A search for direct import consumers does not prove absence of use.
- No file is classified as removable in this baseline. Files without an identified consumer remain **INCERTO** pending route/dynamic/runtime/build reachability evidence.
- Files in `src/generated/prisma/` are generated artifacts referenced by Prisma setup; do not treat generated status as permission to delete or manually edit.

## Evidence references

`src/features/site/RouteContent.tsx:3-25,27-52`; `src/features/site/SiteShell.tsx`; `src/components/`; `src/content/publicEvidence.ts:119-142`; `package.json` dependencies; `src/app/[locale]/[[...segments]]/page.tsx:113-115`.

## P3.1 — Home method presentation boundary

The static institutional/method presentation previously embedded in `Home.tsx` is now owned by `HomeMethodSection.tsx`. `Home` remains responsible for locale selection and contact navigation; the section receives localized method copy, the hero eyebrow, and a contact callback. Its anchor, markup, copy fallbacks, visual classes, motion, imagery and CTA behavior remain unchanged. The interactive `#servicos-principais` solution map was deliberately left in `Home` because it owns decision/navigation behavior and already has focused responsive geometry coverage.
