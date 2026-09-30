---
target: src/features/site/pages/Servicos.tsx
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 4
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Servicos.tsx"
target_fingerprint: "sha256:1fdfbe629f5d0590a6e374dacca6122b027e8630239d93a6c58ada6b96b018e7"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Servicos.tsx"
timestamp: 2026-09-24T23-46-19Z
slug: src-features-site-pages-servicos-tsx
---
# Auditoria Impeccable — Servicos.tsx

## Design Health Score

| Heuristica | Nota |
|---|---:|
| Visibilidade do estado | 2/4 |
| Correspondencia com o mundo real | 3/4 |
| Controle e liberdade | 3/4 |
| Consistencia e padroes | 2/4 |
| Prevencao de erros | 3/4 |
| Reconhecimento em vez de memorizacao | 3/4 |
| Flexibilidade e eficiencia | 2/4 |
| Estetica e minimalismo | 2/4 |
| Recuperacao de erros | 3/4 |
| Ajuda e documentacao | 2/4 |
| **Total** | **25/40** |

## Veredito

A pagina tem identidade TAG08 clara, mas repete a mesma ideia de diagnostico e recomendacao em muitos modulos. O resultado e autoral, porem mais longo e menos decisivo do que deveria para um hub comercial.

## Detector

Nenhum achado automatico no detector Impeccable. A ausencia de achados nao elimina problemas semanticos e de produto dependentes de contexto.

## Prioridades

### P0 — A pagina demora para chegar a oferta principal

Matriz de diagnostico vem antes do mapa de solucoes, e diagnostico, combinacoes, processo e FAQ repetem a mesma ideia. Reordenar para hero com CTA, mapa das quatro frentes, matriz como apoio, processo resumido, FAQ e CTA final. Tratar diagnostico como orientacao transversal.

### P1 — FAQ sem semantica acessivel

Os botoes alteram activeFaq, mas nao expoem aria-expanded, aria-controls, painel identificado ou relacao entre pergunta e resposta. Converter para accordion semantico com role region, aria-labelledby e perguntas em h3.

### P1 — Hierarquia de headings quebrada

Ha h3 diretamente apos h1, h4/h5 usados como rotulos e titulos estruturais desalinhados. Usar h2 nas secoes, h3 nos cards/etapas e span/p nos rotulos visuais.

### P1 — CTAs sem alvo minimo garantido

Botoes usam py-3 sem min-height de 44px. Aplicar min-h-11 e validar em 390px.

### P1 — Scroll suave sem reducao de movimento

handleLinkClick e scrollIntoView usam smooth sem consultar prefers-reduced-motion. Trocar para auto quando necessario.

### P2 — Altura e repeticao excessivas no mobile

Muitos py-20/py-24, min-heights, imagens grandes e cards detalhados afastam o CTA final. Reduzir ritmo vertical e manter CTA apos hero e mapa.

### P2 — Movimento excessivo

ThreeDimensionalTilt, canvas, transition-all, duration 500/700 e hover scale competem com a decisao. Restringir transforms a ponteiro preciso, usar propriedades especificas e 160–250ms.

### P2 — Hardcodes visuais fora dos tokens

bg-[#000]/10, bg-neutral-900/10, bg-[#0c0c0e] e bg-[#121214] devem usar tokens existentes.

### P2 — Metadados de baixo contraste

zinc-500/600/800 e white/20/40/50 precisam ser reservados a decoracao; textos funcionais devem subir para tokens equivalentes a zinc-300/400.

### P3 — Taxonomia inconsistente

Hero anuncia quatro caminhos, matriz apresenta cinco ao incluir diagnostico e processos aparecem como capacidade. Fixar quatro frentes comerciais + diagnostico transversal, se essa for a decisao do produto.

## Personas

- Jordan: precisa de uma sequencia comercial mais direta e menos ambigua.
- Riley: precisa comparar escopo, servico e etapa sem repeticao.
- Casey: precisa de modulos menores, CTA proximo e alvos de toque de 44px.

## Limitacoes

Browser visual indisponivel por spawn EPERM; overflow, medidas reais e leitor de tela ainda precisam de validacao no navegador.
