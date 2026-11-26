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

O sistema TAG08 combina direção editorial, clareza operacional e expressão estratégica. Seu arquétipo central é o Sábio: a experiência deve comunicar conhecimento aplicado, método, investigação, ciência, tecnologia, precisão e criatividade, sem reduzir a marca a uma agência exclusivamente criativa nem transformar cada tela em um painel ou grade de cards.

**Leitura normativa deste arquivo:** o bloco YAML acima registra o mapeamento de tokens e componentes da implementação atualmente codificada. Ele não substitui as decisões institucionais aprovadas descritas a seguir nem autoriza sua implementação automática. Onde direção institucional e código ainda divergirem, esta diferença deve permanecer explícita até validação e implementação próprias.

### Status das regras

- **Decisão institucional aprovada:** identidade, proteção de navegação e princípios expressamente estabelecidos pela direção.
- **Direção preferencial:** caminho desejado cuja aplicação precisa ser validada em contexto.
- **Proposta conceitual:** possibilidade de exploração, sem caráter obrigatório ou identidade final aprovada.
- **Parâmetro técnico a validar:** hipótese mensurável que depende de teste, compatibilidade ou evidência.
- **Regra técnica preservada:** orientação válida já existente neste documento e mantida.
- **Implementação vigente:** comportamento confirmado no código; sua descrição não declara aprovação institucional.
- **Implementação pendente:** decisão aprovada ainda não aplicada ao código.

Não converter preferência ou proposta em requisito implementado. Mudanças na aplicação exigem escopo e validação próprios.

## Colors — direção institucional e implementação vigente

- **Decisão institucional aprovada:** a identidade cromática de referência é `#F2F2F2` (predominante), `#0D0D0D` (secundária) e `#DDF81D` (destaque). A direção prevê predominância clara no conjunto da experiência, alternância intencional entre superfícies claras e escuras e proporção 60/30/10 flexível, não uma fórmula por tela. O lime pode funcionar como ação, detalhe, expressão gráfica ou superfície editorial; texto comum em lime sobre superfície clara não é legível e não deve ser usado.
- `#EBF21D` não substitui o lime institucional aprovado. `#A1A614` e `#3E4008` não devem ganhar protagonismo como fundamentos cromáticos. Cores semânticas de estados continuam funcionais e não são proibidas pela paleta institucional.

**Implementação vigente, confirmada em `src/index.css`:** o tema global ainda é escuro, com `main` `#0A0A0A`, `surface` `#151518`, `subtle` `#1E1E22`, `border-subtle` `#303038`, `text-primary` `#F3F4F6` e `text-secondary` `#D1D5DB`. A classe opt-in `context-default` remapeia papéis em superfícies claras e tem usos identificados em trechos de `src/features/site/pages/DesenvolvimentoWeb.tsx` e no estado condicional de `src/components/ServiceInsightsBridge.tsx`; não configura tema claro global. A predominância clara aprovada ainda não corresponde ao tema global atualmente codificado.

- `brand` (`#DDF81D`, RGB `221, 248, 29`) é o lime institucional aprovado e token vigente.
- `brand-secondary` é alias de `brand`, não uma segunda cor.
- `brand-dark` (`#B9DE00`) permanece como token funcional legado de interação; não é a cor institucional principal.
- `accent-readable` (`#3F5A00`) é uma cor funcional de acessibilidade para destaque em superfícies claras, não uma cor institucional. Ela não deve ser confundida com `#3E4008`.
- As famílias semânticas `success`, `warning`, `danger` e `info` permanecem funcionais e independentes da identidade cromática.

`brand-secondary` é um alias legado de `brand`. Ele pode aparecer em detalhes de suporte, mas não cria uma segunda paleta nem deve dominar uma tela.

Os papéis semânticos de superfície, conteúdo, borda, foco e ação em `src/index.css` preservam o tema escuro no `:root`. `context-default` é contexto local: ao usá-lo, remapeie também texto, bordas, foco e ações e valide os pares renderizados. Os estados atuais usam `state-success` (`#10B981`), `state-warning` (`#FBBF24`), `state-danger` (`#EF4444`) e `state-info` (`#3B82F6`).

