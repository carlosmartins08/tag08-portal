# P1.2D — Contact → Operação/CRM Delivery

## Resultado

`POST /api/contact` agora confirma o envio somente depois de persistir `ContactLead` e, na mesma transação PostgreSQL, duas entregas independentes na outbox: ClickUp e Google Sheets. O worker permanece responsável pelas integrações assíncronas. A implementação reutiliza `IntegrationDelivery`; não foi criada fila nem fonte transacional paralela.

## Arquitetura antes e depois

**Antes — ATUAL observado:** `/contato` → `POST /api/contact` → validação Zod → `ContactLead` + uma entrega `GOOGLE_SHEETS` em transação → resposta `202`. O worker já processava ClickUp para talentos e onboarding, mas não encaminhava `contact_lead` e não possuía limite de tentativas automáticas.

**Depois:** `/contato` → validação de payload e chave idempotente → transação PostgreSQL (`ContactLead` + `IntegrationDelivery(CLICKUP)` + `IntegrationDelivery(GOOGLE_SHEETS)`) → `202 accepted` → worker entrega cada destino sem bloquear a resposta do formulário.

PostgreSQL segue como verdade transacional; ClickUp segue como CRM operacional downstream; Sheets segue como apoio/staging. Nenhuma chamada a serviço externo ocorre no handler HTTP.

## Contrato de submissão e idempotência

- `Idempotency-Key` passa a ser obrigatório para `POST /api/contact`, limitado a 1–128 caracteres opacos (`A-Z`, `a-z`, dígitos, `.`, `_`, `:`, `-`). Chave ausente/inválida retorna `400`; reutilização da mesma chave com payload diferente retorna `409` sem expor dados do payload.
- O formulário grava a tentativa na fila local antes do `fetch`, reutiliza a mesma chave/payload após reload e remove a entrada ao receber sucesso ou erro 4xx. Falha de rede/5xx deixa a tentativa para retry local. A fila local existente pode manter payload no navegador até a entrega, por até 30 dias; isso já era usado para falhas e agora também cobre a janela da requisição em curso.
- A chave identifica uma submissão, não uma pessoa: a restrição única existente em `ContactLead.idempotencyKey` deduplica retries; e-mail/telefone não são chaves. Uma nova intenção legítima com nova chave cria outro registro.
- Um replay com mesmo payload retorna o `leadId` já persistido e `replayed: true`, sem gerar novas entregas. A unicidade do banco também trata corridas concorrentes; payload diferente com a mesma chave é conflito.
- A persistência do registro e das duas entregas é atômica. A resposta `202` só é enviada depois do commit. Os estados/dados existentes de consentimento, locale, `source`, UTM e retenção de 12 meses foram preservados.

## Evento/outbox

O evento usa o `IntegrationDelivery.id` como Delivery ID, `aggregateType=contact_lead`, `aggregateId=ContactLead.id`, target, status/attempts/lease/timestamps e referência externa já previstos no modelo. O payload de Contact recebe envelope `version: 1`; o worker ainda aceita payloads crus de outbox existentes, sem migração ou quebra de entregas antigas. A projeção para integrações contém apenas nome, empresa, contato, intenção/frentes, orientação, mensagem, versão do consentimento, locale, `source` e UTM; não inclui honeypot, token ou o booleano de consentimento.

As chaves únicas das entregas são derivadas de aggregate e target (`contact_lead:<recordId>:clickup` e `contact_lead:<recordId>:google_sheets`). Não dependem de nome/e-mail.

## ClickUp — Pré-venda

- A entrega `contact_lead` resolve para `CLICKUP_PRE_SALES_LIST_ID`, configurado nos exemplos com o ID aprovado `900700475931`. Os IDs existentes de Talentos e Onboarding foram mantidos sem alteração.
- A tarefa tem nome determinístico `TAG08 Contact <recordId>` para localizar a tarefa em replay sem usar identidade humana como chave. A descrição legível leva nome, empresa, telefone, e-mail, intenção, frentes, necessidade de orientação, mensagem, origem, UTM, data, Record ID e Delivery ID.
- O `externalReference` da entrega guarda o ClickUp Task ID. Retry procura a tarefa pelo nome correlacionado antes de criar outra.
- `source`, incluindo valores como `contact-page:offer`, é preservado sem normalização.

## Google Sheets — staging operacional

- O ID configurado localmente e nos exemplos é o informado para `TAG08 - Operacao Staging`. A aba permanece `Leads`.
- O formato atual A:D foi mantido: Delivery ID, Record ID, criação e JSON do payload projetado. Não foi adicionada coluna nem redesenhada a planilha.
- Antes de append, o worker procura Delivery ID na coluna A; replay reutiliza a linha existente. A referência retornada (`Leads!A…:D…`) é persistida em `IntegrationDelivery.externalReference`.
- Não houve chamada para inspecionar a planilha real; portanto, a validação do schema externo continua pendente de staging controlado. A implementação não expandiu esse schema.

## Worker, retry e falhas

