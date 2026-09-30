---
target: Home.tsx
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Home.tsx"
target_fingerprint: "sha256:f6e63555c9038a769de3dd123ec9e95d9c0e5c006ebabe36b8be7d931e3b5889"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Home.tsx"
timestamp: 2026-09-25T02-13-21Z
slug: src-features-site-pages-home-tsx
---
Method: dual-agent (A: home_design_review · B: home_detector_review)

## Design Health Score

| # | Heurística | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2 | Estados de conteúdo oficial, fallback, consentimento e carrossel nem sempre são explícitos. |
| 2 | Match System / Real World | 3 | A proposta é compreensível, mas códigos editoriais e termos internos competem com a linguagem comercial. |
| 3 | User Control and Freedom | 3 | Há navegação e saídas, mas muitas interações dependem de cards customizados. |
| 4 | Consistency and Standards | 2 | Headings, focos, componentes e tratamentos de CTA variam ao longo da rota. |
| 5 | Error Prevention | 3 | Consentimento de vídeo tem cuidado, mas estados externos e fallback podem ser confundidos. |
| 6 | Recognition Rather Than Recall | 2 | O próximo passo não é dominante; tags e códigos nem sempre explicam sua função. |
| 7 | Flexibility and Efficiency of Use | 2 | Não há atalhos; há dependência de hover e navegação longa. |
| 8 | Aesthetic and Minimalist Design | 1 | Muitas seções repetem diagnóstico, método, prova e solução. |
| 9 | Help Users Recognize, Diagnose, and Recover | 3 | FAQ e diagnóstico ajudam, mas não têm semântica completa de estado. |
| 10 | Help and Documentation | 3 | Há bastante explicação, porém distribuída em uma jornada extensa. |
| **Total** |  | **24/40** | **Aceitável: identidade forte, foco e acessibilidade precisam de correção.** |

## Design Specificity Verdict

The page is clearly authored for TAG08: its dark editorial world, green accent, diagnostic language and “moment of the business” framing are distinctive. The problem is not generic visual design; it is accumulation. The Home currently behaves as a full institutional site inside one route.

The deterministic detector found one warning at `Home.tsx:1759`: `border-l-2` side-tab accent. This is a false positive in context: the border marks a quoted impact inside a diagnostic card and is semantically useful, though its visual treatment can be softened. Encoding, interaction, typography and visual-contract audits passed. Browser DOM inspection was available on `http://localhost:3101/`; no overlay injection was performed.

## What's Working

- Hero communicates the core promise quickly: presence with direction, without improvisation.
- The solution map organizes services by business moment instead of presenting only a catalogue.
- The diagnostic interaction, consent gate and external-content fallbacks show real product care.

## Priority Issues

### [P1] One Home, too many jobs

**Why it matters:** The route stacks problem framing, diagnostic, maturity bento, symptoms, method, solutions, validation portfolio, methodology, videos, institutional proof, reviews, FAQ and final conversion. A first-time visitor must process a long narrative before deciding what to do.

**Fix:** Make the primary path `proposition → problem → solutions → approved proof → contact`. Keep diagnostic and method as progressive-depth modules, and reduce repeated explanations of direction, method and execution.

### [P1] CTA hierarchy is not explicit enough

**Why it matters:** The hero's main interaction is a custom card labelled “Entender meu melhor caminho”; several tags scroll to services, and later sections introduce “Identificar meu momento”, “Conhecer soluções”, video play and multiple contact actions. The page communicates, but does not clearly tell the visitor which action is primary.

**Fix:** Make “Falar com a TAG08” the hero primary CTA and “Identificar meu momento” the secondary CTA. Treat category pills as navigation/filter controls with explicit labeling, not as competing CTAs.

### [P1] Heading and interactive semantics are inconsistent

**Why it matters:** Structural cards and methodology steps use `h4` directly after section `h2`/`h3` (for example lines 1247, 1284, 1323, 1368, 1399, 2715–2755 and 3905–3923). The FAQ is a visual selector whose buttons lack `aria-expanded`, `aria-controls`, a linked panel id and a region. Several cards are `div role="link"`/`role="button"` instead of native anchors/buttons.

**Fix:** Use `h3` for card/step/question titles, `p`/`span` for labels, native `<a>` for navigation and `<button>` for state changes. Add complete accordion semantics and consistent `focus-visible` treatment.

### [P2] Mobile rhythm is forced by rigid heights

**Why it matters:** The route uses `min-h-[74vh]`, multiple fixed card heights and diagnostic/video minimum heights. These values create an editorial desktop composition but can produce empty space, excessive wrapping and a much longer mobile page.

**Fix:** Prefer content-driven `min-height` only where needed; remove fixed heights from cards, use one column on mobile and reserve multi-column layouts for breakpoints where copy remains readable.

### [P2] Motion is broad and not preference-aware

**Why it matters:** The route uses `transition-all`, 700–1200ms image transitions, repeated scale/translate hovers, smooth programmatic scroll and an 8.5s review rotation. There is no route-level `useReducedMotion` handling.

**Fix:** Use property-specific 160–250ms transitions, gate hover transforms behind precise-pointer media queries, make scroll instant under reduced motion, and pause/replace auto-rotation on touch and assistive contexts.

### [P2] Low-contrast metadata carries real meaning

**Why it matters:** `text-zinc-500/600` and low-opacity white labels are used not only for decoration but also for dates, source state, diagnostic labels and supporting copy. The page is dark and long, so these cues are easy to miss.

**Fix:** Reserve low contrast for watermarks only; raise functional labels to `zinc-300/400` and validate both dark and light panels.

### [P2] Unvalidated proof receives too much visual weight

**Why it matters:** The “portfolio in validation” block and generic imagery occupy the same visual language as approved cases and testimonials. The copy is honest, but the layout can still make a visitor read placeholders as proof.

**Fix:** Reduce or move the validation block below approved proof, label fallback/internal curation at the point of use, and never let generic stock imagery imply a completed client case.

## Persona Red Flags

**Jordan (first-timer):** Sees many plausible next steps before understanding which one starts a conversation. Editorial codes such as M-01/M-07 and category pills add interpretation work.

**Riley (stress tester):** The page exposes long stateful regions, auto-rotating reviews, external-content fallbacks and custom clickable cards. Refreshing or returning mid-flow can lose active diagnostic/video context.

**Casey (mobile user):** The primary action is not consistently in the thumb-friendly reading path, fixed-height cards extend the scroll, and hover-oriented feedback has no mobile equivalent.

## Minor Observations

- The route contains disabled blocks wrapped in `{false && ...}` (methodology preview, plans and differentials), which increases maintenance ambiguity.
- There are hard-coded surfaces such as `#070707`, `#121214`, `#0a0a0c`, `bg-black` and `bg-zinc-950` mixed with charcoal tokens.
- The diagnostic quote accent at line 1759 is useful, but a subtler border or background cue would avoid the detector warning.
- The source is valid UTF-8; mojibake seen in some terminal output is a console decoding artifact, not a confirmed rendered defect.

## Questions to Consider

- What is the one action the Home must win if the visitor only scrolls through the first three sections?
- Can the diagnostic be a deliberate secondary route instead of the main narrative spine?
- Which proof is actually approved today, and should unapproved material occupy this much space?