## Typography — direção institucional e implementação vigente

**Direção preferencial aprovada:** Darker Grotesque para expressão editorial, manifestos e títulos; Manrope para leitura, comunicação, controles e interface. Darker Grotesque contempla pesos de 300 a 900; Manrope, 200 a 800. A distribuição final deve ser validada com as métricas reais das fontes, considerando legibilidade, hierarquia, altura visual, kerning, entrelinha, comprimento de linha, quebras responsivas, alinhamento óptico, formatos web, licença, carregamento e estabilidade visual. JetBrains Mono pode permanecer para usos técnicos justificados. Não introduzir fontes concorrentes sem necessidade.

**Implementação vigente, validada em 2026-11-25:** `--font-sans` e `--font-display` continuam apontando para Manrope; JetBrains Mono permanece no papel mono. `--font-editorial` referencia a Darker Grotesque local, carregada como fonte variável nos pesos 300–900 por `next/font/local`. A classe opt-in `.tag08-editorial-heading` aplica esse papel semântico; ela foi validada somente nos títulos editoriais da seção de diagnóstico da Home e da seção contextual de Desenvolvimento Web, em 390, 768 e 1440 px. Os demais títulos, o corpo e a navegação preservam Manrope. O arquivo WOFF2 e a licença OFL estão em `src/assets/fonts`; os glifos acentuados testados em português, inglês e espanhol foram renderizados pela fonte local. O carregamento usa `display: swap` e não faz preload da Darker Grotesque. Esta é uma aplicação piloto delimitada, não uma regra global para H1/H2/H3; expansões precisam de avaliação contextual e visual própria. A navegação protegida foi comparada antes/depois e permaneceu pixel-idêntica nas capturas dos três viewports.

- Títulos: peso alto, entrelinha compacta e leve tracking negativo para estabelecer direção.
- Corpo: peso regular, entrelinha confortável e largura controlada para leitura contínua.
- Labels e metadados: pequenos, semibold/bold, em caixa alta e com tracking ampliado; nunca devem carregar informação essencial sozinhos.

Essas orientações de papel não prescrevem valores finais de tamanho, peso, tracking ou entrelinha. Validar com a fonte efetivamente carregada, idioma, comprimento do conteúdo e viewport antes de propor tokens.

## Layout

O layout trabalha com uma linha editorial clara: entrada, contexto, prova, método e ação. Seções usam `section-space` ou `section-space-compact` e devem preservar respiro em 390, 768 e 1440 pixels.

Grids começam em uma coluna no mobile, passam por duas no tablet e só usam quatro colunas quando o conteúdo continua legível no desktop. Cards com quantidade ímpar não devem criar uma última coluna comprimida. O CTA primário precisa ser identificável sem depender de hover ou de uma imagem.

## Elevation & Depth

Existem apenas dois níveis de profundidade: `base` para separar uma superfície do fundo e `emphasis` para destacar uma ação ou bloco editorial. Sombras são discretas e não criam uma nova categoria visual. Gradientes e glows são suporte atmosférico, não substitutos para contraste ou hierarquia.

## Borders, surfaces and dividers

Consolidação técnica local em 2026-11-25 (Missão 05-B): os contextos claros `context-default` e `context-subtle` usam `#F2F2F2` como canvas e `#0D0D0D` como conteúdo primário, sem alterar os valores globais de `:root`. Em contextos escuros (`context-inverse` e `context-media`), `border-default` referencia o token existente `border-subtle`; `border-strong` permanece distinto. O card de sinal selecionado na Home consome o canvas e a cor de foco do contexto, evitando fundo local duplicado e mantendo o foco de teclado legível sobre a superfície clara. O teste automatizado verifica os contratos de código. A prévia canônica foi identificada pela cadeia `tools/dev-preview.mjs` e uma captura desktop da Home foi inspecionada; contraste renderizado, estados interativos e os viewports de 390, 768 e 1440 px seguem pendentes, pois o controle do navegador Windows foi encerrado após perder a confiança no URL ativo.

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

### Variants and states

