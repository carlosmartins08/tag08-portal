# Integration map

Labels: **ATUAL** = observed in code; **ALVO APROVADO** = closed business/architecture decision; **GAP** = difference. Credentials are intentionally excluded.

## Submission flows

| Journey | ATUAL: entry, validation, persistence and delivery | ALVO APROVADO | GAP |
| --- | --- | --- | --- |
| Lead / Contact | `/contato` → `POST /api/contact` → `contactLeadSchema` → `persistContactLead` → PostgreSQL `ContactLead` + outbox; outbox target is Google Sheets only (`src/app/api/contact/route.ts:18-46`; `server/submissionStore.ts:27-51`). | Site → secure persistence → staging/outbox → ClickUp Pré-venda. Sheets supports/stages structured information, not CRM. Human commercial process may move qualified lead to Vendas; the site must not recreate the pipeline. | **GAP DE IMPLEMENTAÇÃO:** no ClickUp delivery is queued for contact. Do not reopen as a business decision. |
| Talent | `/trabalhe-conosco` → `POST /api/talent-applications` → `talentApplicationSchema` → PostgreSQL `TalentApplication` + outbox; Sheets and generic ClickUp target (`route.ts`; `submissionStore.ts:54-83`). | Site → persistence → staging/outbox → ClickUp Banco de Talentos. | List-specific target is not proven by generic `CLICKUP` enum/config alone. No resume binary storage is evidenced in schema. |
| Client onboarding | `/cliente/onboarding` → `POST /api/onboarding` → versioned contract → PostgreSQL `OnboardingSubmission` + outbox; Sheets and generic ClickUp target (`src/app/api/onboarding/route.ts:24-67`; `submissionStore.ts:86-114`). | Site → persistence → staging/outbox → ClickUp Onboarding Novos. | Exact list mapping requires implementation/config verification; this is customer operations, not a separate CRM pipeline. |

Public submission handlers perform bounded JSON parsing, honeypot checks, validation and idempotency handling; persistence stores consent version and retention deadline. Evidence: `src/app/api/{contact,talent-applications,onboarding}/route.ts`; `server/submissionContracts.ts`; `server/onboardingContract.ts`; `server/submissionStore.ts`.

## Outbox, retry, escalation and simulator policy

- `IntegrationDelivery` stores target, aggregate identity, payload, status, attempts, retry time, processing lease, external reference and last error (`prisma/schema.prisma:95-115`).
- `server/integrationWorker.mjs` processes Sheets and ClickUp deliveries, claims due work, reclaims stalled leases and marks success/failure (`:85-249`). Failed rows can be requeued via token-protected `POST /api/internal/integrations/reprocess` (`src/app/api/internal/integrations/reprocess/route.ts:7-29`).
- **ALVO APROVADO:** retry first; create an escalation/task/alert only for persistent or operationally relevant failures. Simulator activity must not create tasks unless a human action is needed.
- **GAP / INCERTO:** exact current production thresholds, alert destinations/owners and worker schedule were not established by source inspection. Verify before implementing escalation; avoid noisy task creation.
- Compose puts both workers in `jobs` profile (`compose.yaml:103-135`); declaration does not prove a production scheduler is active.

## Retention and database

- **ATUAL:** `server/submissionStore.ts:7-13` sets 12-month retention. `retentionWorker.mjs` deletes expired aggregates while protecting active delivery leases and records `retention_audits` (`:4-49`). `tools/verify-retention.mjs` exists.
- **ALVO APROVADO:** preserve/evolve outbox, retry and retention. PostgreSQL remains the transactional source of truth; Prisma may remain. No other approved technology replaces transactional persistence.
- Legal basis for the retention period and actual production schedule remain **INCERTOS**; confirm before changing them.
- Prisma schema uses PostgreSQL (`prisma/schema.prisma:1-8,30-126`); app uses Prisma adapter, workers use `pg`. Compose declares Postgres, migration, web and translation services; production parity is not established.

## Other integrations

- Official content: YouTube Data API and Google Business reviews with timeout/cache/fallback (`server/officialContent.ts:83-120,340-420`; `/api/official-content`). Separate from lead CRM delivery.
- LibreTranslate: translation engine in server/tools and Compose; not a submission sink.
- Analytics: GTM loader after consent (`src/lib/analytics.ts:28-105`); actual tag configuration is external to repository.

## Approved CRM / architecture target

- ClickUp is the TAG08 CRM/operational system. Google Sheets is staging/support and does not replace it.
- ClickUp target lists are Pré-venda, Onboarding Novos and Banco de Talentos. Human commercial process manages progression to Vendas; website must not recreate that pipeline.
- Evolve the current Next.js + React + TypeScript system, do not rebuild. PostgreSQL is transactional truth; Prisma may remain; preserve outbox/retry/retention.
- WordPress is headless/editorial-only, not CRM, onboarding/talent storage or operations. Typesense is a secondary search index, never transactional truth.
- Railway is the preferred initial infrastructure while portability is preserved. Current Compose configuration does not prove Railway is already deployed.
- Resumable onboarding will use a secure magic link; no full portal or permanent password in this phase. A complete magic-link runtime was not established by this baseline.
- These architecture choices are closed absent objective evidence of technical infeasibility or a newer explicit decision.

## Remaining implementation facts to verify

1. ClickUp list-specific configuration for each aggregate in deployment without exposing credentials.
2. Production worker scheduler, persistent storage and network topology (including preferred Railway target).
3. Failure escalation thresholds, alert/task target and operational owner.
4. Retention legal basis and production cadence.
5. Secure magic-link lifecycle (token entropy, expiry, single use, revocation, data minimization and audit) before its implementation.
