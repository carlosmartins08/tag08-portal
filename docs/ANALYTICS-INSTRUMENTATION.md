# TAG08 — contrato local de mensuração

Estado: implementação local alinhada ao contrato em 2026-11-24. O contêiner GTM e os destinos externos ainda precisam de homologação administrativa; esta documentação não afirma entrega confirmada ao GA4.

## Fonte única e consentimento

- O código carrega somente o contêiner `GTM-NNL7DMP`; tags de GA4 e mídia devem ser governadas no GTM, sem snippets duplicados nos componentes.
- Antes de carregar o GTM, a dataLayer recebe Consent Mode com `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` e `personalization_storage` negados; `functionality_storage` e `security_storage` ficam concedidos para operação essencial.
- A preferência `performance` controla `analytics_storage`. A preferência `marketing` controla `ad_storage`, `ad_user_data` e `ad_personalization`. Cada mudança e revogação atualiza as categorias; a biblioteca só carrega após consentimento de desempenho ou marketing.
- Sem consentimento, eventos da aplicação não são enfileirados nem enviados. Uma concessão posterior não recria retroativamente o `page_view` da página já aberta.

## Contrato dos eventos da aplicação

| Etapa | Evento | Regra |
| --- | --- | --- |
| Navegação | `page_view` | Uma vez por rota efetivamente visitada depois do consentimento. Mudanças internas contam; re-renderizações na mesma rota são deduplicadas; voltar a uma rota anterior conta novamente. |
| Interação | `cta_click` | Registra nome, local e tipo do CTA; não envia URL de destino, caminho externo, consulta ou fragmento. |
| Abertura de canal | `contact_whatsapp`, `contact_phone`, `contact_email` | Registra clique/abertura de canal reconhecido. Não afirma que mensagem foi enviada, recebida ou respondida. WhatsApp só é reconhecido em HTTPS nos hosts exatos `wa.me` e `api.whatsapp.com`. |
| Início | `form_start` | O visitante iniciou um formulário. |
| Progresso | `form_step` | O visitante avançou em uma etapa real. |
| Tentativa/conclusão | `form_submit` | `success` somente depois de a API confirmar persistência; `queued` representa retry local e não é conclusão. Também permite observar outras jornadas concluídas. |
| Lead comercial | `generate_lead` | Exclusivamente Contato `new_project` com persistência confirmada. Não significa qualificação humana, proposta ou contratação. A mesma chave local de submissão evita confirmação duplicada, sem ser enviada à plataforma. |

Talentos, Diagnóstico, clientes atuais e Parceria não geram `generate_lead`. Nenhum nome, e-mail, telefone, WhatsApp, mensagem, conteúdo do formulário, identificador de submissão ou credencial pode ser enviado às plataformas.

### Parâmetros por evento

| Evento | Parâmetros locais aprovados |
| --- | --- |
| `page_view` | `page_location`, `page_path`, `page_title`, `page_referrer` (origem apenas), `language`, `route_type`, `route_key`, `page_group`, `is_service_page`, `device_category` |
| `cta_click` | `cta_name`, `cta_location`, `cta_type`, `language`, `page_path` |
| `contact_whatsapp`, `contact_phone`, `contact_email` | `contact_surface`, `contact_label`, `language` |
| `lead_action` | `action`, `lead_surface`, `lead_label`, `language`, `status`, `page_path`, `step`, `step_name`, `total_steps` |
| `form_start`, `form_submit`, `form_error`, `form_step` | `form_name`, `form_surface`, `status` quando aplicável, `error_count` quando aplicável, `request_type` apenas no Contato, `language`, `page_path`, `step`, `step_name`, `total_steps` |
| `generate_lead` | `form_name`, `form_surface`, `delivery_status`, `language`, `page_path` |
| `scroll_depth`, `engagement_time` | `page_path`, `page_title`, `depth_percent` ou `engaged_seconds`, `language`, `route_type` |
| `web_vital` | `metric_name`, `metric_value`, `metric_rating`, `page_path`, `language` |
| `content_video` | `video_action`, `video_id`, `video_source`, `video_surface`, `page_path` |
| `simulator_interaction` | `action`, `simulator_id`, `simulator_version`, `page_path` |

