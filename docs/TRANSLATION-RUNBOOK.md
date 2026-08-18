# Tradução automática local

PT-BR é a fonte de conteúdo. EN e ES são artefatos de publicação gerados pelo serviço privado LibreTranslate; o navegador nunca recebe URL, token ou acesso ao serviço.

## Operação

1. Inicie o serviço local com `docker compose up -d translation`.
2. Para gerar catálogos no host, use `TRANSLATION_SERVICE_URL=http://127.0.0.1:5001 npm run i18n:sync`.
3. Para publicar, o pipeline deve executar `npm run release:i18n` antes de criar a imagem.

`release:i18n` falha se o serviço estiver indisponível, se faltar PT/EN/ES, se qualquer chave divergir ou se placeholders e URLs forem alterados. Com `TRANSLATIONS_AUTOPUBLISH=true`, o `prebuild` executa a mesma verificação e recusa artefatos desatualizados.

## Produção

- O LibreTranslate deve ficar em rede privada e sem porta pública.
- Configure `TRANSLATION_SERVICE_URL`, `TRANSLATION_SERVICE_TOKEN` e `TRANSLATION_ENGINE_VERSION` somente no ambiente de publicação.
- A imagem anterior é o rollback: ela contém os catálogos correspondentes ao seu conteúdo PT.
- Acompanhe `npm run i18n:health`, os logs `i18n_catalog_generated` e `i18n_sync_failed`.

## Regra editorial

Avaliações e conteúdo de terceiros traduzidos exibem a indicação de tradução automática e mantêm o original acessível. Se o serviço estiver indisponível durante uma consulta ao conteúdo externo ao vivo, o original é mantido; uma publicação de conteúdo próprio, porém, é bloqueada.
