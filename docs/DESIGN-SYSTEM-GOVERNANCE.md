# TAG08 Design System Governance

## Objetivo

Garantir que a regra 60/30/10 seja aplicada de forma consistente, sem dispersar tokens, sem criar uma terceira paleta e sem reintroduzir hardcode visual no projeto.

## Fonte de verdade

1. `src/index.css`
2. `docs/ARCHITECTURE.md`
3. `docs/TAG08_KNOWLEDGE_SYSTEM.md`

## Regra visual

- 60%: fundo e superfícies neutras.
- 30%: texto, estrutura e separação.
- 10%: destaque.

## Tokens oficiais

- `bg-main`
- `bg-surface`
- `bg-subtle`
- `text-primary`
- `text-secondary`
- `border-subtle`
- `brand` para o acento principal
- `brand-secondary` para apoio visual, não para dominar a tela
- `accent-readable` para textos no modo claro quando o verde-limão puro comprometer contraste

## Typography tokens

- Primary family: `Manrope`
- Secondary family: `Manrope`
- Support family: `JetBrains Mono`
- `font-display` maps to the primary heading role, not a second visual family
- `font-sans` maps to secondary family
- `font-mono` stays as support family
- `font-primary` and `font-secondary` are semantic aliases available for new work

## Uso correto

- `brand` é a cor principal de ação, CTA e ênfase estratégica.
- `brand-secondary` é suporte: glow, borda leve, badge auxiliar, detalhe decorativo.
- Fundo grande nunca deve depender do acento como cor dominante.
- Texto principal nunca deve depender do acento como cor padrão.

## Exceções aceitas

- Identidade de marca em peça específica.
- Variações de logo e ilustração.
- Elementos de data vizual ou demonstração conceitual.
- Casos em que o acento é conteúdo, não UI.

## Padrões proibidos

- Hex hardcoded para cor de marca fora de casos excepcionais.
- Terceira cor de destaque sem registro.
- Repetição de `brand-secondary` como se fosse cor principal.
- Hover tratado como cor nova de paleta.

## Procedimento de mudança

1. Alterar token antes de alterar tela.
2. Reusar componente ou classe semântica existente.
3. Registrar exceção quando a cor não puder ser semanticamente substituída.
4. Validar build e inspeção visual em desktop e mobile.

## Auditoria

- Rodar a varredura de cores antes de publicar.
- Qualquer exceção nova precisa vir com justificativa funcional.
- Se a exceção se repetir, ela deixa de ser exceção e vira token.
- Typography exceptions follow the same rule: if a page keeps needing a custom family, the class or token must be standardized instead of repeated.