Organize components by responsibility: controls, navigation, functional and editorial cards, modular compositions, scientific content, forms, indicators, dialogs, projects/evidence, and loading/recovery. Keep equivalent functions consistent; allow only contextually justified variants and avoid adding a variant without a demonstrated need. Review, when applicable, default, hover, focus, pressed, selected, loading, success, error, disabled, empty, and unavailable states. A state must not rely on color alone.

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

## Institutional visual direction

As decisões desta seção são direção institucional aprovada, não declaração da interface já implantada.

### Iconography

A direção é linear encorpada, geométrica, reconhecível e consistente em espessura, proporções, junções e alinhamento óptico. Traço de 2 px em grade 24 × 24 é referência inicial a validar, não regra rígida. Reaproveitar a implementação `src/components/DooIcons.tsx` e os SVGs de traço locais antes de considerar outra biblioteca. O tamanho desenhado do glifo não determina a área interativa.

### Photography, illustration and computational expression

A fotografia deve ser humana, autêntica, editorial, cinematográfica ou conceitual quando o conteúdo justificar; ela participa da narrativa, não serve como preenchimento genérico. Retratos monocromáticos, luz e sombra, enquadramentos incomuns, movimento desfocado, reflexos e abstração geométrica são possibilidades, não efeitos obrigatórios. Preservar cores originais em projetos apresentados como evidência. Não gerar imagens que se passem por equipe, clientes, trabalhos ou resultados reais.

Redes, conexões, matrizes, fluxos, padrões, geometria computacional, diagramas e arte generativa podem expressar investigação e tecnologia. Identificar visualmente e no conteúdo se o recurso é (1) dado real, (2) ilustração explicativa ou (3) arte conceitual. Nunca apresentar dados, números ou métricas fictícias como prova. Evitar robôs, hologramas e futurismo genérico. Dar finalidade editorial às texturas, granulações e distorções, sem aplicá-las indiscriminadamente a controles.

O símbolo oficial pode inspirar futuras curvas, interseções, recortes, repetições e estruturas modulares. Estudos conceituais não são vetores oficiais aprovados; arte final depende de ativo institucional autorizado.

### Composition and spatial precision

Usar surpresa visual controlada: a composição editorial pode variar; navegação e padrões de interação permanecem previsíveis. Escolher composição tipográfica, modular assimétrica, científica, comparativa, fotográfica ou funcional pela finalidade e pelo conteúdo. Não converter toda seção em grade de cards.

Grids, alinhamentos, escala, densidade, espaço negativo, agrupamento semântico, raios, bordas e continuidade de superfícies devem formar relações coerentes. Múltiplos de 4 ou 8 são referências, não obrigação. Em superfícies concêntricas com espaçamento uniforme, pode-se testar `raio interno = raio externo − espaçamento`; a fórmula não se aplica automaticamente a geometrias diferentes. Escala tipográfica modular 1,25 é hipótese de avaliação, não token aprovado. Entrelinha e quebras dependem das métricas da fonte, idioma, tamanho e uso.

## Interaction, cognition and intelligent collection

A direção institucional aprova evoluir a coleta tradicional para interações contextuais e mais simples. Aplicar EAS — Eliminar, Automatizar, Simplificar — para reduzir esforço cognitivo total e obter somente informação necessária à finalidade. Isso não autoriza remover campos, alterar contratos ou lançar outro fluxo sem sua própria investigação e aprovação.

Considerar formulário direto para tarefa simples, seleção visual, perguntas condicionais, divulgação progressiva, linguagem natural, preenchimento contextual autorizado, voz, extração assistida, revisão, retomada e integrações existentes. São opções a avaliar, não funcionalidades obrigatórias. IA deve ser assistiva apenas quando houver benefício concreto; não transformar toda coleta em chatbot. Não presumir consentimento, não declarar inferências pessoais como fatos e manter alternativa acessível quando recursos de IA estiverem indisponíveis.

Na concepção e avaliação, priorizar familiaridade, reconhecimento em vez de recordação, agrupamento por significado, hierarquia, fragmentação de conteúdo complexo, ação principal clara, ergonomia móvel, prevenção e recuperação de erros, preservação de contexto e encerramento compreensível. Revelar opções progressivamente quando isso reduzir complexidade sem ocultar informação essencial ou retirar controle. Progresso, recomendações e opções padrão precisam ser reais, justificáveis, reversíveis e não manipulativos.

