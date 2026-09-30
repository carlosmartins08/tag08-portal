---
target: src/features/site/pages/ProducaoAudiovisual.tsx
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 7
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProducaoAudiovisual.tsx"
target_fingerprint: "sha256:b7d33060850a48680d25d124b0bc833a9ddee043353610b34ab7370ad84018ca"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProducaoAudiovisual.tsx"
timestamp: 2026-09-25T00-53-06Z
slug: src-features-site-pages-producaoaudiovisual-tsx
---
# Auditoria Impeccable — ProducaoAudiovisual.tsx

## Design Health Score

| # | Heurística | Score | Problema principal |
|---|---|---:|---|
| 1 | Visibilidade do estado | 3/4 | Planner atualiza resumo; FAQ e vídeos não comunicam estados de forma semântica/robusta. |
| 2 | Correspondência com o mundo real | 3/4 | Formatos e reaproveitamento são claros, mas rótulos técnicos afastam. |
| 3 | Controle e liberdade | 3/4 | Seleções são editáveis, mas falta reset explícito e atalho para contato. |
| 4 | Consistência e padrões | 2/4 | Headings, CTA, densidade e tokens variam entre blocos. |
| 5 | Prevenção de erros | 2/4 | Planner aceita WhatsApp sem escopo definido nem opção “ainda não sei”. |
| 6 | Reconhecimento vs. recall | 3/4 | Cards ajudam, mas a extensão obriga o usuário a reter muita taxonomia. |
| 7 | Flexibilidade/eficiência | 2/4 | Não há caminho rápido para quem já quer contratar. |
| 8 | Estética minimalista | 2/4 | Visual premium, porém efeitos e seções competem entre si. |
| 9 | Recuperação de erros | 2/4 | Falhas de mídia/envio não têm recuperação evidente. |
| 10 | Ajuda/documentação | 3/4 | FAQ ajuda, mas não cobre logística, prazo, localização e edição de material existente. |
| **Total** |  | **25/40** | **Aceitável; requer correções importantes antes de publicar.** |

## Veredito de especificidade

A página é estrategicamente específica (audiovisual para institucional, eventos, bastidores, depoimentos, recorrência e reaproveitamento), mas ainda é pouco específica para decisão comercial: faltam escopo observável, prazos, logística, prova por formato e um próximo passo explícito. O detector Impeccable retornou `[]`; isso não invalida problemas de fluxo, semântica ou densidade que são contextuais.

## O que funciona

1. Posiciona vídeo como ativo de comunicação e negócio, não apenas como estética.
2. Os formatos e materiais cobrem necessidades reais e o planner leva contexto para o WhatsApp.
3. FAQ, método e integrações reduzem parte do risco percebido.

## Prioridades

### [P1] Texto potencialmente corrompido por encoding

Strings visíveis e mensagens de WhatsApp aparecem no fonte com padrões como `VÃ­deos`, `produÃ§Ã£o` e `OlÃ¡`. Se isso chegar ao navegador, destrói credibilidade e pode contaminar a mensagem enviada.

**Correção:** confirmar bytes UTF-8 no arquivo, build e payload final do WhatsApp; adicionar verificação automatizada de encoding.

### [P1] Conversão primária chega tarde

O primeiro CTA (“Planejar meu audiovisual”) leva ao planner; o contato direto aparece apenas depois de várias seções.

**Correção:** CTA primário “Falar com a TAG08” via WhatsApp no hero, com o planner como ação secundária. No mobile, colocar o CTA antes do texto complementar.

### [P1] Excesso de conteúdo e repetição antes da decisão

Hero, métricas, desalinhamento, frentes, vídeos, planner, método, escopo, integrações, cases, insights, CTA e FAQ repetem narrativa, reaproveitamento, clareza e canais.

**Correção:** sequência curta: hero comercial → quando faz sentido → formatos/entregas → planner opcional → provas → FAQ → CTA. Vídeos e insights ficam como aprofundamento.

### [P1] FAQ não é um accordion semântico

Os botões alteram `activeFaq`, mas não têm `aria-expanded`, `aria-controls`, painel identificado ou associação de heading; a pergunta usa `h4`.

**Correção:** botão em heading `h3`, `aria-expanded`, `aria-controls`, painel `role="region"`, `aria-labelledby` e foco/anúncio controlado.

### [P1] Foco de teclado removido no planner

Os controles usam `focus:outline-none` sem anel `focus-visible` equivalente.

**Correção:** aplicar foco visível consistente e `aria-pressed` aos seletores; não depender apenas de cor para estado ativo.

### [P1] Redução de movimento incompleta

`scrollTo` usa sempre `smooth` e a rota combina tilt, canvas, pulse, escalas e transições de 500–1000 ms.

**Correção:** `useReducedMotion`, scroll `auto` quando necessário, transformações apenas em ponteiro preciso e transições específicas de 160–250 ms.

### [P1/P2] Alturas rígidas e densidade mobile

Há `h-64`, `h-72`, `min-h-[440px]`, `min-h-[500px]` e grid de quatro benefícios em `grid-cols-2` no mobile. Isso cria vazio artificial, quebra desigual e rolagem excessiva em 390 px.

**Correção:** deixar conteúdo definir altura, usar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, reduzir espaçamento e preservar CTA após hero e formatos.

### [P2] Contraste, tokens e alvos de toque

Metadados em `text-zinc-500`, `text-white/20` e `text-black/60`, fundos `bg-[#0c0c0e]`/`bg-[#121214]` e links com apenas padding vertical reduzem legibilidade e toque.

**Correção:** elevar textos funcionais para AA, marcar ornamentos como decorativos, usar tokens `charcoal`/`brand` e garantir `min-h-11` nos CTAs.

## Personas

- **Jordan (primeiro contato):** entende a tese, mas precisa atravessar conteúdo demais antes de saber como contratar.
- **Riley (marketing):** é bem atendido por formatos e reaproveitamento, mas sente falta de volume, calendário, arquivos e exemplos concretos.
- **Casey (evento/marca pessoal):** precisa de segurança logística; faltam localidade, deslocamento, equipe, prazo e edição de material existente.

## Observações menores

- “SYS // BROADCAST_FAQ” e badges técnicos reforçam estilo, mas competem com clareza.
- O planner não acolhe explicitamente quem ainda não sabe o formato, embora o FAQ diga que isso é permitido.
- MiniCases/vídeos não substituem prova audiovisual rotulada por objetivo e autorização.
- A imagem hero é genérica e pouco demonstra o trabalho específico.

## Perguntas provocativas

- Se todos os efeitos fossem removidos, a contratação ainda ficaria clara em dez segundos?
- O planner ajuda o cliente ou transfere a ele o trabalho de definir o escopo?
- Onde a página prova execução audiovisual, e não apenas consultoria?
- Qual seção pode desaparecer sem reduzir compreensão ou conversão?
