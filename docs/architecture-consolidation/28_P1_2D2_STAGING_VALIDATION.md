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
