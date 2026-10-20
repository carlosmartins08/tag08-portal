# P1.2D.2 — Validação Sintética de Staging

## Conclusão

**STAGING BLOCKED.** Nenhuma integração externa, execução de worker ou escrita de dados foi realizada. As evidências disponíveis não comprovam um ambiente de staging isolado nem autorização para testar nos destinos externos. A implementação publicada permanece sem alteração.

## Estado Git e escopo

- Branch: `p2-home-cases-consolidation`.
- HEAD: `018f31481a2ff50fd3d9697ffebfb95720782ed1`.
- Upstream: `origin/p2-home-cases-consolidation`, sincronizado (`ahead 0`, `behind 0`).
- Worktree inicial: limpo; staging vazio.
- A missão alterou somente este relatório. Nenhum código, configuração local, schema ou dado foi modificado.

## Pré-condições de isolamento

| Pré-condição | Evidência observada | Resultado |
| --- | --- | --- |
| Configuração específica de staging | `.env.staging` não existe. | Não comprovada |
| Integrações desativadas em produção | Não foi fornecido acesso/evidência do ambiente de produção. | Não comprovada nesta missão |
| Integrações locais inativas | `.env` declara `INTEGRATIONS_ENABLED=false`. | Confirmada apenas para a configuração local observada |
| PostgreSQL de staging isolado | `.env.local` contém configuração de banco, mas não comprova que o destino seja staging; nenhuma conexão foi tentada. | Não comprovada |
| Docker/serviços locais isolados | Contexto Docker `desktop-linux`; acesso à API Docker negado pelo ambiente. | Não disponível |
| ClickUp de staging autorizado | O ID aprovado de Pré-venda está documentado como `900700475931`, mas não há prova de que a lista seja um destino de teste autorizado e não produção. Nenhuma chamada foi feita. | Não comprovada |
| Google Sheets de staging autorizado | O ID fornecido está nos exemplos/configuração, mas não foi possível verificar o título real, a aba `Leads`, o schema nem a autorização de escrita sem acesso externo. Nenhuma chamada foi feita. | Não comprovada |
| Credenciais próprias de staging | Não foi possível distinguir com segurança credenciais de staging de credenciais de outro ambiente. Nenhuma credencial foi usada ou exposta. | Não comprovada |
| Dados sintéticos | Não foi enviado nenhum lead. | Não aplicável; nenhum dado criado |

Como faltam pré-condições de isolamento e autorização, a missão para antes de qualquer integração externa, conforme o gate definido.

## Contratos a validar quando houver staging isolado

### PostgreSQL

Não validado contra banco de staging. O código da P1.2D prevê persistência de `ContactLead` e criação atômica de duas `IntegrationDelivery` (`CLICKUP` e `GOOGLE_SHEETS`) na mesma transação, com chave idempotente única por submissão. Tabelas, constraints, versão implantada e concorrência real permanecem sem comprovação neste ambiente.

### Google Sheets

Não foi possível abrir a planilha nem confirmar que o título é `TAG08 - Operacao Staging`, que a aba `Leads` existe ou que suas colunas reais são compatíveis. O contrato esperado pelo código é A:D:

1. Delivery ID;
2. Record ID;
3. `createdAt`;
4. payload JSON.

Nenhuma linha foi escrita. A compatibilidade do schema externo permanece desconhecida; não houve adaptação ou expansão.

### ClickUp

O destino configurado no código é `CLICKUP_PRE_SALES_LIST_ID=900700475931`, indicado como `Pré-venda [CRM]`. Não foram verificadas existência, nome efetivo da lista, permissões da credencial ou natureza staging/produção. Nenhuma task foi criada ou consultada.

## Cenários

