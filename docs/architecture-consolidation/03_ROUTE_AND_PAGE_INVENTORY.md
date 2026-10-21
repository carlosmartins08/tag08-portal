# Public route and page inventory

**Source:** `src/config/routeRegistry.ts:61-305`; page dispatch: `src/features/site/RouteContent.tsx:8-50`; locale/indexation: `routeRegistry.ts:5-14,412-487` and `src/app/[locale]/[[...segments]]/page.tsx:52-115`.

Locale `pt` is currently the only indexable/published locale by policy. `en`/`es` prefixes are recognized but unpublished entries redirect to the Portuguese canonical route. “Indexable” below reflects current registry flags, not search-engine observation. Case routes are dynamic and evidence-gated.

| Canonical path | Page component | Registry key / alias | Index / sitemap | Locale | Dependencies / note |
| --- | --- | --- | --- | --- | --- |
| `/` | `Home.tsx` | `home` | yes / yes | pt | `src/data.ts`, `src/content/*`, official-content API, analytics; ~3,978 lines. |
| `/sobre` | `Sobre.tsx` | `sobre` | yes / yes | pt | public evidence gate and client/team assets; ~186 lines. |
| `/servicos` | `Servicos.tsx` | `servicos` | yes / yes | pt | service data and internal navigation; ~786 lines. |
| `/servicos/process-intelligence` | `ProcessIntelligence.tsx` | `servicos-process-intelligence`; alias `/process-intelligence` | yes / yes | pt | simulator/content data; ~956 lines. |
| `/servicos/process-activation` | `ProcessActivation.tsx` | `servicos-process-activation`; alias `/process-activation` | yes / yes | pt | simulator and insights bridge; ~956 lines. |
| `/servicos/desenvolvimento-web` | `DesenvolvimentoWeb.tsx` | `servicos-desenvolvimento-web`; alias `/desenvolvimento-web` | yes / yes | pt | service insights bridge and content; ~636 lines. |
| `/servicos/branding-identidade` | `Branding.tsx` | `servicos-branding-identidade`; alias `/branding` | yes / yes | pt | service/editorial content; ~1,440 lines. |
| `/servicos/gestao-de-redes-sociais` | `GestaoRedesSociais.tsx` | `servicos-gestao-redes-sociais`; alias `/gestao-redes-sociais` | yes / yes | pt | video/content interactions; ~1,388 lines. |
| `/servicos/producao-audiovisual` | `ProducaoAudiovisual.tsx` | `servicos-producao-audiovisual` | yes / yes | pt | video/outbound tracking; ~1,299 lines. |
| `/contato` | `Contato.tsx` | `contato` | yes / yes | pt | `/api/contact`; lead validation and persistence; ~1,032 lines. |
| `/trabalhe-conosco` | `TrabalheConosco.tsx` | `trabalhe-conosco` | yes / yes | pt | `/api/talent-applications`; ~1,304 lines. |
| `/insights` | `Insights.tsx` | `insights`; alias `/blog` | yes / yes | pt | insights are structured in `src/data.ts`; ~521 lines. |
| `/casos/:id` | `CaseStudyDetail.tsx` | `case-study-detail` | yes only for visible cases / yes | pt | `CASE_STUDIES` + `publicEvidence`; currently published IDs are data-derived, not enumerated here; ~308 lines. |
| `/cliente/onboarding` | `ClienteOnboarding.tsx` | `cliente-onboarding` | no / no | pt only | `/api/onboarding`, local journey dictionary; route explicitly non-indexable; ~3,291 lines. |
| `/sebraetec-impulsionando-empreendedores` | `Sebraetec.tsx` | `sebraetec-impulsionando-empreendedores` | yes / yes | pt | business/program content; ~426 lines. |
| `/programa-afiliados` | `ProgramaAfiliados.tsx` | `programa-afiliados` | yes / yes | pt | simulator and lead/outbound tracking; ~478 lines. |
| `/hospedagem-manutencao-sites` | `HospedagemManutencaoSites.tsx` | `hospedagem-manutencao-sites` | yes / yes | pt | simulator and tracking; ~2,061 lines. |
| `/servicos/assessoria-marketing-digital-estrategico` | `AssessoriaMarketingDigitalEstrategico.tsx` | `servicos-assessoria-marketing-digital-estrategico`; alias `/assessoria-marketing-digital-estrategico` | yes / yes | pt | public evidence gate and diagnostic content; ~352 lines. |
| `/404` | **No explicit `RouteContent` branch** | `not-found` | no / no | not applicable | Separate Next not-found implementation: `src/app/[locale]/not-found.tsx` → `NotFoundRoute`; explicit registry path behavior is an uncertainty. |

