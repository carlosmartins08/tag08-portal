# Google Monitoring Guide

## Objetivo
- Usar GA4 para medir aquisição, intenção, leitura e conversão sem coletar dado sensível.
- Manter uma taxonomia curta e estável para o time conseguir ler os dados sem adivinhação.
- Evitar duplicidade de eventos no SPA e manter Search Console separado da camada analítica.

## Fonte de verdade
- Rotas e metadados: `src/config/routeRegistry.ts`
- Atualização de SEO e `page_view`: `src/App.tsx`
- Instrumentação de eventos: `src/lib/analytics.ts`
- Verificação Search Console por prefixo: `index.html`

## Variáveis de ambiente
- `VITE_GA4_ID`
- `VITE_GSC_VERIFICATION`

## Regras de coleta
- Não enviar nome, e-mail, telefone, CNPJ, mensagem ou qualquer outro dado pessoal/corporativo do formulário.
- Medir comportamento, não conteúdo bruto.
- Preferir parâmetros estáveis como `page_path`, `route_type`, `surface`, `status` e `step`.
- Cada evento deve existir por motivo de decisão, não por curiosidade.

## Eventos padrão
- `page_view`
- `cta_click`
- `outbound_click`
- `form_start`
- `form_step`
- `form_submit`
- `form_error`
- `scroll_depth`
- `engagement_time`
- `lead_action`

## Dimensões recomendadas no GA4
- `page_path`
- `page_title`
- `page_group`
- `route_key`
- `route_type`
- `language`
- `theme`
- `device_category`
- `cta_name`
- `cta_location`
- `cta_type`
- `form_name`
- `form_surface`
- `status`
- `step`
- `step_name`

## Conversões recomendadas
- `form_submit` com `status=success`
- `lead_action` para envio de contato
- `cta_click` para WhatsApp e contato principal
- `outbound_click` para redes oficiais e canais externos

## Funis que valem acompanhar
- Home -> Serviços -> Contato
- Home -> Serviço específico -> Contato
- Contato -> WhatsApp
- Cliente Onboarding -> Passo 1 -> Passo final -> Envio
- Insights -> CTA de serviço

## Públicos úteis
- Visitantes engajados: `engagement_time >= 30s`
- Leitores profundos: `scroll_depth >= 75`
- Intenção comercial: clique em `cta_click` ou `outbound_click`
- Lead qualificado: `form_submit` com sucesso
- Onboarding iniciado: `form_start` em onboarding

## Search Console
- Propriedade de domínio: verificação por DNS.
- Propriedade por prefixo de URL: tag HTML no `<head>`.
- O token em `VITE_GSC_VERIFICATION` só faz sentido para a verificação por tag HTML.

## Implementação atual
- `src/App.tsx` envia `page_view`, `scroll_depth` e `engagement_time`.
- `src/components/Header.tsx` envia `cta_click` para navegação e CTA principal.
- `src/components/WhatsAppButton.tsx` envia clique de saída para WhatsApp.
- `src/pages/Contato.tsx` envia início, erro e envio do formulário.
- `src/pages/ClienteOnboarding.tsx` envia início, etapa e submit do onboarding.

## Checklist de operação
1. Confirmar que `VITE_GA4_ID` usa o formato `G-...`.
2. Confirmar que a verificação do Search Console é por DNS ou por tag HTML, não as duas ao mesmo tempo sem necessidade.
3. Marcar como conversão no GA4 apenas os eventos que realmente representam valor para o negócio.
4. Revisar mensalmente quais eventos são acionados em volume e remover ruído.

## Critério de qualidade
- Um evento, um motivo.
- Um parâmetro, um significado.
- Sem PII.
- Sem duplicidade de `page_view`.
- Sem snippet espalhado por componente.