| Cenário | Resultado | Motivo |
| --- | --- | --- |
| A — Submissão sintética, banco e duas entregas | NÃO EXECUTADO | Sem PostgreSQL de staging comprovado |
| A — Worker, ClickUp e Sheets | NÃO EXECUTADO | Sem destinos externos comprovadamente isolados/autorizados; worker não iniciado |
| B — Replay HTTP | NÃO EXECUTADO | Exigiria banco e integrações de staging controlados |
| C — Mesma chave com payload diferente / 409 | NÃO EXECUTADO em staging | Cobertura automatizada local já existe; não substitui validação de staging |
| D — Mesmo e-mail, nova intenção | NÃO EXECUTADO em staging | Exigiria banco de staging controlado |
| E — Retry ClickUp | NÃO EXECUTADO | Não existe mecanismo seguro de falha transitória confirmado para o destino autorizado |
| F — Retry Sheets | NÃO EXECUTADO | Não existe mecanismo seguro de falha transitória confirmado para o destino autorizado |
| Falha permanente e reprocessamento | NÃO EXECUTADO | Exigiria worker, banco e endpoint de staging com autorização comprovada |
| Correlação completa de IDs | NÃO EXECUTADO | Nenhum registro sintético foi criado |
| Source `contact-page:offer` nos sistemas downstream | NÃO EXECUTADO | Nenhuma entrega externa realizada |
| Inspeção/redação de logs de execução real | NÃO EXECUTADO | Worker não foi iniciado |

Não há IDs de correlação a reportar porque nenhum registro foi criado.

## Falhas terminais e operação

O código deixa deliveries terminais em `FAILED` com código sanitizado, disponíveis para reprocessamento deliberado pelo endpoint interno existente. O ownership operacional, o responsável por observar essas falhas, o SLA de resposta e o canal/limiar de alerta ainda precisam ser definidos antes da ativação real. Esta missão não estabelece política operacional definitiva.

## Fila local do navegador

Não alterada. A fila existente pode reter a submissão localmente por até 30 dias, conforme o contrato documentado em `27_P1_2D_CONTACT_CRM_DELIVERY.md`. A revisão de privacidade e retenção client-side continua pendente.

## Pendências para retomar validação

1. Disponibilizar ambiente PostgreSQL de staging identificado e isolado, com schema/constraints implantados e autorização explícita para dados sintéticos.
2. Fornecer configuração de staging segura, incluindo `CLICKUP_PRE_SALES_LIST_ID` e credenciais próprias, sem reutilização presumida de produção.
3. Confirmar com leitura autorizada o nome, ambiente, aba e schema A:D da planilha, e autorização de escrita sintética.
4. Confirmar que a lista ClickUp ID `900700475931` é a lista correta de Pré-venda e está autorizada para teste.
5. Disponibilizar um mecanismo isolado de simulação de falha transitória para cada integração, sem afetar serviços compartilhados.
6. Definir owner, alerta e procedimento para falhas terminais.
7. Revisar política de retenção client-side da fila local.

Após satisfazer os gates, executar com identificadores sintéticos os cenários A–F e registrar a correlação `ContactLead ID ↔ ClickUp Delivery ID ↔ Sheets Delivery ID ↔ ClickUp Task ID ↔ Sheet range`, além dos resultados de replay, conflito, retry e recuperação.

## Produção e onboarding

Produção não foi acessada nem alterada; integrações locais permaneceram desativadas. Nenhuma integração externa ou worker foi executado. Onboarding e magic link não foram iniciados.

## P1.2D.3 — Staging Readiness

### Ambiente encontrado

