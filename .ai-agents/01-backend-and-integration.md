# AGENTE 01 — backend-and-integration

Objetivo:
- Tirar o projeto da dependência de APIs simuladas no cliente para os fluxos críticos de envio.

Escopo:
- `src/pages/ClienteOnboarding.tsx` (fluxo `/api/onboarding`)
- Arquivos de configuração de ambiente (`.env.example`, `README.md` se necessário)
- Ajustar chamadas com fallback explícito e rastreável

Tarefas:
1. Implementar/definir endpoint de backend mínimo para `/api/onboarding`.
2. Atualizar a chamada de submit para registrar sucesso/erro em estado e nunca mascarar falha real.
3. Definir política de fallback local explícita (ex.: `tag08_onboarding_queue`) quando API indisponível.
4. Registrar no handoff onde os dados são persistidos e como recuperar.

Entregável:
- Arquivos alterados com comentários de decisão arquitetural.
- Evidência de payload esperado (schema simplificado) para integração externa.

Critérios de aceite:
- Formulário não perde submissão quando a API não está disponível.
- Mensagem de sucesso só é exibida após recebimento confirmado da API ou fallback seguro documentado.
- Log de erro (console + estado UI) não fica vazio.

