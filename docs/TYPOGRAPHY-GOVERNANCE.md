# TAG08 Typography Governance

## Objective

Keep typography consistent across the project by separating title voice from reading voice.

## Source of truth

1. `src/index.css`
2. `docs/DESIGN-SYSTEM-GOVERNANCE.md`
3. `docs/ARCHITECTURE.md`

## Font families

- Primary family: `Darker Grotesque`
- Secondary family: `Manrope`
- Support family: `JetBrains Mono`

## Usage rule

- Primary family is for titles, section headers, numeric highlights, badges with brand emphasis, and short attention-grabbers.
- Secondary family is for subtitles, body copy, labels, helper text, descriptions, and long reading blocks.
- Support family is for technical labels, counters, metadata, tables, and machine-like UI details.

## Semantic classes

- `font-display` means primary family.
- `font-sans` means secondary family.
- `font-mono` stays reserved for support/system usage.
- `font-primary` and `font-secondary` are semantic aliases for future use.

## Rules

- Do not use a third family for normal UI text.
- Do not mix title voice and reading voice inside the same text block unless there is a functional reason.
- Do not use the support family to fake hierarchy.
- If a new exception appears repeatedly, convert it into a rule or token.

## Migration order

1. Update `src/index.css`.
2. Fix any dead or fake classes like `font-heading`.
3. Review the most visible pages first.
4. Validate on desktop and mobile.

