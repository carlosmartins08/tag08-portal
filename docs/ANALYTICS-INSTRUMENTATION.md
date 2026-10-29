# TAG08 — contrato de mensuração

Estado: contrato local atualizado em 2026-10-29; configurações de plataformas externas pendentes de validação administrativa.

## Fonte única e consentimento

- A aplicação carrega apenas o contêiner `GTM-NNL7DMP`; tags de GA4, Pinterest e LinkedIn não devem ser inseridas diretamente nos componentes.
- O GTM só é carregado após consentimento de desempenho ou marketing. `performance` controla `analytics_storage`; `marketing` controla `ad_storage`, `ad_user_data` e `ad_personalization`. Revogação atualiza o consentimento e interrompe novos eventos da aplicação. O primeiro `page_view` só entra na trava de deduplicação depois de haver consentimento, para que uma concessão imediata não o perca.
- Não enviar nome, e-mail, telefone, mensagem, conteúdo de formulários, tokens ou identificadores pessoais às plataformas.

## Semântica dos eventos da aplicação

| Etapa | Evento | Interpretação |
| --- | --- | --- |
| Interação | `cta_click`, `contact_whatsapp`, `contact_phone`, `contact_email` | Clique/abertura do canal; não comprova conversa ou conversão comercial. |
| Início | `form_start` | Usuário iniciou o formulário. |
| Progresso | `form_step` | Usuário avançou em uma etapa. |
| Conclusão | `form_submit` com `status=success` | API confirmou persistência no Google Sheets. |
| Pendente | `form_submit` com `status=queued` | Tentativa armazenada no navegador para retry; não é conclusão nem conversão. |
| Lead comercial | `generate_lead` | Somente Contato `new_project`, após persistência confirmada. |

Talentos, Diagnóstico, solicitações de clientes atuais e Parceria são jornadas próprias; não geram `generate_lead`. Não há evento de qualificação humana aprovado/implementado. Até existir regra operacional para essa qualificação, `generate_lead` significa novo pedido comercial persistido, não oportunidade aceita por vendas nem contratação. `form_submit` conserva seu papel para medir outras jornadas concluídas.

Parâmetros permitidos devem ser não identificáveis e úteis à leitura da jornada, como `form_name`, `form_surface`, `request_type`, `page_path`, `language`, `route_type`, `route_key`, `page_group` e métricas técnicas. A sanitização da aplicação remove chaves pessoais conhecidas.

## UTM

Usar `utm_source`, `utm_medium`, `utm_campaign` e, quando necessários, `utm_content` ou `utm_term`; manter valores em minúsculas, sem espaços (usar `_`) e sem dados pessoais. Convenção recomendada: `source=linkedin|pinterest|google`, `medium=organic_social|paid_social|organic_search|cpc`, `campaign=<objetivo>_<servico>_<periodo>`. Não inserir parâmetros em links até o responsável de mídia aprovar campanhas e nomenclaturas específicas.

## Estado por plataforma

| Plataforma | Evidência atual | Estado |
| --- | --- | --- |
| GA4 | A captura fornecida mostra uma propriedade existente e relatórios com atividade/eventos; o código possui tracking via GTM. Domínio do fluxo Web, origem dos eventos, conversões e ausência de duplicidade não foram confirmados. | Configuração externa pendente de validação. |
| GTM | O código referencia `GTM-NNL7DMP`; a identidade do contêiner e suas tags não foram inspecionadas no painel. | Não validado. Não publicar alterações. |
| Search Console | O Next.js suporta meta de verificação e gera `robots.txt`/`sitemap.xml`; não foi possível confirmar propriedade `sc-domain:tag08.com.br` nem envio/estado do sitemap no painel. | Implementação local presente; conta pendente. |
| Pinterest | Perfil institucional conhecido; nenhum ID de Pinterest Tag ou conta Business/Ads foi confirmado. | Pendente de acesso, ID e aprovação de marketing. |
| LinkedIn | Página empresarial conhecida; Campaign Manager e Partner ID não confirmados. | Pendente de acesso, ID e aprovação de marketing. |

## Homologação e rollback

1. Confirmar propriedade/contêiner/fluxo e permissões administrativas antes de editar.
2. Usar Preview do GTM, Tag Assistant e GA4 DebugView/Realtime para testar uma navegação consentida e uma sem consentimento; conferir `page_view` manual versus medição automática e evitar duplicidade.
3. Testar consentimento negado, apenas analítico, apenas marketing, completo e revogação. Confirmar que tags publicitárias ficam bloqueadas sem consentimento de marketing.
4. Verificar eventos do formulário: sucesso só após resposta de persistência confirmada; fila local não é conversão; nunca usar dados reais de contato.
5. Confirmar propriedade e sitemap no Search Console. Habilitar Pinterest/LinkedIn apenas após IDs oficiais e aprovações de finalidade/consentimento.
6. Publicação GTM e deploy dependem de aprovação específica. Em caso de regressão, reverter a versão do contêiner previamente publicada; a aplicação mantém um único `GTM_ID` configurado por ambiente.
