# TAG08 Content Team Guide

## Purpose

This document is the working map for the content team.
It explains how the site is organized, what each page must do, and how content should be written so it serves strategy, SEO, conversion, and clarity.

## Source of truth

- `docs/TAG08_KNOWLEDGE_SYSTEM.md`
- `docs/ARCHITECTURE.md`
- `docs/ROUTES.md`
- `docs/AI_SEARCH_CONTENT_STRATEGY.md`
- `docs/INSIGHTS_EDITORIAL_RULES.md`
- `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md`
- `docs/DESIGN-SYSTEM-GOVERNANCE.md`
- `docs/TYPOGRAPHY-GOVERNANCE.md`
- `src/config/routeRegistry.ts`

## How to use this guide

1. Start from the route and page intent.
2. Write for one page, one main promise, and one next step.
3. Build content by section, not by decoration.
4. Keep claims tied to real service delivery.
5. Reuse the same logic across services, cases, and insights.

## Global content rules

- Diagnosis before plan.
- Clarity before speed.
- One primary CTA per page.
- One supporting CTA at most, when it helps the decision.
- Every page must answer: what is this, why does it matter, why trust TAG08, and what happens next?
- Avoid generic marketing language, inflated promises, and filler copy.
- If a section does not move the user toward understanding, proof, or decision, remove it.

## Official proof sources

- The Home page social proof blocks should prefer live data from `GET /api/official-content`.
- YouTube content is considered synced when `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_HANDLE` are configured.
- Google Business reviews are considered synced when `GOOGLE_BUSINESS_LOCATION_NAME` and OAuth credentials are configured.
- If a source is unavailable, the page must fall back to editorial content without breaking layout or pretending the data is live.
- Setup rápido de sync: `docs/OFFICIAL-CONTENT-SYNC-SETUP.md`

## Content architecture by page group

### 1. Institutional pages

#### Home

- Job: explain what TAG08 is, what it solves, and how the offer system works.
- Content focus: positioning, authority, service overview, proof, diagnostic logic, strong CTA.
- Required blocks:
  - hero with positioning
  - service map
  - proof / case snippets
  - diagnostic or problem framing
  - differentiated offer blocks
  - final conversion section
- Primary CTA: start a diagnostic / talk to TAG08.

#### Sobre

- Job: prove the company has method, principles, and operational seriousness.
- Content focus: DNA, philosophy, team, way of working, what TAG08 does and does not do.
- Required blocks:
  - brand narrative
  - principles
  - operational method
  - team or leadership proof
  - values / anti-patterns
  - final CTA
- Primary CTA: understand TAG08 or contact the team.

#### Contato

- Job: convert qualified visitors into direct conversation.
- Content focus: contact channels, qualification, response expectations, service fit.
- Required blocks:
  - contact hero
  - service / channel cards
  - qualification form
  - response expectation
  - trust / privacy notice
- Primary CTA: send contact request.

#### Trabalhe Conosco

- Job: attract aligned talent and filter by fit.
- Content focus: culture, standards, roles, hiring logic, expectations, application.
- Required blocks:
  - culture positioning
  - role / profile cards
  - hiring flow
  - requirements
  - form / application
- Primary CTA: apply.

#### NotFound

- Job: recover navigation and avoid dead ends.
- Content focus: helpful recovery, links to key pages, simple next step.
- Primary CTA: go back to home or services.

### 2. Service hub

#### Servicos

- Job: organize the offer catalog and help the visitor choose the right path.
- Content focus: service taxonomy, comparison, who each service is for, proof, route to detail pages.
- Required blocks:
  - service categories
  - summary cards
  - comparison / orientation blocks
  - FAQ or guidance
- Primary CTA: open the right service page or request contact.

### 3. Service pages

#### Branding e Identidade Visual

- Job: show how branding clarifies value and reduces inconsistency.
- Content focus: diagnosis, identity process, visual direction, deliverables, portfolio proof.
- Required blocks:
  - brand pain framing
  - process explanation
  - deliverables
  - portfolio / examples
  - CTA
- Primary CTA: request branding diagnosis.

#### Desenvolvimento Web

- Job: position TAG08 as a strategic web partner, not a template shop.
- Content focus: performance, architecture, conversion, mobile experience, technical credibility.
- Required blocks:
  - problem statement
  - strategic approach
  - technical advantages
  - proof / comparisons
  - CTA
- Primary CTA: request web project evaluation.

#### Gestao de Redes Sociais

- Job: show social content as strategy, not volume.
- Content focus: editorial line, content pillars, consistency, qualification, proof.
- Required blocks:
  - strategic positioning
  - editorial framework
  - distribution logic
  - proof / results
  - CTA
- Primary CTA: request social strategy.

