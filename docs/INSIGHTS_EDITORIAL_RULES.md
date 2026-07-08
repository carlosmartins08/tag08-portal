# TAG08 Insights Editorial Rules

## Goal
Keep the editorial hub useful for SEO, AI search, and commercial qualification without turning it into generic blog filler.

## Source of truth
- `docs/TAG08_KNOWLEDGE_SYSTEM.md`
- `docs/AI_SEARCH_CONTENT_STRATEGY.md`
- `docs/ROUTES.md`
- `src/config/routeRegistry.ts`
- `src/types.ts`
- `src/data.ts`

## Core rule
Every content piece must be modeled as a `BlogPost` internally, but it must also be tied to one real service and one real next step.

## Content standard
Each `BlogPost` should include:
- a real problem or question;
- a direct answer in the first paragraph;
- a clear error or warning sign;
- a practical next step;
- a linked service;
- a service note that explains why that service is the next step;
- a CTA that goes to the service route, not to a generic contact page first.

## Human + AI workflow
- Use AI for ideas, outlines, classification, and draft structure.
- Use humans for point of view, proof, examples, positioning, and final judgment.
- Keep the final text grounded in real experience, not in generic claims.
- Verify facts, numbers, URLs, and any promise before publishing.

## EEAT rules
- Show lived experience when possible.
- Prefer concrete examples over abstract statements.
- Keep the tone direct, useful, and specific.
- Avoid inflated claims, vague promises, and empty authority language.

## Relationship model
Each post should map to one primary service:
- Strategy -> `Assessoria de Marketing`
- Branding -> `Branding e Identidade`
- Web -> `Desenvolvimento Web`
- Processes -> `Process Intelligence`
- Process execution -> `Process Activation`
- Audiovisual -> `Producao Audiovisual`
- Hosting and maintenance -> `Hospedagem e Manutencao`

## Publishing flow
1. Draft the post.
2. Assign the service relation.
3. Check if the CTA is commercially useful.
4. Review tone against TAG08 knowledge system.
5. Verify SEO title and description.
6. Publish only after human review.

## Good post shape
- problem;
- direct answer;
- proof or context;
- what to do now;
- linked service;
- CTA.

## Bad post shape
- generic motivation;
- no service relation;
- no clear next step;
- content that exists only to fill space;
- AI text with no human revision.

## Distribution rule
Do not depend on Google only.
- Reuse the post into social snippets.
- Reuse the post into WhatsApp sales support.
- Reuse the post into LinkedIn, short video, or newsletter when relevant.

## Acceptance criteria
- Every published post is mapped to one service.
- Every post has a clear CTA path.
- Every post can be reused outside the site.
- Every post improves clarity, trust, or qualification.

