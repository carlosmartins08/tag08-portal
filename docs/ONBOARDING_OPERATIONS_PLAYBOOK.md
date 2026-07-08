# Playbook operacional - Onboarding TAG08

## Objetivo

Recuperar fila local, restaurar envio e documentar incidente de onboarding.

## Acionamentos

- Falha persistente do endpoint.
- Picos de rejeições acima de 5% em `GET /api/onboarding/metrics`.
- Usuários sem confirmação de envio no final do fluxo.

## Ações de primeiro socorro

1. Abrir o console do projeto e validar:
   - `GET /api/onboarding/metrics`
   - `totalFailure` e `failureRate`
2. Validar se existe fila local no navegador do usuário:
   - chave `tag08_onboarding_queue`
   - status `pending`, `retrying` ou `error`
3. Confirmar eventos de conectividade:
   - status da rede no browser
   - retorno `navigator.onLine`
4. Confirmar `VITE_USE_MOCK_ONBOARDING`:
   - local deve usar mock apenas em dev
   - produção deve apontar para `http://127.0.0.1:3001` no proxy

## Recuperação de fila

- O fluxo de envio automático roda em:
  - evento `online`
  - intervalo `ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS`
- Se a entrada ficou em `error`, manter para revisão até limpeza por idade/retries.
- Se necessário, reduzir temporariamente `ONBOARDING_QUEUE_MAX_AGE_DAYS` para limpeza controlada.

## Limpeza

- A fila local remove automaticamente:
  - itens com `attempts` acima do limite
  - itens com idade acima do período definido
- Envio novo deve sempre atualizar o `localStorage` com o último estado da fila.

## Pauta de pós-incidente

- Hora do início
- Número de entradas afetadas
- Raiz do problema: validação, infra ou endpoint
- Correções aplicadas
- Passo para rollback
- Data e hora da recuperação e da próxima verificação