## Responsiveness, motion and quality of response

`INP ≤ 200 ms` no percentil 75 é referência para boa responsividade quando houver dados de campo ou medição representativa; não é promessa nem gate inferido sem medição. Distinguir o feedback perceptível do tempo total de processamento. Escolher feedback proporcional à operação: resposta imediata, indicador localizado, skeleton, etapa ou progresso mensurável. Mostrar sucesso somente após confirmação efetiva; não inventar progresso, duração ou estimativa. Operações sem progresso mensurável usam estado indeterminado e oferecem recuperação quando disponível.

Movimento pode comunicar revelação, foco, organização, fluxo, transformação ou feedback. Deve respeitar `prefers-reduced-motion`, preservar leitura, foco, alvo interativo e estabilidade, sem mascarar espera real. Preservar animações existentes que atendam ao propósito e às regras de acessibilidade.

## Acessibilidade e ergonomia responsiva — decisões institucionais

Manter WCAG 2.2 AA como referência e preservar a avaliação dos pares renderizados definida acima. Alvo de 44 × 44 px CSS é padrão interno para controles interativos quando aplicável; não impor altura ou padding a links inline que não funcionam como controles isolados. Diferenciar glifo visual da área clicável.

Validar teclado, foco visível, leitor de tela, zoom/reflow, espaçamento textual, toque, estados e mensagens. Medir contraste depois de compor transparências, imagem e overlay. Conservar os viewports já usados de 390, 768 e 1440 px; acrescentar 375 px, orientação, teclado virtual ou outros contextos quando o risco da alteração justificar. Mobile deve ser experiência projetada para seu contexto, não uma versão comprimida do desktop.

## Excelência integral e acabamento meticuloso

A excelência é obrigação transversal, e conformidade técnica isolada não basta para aprovar uma experiência. Em cada entrega avaliar, conforme o contexto, geometria, alinhamento óptico, hierarquia, raios, ritmo tipográfico, kerning, entrelinha, quebras, ícones, bordas, divisores, superfícies, espaçamento, fotografia, contraste, microinterações, estabilidade de carregamento, responsividade, linguagem, estados vazios, erros, confirmações e conclusão dos fluxos.

Acabamento deve ser sofisticado, acessível, profissional e confiável sem excesso decorativo. Cada revisão precisa de escopo, evidência, critérios de aceite e limite de conclusão; não abrir ciclos indefinidos de refinamento quando os critérios foram satisfeitos e não há defeito relevante demonstrado.

## Referencial metodológico permanente

O Nielsen Norman Group (NN/g) é referência metodológica permanente para usabilidade, comportamento, pesquisa e avaliação. As fontes abaixo orientam perguntas e métodos; não substituem julgamento contextual, evidência do projeto ou skills especializadas e não são instruções automáticas de implementação. Não duplicar aqui o conteúdo das skills: registrar somente a autoridade da referência, os tópicos úteis e o limite de aplicação.

