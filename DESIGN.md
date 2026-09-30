---
name: TAG08 Design System
description: Direção editorial com clareza operacional para experiências institucionais, comerciais e de serviço da TAG08.
colors:
  brand: "#D4FF00"
  brand-dark: "#B9DE00"
  main: "#0A0A0A"
  surface: "#151518"
  subtle: "#1E1E22"
  border-subtle: "#303038"
  text-primary: "#F3F4F6"
  text-secondary: "#D1D5DB"
  accent-readable: "#5B8000"
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
- `brand` (`#D4FF00`) é o acento principal de CTA, estados ativos e ênfase estratégica.
- `brand-dark` (`#B9DE00`) é a variação de interação em fundos claros ou estados pressionados.
- `accent-readable` (`#5B8000`) é a alternativa para texto de destaque sobre superfícies claras.

`brand-secondary` é um alias legado de `brand`. Ele pode aparecer em detalhes de suporte, mas não cria uma segunda paleta nem deve dominar uma tela.

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
