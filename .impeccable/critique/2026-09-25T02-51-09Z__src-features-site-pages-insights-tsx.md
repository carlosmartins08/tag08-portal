---
target: InsightArticle.tsx (resolved to src/features/site/pages/Insights.tsx)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Insights.tsx"
target_fingerprint: "sha256:045e27639458a359b5cd60a5e9754c136ff2d33192131f89d3aeda1940bae52a"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Insights.tsx"
timestamp: 2026-09-25T02-51-09Z
slug: src-features-site-pages-insights-tsx
---
# Auditoria Impeccable — Insights.tsx

## Design Health Score

| Heurística | Score | Observação |
|---|---:|---|
| Visibility of System Status | 3/4 | Filtros, foco no título e estados de lista existem; a troca para artigo poderia anunciar melhor a mudança. |
| Match Between System and Real World | 4/4 | Linguagem editorial clara e metadados familiares. |
| User Control and Freedom | 3/4 | Voltar e links relacionados funcionam; o estado depende de pushState manual. |
| Consistency and Standards | 3/4 | Visual coerente, mas a hierarquia de headings da listagem é irregular. |
| Error Prevention | 3/4 | O contrato editorial é simples; parser e ordenação dependem de formatos implícitos. |
| Recognition Rather Than Recall | 3/4 | Categorias, tempo de leitura e sumário ajudam; o destaque não comunica critério editorial. |
| Flexibility and Efficiency | 2/4 | Filtros existem, mas faltam deep links robustos e sumário útil no mobile. |
| Aesthetic and Minimalist Design | 3/4 | Boa composição, com excesso de módulos de conversão no final do artigo. |
| Error Recovery | 3/4 | Há retorno à listagem e estado vazio; não há tratamento editorial explícito para conteúdo inválido. |
| Help and Documentation | 2/4 | O próprio texto orienta, mas não há ajuda contextual além do sumário. |
| **Total** | **29/40** | **Bom, mas requer correções editoriais e semânticas antes de escalar.** |

## Design Specificity Verdict

O resultado é claramente TAG08: fundo escuro, verde-neon, tipografia editorial e ligação explícita entre leitura e serviço. Não é um template genérico. O detector Impeccable encontrou 0 achados mecânicos. A inspeção no navegador confirmou que o título, imagem, metadados, corpo e CTA formam uma leitura coerente. O maior risco não é falta de identidade, e sim a decisão editorial escondida em lógica de ordenação e a conclusão comercial sobrecarregada.

## What's Working

- Separação clara entre descoberta (filtros e cards) e leitura (artigo completo).
- Corpo com h1, h2, listas semânticas, sumário lateral, síntese estratégica e links relacionados.
- Foco programático no h1 do artigo, `aria-pressed` nos filtros e alvos mínimos nos CTAs principais.

## Priority Issues

### [P1] Destaque promove o item mais antigo

`filteredPosts` é ordenado do mais recente para o mais antigo, mas `featuredPost = filteredPosts.at(-1)`. A etiqueta “Em destaque” pode promover um conteúdo antigo sem critério explícito.

**Impacto:** a promessa editorial da primeira dobra fica incoerente e a relevância percebida cai.

**Fix:** usar um campo editorial explícito para destaque; na ausência dele, usar o primeiro item ordenado.

**Suggested command:** `$impeccable clarify`

### [P1] Hierarquia da listagem não distingue seção de card

Os títulos de todos os cards usam `h2`, enquanto a listagem não possui um heading de seção próprio. No detalhe, o h1 e os h2 do corpo estão corretos, mas a árvore da listagem fica longa e plana.

**Impacto:** leitores de tela precisam atravessar muitos headings de mesmo nível e perdem a estrutura “lista de artigos”.

**Fix:** criar um h2 para a seção de artigos e usar h3 nos cards; manter h2 apenas no destaque se ele representar a unidade principal.

**Suggested command:** `$impeccable polish`

### [P1] A conclusão empilha decisões concorrentes

Depois do corpo vêm “Direção Estratégica”, FAQ, Insights relacionados, CTA do serviço e CTA de contato. Cada bloco é válido isoladamente, mas a sequência não define uma ação dominante.

**Impacto:** o leitor chega ao fim sem saber se deve abrir outro artigo, ver o serviço ou falar com a TAG08.

**Fix:** escolher um CTA primário por artigo; transformar o restante em apoio secundário e usar uma ordem fixa: síntese → CTA primário → relacionados/FAQ.

**Suggested command:** `$impeccable distill`

### [P2] Deep link é frágil para compartilhamento editorial

`pushState` substitui toda a query string ao abrir e remove-a ao fechar. A página também não demonstra metadata específica por artigo.

**Impacto:** parâmetros externos podem ser perdidos e o compartilhamento pode apresentar apenas a identidade genérica de `/insights`.

**Fix:** preservar `URLSearchParams`/hash existentes e definir título, canonical e descrição conforme o slug quando a infraestrutura permitir.

**Suggested command:** `$impeccable harden`

### [P2] Sumário perde valor no mobile

O aside “Nesta leitura” entra depois do corpo no fluxo de uma coluna. Em artigos longos, o usuário precisa ler ou rolar todo o conteúdo antes de encontrar a navegação interna.

**Impacto:** piora a escaneabilidade para leitura interrompida e uso em telas pequenas.

**Fix:** renderizar um sumário compacto antes do corpo em mobile (ou torná-lo expansível) e manter o sticky lateral no desktop; adicionar estado de seção ativa apenas se houver necessidade real.

**Suggested command:** `$impeccable adapt`

### [P2] Contrato editorial do parser é implícito

O renderer entende apenas `###`, listas simples e `**negrito**`. Outros formatos Markdown aparecem como texto cru.

**Impacto:** um post novo pode parecer quebrado sem que o CMS/dado indique erro.

**Fix:** documentar e validar o contrato de conteúdo, ou usar renderer Markdown restrito com fallback explícito.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Jordan (primeiro contato):** encontra muitos módulos no final e pode hesitar entre “Ver serviço”, artigos relacionados e “Falar Conosco”.

**Sam (leitor operacional):** consegue escanear h2 e listas, mas o sumário só aparece depois do artigo no mobile e não ajuda a voltar a uma seção específica.

**Casey (mobile/interrompido):** perde contexto quando o deep link descarta parâmetros e pode ter rolagem excessiva antes da navegação “Nesta leitura”.

## Minor Observations

- `Date.parse` depende de abreviações e hoje normaliza apenas `Set`; vale trocar por datas ISO no dado.
- `articleSections` usa `key={title}`; títulos repetidos podem gerar chave duplicada.
- Botões de Insights relacionados deveriam explicitar `type="button"`, foco visível e alvo mínimo para manter o padrão compartilhado.
- O texto observado como mojibake em algumas saídas de PowerShell não se confirmou: Node, auditoria de encoding e navegador exibem UTF-8 correto.

## Questions to Consider

- O que deve vencer no fim do artigo: aprofundamento ou conversa comercial?
- “Em destaque” é curadoria editorial ou simplesmente o item mais recente?
- O sumário precisa orientar a leitura antes do corpo, especialmente no mobile?