- [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) e [How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/): avaliação heurística, não teste de usuário nem prova isolada de defeito.
- [5 Principles of Visual Design in UX](https://www.nngroup.com/articles/principles-visual-design/) e [The Aesthetic-Usability Effect](https://www.nngroup.com/articles/aesthetic-usability-effect/): hierarquia e composição; aparência positiva não comprova usabilidade.
- [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): revelar opções secundárias quando isso reduz a carga inicial sem prejudicar descoberta e controle.
- [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) e [Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/): feedback e padrões de espera avaliados conforme a operação real.
- [Usability 101](https://www.nngroup.com/articles/usability-101-introduction-to-usability/) e [Web UX: Study Guide](https://www.nngroup.com/articles/web-ux-study-guide/): fundamentos e índice de tópicos de experiência web.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) é a referência normativa de acessibilidade deste sistema. [INP](https://web.dev/articles/inp) é referência complementar de resposta à interação e requer medição adequada.

Antes de fundamentar uma decisão em uma fonte externa específica, confirmar que a página e a recomendação citada continuam disponíveis e são pertinentes ao caso. As heurísticas são regras gerais; avaliação deve explicitar tarefa, público, contexto, evidência e severidade.

## Protected navigation system

Por decisão expressa da direção, o cabeçalho e todo o sistema de navegação atual estão integralmente protegidos nesta missão e em futuras experiências piloto. Preservar estrutura, conteúdo, comportamento, responsividade, estados e geometria de cabeçalho, menu principal, mega menu, agrupamentos, seletor de idioma e CTA de contato; inclui cores, tipografia, iconografia, espaçamento, bordas, animações, foco e alvos interativos. Não redesenhar, substituir, simplificar, reinterpretar nem usar a navegação como superfície experimental.

**Dependências indiretas identificadas:** `src/components/Header.tsx` consome `src/components/DooIcons.tsx`, `src/components/CountryFlag.tsx`, `src/components/FocusManagedDialog.tsx`, `motion/react`, cópias de `src/i18n/siteI18n`, disponibilidade de idioma, `routeRegistry`, destinos de `siteNetwork` e funções de tracking. `src/features/site/SiteShell.tsx` compõe a interface global; `src/index.css` define os papéis semânticos e tipográficos globais consumidos pelas classes do Header, incluindo tokens de cor, `font-sans`/`font-display`, foco e dimensões. Mudanças nesses módulos podem afetar o cabeçalho mesmo sem editar `Header.tsx` diretamente.

Qualquer defeito identificado nessas superfícies deve ser registrado e tratado em missão separada com autorização específica. Antes e depois de mudanças autorizadas em dependências compartilhadas, executar comparação de regressão do cabeçalho em desktop e mobile, incluindo menu, idioma, CTA, teclado, foco, estados e conteúdo traduzido. A proteção não declara que a implementação atual foi integralmente validada.

## Positive internal design references

A direção reconhece o hero atual da Home e a composição modular da metodologia como referências internas positivas. Preservar os conceitos centrais, organização e personalidade dessas composições; não substituí-las por modelos genéricos. São referências de intenção, não aprovação automática de todo detalhe nem proteção absoluta equivalente à navegação. Refinamentos futuros requerem justificativa observável, escopo e critérios de aceite.

## Reconciliation and future validation

Ao confrontar direção, documentação e implementação, registrar regra anterior, nova direção, fonte de autoridade, evidência executável, dependências, conflito, impacto e encaminhamento. Distinguir decisão aprovada, preferência, proposta conceitual, parâmetro a validar, regra preservada, implementação pendente e hipótese. Não usar arquivo auxiliar ou relatório histórico como norma sem conferir sua autoridade e atualidade.

Inventário confirmado para evolução posterior: tokens e papéis em `src/index.css`; componentes globais em `src/components/`; SVGs de ícones acessados pelo wrapper `DooIcons`; Manrope e JetBrains Mono nos papéis globais, com Darker Grotesque local conectada ao papel editorial opt-in e validada em dois títulos-piloto; shell compartilhado em `SiteShell`; hero e metodologia em `Home.tsx`/`HomeMethodSection.tsx`; regras automatizadas disponíveis em `npm run audit:colors`, `audit:typography`, `audit:visual-contract`, `audit:interactions` e `audit:ux-matrix`. A existência desses recursos não prova cobertura ou aprovação integral.

Próximas avaliações visuais podem examinar o hero e a composição modular da metodologia na Home, preservando seus conceitos, e comparar superfícies `context-default` em `DesenvolvimentoWeb.tsx` com uma superfície escura. A aplicação editorial da Darker Grotesque já está integrada nos dois títulos-piloto descritos acima; sua expansão para outras telas requer avaliação e escopo próprios. Avaliar controles compartilhados somente quando um fluxo concreto justificar a inspeção; para coleta, selecionar campos delimitados de `Contato.tsx`, sem mudar contrato, regra de negócio ou integração. Mudanças de paleta global, tokens compartilhados ou estruturas comuns exigem missão própria e verificação de impacto, sem alterar a navegação protegida.

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
