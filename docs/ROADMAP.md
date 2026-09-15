# Roadmap de reconciliação e evolução — TAG08

Atualizado em: `2026-09-15`

Objetivo: consolidar uma linha de evolução sem descartar melhorias técnicas nem publicar conteúdo sem validação.

## Fase 0 — Base segura

- Concluída em `2026-09-15`: criados checkpoints separados para governança e `/llms.txt`; `public/clients/` permaneceu isolada, sem promoção para o site.
- Separar alterações locais por objetivo: discoverability (`llms.txt`) e ativos de clientes.
- Manter `p0-routing-secret-containment` como candidata à integração e `main` como destino; não fazer merge direto.
- Critério de saída: `git status` compreensível e cada mudança com dono e destino definidos.

## Fase 1 — Reconciliação de decisão e conteúdo

- Inventário inicial registrado em `docs/CONTENT_EVIDENCE_INVENTORY.md`; a classificação comercial e a evidência externa ainda são pendentes.
- Criar inventário de equipe, cases, depoimentos, marcas, logos e métricas que aparecem no site.
- Para cada item, registrar evidência, responsável e status: `aprovado`, `pendente` ou `remover`.
- Resolver conflitos entre decisões de 02/09 e alterações posteriores, especialmente em `/sobre` e `/`.
- Critério de saída: nenhuma reivindicação pública depende apenas de uma implementação ou de um asset local.

## Fase 2 — Integração controlada

- Auditoria dos commits registrada em `docs/INTEGRATION_AUDIT.md`; a política para conteúdo `pendente` bloqueia a criação da integração revisável.
- Revisar os dez commits de `p0-routing-secret-containment` por domínio: plataforma, segurança, rotas/i18n, acessibilidade, interface e conteúdo.
- Validar a base integrada com `npm run check`, testes de navegador pertinentes e verificações de rotas/SEO.
- Integrar por PR ou sequência equivalente revisável, sem juntar conteúdo pendente com correções técnicas.
- Critério de saída: `main` representa a base técnica atual e tem checkpoint correspondente.

## Fase 3 — Evolução contínua

- Abrir uma branch curta por missão.
- Antes da implementação: registrar objetivo, arquivos afetados, restrições, risco e critério de aceite.
- Depois da implementação: commit focado, validação e atualização do estado.
- Critério de saída: nenhuma sessão depende de memória de conversa para saber onde continuar.

## Fora de escopo desta reconciliação

- Redesign das páginas.
- Criação de novas ofertas, cases ou rotas.
- Remoção de conteúdo sem classificação comercial.
- Alteração de contratos de onboarding, dados ou integrações sem missão própria.