- **Local:** .env existe; a flag de integração está explicitamente desativada. Há identificadores/credenciais locais, mas a origem e o ambiente dessas credenciais não foram comprovados; não foram usados nem seus valores registrados.
- **Staging local:** nem .env.staging nem .env.staging.local existem. Ambos os nomes são ignorados pelo Git via regra .env*; nenhum arquivo foi criado.
- **Railway:** não há CLI railway instalada nem configuração de projeto/staging identificada no workspace. Não foi possível inspecionar secrets ou serviços Railway.
- **PostgreSQL:** .env.local possui DATABASE_URL, mas sem evidência segura de host/instância e sem comprovação de que seja staging, não houve conexão. O schema versionado define ContactLead.idempotencyKey unique, IntegrationDelivery.idempotencyKey unique, externalReference e índices de status/agregado; isso descreve o schema esperado pelo código, não o schema implantado. Nenhuma migration foi executada.
- **ClickUp:** ID pretendido documentado é 900700475931; variável real CLICKUP_PRE_SALES_LIST_ID está ausente na configuração local observada. Não foram consultados lista, workspace ou permissões.
- **Google:** credencial existe na configuração local, mas ambiente/identidade/acesso não foram validados. O Sheet ID aprovado aparece na configuração local, porém título, aba, cabeçalhos e autorização não foram lidos.
- **Worker:** existe comando worker:integrations e serviço integration-worker no Compose local; este define integrações desativadas. Isso não comprova worker implantado/configurado em staging. O comando local usa .env, não um perfil staging demonstrado.
- **Scheduler:** nenhum scheduler do worker de integração foi identificado no repositório; o workflow cron encontrado é de performance, não entrega de integrações.
- **Observabilidade:** código registra delivery falha com IDs técnicos, target, aggregate type, código, retry agendado/terminal; há resumo de contagem de deliveries FAILED no store e endpoint interno protegido para reprocessamento. Não foi identificado owner, canal de alerta ou serviço de alertas de staging.
- **Docker:** contexto é desktop-linux, mas a API do Docker Desktop negou acesso (permission denied). Docker não é requisito para staging Railway/remoto; a indisponibilidade local não bloqueia por si só um ambiente externo, mas não há ambiente remoto comprovado.

### Preflights executados

| Preflight | Resultado | Interpretação |
| --- | --- | --- |
| node --env-file-if-exists=.env --env-file-if-exists=.env.local tools/preflight-integrations.mjs | Exit 0: integration_preflight_disabled | Integrações desligadas localmente; não valida credenciais, destinos ou conectividade de staging. |
| npm run preflight:deploy | Falhou: faltam DATABASE_URL, ALLOWED_ORIGINS, INTERNAL_API_TOKEN no ambiente carregado pelo preflight. | Configuração de deploy/staging incompleta; bloqueia o preflight de deploy. |
| Docker context show / ps -a | Contexto desktop-linux; API negou acesso. | Bloqueado por acesso do agente; nenhum container foi alterado. |

Nenhum preflight foi contornado, e nenhum script foi modificado.

### Variáveis e secrets

