# Ativação de mensuração no GTM

O aplicativo envia eventos para uma única `dataLayer` e não deve carregar snippets de GA4, Meta, Pinterest ou LinkedIn diretamente.

## Pré-requisitos

- Acesso de publicação ao contêiner `GTM-NNL7DMP`.
- Acesso de administrador ou analista a GA4, Meta Events Manager, Pinterest Business e LinkedIn Campaign Manager.
- Domínio `tag08.com.br` verificado onde cada plataforma exigir.

## Tags e consentimento

1. Remova tags Universal Analytics e qualquer GA4 ou pixel instalado fora do GTM.
2. Configure Consent Mode v2: `analytics_storage` para GA4; `ad_storage`, `ad_user_data` e `ad_personalization` para publicidade.
3. Faça GA4 depender de analytics. Faça Meta Pixel, Pinterest Tag e LinkedIn Insight Tag dependerem de marketing.
4. Não habilite enhanced conversions nem envie campos de formulário pelo navegador: a aplicação bloqueia nome, empresa, e-mail, telefone, WhatsApp e mensagem.

## Eventos de conversão

| Evento | Regra | Destino |
| --- | --- | --- |
| `generate_lead` | Formulário enviado ou enfileirado | GA4 e pixels, com consentimento aplicável |
| `contact_whatsapp` | Clique em `wa.me` | GA4 e pixels, com consentimento aplicável |
| `contact_phone` | Clique em `tel:` | GA4 e pixels, com consentimento aplicável |
| `contact_email` | Clique em `mailto:` | GA4 e pixels, com consentimento aplicável |

Configure esses quatro eventos como conversões. `page_view`, `cta_click`, `form_start`, `form_submit`, `content_video` e `simulator_interaction` servem para diagnóstico, não como conversões por padrão.

## Publicação segura

1. Crie uma versão nomeada no workspace do GTM e teste em Preview/Tag Assistant.
2. Valide uma sessão sem consentimento, analytics somente e analytics + marketing.
3. Verifique GA4 DebugView, Meta Test Events, Pinterest Tag Helper e LinkedIn Campaign Manager.
4. Publique somente após não haver `page_view` duplicado e mantenha a versão anterior para rollback.