## Registry mechanics and conflicts to preserve for later review

- Aliases are canonicalized then permanently redirected by the catch-all; aliases are not independent pages (`routeRegistry.ts:318-349`, page lines 93–95).
- `generateStaticParams` uses renderable paths and published locales. Sitemap has a separate `includeInSitemap` switch. These are related but not identical switches (`routeRegistry.ts:430-487`).
- `case-study-detail` route exists only when the case passes `isEvidenceVisible`; the same evidence policy is used by public rendering and route generation (`routeRegistry.ts:308-316,376-392`).
- `RouteContent` has a component branch per canonical path and does not use a registry component identifier. `/404` is in the registry but not in that dispatch; do not assume it is a public page or dead route without verifying runtime expectations.
- **ATUAL:** the registry retains historical commercial routes, some indexable. **ALVO APROVADO:** route presence is technical/historical evidence only; do not remove or redirect automatically. Confront each disposition with the BRM before P1. Commercial priority is not inferred from registry presence.
- Route source file approximate sizes are line counts at baseline and can change without a route contract change.

## P2.1 — HTTP not-found verification (2026-10-21)

The earlier uncertainty around the technical `/404` registry entry was resolved against an isolated production build. Unknown paths and cases without publication evidence returned HTTP 404 through the locale not-found boundary. Before the fix, direct `/404` resolved as a registry route and returned HTTP 200 with no page content, despite being excluded from renderable/indexed/sitemap paths. The catch-all now sends the `not-found` registry key to Next.js `notFound()` and omits canonical metadata for that response; `/404` now returns HTTP 404, `noindex`, and no canonical. The registry entry and all commercial URLs remain unchanged.

Focused validation confirmed: an unknown path and an unapproved case return HTTP 404; `/process-intelligence` retains its permanent redirect to `/servicos/process-intelligence`; unpublished `/en/sobre` redirects to Portuguese; onboarding remains a neutral HTTP 200 route with `noindex`, `private, no-store`, and remains outside the sitemap. The focused public-evidence E2E passed 5/5, the route-registry contract passed, and the official isolated build passed. The snapshot used the expected HEAD and Git blobs, copied the protected `next-env.d.ts` byte-for-byte, and used an independent dependency tree with no reparse points; no database or external integration was used.

## P2.2 — Registry and renderer integrity

The route registry and `RouteContent` remain complementary: public catch-all routes resolve through the registry and then use the page dispatcher, while `/cliente/onboarding` is an intentional dedicated App Router page excluded from catch-all static params. The generic dispatcher had retained a duplicate onboarding branch that could not be reached through the App Router; it was removed. The route contract now checks both directions for static dispatcher paths and verifies the dedicated onboarding boundary, access gate, and authenticated renderer. Dynamic case routes remain evidence-gated and use the existing category renderer; `/404` remains handled by Next not-found as recorded in P2.1.

P2.2 closeout: the pre-existing local version of `next-env.d.ts` was replaced during a build run in the main workspace. Its known SHA-256 was `1BEC57E49CD162A5E86AF6CAF5626BDA964581330AC53813A5F68985D14F0A9B`; the investigation found no matching copy. The current file matches HEAD and was explicitly accepted as the operational baseline. The prior content and any functional impact remain undetermined. A possible removal of a temporary `.bin` file was also reported, but its identity and impact were not established. Future builds must use an isolated environment and avoid side effects in the main workspace.
