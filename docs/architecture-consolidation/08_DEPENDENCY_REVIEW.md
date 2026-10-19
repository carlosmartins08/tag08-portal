# Dependency review

Classification reflects manifest declarations and source-use evidence inspected on 2026-10-19. **NÃO ENCONTRADO USO** means no use was proven in the inspected code paths, not that safe removal is established. No dependency is removed or changed here.

## Runtime dependencies (`package.json`)

| Dependency | Observed use / classification | Evidence / follow-up |
| --- | --- | --- |
| `next` | **NECESSÁRIA** — App Router, API routes, metadata, build/runtime. | `src/app/**`, `next.config.ts`, scripts. |
| `react`, `react-dom` | **NECESSÁRIA** — pages/components. | `src/**`. |
| `@prisma/client`, `@prisma/adapter-pg`, `pg` | **NECESSÁRIA** — PostgreSQL persistence; Prisma in application, `pg` in workers. | `src/lib/server/prisma.ts`, `server/*.mjs`, schema. |
| `prisma` (dev) | **NECESSÁRIA** — schema generation/migrations/scripts. | `prisma/schema.prisma`, package scripts. |
| `zod` | **NECESSÁRIA** — submission validation. | `server/submissionContracts.ts`, `server/onboardingContract.ts`. |
| `lucide-react` | **NECESSÁRIA** — UI icon package; imported in site components/pages. | `rg` imports under `src/`. |
| `animejs` | **INCERTA / EXPERIMENTAL** — declared; visual animation consumers exist in the codebase but exact ownership and overlap with other motion packages need complete import graph. | `package.json`, `src/components/ThreeDimensionalTilt.tsx`, `Subtle3DCanvas*.tsx`; no consolidation based on partial search. |
| `motion` | **INCERTA / EXPERIMENTAL** — declared alongside Anime.js and Lenis; precise consumers and responsibilities need full graph. | `package.json`, visual components/pages. |
| `lenis` | **INCERTA / EXPERIMENTAL** — smooth-scroll dependency; verify runtime activation and accessibility/reduced-motion behavior before any change. | `package.json`, global shell/style/runtime import search required. |
| `@google/genai` | **NÃO ENCONTRADO USO** in inspected first-party import search; could be dynamic/tool-only or stale. | `package.json`; requires full `rg` across tools, scripts, server and CI before classifying further. No removal authorization. |
| `dotenv` | **INCERTA** — package exists; project commonly uses Node `--env-file-if-exists`; direct runtime dependency not established in this inventory. | package scripts; search full scripts and imports before action. |

## Development / verification dependencies

| Dependency | Classification / role | Evidence |
| --- | --- | --- |
| `typescript`, `tsx`, `@types/node`, `@types/react`, `@types/react-dom` | **NECESSÁRIA** — typecheck, test execution, TS tools. | `package.json` scripts and `tests/*.ts`. |
| `@playwright/test` | **NECESSÁRIA** — browser regression suites and configs. | `tests/e2e`, `playwright*.config.*`, CI. |
| `@axe-core/playwright` | **NECESSÁRIA** — accessibility/browser audits; exact spec consumers should be rechecked during future dependency waves. | `tests/`, package manifest. |
| `@lhci/cli` | **NECESSÁRIA** — Lighthouse mobile/desktop workflows. | `lighthouserc*.cjs`, `performance.yml`, audit scripts. |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss` | **NECESSÁRIA** — CSS processing and utility styling. | `src/index.css`, `postcss.config.*`, build. |

## Non-dependency packages that may look related

LibreTranslate is declared as a Docker image, not an npm dependency. PostgreSQL is a container/service. Google/ClickUp are HTTP API integrations implemented with built-in fetch/crypto/JWT code, not SDK packages in the manifest.

## Review boundary

The package manifest is already modified/staged in this worktree. This document does not compare or rewrite the staged manifest. Before a future dependency cleanup, inventory imports in all source, scripts, config, tests and Docker stages; confirm dynamic loading, peer/transitive use, license, bundle impact and rollback. A missing direct import is not sufficient evidence for removal.
