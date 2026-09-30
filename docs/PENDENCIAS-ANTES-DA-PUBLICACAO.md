# Pendencias antes da publicacao

Atualizado em: `2026-09-30`

Este e o documento unico para acompanhar o que ainda precisa acontecer antes de publicar a TAG08. Um item so pode ser marcado como concluido quando houver evidencia verificavel, comando executado ou decisao registrada.

## Estado atual

- Referencia local: `http://localhost:3101`.
- Build, TypeScript, rotas, SEO, headers, imagens, consentimento, formularios, WhatsApp, persistencia e filas validados.
- `npm run content:status`: zero itens `pending` no escopo aprovado.
- Sheets e ClickUp tiveram preflight e smoke test real concluídos; os registros sinteticos foram removidos.
- As integracoes continuam desativadas no ambiente local para evitar envio acidental de leads.

### Validacao local desta rodada

- `npm run build`: concluido com sucesso, incluindo `prisma generate`, TypeScript, paginas estaticas e standalone.
- `npm run verify:routes`: concluido com sucesso no servidor standalone em `127.0.0.1:3210`.
- `npm run lint`: concluido com sucesso (`tsc --noEmit`).
- `npx tsc --noEmit --pretty false`: concluido com sucesso.
- `npm test`: concluido com sucesso, incluindo testes de rotas e contratos.
- `npx playwright test tests/e2e/critical-pages.spec.ts`: concluido com 89 testes aprovados (incluindo navegacao, movimento e imagem).
- Auditoria visual de superfícies: tokens remapeados e validados em 390, 768 e 1440 px pela suíte crítica; inspeção visual manual final em navegador continua recomendada antes do corte.
- Piloto de acento na Home: concluído e validado; replicação nas demais rotas depende de inspeção visual e não deve ser feita por substituição em massa.
- Superfície clara na primeira frente de Serviços: implementada e validada pela suíte crítica; demais frentes permanecem dark até nova decisão visual.

## Pendencias bloqueantes

### 1. Definir o destino de staging e producao

- [ ] Escolher a infraestrutura final: Docker/VPS ou plataforma gerenciada.
- [ ] Registrar dominio de staging e dominio de producao.
- [ ] Confirmar DNS, SSL, proxy reverso e porta publica.
- [ ] Definir quem executa o deploy e quem aprova o corte.

**Criterio de encerramento:** existe uma URL de staging acessivel e o procedimento de deploy/rollback esta definido.

### 2. Preencher o ambiente de staging

Variaveis obrigatorias detectadas pelo `npm run preflight:deploy -- --staging`:

- [ ] `DATABASE_URL` apontando para PostgreSQL remoto de staging.
- [ ] `ALLOWED_ORIGINS` com a origem HTTPS correta.
- [ ] `INTERNAL_API_TOKEN` gerado e armazenado no gerenciador de secrets.
- [ ] `DATABASE_SSL=true` quando exigido pelo provedor.
- [ ] `BASE_URL` apontando para a URL real de staging.
- [ ] `TRANSLATIONS_AUTOPUBLISH` e variaveis de traducao definidas se o staging reproduzir o gate de producao.

**Criterio de encerramento:** `npm run preflight:deploy -- --staging` retorna `deploy_preflight_passed`.

### 3. Decidir a ativacao de Sheets e ClickUp

Estado local atual:

```env
INTEGRATIONS_ENABLED=false
GOOGLE_SHEETS_ENABLED=false
CLICKUP_ENABLED=false
```

- [ ] Decidir se Sheets e ClickUp entram ativos no primeiro deploy.
- [ ] Se sim, cadastrar os secrets no ambiente de staging sem coloca-los no Git.
- [ ] Ativar somente no staging primeiro.
- [ ] Executar um lead sintetico controlado.
- [ ] Confirmar entrega no Sheets e na lista correta do ClickUp.
- [ ] Remover o registro sintetico e confirmar a limpeza.
- [ ] Promover as mesmas flags para producao somente apos a aprovacao do staging.

**Criterio de encerramento:** preflight, entrega sintetica e limpeza aprovados no ambiente que sera publicado.

### 4. Separar e registrar o commit de release

- [ ] Revisar os arquivos rastreados modificados.
- [ ] Remover do índice Git os relatórios históricos de `.lighthouseci/` (`git rm -r --cached .lighthouseci`), preservando-os apenas como artefatos locais/CI.
- [ ] Classificar os arquivos nao rastreados: incluir, separar ou remover.
- [ ] Confirmar que nenhuma alteracao local de outra missao entrou no release.
- [ ] Atualizar `docs/PROJECT_STATE.md` e `docs/CHANGELOG.md` no mesmo commit quando houver mudanca de comportamento.
- [ ] Criar commit focado e executar o CI correspondente.

**Criterio de encerramento:** arvore de trabalho limpa, commit identificavel e CI verde.

## Pendencias de validacao apos staging

- [ ] `npm run verify:routes` usando `BASE_URL` de staging.
- [ ] `npm run verify:health` usando `BASE_URL` de staging.
- [ ] `npm run verify:seo` usando `BASE_URL` de staging.
- [ ] `npm run verify:security-headers` usando `BASE_URL` de staging.
- [ ] Fluxo de contato com consentimento e resposta esperada.
- [ ] Fluxo de WhatsApp em contato e paginas de servico.
- [ ] Teste mobile em 390 px e desktop em 1440 px.
- [ ] Confirmacao de sitemap, robots, canonical e ausencia de conteudo de revisao.
- [ ] Confirmacao de logs, healthcheck, backup e rollback.

**Criterio de encerramento:** todas as verificacoes retornam sucesso na URL de staging, sem erro funcional ou de seguranca.

## Itens nao bloqueantes

Estes itens ficam registrados para nao serem esquecidos, mas nao impedem a publicacao se os fallbacks atuais forem mantidos:

- [ ] Configurar a fonte oficial de avaliacoes Google Business, caso a estrategia comercial exija avaliacoes ao vivo.
- [ ] Revisar documentos historicos que ainda descrevem evidencias ja aprovadas como pendentes.
- [ ] Reavaliar cases e logos fora das rotas autorizadas somente com nova evidencia ou decisao comercial.

## Ordem final de execucao

1. Definir destino, dominio e responsaveis.
2. Preencher secrets de staging.
3. Executar o preflight de deploy.
4. Publicar staging e executar todos os checks desta lista.
5. Aprovar ou corrigir o que falhar.
6. Decidir e testar as integracoes.
7. Separar o commit de release e validar CI.
8. Promover o mesmo artefato para producao.
9. Repetir healthcheck, rotas, consentimento, formulario, WhatsApp e integracoes em producao.
10. Marcar este documento como encerrado e registrar data, commit e URL publicada.

## Definicao de pronto

A publicacao esta pronta quando:

- o preflight de deploy passa;
- o staging passa todos os checks;
- o commit de release esta identificado e o CI esta verde;
- as integracoes estao explicitamente ativas ou explicitamente adiadas;
- existe rollback conhecido;
- nenhuma pendencia bloqueante permanece aberta neste documento.
