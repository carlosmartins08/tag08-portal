# Playbook operacional - Onboarding TAG08

## Objetivo

Recuperar fila local, restaurar envio e documentar incidente de onboarding.

## Acionamentos

- Falha persistente do endpoint.
- Picos de rejeicoes acima de 5% em `GET /api/onboarding/metrics`.
- Usuarios sem confirmacao de envio no final do fluxo.

## Acoes de primeiro socorro

1. Abrir o console do projeto e validar:
   - `GET /api/onboarding/metrics`
   - `totalFailure` e `failureRate`
2. Validar se existe fila local no navegador do usuario:
   - chave `tag08_onboarding_queue`
   - status `pending`, `retrying` ou `error`
3. Confirmar eventos de conectividade:
   - status da rede no browser
   - retorno `navigator.onLine`
4. Confirmar que a stack local esta ativa com `npm run dev`.
5. Confirmar que `DATABASE_URL` esta configurada no ambiente que recebe os envios.

## Recuperacao de fila

- O fluxo de envio automatico roda em:
  - evento `online`
  - intervalo `ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS`
- Se a entrada ficou em `error`, manter para revisao ate limpeza por idade ou retries.
- Se necessario, reduzir temporariamente `ONBOARDING_QUEUE_MAX_AGE_DAYS` para limpeza controlada.

## Limpeza

- A fila local remove automaticamente:
  - itens com `attempts` acima do limite
  - itens com idade acima do periodo definido
- Envio novo deve sempre atualizar o `localStorage` com o ultimo estado da fila.

## Pauta de pos-incidente

- Hora do inicio
- Numero de entradas afetadas
- Raiz do problema: validacao, infra ou endpoint
- Correcao aplicada
- Passo para rollback
- Data e hora da recuperacao e da proxima verificacao
