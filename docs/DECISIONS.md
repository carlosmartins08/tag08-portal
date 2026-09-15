# Decisões ativas — TAG08

Atualizado em: `2026-09-15`

Este arquivo registra decisões que governam o estado atual. Ele não substitui prova comercial, autorização de uso de imagem ou contrato. Quando houver conflito, a precedência é:

1. prova comercial, jurídica ou autorização verificável;
2. decisão registrada aqui, com data e responsável;
3. contratos e registries técnicos;
4. implementação atual;
5. arquivos não rastreados ou referências visuais.

## DEC-001 — Linha de integração

- Data: `2026-09-15`
- Decisão: `p0-routing-secret-containment` é a candidata à base de integração; `main` continua sendo o destino de integração.
- Estado: ativa, sem merge autorizado ainda.
- Motivo: a branch candidata contém dez commits posteriores à `main`, incluindo correções de segurança, rotas, i18n, acessibilidade e testes.
- Critérios antes do merge: árvore de trabalho limpa, mudanças locais separadas por objetivo, documentação reconciliada e validações executadas.

## DEC-002 — Conteúdo não é definido apenas por componentes de página

- Data: `2026-09-15`
- Decisão: `src/features/site/pages/` é a camada principal de apresentação por rota, mas não é a única fonte de conteúdo.
- Fontes complementares: `src/data.ts`, `src/content/`, `src/components/`, `src/config/routeRegistry.ts`, `src/i18n/`, `src/lib/officialContent.ts` e `server/officialContent.ts`.
- Regra: uma revisão editorial deve verificar todas as fontes que alimentam a rota antes de concluir que uma página foi revisada.

## DEC-003 — Conteúdo público sensível exige classificação

- Data: `2026-09-15`
- Decisão: equipe, cargos, fotos, marcas, cases, métricas, depoimentos e logos só podem ser classificados como publicados após evidência verificável.
- Estado atual: pendente de classificação. A data de um commit não equivale a aprovação comercial ou autorização de uso.
- Regra temporária: não remover nem promover esses itens durante a reconciliação. Registrar cada item como `aprovado`, `pendente` ou `remover` antes de qualquer alteração pública.

## DEC-004 — Encerramento de mudança

- Data: `2026-09-15`
- Decisão: uma mudança só é concluída depois de commit focado, validação proporcional e atualização de `PROJECT_STATE.md` e `CHANGELOG.md` quando afetar comportamento, conteúdo ou arquitetura.
- Regra: ativos não rastreados e alterações de objetivos diferentes não entram no mesmo commit.

## DEC-005 — Gate de publicação para evidências públicas

- Data: `2026-09-15`
- Decisão: a política conservadora foi aprovada. Um item `pendente` permanece preservado no código e no inventário, mas não pode renderizar, gerar rota ou entrar no sitemap.
- Escopo inicial: equipe, fotos, cases, candidatos de portfólio, métricas, mini-cases e depoimentos internos.
- Exceção: avaliações obtidas ao vivo da integração oficial do Google Business continuam condicionadas à resposta real da fonte, sem fallback editorial.
- Reativação: exige registrar evidência, responsável, validade e rotas autorizadas no inventário; depois, alterar apenas a chave correspondente em `src/content/publicEvidence.ts` e validar as rotas.