#### Producao Audiovisual

- Job: show audiovisual as brand communication and commercial support.
- Content focus: format, production logic, event coverage, use cases, proof.
- Required blocks:
  - production narrative
  - format / service breakdown
  - examples
  - CTA
- Primary CTA: request production brief.

#### Assessoria de Marketing Digital Estrategico

- Job: explain diagnosis, maturity, and strategic direction for growth.
- Content focus: current state, bottlenecks, metrics, funnel logic, operating plan.
- Required blocks:
  - maturity framing
  - diagnostic blocks
  - metrics / impact logic
  - plan structure
  - CTA
- Primary CTA: start the strategic diagnosis.

#### Process Intelligence

- Job: help the user see operational chaos and the need for structured process intelligence.
- Content focus: mapping, bottlenecks, standardization, visibility, execution control.
- Required blocks:
  - problem map
  - process logic
  - diagnosis / clarity blocks
  - outcome indicators
  - CTA
- Primary CTA: request process diagnosis.

#### Process Activation

- Job: move the client from understanding to execution.
- Content focus: implementation, adoption, training, operational governance, timeline.
- Required blocks:
  - activation logic
  - implementation flow
  - operational proof
  - CTA
- Primary CTA: activate the process.

#### Hospedagem e Manutencao de Sites

- Job: prove reliability, security, continuity, and support.
- Content focus: uptime, maintenance, safeguards, monitoring, service levels, cost of failure.
- Required blocks:
  - infrastructure value
  - security and continuity
  - maintenance process
  - comparison / risk framing
  - CTA
- Primary CTA: request hosting and maintenance plan.

### 4. Utility and conversion flows

#### Cliente Onboarding

- Job: collect structured project context with low friction.
- Content focus: business info, goals, assets, privacy, roles, scope, approvals.
- Required blocks:
  - guided intake
  - consent and privacy
  - scope clarification
  - asset collection
  - final confirmation
- Primary CTA: complete onboarding.

#### Sebraetec

- Job: explain the subsidy opportunity and qualify eligibility.
- Content focus: subsidy rules, eligible projects, steps, documentation, next action.
- Required blocks:
  - value of the program
  - eligibility criteria
  - step-by-step process
  - CTA
- Primary CTA: check eligibility.

#### Programa Afiliados

- Job: recruit partners who can send qualified leads.
- Content focus: commission model, rules, benefits, fit, application.
- Required blocks:
  - partnership pitch
  - rules and commissions
  - how referrals work
  - application CTA
- Primary CTA: join the affiliate program.

#### Insights

- Job: turn knowledge into discoverability and service qualification.
- Content focus: answer a real question, expose a mistake, connect to a service, show next step.
- Required blocks:
  - problem
  - direct answer
  - warning signs
  - practical next step
  - service connection
  - CTA
- Primary CTA: open the related service or contact page.

#### CaseStudyDetail

- Job: show proof in a way that supports decision-making.
- Content focus: context, problem, approach, implementation, result, measured proof.
- Required blocks:
  - challenge
  - solution
  - execution
  - result
  - lesson learned
- Primary CTA: talk to TAG08 about a similar case.

## Reusable content modules

These modules should be reused across pages instead of rewritten from scratch:

- Hero with positioning.
- Proof strip or trust strip.
- Problem / tension block.
- Service summary card.
- Diagnostic block.
- Comparison block.
- Result / metric block.
- FAQ block.
- Final CTA block.
- Privacy / legal block when needed.

## Writing pattern for every page

Use this order:

1. What is this page about?
2. Why does the visitor care?
3. What does TAG08 do differently?
4. What proof exists?
5. What is the next step?

## Microcopy rules for the content team

- Buttons should say what happens next.
- Labels should be short and explicit.
- Error states should say what failed and how to fix it.
- Privacy language must be clear and specific.
- Do not use hype to cover lack of proof.

## What to avoid

- Writing for sections without knowing the page job.
- Creating content that only repeats the same promise in different words.
- Using CTA buttons that do not match the page intent.
- Mixing multiple service narratives in one block.
- Turning a technical label into a marketing sentence.

## Editorial handoff workflow

1. Read this guide.
2. Read `docs/TAG08_KNOWLEDGE_SYSTEM.md`.
3. Check the route in `docs/ROUTES.md`.
4. Draft page copy.
5. Validate tone, proof, and CTA.
6. Review against the design and typography rules.
7. Publish only after alignment.

## Ownership by team

- Strategy and offer logic: product and leadership.
- Copy and editorial structure: content team.
- SEO and page intent: content + SEO.
- UX and layout constraints: design and frontend.

## Final rule

If the content does not help the visitor understand, trust, or decide, it is not useful enough for TAG08.
