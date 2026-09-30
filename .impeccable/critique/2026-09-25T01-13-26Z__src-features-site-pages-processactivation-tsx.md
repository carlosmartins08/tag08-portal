---
target: src/lib/simulators/processActivation.ts + src/features/site/pages/ProcessActivation.tsx
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 6
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProcessActivation.tsx"
target_fingerprint: "sha256:3f03adf76879b86eb4f0c97201efa1c4f7d416700466376c9315225d8e6c2437"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProcessActivation.tsx"
timestamp: 2026-09-25T01-13-26Z
slug: src-features-site-pages-processactivation-tsx
---
# Auditoria — ProcessActivation

## Checklist

- Clareza comercial e pré-requisito do serviço
- Contrato dos dados e roadmaps
- Semântica, estados e teclado
- Hierarquia, contraste e tokens
- Motion, performance e mobile
- Testes e consistência das mensagens

## Design Health Score

| Heurística | Score | Problema |
|---|---:|---|
| Visibilidade do estado | 2/4 | Nível ativo muda visualmente, mas não é anunciado semanticamente. |
| Correspondência com o mundo real | 2/4 | Bronze/Prata/Ouro e jargão técnico simplificam demais maturidade operacional. |
| Controle e liberdade | 3/4 | Níveis podem ser trocados; falta reset e caminho curto para contato. |
| Consistência | 2/4 | Headings, tokens, motion e CTAs divergem do sistema já corrigido. |
| Prevenção de erros | 2/4 | Roadmaps sugerem contratação sem explicar critérios de classificação. |
| Reconhecimento | 2/4 | O usuário precisa interpretar níveis, fases e pré-requisitos. |
| Flexibilidade | 2/4 | Há três cenários, mas nenhum “não sei qual nível”. |
| Minimalismo | 2/4 | Métricas, alerta, pilares, benefícios, roadmap, cases, FAQ e CTA competem. |
| Recuperação de erros | 2/4 | Não há estado explícito para mídia ou contato. |
| Ajuda/documentação | 2/4 | FAQ não explica critérios, limites, dependências e entregáveis com precisão. |
| **Total** | **21/40** | **Aceitável baixo; precisa de correções antes de publicação.** |

## Prioridades

### P0 — Pré-requisito comercial precisa dominar a jornada

O serviço depende de Process Intelligence, mas o CTA do hero vai para `/contato` sem contextualizar a dependência. O usuário pode solicitar ativação sem ter o diagnóstico base.

Correção: manter o alerta, transformá-lo em regra de decisão visível e direcionar o CTA para avaliação/diagnóstico quando o pré-requisito não estiver concluído.

### P1 — Roadmaps contêm promessas e especificidades não verificadas

“4/6/8 semanas”, “certificação”, “auditoria diária”, “WhatsApp Cloud API”, “painel de monitoramento” e “automações nativas” parecem compromissos operacionais, não apenas exemplos.

Correção: confirmar cada entrega com fonte de verdade; rotular como referência quando não for compromisso; evitar promessa de certificação ou prazo sem escopo aprovado.

### P1 — Selector de maturidade sem semântica completa

Os botões trocam `activeLevel`, mas não têm `aria-pressed`, foco visível ou instrução para quem não sabe escolher.

Correção: adicionar `aria-pressed`, foco `focus-visible`, opção “Ainda não sei” ou texto de orientação e anunciar o roadmap selecionado.

### P1 — Conversão direta aparece tarde

O hero usa `onNavigate("/contato")`; os links de WhatsApp aparecem no bloco inferior. Isso separa intenção de contato da seleção de nível.

Correção: CTA primário contextualizado no hero e CTA secundário para entender os níveis; gerar mensagem com nível apenas quando houver escolha válida.

### P1 — FAQ também não é accordion acessível

Faltam `aria-expanded`, `aria-controls`, painel identificado e associação com heading. Há `h4` estruturais sem níveis intermediários.

Correção: semântica de accordion e headings `h2`/`h3`.

### P1 — Motion e performance fora das travas do projeto

Há `transition-all`, durações de 500–1000 ms, tilt, canvas, pulse e scroll suave sem `useReducedMotion` local.

Correção: preservar o efeito cinematográfico apenas como acento, usar transições específicas de 160–250 ms e comportamento instantâneo sob redução de movimento.

### P2 — Densidade e contraste no mobile

Métricas em duas colunas, textos `zinc-500`, muitos cards e imagens com `min-h-[380px]` a `min-h-[520px]` tornam a rota longa e difícil em 390 px.

Correção: uma coluna no mobile, alturas determinadas pelo conteúdo, metadados em contraste AA e CTA com área mínima de 44 px.

### P2 — Dados e testes não protegem o contrato

O módulo tem apenas um teste de duração e não valida que cada nível tenha quatro fases, títulos, badges e duração coerentes. Não há validação contra strings vazias ou roadmap incompleto.

Correção: adicionar testes de integridade do catálogo e mensagens de WhatsApp.

## Pontos positivos

- O pré-requisito Process Intelligence está explicitado.
- Os roadmaps são determinísticos e tipados por `ActivationLevel`.
- A seleção gera mensagens contextualizadas para Brasil e internacional.
- O conteúdo orienta implantação, treinamento, auditoria e handoff.

Nenhum arquivo foi alterado nesta auditoria.