| Variável | Finalidade | Estado observado | Fonte esperada | Bloqueia teste? |
| --- | --- | --- | --- | --- |
| DATABASE_URL | PostgreSQL do app/worker | Presente em .env.local, destino não comprovado; ausente do ambiente usado por preflight:deploy | Secret do serviço/app/worker de staging no provedor, ou arquivo local ignorado com endpoint staging identificado | **Sim** |
| INTEGRATIONS_ENABLED | Gate global das integrações | false em .env; não há configuração staging | Secret/env do worker de staging, inicialmente desligado até autorização | **Sim** para worker controlado |
| CLICKUP_ENABLED | Habilitar ClickUp | Não definido localmente | Env de staging autorizado | **Sim** |
| CLICKUP_API_TOKEN | Credencial ClickUp | Presente em .env, identidade/ambiente não comprovados; não usado | Secret próprio de staging, emitido/autorizado para o workspace/lista de teste | **Sim** |
| CLICKUP_PRE_SALES_LIST_ID | Destino ClickUp de Contact | Ausente localmente; ID pretendido conhecido | Configuração/secret de staging após confirmação de destino e autorização | **Sim** |
| GOOGLE_SHEETS_ENABLED | Habilitar Sheets | Não definido localmente | Env de staging autorizado | **Sim** |
| GOOGLE_SERVICE_ACCOUNT_JSON | Credencial Google Sheets | Presente em .env, identidade/ambiente não comprovados; não usado | Secret próprio de staging com acesso mínimo à planilha autorizada | **Sim** |
| GOOGLE_SHEETS_SPREADSHEET_ID | Planilha operacional | Presente em .env; ID pretendido conhecido, título/schema não verificados | Configuração de staging aprovada após validação de leitura | **Sim** |
| INTERNAL_API_TOKEN | Proteção de endpoints internos/reprocessamento | Ausente no preflight de deploy local | Secret de staging distinto, no app que hospeda a API | **Sim** para validar reprocessamento |
| ALLOWED_ORIGINS | Origens web permitidas no deploy | Ausente no preflight de deploy | Configuração do app de staging | **Sim** para preflight/deploy; não substitui autorização externa |
| INTEGRATION_PROCESSING_LEASE_SECONDS | Lease do worker | Não definido; código tem default | Env do worker, se houver valor operacional específico | Não para provisionar; confirmar valor no staging antes do teste |
| INTEGRATION_DELIVERY_ID | Restringir execução manual a uma delivery | Não definido | Filtro opcional em execução controlada do worker | Não para app; recomendável para execução manual isolada |
| RETENTION_AGGREGATE_ID | Escopo de retenção controlada | Não definido | Não pertence a esta validação de integração | Não aplicável |

**Mecanismo recomendado, ainda não comprovado:** secrets separados no provedor Railway para app/API e worker de staging. O CLI Railway está ausente e não há vínculo de projeto demonstrado. Como alternativa local, .env.staging.local é ignorado pelo Git, mas não foi criado porque nenhum conjunto autorizado de valores/destino foi fornecido. Não copiar secrets de .env para staging.

### Readiness matrix

| Componente | Isolado? | Acesso comprovado? | Escrita autorizada? | Pronto para teste sintético? |
| --- | --- | --- | --- | --- |
| PostgreSQL | Não comprovado | Não | Não | Não |
| ClickUp | Não comprovado; pode ser lista operacional | Não | Não | Não |
| Google Sheets | Nome indica staging, mas ambiente não verificado | Não | Não | Não |
| Worker | Compose local está desabilitado; worker remoto não identificado | Não | Não | Não |
| Secrets/env | .env.staging* ausente; Railway não inspecionável neste ambiente | Não | Não | Não |
| Observabilidade | Mecanismos de estado/log no código existem; owner/alerta ausentes | Parcial para mecanismo local, não em staging | N/A | Não |

### Política e gaps do teste sintético

Ainda não há decisão/autorização suficiente sobre: banco que receberia o lead; lista ClickUp e planilha exatas; identidade que autorizou escrita; marcação sintética; permanência dos registros como evidência; owner de dados; e como impedir contaminação de métricas comerciais. **Nenhuma escrita está autorizada por inferência.**

Para falhas terminais, o código deixa estado FAILED no banco e permite reprocessamento pelo endpoint interno existente com autenticação; os logs são estruturados. Falta definir quem recebe/acompanha a falha e qual alerta/SLA deve ser usado. Isso é gap operacional bloqueante para um teste que inclua recuperação e para ativação, não impede a preparação documental.

A retenção client-side de até 30 dias em localStorage continua pendência de privacidade/retention, separada da prontidão técnica e sem risco direto comprovado para provisionar staging.

### Conclusão de readiness

**STAGING BLOCKED.** Há evidência do código esperado e de uma configuração local com integrações desligadas, mas não de PostgreSQL, worker ou destinos externos isolados e autorizados. Para avançar, é necessário que o responsável forneça/identifique um ambiente de staging e autorize explicitamente os destinos e a escrita sintética, além de disponibilizar secrets próprios nesse ambiente. Até lá, não criar lead, não iniciar worker, não consultar serviços com credenciais locais e não habilitar integrações.
