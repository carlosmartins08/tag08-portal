---
name: TAG08 Design System
description: Direção editorial com clareza operacional para experiências institucionais, comerciais e de serviço da TAG08.
colors:
  brand: "#DDF81D"
  brand-dark: "#B9DE00"
  main: "#0A0A0A"
  surface: "#151518"
  subtle: "#1E1E22"
  border-subtle: "#303038"
  text-primary: "#F3F4F6"
  text-secondary: "#D1D5DB"
  accent-readable: "#3F5A00"
typography:
  display:
    fontFamily: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    fontSize: "0.6875rem"
    lineHeight: 1.35
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
rounded:
  control: "12px"
  card: "16px"
  editorial: "24px"
spacing:
  section-compact: "clamp(3.5rem, 6vw, 5rem)"
  section: "clamp(4.5rem, 8vw, 7rem)"
  control: "0.75rem 1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.main}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
    typography: "label"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
    typography: "label"
  card-functional:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "1.25rem"
  card-editorial:
    backgroundColor: "{colors.main}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.editorial}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.main}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
---

## Overview

TAG08 usa uma linguagem editorial escura para organizar decisões, serviços e provas sem transformar o destaque em ruído. A composição parte de camadas neutras, tipografia forte, imagens reais e um único acento lime usado para ação e orientação. Superfícies claras são permitidas quando funcionam como âncoras intencionais de leitura; nesse caso, texto, ícones, bordas e CTAs devem ser remapeados para manter contraste.

O sistema segue a proporção 60/30/10: neutros para fundo e superfícies, texto e estrutura para leitura e separação, e destaque para ação e ênfase. O objetivo é dar direção sem parecer uma interface genérica ou um painel carregado.

## Colors

- `bg-main` / `main` (`#0A0A0A`) é o fundo principal.
- `bg-surface` / `surface` (`#151518`) é a superfície funcional de cards, campos e navegação contextual.
- `bg-subtle` / `subtle` (`#1E1E22`) cria separação discreta entre camadas.
- `border-subtle` (`#303038`) estrutura sem competir com o conteúdo.
- `text-primary` (`#F3F4F6`) é o texto principal; `text-secondary` (`#D1D5DB`) é o texto auxiliar funcional.
- `brand` (`#DDF81D`, RGB `221, 248, 29`) é o lime institucional principal para CTA, estados ativos e ênfase estratégica.
- `brand-secondary` é alias compatível de `brand`, inclusive no RGB; não representa uma segunda cor.
- `brand-dark` (`#B9DE00`) permanece como token funcional legado de interação; não é cor institucional e não foi recalibrado nesta fase.
- `accent-readable` (`#3F5A00`) é uma cor funcional de acessibilidade para texto de destaque sobre superfícies claras; não é cor institucional TAG08.
- Cores de estado (`success`, `warning`, `danger`, `info`) são cores funcionais do produto, não cores institucionais.

`brand-secondary` é um alias legado de `brand`. Ele pode aparecer em detalhes de suporte, mas não cria uma segunda paleta nem deve dominar uma tela.

Os papéis semânticos de superfície, conteúdo, borda, foco e ação em `src/index.css` preservam o tema escuro no `:root`. A classe `context-default` pode remapear esses papéis em seções claras deliberadas; use-a apenas em uma âncora contextual, remapeando também texto, bordas, foco e ações. Ela não define um tema claro global. Os estados funcionais usam `state-success` (`#10B981`), `state-warning` (`#FBBF24`), `state-danger` (`#EF4444`) e `state-info` (`#3B82F6`), sem substituir cores institucionais.

## Typography

Manrope é a família única do sistema para títulos e corpo. `font-display` e `font-sans` expressam papéis diferentes da mesma família, mantendo unidade. JetBrains Mono fica reservado para metadados técnicos, códigos e dados de suporte.

- Títulos: peso alto, entrelinha compacta e leve tracking negativo para estabelecer direção.
- Corpo: peso regular, entrelinha confortável e largura controlada para leitura contínua.
- Labels e metadados: pequenos, semibold/bold, em caixa alta e com tracking ampliado; nunca devem carregar informação essencial sozinhos.

## Layout

O layout trabalha com uma linha editorial clara: entrada, contexto, prova, método e ação. Seções usam `section-space` ou `section-space-compact` e devem preservar respiro em 390, 768 e 1440 pixels.

Grids começam em uma coluna no mobile, passam por duas no tablet e só usam quatro colunas quando o conteúdo continua legível no desktop. Cards com quantidade ímpar não devem criar uma última coluna comprimida. O CTA primário precisa ser identificável sem depender de hover ou de uma imagem.

## Elevation & Depth