Chaves desconhecidas e chaves pessoais são descartadas pela aplicação. A chave de idempotência usada para deduplicar uma confirmação fica somente em memória e nunca integra o evento.

## Parâmetros e URLs

- A camada local mantém uma allowlist de parâmetros de eventos e descarta chaves desconhecidas, chaves pessoais e valores com padrão identificável de e-mail/telefone.
- `page_location` conserva apenas caminho e UTMs aprovadas (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) com valores curtos formados por letras, números, `_` ou `-`; remove outros parâmetros e fragmentos. `page_referrer` é reduzido à origem.
- Links de WhatsApp, telefone e e-mail nunca enviam número, caminho de destino, endereço, texto pré-preenchido ou query string.
- A proteção da aplicação não controla parâmetros automáticos adicionados por tags no GTM. Na configuração externa, impedir que URLs completas, campos de formulário e identificadores pessoais sejam encaminhados.

UTMs devem usar valores não pessoais, minúsculos e sem espaços. Não adicionar UTMs a links até que campanhas e nomenclaturas sejam aprovadas.

## Contrato de configuração do GTM e GA4

1. Confirmar administrativamente que o contêiner corresponde ao ambiente TAG08 e que o destino GA4 é a propriedade aprovada. Não criar propriedade, fluxo ou tag duplicada.
2. Configurar os defaults de Consent Mode antes de tags que leem consentimento. GA4 exige `analytics_storage`; tags publicitárias exigem as categorias de marketing correspondentes. Testar revogação e não conceder marketing a partir de consentimento analítico.
3. Tratar o evento da dataLayer `page_view` como fonte de navegação da aplicação. Configurar a Google tag para não emitir visualização automática inicial e desativar a detecção automática de mudanças de histórico se ela criar duplicidade. Validar no Preview/Tag Assistant e GA4 DebugView.
4. Mapear eventos da dataLayer para GA4 sem ampliar parâmetros. Marcar `generate_lead` como evento principal somente depois de confirmar que a tag dispara exclusivamente para o evento e para a semântica descritos acima.
5. Não publicar tags de Pinterest/LinkedIn, públicos, Enhanced Match ou conversões publicitárias sem IDs oficiais, consentimento de marketing e aprovação específica.

## Estado por plataforma

| Plataforma | Situação comprovada localmente | Estado externo |
| --- | --- | --- |
| GTM | Código referencia um único contêiner e aplica consentimento antes da carga. | Identidade do contêiner, tags e triggers não validados nesta missão. |
| GA4 | A aplicação publica eventos locais conforme este contrato após consentimento. | Propriedade, fluxo, configuração de page_view, eventos principais e recebimento precisam de Preview/DebugView. |
| Search Console | Sitemap, robots e suporte a token de verificação existem no código. | Propriedade e estado de sitemap não fazem parte da validação de Analytics. |
| Pinterest | Nenhum identificador foi confirmado pelo código/configuração revisada. | Pendente de conta/ID oficial e aprovação. |
| LinkedIn | Nenhum Partner ID/Campaign Manager foi confirmado pela configuração revisada. | Pendente de conta/ID oficial e aprovação. |

## Homologação e rollback

- Validar sem consentimento, apenas desempenho, apenas marketing, consentimento completo e revogação. Conferir dataLayer, comandos de consentimento e requisições de rede sem dados pessoais.
- Em Preview/Tag Assistant e GA4 DebugView, comparar eventos da aplicação com tags efetivamente disparadas; conferir uma visualização inicial, navegação interna, retorno por histórico e submissões sintéticas locais.
- Distinguir evento criado na dataLayer, tag executada, requisição tentada e evento recebido pelo GA4. Testes locais não comprovam as três últimas etapas.
- Publicação de GTM e deploy requerem autorização própria. Em regressão do contêiner publicado, voltar à versão GTM previamente aprovada; na aplicação, reverter o commit local correspondente pela governança normal.
