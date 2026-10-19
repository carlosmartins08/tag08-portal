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