Existem apenas dois níveis de profundidade: `base` para separar uma superfície do fundo e `emphasis` para destacar uma ação ou bloco editorial. Sombras são discretas e não criam uma nova categoria visual. Gradientes e glows são suporte atmosférico, não substitutos para contraste ou hierarquia.

## Borders, surfaces and dividers

Use os tokens de borda existentes como ponto de partida. Bordas sólidas e translúcidas são válidas: escolha conforme a superfície real, a separação necessária, o estado e a consistência do contexto. Transparência não deve apagar o limite de um controle nem reduzir a distinção de foco, hover ou seleção. Quando a borda for necessária para identificar um componente ou estado, valide o contraste composto no fundo renderizado (3:1 quando aplicável); não crie um novo valor de cor sem demonstrar uma lacuna nos tokens.

Divisores funcionais devem continuar perceptíveis. Linhas decorativas podem ser mais sutis, mas seu peso não deve competir com a tipografia próxima nem desaparecer quando necessário para compreender o agrupamento. Escolha o traço em relação à densidade, hierarquia e superfície, não por uma espessura universal. HSL, RGB e RGBA são formatos de representação; nenhum garante melhor contraste por si só.

## Shapes

- Controle: `12px` para botões, campos, tabs e navegação contextual.
- Card funcional: `16px` para escolhas, formulários e itens de lista.
- Bloco editorial: `24px` para hero, provas, destaques e agrupamentos de seção.

Raios maiores devem comunicar agrupamento editorial; não devem ser aplicados indiscriminadamente a cada elemento da tela.

## Components

### Buttons

O botão primário usa `brand` com texto `main`, alvo mínimo de 44px e foco visível. O botão secundário usa uma superfície neutra e permanece claramente subordinado. Ambos devem declarar a ação; ícones complementam o rótulo e não o substituem.

### Chips and metadata

Chips e metadados usam `tag08-meta` e o acento apenas como sinal de categoria ou estado. Eles não devem competir com o título nem virar texto corrido em caixa alta.

### Cards and containers

Cards funcionais usam `bg-surface`, raio de 16px e borda sutil. Blocos editoriais podem usar `bg-main`, imagens e raio de 24px. A variante clara é uma âncora excepcional e exige remapeamento completo de texto, ícones, bordas e CTA; trocar somente o fundo não é suficiente.

### Inputs and fields

Campos usam `bg-main`, `text-primary`, `border-subtle`, raio de 12px e labels associados. Mensagens de erro, ajuda e consentimento precisam permanecer legíveis sem depender apenas de cor.

### Navigation

A navegação preserva a ação de contato como CTA primário, foco visível e alvos de toque de pelo menos 44px. Menus e estados ativos usam `brand` com parcimônia e continuam compreensíveis sem movimento.

### Editorial imagery

Imagens reais reforçam contexto e prova. Apenas a imagem hero deve receber prioridade de carregamento; imagens abaixo da dobra permanecem lazy. Tratamento monocromático, overlays e glows devem preservar leitura do conteúdo sobreposto.

### Case cards

Present cases as editorial narratives: project identity, challenge, response, and next step. Use local logos only when their relationship to a case is verified and the asset is approved for that route. Without an authorized image, use typography and neutral surfaces; do not use generic photography or visuals that imply unverified proof. Build hierarchy with composition, spacing, and scale while staying within existing tokens. When a case collection is long, prefer a manually controlled horizontal carousel with a visible peek of the next card, native touch scrolling, keyboard-accessible previous/next controls, and no autoplay. Keep every approved case in the document flow, provide a clear accessible region name, and respect reduced-motion preferences. Avoid repeating the client name in both the identity panel and headline.

## Accessibility and contrast

A referência é WCAG 2.2 AA, aplicada aos pares realmente renderizados, sem impor tema claro, paleta alternativa ou estilo único de CTA. Texto comum exige contraste mínimo de 4.5:1; texto grande, 3:1. Limites de controles e indicadores visuais também precisam de 3:1 quando o contraste for necessário para identificá-los ou perceber seu estado.

Meça a cor do texto contra o fundo efetivo depois de compor transparências, overlays e gradientes no ponto em que o texto aparece. Não aprove uma combinação apenas por seus valores hexadecimais isolados. Para gradientes, imagens e resultados que o verificador não consiga determinar, registre a inspeção como manual/inconclusiva, nunca como aprovada automaticamente.

Combinações atuais de referência, calculadas a partir dos tokens: `brand` (`#DDF81D`) sobre `main` (`#0A0A0A`) = 16.52:1; `brand` sobre `surface` (`#151518`) = 15.20:1; `accent-readable` (`#3F5A00`) sobre branco = 7.85:1. São exemplos para esses pares, não uma lista universal de cores permitidas.

