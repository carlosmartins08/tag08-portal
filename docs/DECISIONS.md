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
- Estado: reconciliada. A integracao ocorreu no merge `5126504`; `ee4d9ed` e o HEAD local/remoto subsequente neste checkpoint. O registro abaixo prevalece sobre a redacao anterior desta decisao.
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

## DEC-006 — Revisão local sem publicação implícita

- Data: `2026-09-15`
- Decisão: Carlos Henrique Martins é a autoridade final para classificar cada evidência. O registro executável deve guardar status, rotas autorizadas, responsável, data, referência verificável não sensível e validade quando existir.
- Regra: `npm run dev:content-review` pode exibir localmente itens `pendente`, sempre com faixa e badge de revisão. O modo só funciona em desenvolvimento; produção, rota, sitemap e metadata continuam estritamente no modo público.
- Encerramento: cada alteração de status exige `npm run content:status`, revisão visual local, testes e commit focado. O histórico Git explica contexto, mas não vale como autorização.

## DEC-007 — Perfis de equipe preservados, fora da página pública

- Data: `2026-09-16`
- Decisão: os sete perfis de equipe em `/sobre` permanecem no código e disponíveis apenas na prévia de revisão, mas não renderizam no site público.
- Motivo: restaurar a versão editorial atual de `/sobre` sem desfazer melhorias técnicas, estrutura, rota ou SEO acumulados desde a reintrodução dos perfis.
- Reativação: exige nova decisão explícita de publicação; a mudança deve ocorrer somente em `src/content/publicEvidence.ts` e ser validada nas prévias pública e de revisão.

## DEC-008 — Prévia editorial é a referência de evolução interna

- Data: `2026-09-16`
- Decisão: a versão identificada por “REVISÃO LOCAL — NÃO PUBLICADO”, aberta por `npm run dev` em `http://localhost:3101`, é a referência visual e editorial para continuidade do trabalho. `npm run dev:content-review` permanece como alias explícito.
- Regra: a prévia pública em `http://localhost:3212` representa somente o recorte que pode ser publicado com as evidências classificadas. Ausências nessa prévia não autorizam remover estrutura, perfis, integrações ou conteúdo preservado.
- Limite: essa decisão não publica automaticamente nenhum item pendente. A faixa de revisão deve permanecer visível enquanto houver conteúdo não aprovado.