- ClickUp e Sheets continuam isolados por delivery, com lease, claim transacional e `FOR UPDATE SKIP LOCKED` existentes. Um destino pode falhar sem impedir o outro nem reverter o aceite interno.
- Chamadas HTTP possuem timeout de 15 segundos. HTTP `408`, `429`, `5xx` e falhas de rede são transitórias; usam backoff exponencial crescente, limitado a uma hora, por no máximo 8 tentativas automáticas.
- Erros de configuração, payload/versão inválidos, unsupported aggregate e respostas HTTP `4xx` exceto `408`/`429` são terminais para retry automático: ficam `FAILED`, com código sanitizado, `lastErrorAt` e nova tentativa distante. O endpoint interno de reprocessamento, protegido pelo token existente, permite reprocessamento deliberado e reinicia o contador.
- Ausência/invalidade de configuração deixa a entrega registrada como falha terminal observável, em vez de abortar o worker antes de classificar a delivery. Preflight continua bloqueando configuração incompleta antes de ativação/deploy.
- Logs registram IDs técnicos, destino, tipo, código e se o retry foi agendado/terminal; não serializam nome, e-mail, telefone, mensagem, token ou credenciais.

## Configuração e divergências observadas

- `.env` local tem integrações desabilitadas e o ID de planilha coincide com o destino aprovado. Não foi alterado nem exibido qualquer valor de credencial.
- Não havia `CLICKUP_PRE_SALES_LIST_ID` na configuração local nem nos exemplos antes desta missão; os exemplos agora declaram `900700475931`. O ambiente local permanece sem esse destino configurado e com integrações desativadas. Nenhuma credencial ou integração foi habilitada.
- `tools/preflight-integrations.mjs` e `tools/preflight-deploy.mjs` agora exigem o ID de Pré-venda numérico quando ClickUp está habilitado; os IDs das listas existentes não foram substituídos.

## Testes e validação

- Testes unitários com fake Prisma verificam atomicidade lógica, duas entregas, versionamento, replay, conflito de chave, novo contato com mesmo e-mail e ausência de campos desnecessários no payload externo.
- Testes de contrato cobrem chave idempotente, `source` contextual e múltiplas intenções.
- Teste da fila de browser verifica persistência do mesmo payload/chave e retry sem integração externa.
- Testes puros do worker cobrem mapeamento de listas, conteúdo/correlação de tarefa, payload retrocompatível, referência Sheets, classificação de erros, limite de tentativas e sanitização de logs.
- `npm run test:contracts`: PASS; `npm test`: PASS; `npx tsc --noEmit`: PASS; `npm run lint`: PASS (incluindo `prisma generate`, sem migration); `npm run continuity:check`: PASS; `npm run build`: PASS.
- `npm run test:browser -- tests/e2e/contact-experience.spec.ts`: PASS, 11/11 em servidor local isolado; a suíte intercepta `/api/contact` e bloqueia hosts externos.
- Não foram executados migrations, workers, PostgreSQL, ClickUp, Google Sheets nem chamadas externas. O teste de outbox existente modifica banco local e não foi usado; não há banco isolado controlado indicado para esta missão.
- A primeira execução restrita de `npm run test:contracts` encontrou `spawn EPERM`; repetição no ambiente autorizado passou integralmente. Um fixture de teste foi corrigido para enviar o contrato real do endpoint (payload raiz), sem alteração de produção por esse achado.

## Arquivos desta unidade

- `.env.example`, `.env.staging.example`
- `package.json`
- `server/integrationDelivery.mjs`, `server/integrationWorker.mjs`
- `server/submissionContracts.ts`, `server/submissionStore.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/internal/integrations/reprocess/route.ts`
- `src/features/site/pages/Contato.tsx`, `src/lib/formQueue.ts`
- `tools/preflight-deploy.mjs`, `tools/preflight-integrations.mjs`
- `tests/contactPersistence.test.ts`, `tests/formQueue.test.ts`, `tests/integrationDelivery.test.mjs`, `tests/submissionContracts.test.ts`
- `docs/architecture-consolidation/27_P1_2D_CONTACT_CRM_DELIVERY.md`

## Deliberadamente não alterado

Sem alterações em Prisma schema/migrations, IDs existentes de listas comerciais, listas de Vendas/Onboarding/Talentos, rotas públicas/canonical/sitemap, UI do router/intenção da P1.2C (exceto persistir a tentativa durante o request), ClickUp/Sheets reais, CRM síncrono, onboarding/magic link, retenção ou regras comerciais.

## Riscos e gaps restantes

1. **Integração real não validada:** o ambiente atual mantém integrações desativadas; a variável local do ID Pré-venda ainda deve ser fornecida no staging controlado, junto das credenciais próprias.
2. **Google Sheets:** o formato A:D foi preservado por compatibilidade com o worker existente, mas a estrutura real da aba precisa de validação controlada antes de ativação.
3. **Operação:** scheduler do worker e alertas/owner para falhas terminais permanecem fora da evidência local; `FAILED` é observável e reprocessável, mas política de escalonamento permanece operacional.
4. **Fila do navegador:** payload de contato pode residir no localStorage durante tentativa/retry, limitado pelo mecanismo existente de 30 dias; rever na política de privacidade/retention client-side caso necessário.
5. **Testes de integração com banco:** a transação real/unique constraint concorrente e atualização de `externalReference` devem ser verificadas em banco sintético de staging antes do release.

## Próximo gate

Executar gates de teste, TypeScript, lint, continuidade e build em ambiente autorizado. Depois, com credenciais exclusivas de staging, validar sinteticamente `ContactLead → duas deliveries → ClickUp Pré-venda → Sheets Leads`, IDs de correlação, replay e retry. Não habilitar produção nem iniciar onboarding nesta unidade.