Prefira corrigir localmente o papel de texto ou superfície que falhar, preservando a composição aprovada. Uma sombra não corrige contraste de texto. Borda e sombra de cards são escolhas de composição; uma borda só exige contraste mínimo quando é necessária para reconhecer um controle/estado ou quando não há outro indicador suficiente. Mantenha foco visível por teclado e não comunique erro, sucesso ou seleção apenas por cor.

Testes automatizados podem bloquear apenas os pares e contextos em que a ferramenta consegue medir o resultado renderizado com confiabilidade. A varredura global atual desativa `color-contrast` devido à interpretação inconsistente de alguns tokens CSS do Tailwind; os componentes medidos usam verificações Axe focadas em desktop, tablet e mobile, e fundos complexos permanecem sujeitos a inspeção manual. Falha ou ausência de uma regra de bloqueio de contraste não deve ser descrita como falha de build.

## Navigation and interactive targets

Use links (`<a>`/Next.js `Link`) quando a ação leva a outra rota ou URL, com destino no `href` e nome acessível derivado do texto visível. Use buttons para ações que alteram estado ou executam uma operação na página. Links ativam com Enter; Space não é ativação nativa de link. Controles precisam de foco visível e de área interativa mínima de 44 × 44 px quando aplicável; uma animação não pode reduzir essa área durante hover, entrada ou saída.

Em Branding, os cards de aplicação usam um botão de área ampla para abrir os detalhes. Favoritos e ações visíveis de detalhe são botões independentes, posicionados acima dessa área; devem manter nomes/estados acessíveis e impedir que a ação interna dispare também a abertura do card. Ao fechar o diálogo, devolva o foco ao controle que o abriu. O foco dos controles deve continuar perceptível sem depender de hover. O movimento de entrada dos cards não escala o alvo interativo; a escala `0.9` foi removida dessa animação. Respeite `prefers-reduced-motion` nos movimentos e transições sem alterar a dimensão do alvo.

### Icon transitions

Uma troca direta é adequada quando o novo ícone precisa representar imediatamente o estado atual. Use crossfade ou uma pequena variação de opacidade/escala somente quando isso melhorar a compreensão; blur não é efeito padrão. Transições devem ser curtas, respeitar `prefers-reduced-motion`, preservar a área interativa e não deslocar o layout. O estado e o nome acessível permanecem disponíveis durante a transição.

### Mobile viewport and forms

Não proíba `vh` como regra geral. Para conteúdo variável, prefira `min-height` a uma altura rígida; quando barras dinâmicas do navegador afetarem um painel, avalie `svh`/`dvh` com fallback compatível e valide retrato, paisagem e teclado virtual. Não corte conteúdo nem introduza overflow horizontal.

Antes de dividir ou reduzir um cadastro, confirme quais campos são obrigatórios e úteis, agrupe-os por contexto e use etapas somente quando tornarem a tarefa mais previsível. Progresso deve refletir etapas reais; voltar preserva respostas, erros ficam associados aos campos e a revisão final permanece disponível quando necessária. Valide teclado, foco, leitores de tela e preenchimento móvel; reduzir a quantidade aparente de campos, por si só, não é melhoria.

Validações registradas nesta etapa: `tests/e2e/decision-architecture.spec.ts` passou (7 testes), incluindo nomes/rotas dos dois links de Serviços, foco visível, Enter para navegar e Space sem ativar o link; em Branding, responsividade/alvos/overflow e abertura do diálogo por teclado com retorno de foco após Escape sob `prefers-reduced-motion`. `npm run lint` não chegou ao TypeScript: `prelint` falhou ao baixar o Prisma Schema Engine por conexão recusada no proxy local; `npm run lint --ignore-scripts` passou no `tsc --noEmit`, mas não substitui o fluxo completo. O registro histórico de 126 alvos não foi localizado com evidência individualizável nesta validação e não comprova cobertura atual. A inspeção visual manual de hover, estados de formulário, imagens, toque, seleção de texto e zoom real de 200% continua pendente; a ferramenta de navegador não conseguiu confirmar a URL da janela local.

## Do's and Don'ts

### Do

- Reutilize tokens semânticos antes de criar uma classe nova.
- Use `brand` para ação e decisão; use `accent-readable` quando o lime puro falhar no contraste.
- Trate superfícies claras como âncoras deliberadas, ajustando todos os descendentes.
- Valide cada alteração em 390, 768 e 1440 pixels.
- Respeite redução de movimento e mantenha foco visível.
- Registre uma exceção quando uma peça de marca ou imagem exigir tratamento fora do sistema.

### Don't

- Não introduza uma terceira cor de destaque.
- Não use o acento como texto padrão ou fundo grande.
- Não dependa de hex hardcoded para cores de marca fora de exceções registradas.
- Não use hover como uma nova cor de paleta.
- Não resolva contraste trocando apenas o fundo de um componente.
- Não use altura fixa para forçar cards com conteúdos de comprimentos diferentes.
