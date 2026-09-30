---
target: src/features/site/pages/Insights.tsx
total_score: 27
max_score: 40
na_heuristics: 7
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Insights.tsx"
target_fingerprint: "sha256:1876e6c789dc15737d4a79a78c9d438d9a008ea0250cdcb09f5842e1beb2a490"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Insights.tsx"
timestamp: 2026-09-25T01-17-20Z
slug: src-features-site-pages-insights-tsx
---
# Auditoria — Insights.tsx

## Checklist

- Descoberta, filtragem e seleção de conteúdo
- Leitura longa e navegação interna
- URL, histórico e compartilhamento
- Hierarquia, contraste e mobile
- Motion, foco e estados
- Integridade dos dados editoriais

## Prioridades

### [P1] Artigo existe apenas em estado local

Selecionar um insight não atualiza URL, slug ou histórico. Não é possível compartilhar uma leitura específica, recarregar preservando o artigo ou usar o botão voltar do navegador como retorno previsível.

Correção: usar query/hash ou rota dinâmica mantendo `onNavigate`, e sincronizar abertura/fechamento com histórico.

### [P1] Destaque é escolhido pela posição do array

`filteredPosts.at(-1)` define o destaque. A página depende da ordem de `BLOG_POSTS`, não de data, prioridade editorial ou campo explícito.

Correção: ordenar por data validada ou adicionar uma marca editorial explícita.

### [P1] Transição e scroll ignoram redução de movimento

O `useEffect` e `handleLinkClick` usam `smooth`; `AnimatePresence` desloca o artigo com `y`; imagens têm hover de 500 ms.

Correção: `useReducedMotion`, scroll `auto`, transição apenas de opacidade em redução e hovers de 160–250 ms.

### [P1] Filtros e controles sem alvo mínimo/foco explícito

Filtros, voltar, CTA e cards dependem de padding variável; não há garantia uniforme de 44 px nem foco `focus-visible` local.

Correção: `min-h-11`, foco visível e estados `active`.

### [P2] Leitura longa tem semântica parcial

O sumário é um `aside` útil, mas a renderização Markdown é limitada a headings, listas e negrito; links, citações e outros blocos não são tratados. O artigo usa headings h2 corretamente, porém não há anúncio de mudança quando o artigo é aberto.

Correção: preservar o contrato editorial atual, ampliar parsing apenas se os dados exigirem e mover foco para o h1 do artigo.

### [P2] Contraste e tokens inconsistentes

Há metadados em `text-zinc-500`, `text-zinc-400`, `text-gradient`, `bg-black/20` e transições longas. Alguns textos funcionais ficam abaixo de AA em mobile.

Correção: elevar metadados funcionais, remover gradiente textual e usar tokens de superfície.

### [P2] Estado vazio pouco útil

O filtro sem resultados mostra apenas uma frase, sem limpar filtro nem orientar o visitante.

Correção: incluir ação “Ver todos os insights” e uma explicação curta.

### [P3] Duplicidade e arquitetura editorial

`Insights.tsx` mistura catálogo, parser Markdown, artigo, sumário, FAQ, síntese estratégica e CTA. Funciona, mas concentra responsabilidades e dificulta evolução.

Correção: extrair parser e cartão apenas em etapa técnica posterior, sem alterar a API pública.

## Pontos positivos

- Categorias com `aria-pressed` já existem.
- Cards e destaque têm labels acessíveis.
- Conteúdo editorial tem contrato testado: id, slug, autor, data, leitura, imagem, seções e próxima ação.
- Sumário interno melhora leitura longa.
- Detector Impeccable, TypeScript e teste editorial passaram.

Nenhum arquivo foi alterado nesta auditoria.
