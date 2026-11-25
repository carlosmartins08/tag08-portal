---
target: ProgramaAfiliados.tsx commission simulator
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProgramaAfiliados.tsx"
target_fingerprint: "sha256:86079d949ac3ef72b04b8c70e8a14e71745b79e51d938f2b4f26af517554b7c9"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\ProgramaAfiliados.tsx"
timestamp: 2026-11-10T17-38-33Z
slug: src-features-site-pages-programaafiliados-tsx
---
# Crítica do simulador — Programa de Parceria

**Alvo:** `src/features/site/pages/ProgramaAfiliados.tsx` — seção “Simule um cenário de comissão”. **Base:** `main@8758c15`. Análise de código e testes; navegador público indisponível, portanto não constitui aprovação visual ao vivo.

**Veredito:** regras comerciais separadas por modalidade e taxas centralizadas. A oportunidade principal é reduzir o esforço de preenchimento e esclarecer a base antes da estimativa.

## Pontos fortes
- Modalidades separadas; taxas centralizadas.
- Resultado reativo; recorrência condicionada.
- A simulação não promete pagamento ou elegibilidade.
- E2E cobre taxas, marco de 90 dias, elegibilidade e exclusões.

## Problemas prioritários
1. **Alta — Base de cálculo explicada tarde.** A introdução orienta usar base elegível, mas os detalhes das exclusões ficam no painel de resultado depois dos campos de serviços pontuais. Correção mínima: síntese das exclusões junto aos campos. Aceite: critério de base disponível antes ou junto da entrada.
2. **Alta — Entrada inválida parece zero.** `Number(value)` converte vazio em zero e o cálculo limita valores negativos a zero, sem mensagem visível. Correção: validação associada ao campo e sem estimativa até corrigir. Aceite: inválidos nunca viram zero silenciosamente.
3. **Média — Muitos dados no modo ativo.** Há dias, três condições e três valores financeiros simultâneos. Ainda falta definir se o modelo é uma oportunidade ou um conjunto de receitas. Correção condicional: se individual, escolha do cenário e revelação progressiva; se agregado, explicitar o modelo. Aceite: escopo da simulação e entradas necessárias ficam claros.
4. **Média — Estado inicial parece estimativa.** Tudo começa em zero e o painel já se intitula “Valores estimados”. Correção: orientação inicial e exibição do resultado após entrada válida. Aceite: zero não aparece como cálculo antes de haver cenário.
5. **Média — Região acessível possivelmente extensa.** `aria-live=polite` e `aria-atomic=true` abrangem resultado e explicações. Risco a confirmar com teste assistivo. Correção: região dinâmica limitada ao resumo atualizado. Aceite: leitor anuncia o valor principal sem repetir avisos longos.

## Heurísticas indicativas (leitura estática)
Estado do sistema 2/4; mundo real 2/4; controle 2/4; consistência 3/4; prevenção 2/4; reconhecimento 2/4; flexibilidade 2/4; minimalismo 2/4; recuperação de erros 2/4; ajuda 3/4. **22/40**. Não é nota da interface renderizada.

## Não verificado
Hierarquia renderizada, contraste, legibilidade, proporções desktop/mobile, estado inicial visual e comportamento real de leitor de tela. Navegador público indisponível. Nenhum arquivo de aplicação foi alterado; `next-env.d.ts` preexistente foi preservado.
