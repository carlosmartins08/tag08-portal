# P1.2E — Onboarding Seguro com Magic Link

Data: 2026-10-20
Base: `p2-home-cases-consolidation` em `5e7f2a85c316db8fe28af4ff2800520a6b75c921`
Estado: implementação local não commitada; migration não aplicada; nenhum acesso externo executado.

## Decisões aprovadas e escopo

- Emissão exclusivamente por CLI administrativo server-side, após confirmação comercial. Não existe endpoint nem formulário público de emissão; não se usa `INTERNAL_API_TOKEN`; não há envio de e-mail nesta unidade.
- O CLI exige operador declarado, referência comercial e motivo, registra esses valores e o resultado. A identidade do operador é autodeclarada, não autenticada individualmente pela aplicação. O link bruto é mostrado uma vez no stdout; a execução precisa ocorrer em terminal controlado, sem transcript, gravação de CI ou redirecionamento.
- Token aleatório opaco de 32 bytes (256 bits), codificado em Base64URL, SHA-256 persistido, uso único e validade de 24 horas.
- Sessão opaca com hash persistido, cookie `HttpOnly; SameSite=Lax; Path=/`, `Secure` quando o request/proxy indica HTTPS, validade absoluta de 8 horas, sem renovação deslizante.
- Revogar uma jornada invalida links e sessões. Reemissão invalida links anteriores; uma jornada já explicitamente revogada não pode ser reemitida por este comando.
- Sem conta, senha, login social ou segundo fator. A retomada após expiração requer reemissão administrativa.

## Arquitetura implementada

`confirmação comercial → operador executa CLI autorizado → jornada + link → hash no banco → entrega manual → fragmento de URL → resgate server-side → consumo único + sessão → redirect sem token → progresso server-side → submissão autenticada`

O magic link usa `#access_token=...`, que não é enviado ao servidor no primeiro GET. O cliente remove o fragmento da entrada de histórico antes de fazer POST same-origin para `/api/onboarding/access/redeem`; em sucesso há navegação de substituição para `/cliente/onboarding`. A página dedicada é dinâmica, `noindex`, canonical fixo e `private, no-store`, com `Referrer-Policy: no-referrer`. O catch-all estático público exclui essa rota.

`/api/onboarding/progress` só lê/salva draft associado à jornada da sessão. `/api/onboarding` exige origem same-origin, cookie e sessão ativa; a jornada e a sessão são revalidadas dentro da transação de submissão. O cliente não escolhe o onboarding por ID. A submissão continua criando o registro e outbox existentes na mesma transação. O servidor força `submissionContext.submittedBy=client` e não aceita a confirmação de autorização de operador enviada pelo navegador.

## Persistência e migration

Migration versionada: `prisma/migrations/202610200001_onboarding_magic_link/migration.sql`. **Não foi aplicada.** Acrescenta:

- `onboarding_journeys`: referência comercial, estado, draft JSON, conclusão, revogação e timestamps;
- `onboarding_magic_links`: `token_hash` único, jornada, operador/referência, emissão, validade, uso e revogação;
- `onboarding_sessions`: `token_hash` único, jornada, criação, validade, revogação e expiração;
- `onboarding_audit_events`: evento, ator declarado, referência/motivo, resultado e instante;
- `onboarding_submissions.journey_id` opcional e único, com FK para a jornada.

Índices cobrem estado/atualização de jornada, jornada/expiração de links e sessões, e jornada/evento de auditoria. FKs de credenciais/sessões removem em cascata com a jornada; auditoria e submissão preservam vínculo nulo quando a jornada é removida. Retenção dos dados de onboarding, hashes expirados, sessões e auditoria continua sem prazo jurídico aprovado; somente os TTL técnicos de 24h/8h foram implementados. A retenção já existente de 12 meses para submissões não foi alterada.

## Lifecycle, autorização e controles

| Superfície | Contrato |
|---|---|
| Emissão | `tools/onboarding-access.ts create`; cria jornada e credencial na mesma transação. Exige `operator`, `commercial-reference`, `reason`, `origin`, `DATABASE_URL` e `ONBOARDING_ADMIN_ENV=local|staging`; recusa `NODE_ENV=production`. |
| Reemissão | `reissue` invalida links ativos anteriores e emite novo link. Jornada inexistente, não ativa, com referência incompatível ou revogada é recusada. |
| Revogação | `revoke` grava `accessRevokedAt`, revoga todos os links e sessões ativos e cria eventos de auditoria na mesma transação. |
| Resgate | Formato validado antes de hash; token é consumido condicionalmente uma única vez; sessão é criada na mesma transação. Erros de link são externamente neutros (`access_unavailable`). |
| Sessão | Cookie não é guardado em `localStorage`; cada leitura/escrita valida hash, expiração, revogação e estado da jornada no servidor. Logout revoga a sessão e remove cookie. |
| CSRF | Mutations exigem `Origin` e host/protocolo same-origin e rejeitam `Sec-Fetch-Site: cross-site`; SameSite=Lax é defesa adicional, não a única. Cabeçalhos forwarded precisam ser sobrescritos por proxy confiável. |
| Rate limit | Resgate limitado a 20 tentativas por endereço/IP por janela de 60s, em memória do processo. Não é distribuído; `X-Real-IP`/`X-Forwarded-For` precisam vir de ingresso confiável. Emissão CLI não é endpoint remoto e não possui rate limiter próprio. |
| Logs | Eventos usam IDs/status/códigos técnicos. Tokens, cookies e payload privado não são registrados. CLI alerta que o link em stdout não deve ser capturado. |

## Progresso e browser

Drafts são allowlistados, limitados a 64 KiB e persistidos no PostgreSQL por `journeyId`; leitura/escrita derivam da sessão. O formulário espera a carga do draft antes de renderizar dados privados, tenta salvar com debounce e mostra erro se não conseguir. A submissão usa chave de idempotência em memória da página; o estado `COMPLETED` impede uma segunda submissão nova para a mesma jornada. Não há mais escrita/leitura da fila client-side de onboarding no código ativo, nem analytics do fluxo ou conteúdo privado em URL do WhatsApp.

A chave legada `tag08_onboarding_queue` não é apagada automaticamente: pode conter submissões anteriores pendentes e removê-la silenciosamente destruiria dados. Os payloads eventualmente remanescentes em navegadores precisam de política específica de privacidade/limpeza. O localStorage não é fonte de verdade do novo fluxo.

## Threat review

| Risco | Mitigação aplicada | Residual / teste ou gate |
|---|---|---|
| Força bruta/guessing | 256 bits de entropia, formato estrito, hash, rate limit de resgate | Rate limit por processo e confiança em proxy; validar configuração do proxy antes de expor. |
| Replay/uso múltiplo | `usedAt` condicional e transação Serializable | Fake Prisma não prova locking/concorrência no PostgreSQL; teste isolado ainda necessário. |
| Vazamento de token | Fragmento URL, remoção imediata, POST no corpo, no-referrer, sem analytics/log | Link em stdout pode ser capturado por terminal/CI; uso manual controlado é obrigatório. |
| Fixation/roubo de sessão | Novo segredo aleatório no resgate, hash no DB, cookie HttpOnly/SameSite e TTL absoluto | Confirmar `Secure` e proxy real no ambiente autorizado; não há validação DB/browser autenticada ainda. |
| CSRF | Origin/Host + protocolo e Fetch Metadata; cookie Lax | Proxies devem sobrescrever `X-Forwarded-Proto`; validar implantação. |
| Enumeração | Estados de token/jornada respondem mensagem pública uniforme | Status interno de indisponibilidade pode variar por falha de serviço, sem revelar existência de contrato. |
| IDOR/acesso cruzado | Jornada derivada da sessão; checagem sessão↔jornada em cada API e submissão | Teste automatizado de integração sessão A→B requer PostgreSQL isolado; E2E atual cobre ausência de sessão. |
| Revogação concorrente com resgate/escrita | Revogação e resgate transacionais, APIs revalidam sessão/jornada | Concorrência e ordem real de transações ainda não comprovadas em PostgreSQL. |
| Banco de produção configurado por engano no CLI | CLI exige ambiente declarado local/staging e recusa `NODE_ENV=production` | **Não prova que `DATABASE_URL` não aponta para produção.** Nunca executar emissão até a origem/isolation da conexão ser verificada operacionalmente; sem allowlist de instância comprovada, este é blocker de ativação. |
| Identidade de operador falsa | Campos e motivo auditados | Identidade autodeclarada; acesso ao shell é a fronteira operacional aprovada, mas não há atribuição individual autenticada na aplicação. |
| Retenção excessiva | Expiração técnica e exclusão do draft após conclusão | Retenção de linhas expiradas, auditoria, dados concluídos e fila legada carece decisão de privacidade. |

## Testes e validações

Validações concluídas localmente:

- `npx tsx tests/onboardingAccess.test.ts` — passou: formato/entropia, hash sem valor puro persistido, TTL 24h/8h, cookies, CSRF, rate limit, allowlist de draft, emissão/reemissão/resgate único/expiração/revogação e reemissão recusada após revogação explícita.
- `npm test` — passou em execução autorizada fora da restrição que bloqueava `spawnSync git` (`EPERM` no sandbox).
- `npm run lint` — passou usando o schema-engine Prisma já presente localmente por `PRISMA_SCHEMA_ENGINE_BINARY`; não houve download nem migration.
- `npx prisma validate` — passou com o engine local; schema válido.
- `npx tsc --noEmit` — passou.
- `npm run continuity:check` — passou em execução autorizada fora da restrição de subprocessos; checkpoint reconhece o estado da missão.
- `git diff --check` — passou; somente avisos de conversão LF/CRLF do Git.
- `npm run build` — passou em execução autorizada; o relatório de rotas confirmou `/[locale]/cliente/onboarding` como dinâmica e APIs de onboarding como dinâmicas. `i18n:check` foi executado pelo prebuild e registrou autopublicação de traduções desabilitada.
- `npx playwright test tests/e2e/onboarding-flow.spec.ts` — 5/5 passaram na porta isolada `3217`, com tráfego externo bloqueado pelos testes.

O E2E caracteriza acesso sem sessão, APIs negadas, token inválido limpo, noindex/sitemap/canonical e layout 390/768/1440. Não há banco isolado disponível, então emissão/resgate válido, autosave autenticado, submissão e sessão A→B não podem ser provados end-to-end nesta execução. Os testes de serviço usam um fake que não simula rollback, isolamento ou concorrência do PostgreSQL. Nenhuma migration, integração externa, worker ou banco foi iniciado.

## Estado Git, riscos e próxima validação

No início: branch e upstream conforme base aprovada, HEAD `5e7f2a85c316db8fe28af4ff2800520a6b75c921`, ahead/behind `0/0`, worktree limpo. A implementação está agora em alterações locais não staged. Nenhum commit ou push foi feito.

Riscos/blockers antes da primeira emissão ou declaração de prontidão operacional:

1. Provar o isolamento do `DATABASE_URL` sem revelar credenciais e executar a migration apenas num banco local/teste autorizado.
2. Testar transações/replay/revogação concorrentes e a API autenticada real contra PostgreSQL isolado.
3. Rodar browser E2E do magic link válido, retomada, expiração e acesso cruzado com dados sintéticos.
4. Confirmar proxy confiável, cabeçalhos de IP/protocolo, cookie Secure, captura segura do stdout do CLI e monitoramento operacional.
5. Definir owner e prazos de retenção/limpeza para dados e auditoria; decidir tratamento dos payloads legados de localStorage.

Nenhum segredo foi criado ou copiado. Não houve ativação de staging/produção, submissão real, envio externo ou início de onboarding por cliente. A implementação não deve ser usada operacionalmente até os blockers acima serem fechados. Como o fluxo autenticado real e a migration ainda não foram validados num banco isolado, a condição “todos os gates passam” não foi satisfeita: nenhum commit foi criado. Push permanece proibido nesta missão.

## P1.2E.1 — REAL DATABASE SECURITY VALIDATION

Data: 2026-10-20. Classificação: `PARTIAL`. Esta seção complementa o histórico acima; não o substitui. A validação foi feita sobre as alterações P1.2E locais não commitadas, preservadas integralmente.

### Baseline e ambiente isolado

- Git inicial/final: branch `p2-home-cases-consolidation`; HEAD `5e7f2a85c316db8fe28af4ff2800520a6b75c921`; upstream `origin/p2-home-cases-consolidation`; ahead/behind `0/0`; sem alterações staged. O diff da P1.2E já existia no início.
- Não havia serviço/processo PostgreSQL local, `psql` host nem listener em 5432/5433. O Docker Desktop respondia ao contexto `desktop-linux`, mas o acesso inicial ao daemon foi negado.
- Com autorização para o Docker, foi criado somente o container efêmero `8a3dd0d2a8cc117e13af2646680c5c8bf99e07bdf5746bb38653933484b1bcd2`, imagem `postgres:16-alpine`, label de QA, database `tag08_onboarding_qa`, usuário sintético `tag08_qa`, porta dinâmica `127.0.0.1:59930` e `tmpfs` em `/var/lib/postgresql/data` (1 GB). `docker inspect` confirmou mounts persistentes vazios (`[]`); não houve volume Docker anexado nem leitura/uso de `DATABASE_URL` pré-existente. A identidade foi confirmada dentro do container por `current_database()`/`current_user`.
- A build standalone local foi servida temporariamente em `127.0.0.1:3221`, com `DATABASE_URL` deste banco definida somente no processo. Nenhum worker ou integração foi iniciado. O browser abortou qualquer host externo e não observou requisições externas.
- Ao fim, o servidor local foi encerrado e o container desta missão foi parado; por `--rm` e storage `tmpfs`, o banco sintético foi descartado. Não se tocou em containers ou no volume `site26_tag08_tag08_postgres_data`.

### Migration, schema e integridade

- `prisma migrate deploy` aplicou com sucesso as três migrations versionadas: `202607160001_init`, `202607190001_outbox_processing_lease` e `202610200001_onboarding_magic_link`. `prisma migrate status` retornou “Database schema is up to date”. Nenhuma migration foi aplicada fora do container efêmero.
- No catálogo PostgreSQL foram confirmadas as cinco tabelas relacionadas (`onboarding_journeys`, `onboarding_magic_links`, `onboarding_sessions`, `onboarding_audit_events`, `onboarding_submissions`), quatro FKs, índices de lookup/unique e as constraints de hash/token, sessão, idempotência e `journey_id`. FKs de magic link/sessão usam cascade; auditoria/submissão usam set-null.
- `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code` detectou deriva de tipos `DateTime` e defaults `updated_at` em modelos existentes e novos. O diff também aponta para tabelas da migration base; as migrations SQL usam `TIMESTAMPTZ`, enquanto os campos Prisma não declaram tipo nativo, e `@updatedAt` não declara o default SQL existente. Isso é uma incompatibilidade de representação schema↔migrations, não falha ao aplicar as migrations nem prova de corrupção dos dados. O serviço conseguiu persistir/ler os registros sintéticos, mas a deriva impede declarar o gate de schema sem ressalvas. Nenhum schema/migration foi corrigido nesta missão.

### Resultados reais com PostgreSQL e dados sintéticos

O harness temporário foi removido após o uso. Todos os registros foram artificiais e o DB efêmero foi descartado.

| Contrato | Resultado observado |
|---|---|
| Token opaco/entropia/hash | 32 bytes aleatórios (256 bits); banco continha somente SHA-256, nunca o token puro. |
| Validade | As 25 linhas de magic link observadas tinham TTL exato de 24h. |
| Resgate/replay | Resgate válido criou uma sessão; replay foi recusado. Dois resgates concorrentes produziram exatamente um vencedor e uma sessão; o outro request foi rejeitado pelo banco/isolamento serializável. |
| Sessão | 15 das 16 linhas observadas tinham exatamente 8h; a linha restante foi deliberadamente encurtada para testar expiração. Não houve extensão durante leitura/retomada. Sessão expirada foi negada e marcada. |
| Reemissão sequencial | O link anterior foi revogado e falhou; o novo link foi aceito. |
| Reemissão concorrente | **FALHA:** duas reemissões simultâneas concluíram e deixaram dois links ainda ativos para a mesma jornada. O catálogo confirmou um grupo com múltiplos links ativos. |
| Revogação | Revogar uma jornada invalidou magic link e sessão já emitida. |
| Autorização/IDOR | Sem sessão, leitura e submissão retornaram 401. Sessão A enviando `journeyId` de B no save continuou gravando apenas em A; B permaneceu sem draft. |
| Progresso/retomada | Draft allowlisted foi persistido no PostgreSQL e relido após reload/browser refresh. |
| Submissão | POST autenticado retornou 202; persistiu uma submissão associada à jornada da sessão e duas deliveries outbox. Replay com mesma chave retornou o mesmo ID, sem duplicar submissão/deliveries. |
| Rollback | Trigger PostgreSQL temporário provocou falha após início da submissão; a transação reverteu submissão, deliveries e mudança de estado da jornada. Trigger/função foram removidos antes do descarte do DB. |
| CSRF | Mutação com Origin externo foi recusada. |
| Constraints/FKs | Migration criou e PostgreSQL aceitou os vínculos/uniques esperados nos caminhos exercitados. |

Os contadores finais do banco descartável foram 25 links (todos TTL 24h), 16 sessões (15 TTL exatos de 8h), 1 submissão sintética, 2 outbox deliveries de onboarding e 68 eventos de auditoria. Não se iniciou worker; deliveries permaneceram apenas no banco descartável.

### Browser QA autenticado

Build standalone existente, browser headless e dados sintéticos foram usados nas larguras 390, 768 e 1440 px. Acesso direto sem sessão mostrou estado neutro e não exibiu o wizard privado. Link válido criou sessão, limpou o fragmento/token da barra de endereço, permitiu leitura/salvamento server-side e retomada após refresh. Foram verificadas revogação em 768 px, expiração em 390 px e replay recusado em 1440 px. Não foi detectado overflow horizontal nas três larguras; nenhuma requisição externa foi permitida/observada.

**Limite:** o teste salvou/consultou progresso via fetch executado no contexto do browser autenticado; não completou todo o wizard por interação de campos, nem fez submissão completa pela UI. A submissão API autenticada foi exercitada separadamente contra o PostgreSQL real descartável. O fluxo completo por interação visual permanece pendente.

### Threat findings — evidência → causa → impacto → mitigação → critério de aceite

| Severidade | Evidência → causa → impacto | Mitigação recomendada → aceite |
|---|---|---|
| Alta / blocker operacional | `OnboardingRouteClient.tsx` envia o token para redeem automaticamente no `useEffect`. O browser QA abriu o link sem qualquer clique e autenticou a sessão. Um scanner de e-mail que executa JavaScript pode consumir o link antes do cliente. | Interstitial e ação explícita do cliente antes do POST. Aceite: abrir/renderizar/pré-visualizar não consome; ação afirmativa resgata; replay continua recusado. |
| Alta / blocker de concorrência | `reissueOnboardingMagicLink` invalida links ativos e cria outro em transação sem serialização/invariante exclusiva por jornada. Teste PostgreSQL simultâneo deixou dois links válidos. | Serializar reemissão por lock/isolamento e/ou invariante DB adequada, preservando histórico. Aceite: N reemissões simultâneas deixam no máximo um link ativo e todos os anteriores falham no resgate. |
| Alta / operação CLI | `tools/onboarding-access.ts` escreve o bearer link no stdout e não comprova que execução é TTY local não gravado/fora de CI; captura de terminal pode persistir o token. Identidade do operador é declarada, não autenticada, conforme decisão aprovada. CLI não foi executada no teste. | Bloquear execução não interativa/CI e adotar procedimento/canal de entrega que não capture stdout. Aceite: token não aparece em logs/transcripts, banco ou telemetria; emissão continua explicitamente auditada como operador autodeclarado. |
| Alta antes de exposição | CSRF, `Secure` e rate-limit usam headers forwarded; rate-limit é Map por processo. Proxy não foi iniciado nesta validação. Headers não sobrescritos permitem spoof de origem/IP; múltiplas instâncias não compartilham limite. | Provar ingress que remove/sobrescreve headers e restringe hosts; antes de multi-instância, limiter compartilhado ou edge equivalente. Aceite: spoof de headers não contorna Origin/IP e limite aplica-se à topologia de produção. |
| Média / gate de schema | `migrate diff` mostrou diferenças temporais/default em modelos antigos e novos. Runtime passou nos caminhos exercitados, mas a representação Prisma/migration não converge. | Separar investigação/correção de schema drift com comparação contra baseline anterior; não alterar nesta missão. Aceite: diff da migration compatível com schema fica vazio, ou drift pré-existente é formalmente isolado e documentado com teste de datas/UTC. |

Outros controles comprovados por inspeção/testes: resposta neutra para token inválido/expirado/usado; secret de sessão opaco e hash no banco; cookie `HttpOnly; SameSite=Lax`; `no-store`/`noindex` e canonical fixo observados no app; token removido da URL antes da continuação; sem logs de PII/token nos cenários executados. Não há segunda fator, e-mail, ClickUp, Sheets, worker ou analytics no teste.

### Falhas, decisões e próximos gates

- **Defeitos encontrados — não corrigidos por escopo:** consumo automático por scanner de link; reemissão concorrente permite mais de um link ativo. Ambos requerem correção e regressão antes de usar/commit da unidade P1.2E.
- **Não executado:** CLI de emissão (risco de captura de stdout e ausência de prova operacional TTY); migração em qualquer DB persistente; testes em proxy/deploy real; integração externa; wizard completo/submissão via interação browser; autenticação individual do operador (não aprovada e deliberadamente ausente).
- **Pendências de segurança/operação:** guardrail verificável para impedir CLI em `DATABASE_URL` de produção; proteção de stdout; configuração confiável de proxy/headers; estratégia de rate limit multi-instância; retenção jurídica de dados/auditoria; política para a chave legada `tag08_onboarding_queue`.
- **Gates positivos:** migration `3/3`; migrations status atualizado; token/hash/TTL; resgate único concorrente; isolamento de jornada; progresso/retomada; submissão/outbox/idempotência; revogação/expiração; rollback; browser 390/768/1440. Sem integrações externas.
- **Estado Git:** somente a documentação 29 recebeu este adendo durante P1.2E.1. Os harnesses de teste temporários foram removidos. O diff de produto/schema/testes P1.2E que existia antes da missão permanece intacto, unstaged; nenhum commit ou push foi feito.

**Conclusão P1.2E.1: `PARTIAL`.** O isolamento e a migration foram comprovados em banco descartável e muitos contratos passaram em PostgreSQL real. A falha de reemissão concorrente, o risco de consumo por scanner e a deriva schema↔migrations impedem `PASS`. **P1.2E não está pronta para commit após revisão humana** até corrigir os dois blockers de segurança, fechar o gate de schema e repetir os testes correspondentes. Este relatório não autoriza implementação das correções, uso operacional ou ativação de qualquer ambiente persistente.

## P1.2E.2 — SECURITY BLOCKER REMEDIATION

Data: 2026-10-20. Classificação: `PARTIAL` para prontidão operacional; os dois blockers de implementação e o drift introduzido pela P1.2E foram corrigidos e validados em ambiente descartável. Este adendo preserva integralmente os resultados históricos anteriores.

### Baseline, agentes e isolamento

- Baseline: branch `p2-home-cases-consolidation`, HEAD `5e7f2a85c316db8fe28af4ff2800520a6b75c921`, upstream sincronizado, worktree com alterações locais P1.2E preexistentes e sem staging. Nenhuma alteração anterior foi descartada, movida para staging ou commitada.
- Skills consultadas: `skill-router` (roteamento; catálogo e baseline referenciados pela skill não existiam no diretório esperado), `project-continuity-governance-guardian`, `solution-architecture-guardian`, `data-architecture`, `api-contract-guardian`, `implementation-guardian`, `test-strategy` e `quality-guardian`. Revisões independentes, somente leitura: segurança de aplicação/autenticação e PostgreSQL/concorrência.
- Foi criado, com autorização explícita, apenas um container PostgreSQL 16 exclusivo: `postgres:16-alpine`, loopback `127.0.0.1`, porta dinâmica 50937, database/usuário sintéticos `tag08_p1_2e2_qa`/`tag08_qa`, armazenamento `tmpfs`, sem mount ou volume Docker. O container existente e `site26_tag08_tag08_postgres_data` não foram usados nem alterados. A URL de conexão foi definida somente no processo dos comandos de teste; nenhuma URL ou credencial preexistente foi lida.
- Aplicadas no container efêmero as três migrations presentes (`202607160001_init`, `202607190001_outbox_processing_lease`, `202610200001_onboarding_magic_link`); estado reportado pelo Prisma: schema atualizado. Nenhuma integração externa ou worker foi iniciado.

### Blocker 01 — reemissão concorrente

**Causa raiz:** reemissão revogava tokens ativos e criava outro sem serialização comum por jornada. Duas transações podiam ler a mesma condição e ambas concluir, deixando dois tokens resgatáveis; a opção Serializable isolada não protegia a invariante no fluxo implementado.

**Correção:** reemissão, resgate e revogação agora bloqueiam a linha pai de `onboarding_journeys` com `SELECT ... FOR UPDATE`. Após adquirir o lock, cada operação relê estado e horário atual dentro da transação. Isso serializa os três caminhos pela mesma jornada, preserva o histórico e mantém a atualização condicional de uso único. Não foi criada fila nem workflow paralelo.

**PostgreSQL real:** 2, 5 e 10 reemissões simultâneas concluíram sem falha não tratada e deixaram exatamente um token ativo/resgatável; somente um token da série pôde ser resgatado. Reemissão concorrente com resgate e com revogação foi exercitada; a revogação permaneceu autoritativa, removendo tokens e sessões ativos. A suíte também cobriu replay, TTL, expiração de link/sessão, revogação de sessão e rollback.

### Blocker 02 — consumo ao abrir o link

**Causa raiz:** `OnboardingRouteClient` fazia o POST de resgate em `useEffect`; scanners que abrem a URL e renderizam JavaScript podiam consumir o link sem ação do cliente.

**Correção:** o fragmento é removido do endereço imediatamente e o token permanece somente em memória. Abrir, renderizar, recarregar e carregar a página não fazem POST. Um botão explícito “Continuar para o onboarding” inicia o resgate; um guard em memória impede double-submit. Token inválido retorna mensagem pública neutra. Token no fragmento não é enviado ao servidor no GET inicial, não entra na query/canonical, não é persistido em storage e a página mantém `no-referrer`. Scanners que não simulam interação afirmativa não consomem o link; scanners que executem um clique real continuam sendo risco residual e não há alegação de proteção absoluta contra eles.

### Schema drift

- A comparação final do banco migrado com `prisma/schema.prisma` não apontou diferenças nas entidades/campos adicionados pela P1.2E: `onboarding_journeys`, `onboarding_magic_links`, `onboarding_sessions`, `onboarding_audit_events` e a nova relação `onboarding_submissions.journey_id`.
- O drift remanescente é legado e anterior à P1.2E: os modelos preexistentes `contact_leads`, `integration_deliveries`, `onboarding_submissions`, `retention_audits`, `simulator_config_versions` e `talent_applications` representam datas como `TIMESTAMP(3)` sem default em `updated_at`, enquanto a migration base as criou como `TIMESTAMPTZ` com defaults. As migrations do HEAD já continham essa representação SQL antes da P1.2E. Nenhuma tabela/campo novo de onboarding aparece no diff.
- **Não convergência global:** o schema inteiro ainda não está alinhado; permanece necessário planejar a resolução do drift legado antes de uma mudança futura que dependa de comparação/migration desse conjunto. Não se alteraram os modelos legados para esta missão.
- O único ajuste SQL do escopo da P1.2E foi manter `onboarding_journeys.updated_at` com `DEFAULT CURRENT_TIMESTAMP`, conforme `@default(now()) @updatedAt` no Prisma. Os 13 campos `DateTime` adicionados pelo onboarding especificam `@db.Timestamptz(6)`.

### Regressões com banco e browser

| Contrato | Resultado |
|---|---|
| Token de 256 bits, persistência somente do hash, TTL de link 24h e sessão absoluta 8h | PASS PostgreSQL 16 |
| Resgate válido, replay, expiração e sessão expirada | PASS PostgreSQL 16 |
| Reemissão serial e concorrente 2/5/10; resgate concorrente; revogação concorrente | PASS PostgreSQL 16 |
| Sessão revogada invalida sessão e links ativos da jornada | PASS PostgreSQL 16 |
| Submissão autenticada, uma linha, duas deliveries outbox e replay idempotente | PASS PostgreSQL 16 e browser |
| Rollback induzido por trigger sintético no evento de auditoria | PASS: submissão, deliveries e conclusão da jornada foram revertidas; trigger/função foram removidos |
| Sessão A tentando gravar com `journeyId` de B | PASS browser + PostgreSQL: a rota gravou apenas em A; B permaneceu sem draft |
| Sem sessão, acesso direto, APIs privadas, limpeza do fragmento, canonical/noindex e ausência de onboarding no sitemap | PASS browser |
| Layout/overflow da tela nos breakpoints 390/768/1440 | PASS browser |

Na primeira execução do cenário browser, o teste falhou porque usava uma chave sintética de idempotência fixa já usada numa execução anterior no mesmo banco: o conflito foi corretamente rejeitado. O harness passou a gerar chave única por execução e reutilizá-la apenas no par original/replay. Não foi necessário alterar a regra de produto por esse resultado.

### Gates executados

- `npm test`: PASS após repetição em ambiente autorizado; a primeira tentativa no sandbox falhou por `spawnSync git EPERM`, sem falha de teste de produto.
- `npm run lint`: PASS; o prelint gerou Prisma Client com o schema-engine local suportado por `PRISMA_SCHEMA_ENGINE_BINARY`, sem download.
- `npx tsc --noEmit`: PASS.
- `npm run continuity:check`: PASS após repetição autorizada; primeira tentativa no sandbox também foi bloqueada por `spawnSync git EPERM`.
- `npx prisma validate`: PASS.
- `npm run build`: PASS; build foi executado com `DATABASE_URL` do banco descartável, e `i18n:check` registrou autopublicação de traduções desabilitada.
- `npx tsx tests/onboardingAccess.postgres.integration.ts`: PASS no PostgreSQL 16 descartável.
- `npx playwright test tests/e2e/onboarding-flow.spec.ts`: PASS, 7/7; porta local 3227, host externo abortado pelos testes e banco PostgreSQL descartável.
- `git diff --check`: PASS, com avisos normais de conversão LF/CRLF.
- ClickUp, Sheets, deploy, produção e worker: não executados.

### Mudanças deste adendo e arquivos da remediação

Arquivos de produto/schema/teste alterados nesta unidade, além do diff local P1.2E já existente: `server/onboardingAccess.ts`, `server/submissionStore.ts`, `src/app/api/onboarding/route.ts`, `src/features/site/onboarding/OnboardingRouteClient.tsx`, `prisma/schema.prisma`, `prisma/migrations/202610200001_onboarding_magic_link/migration.sql`, `tests/e2e/onboarding-flow.spec.ts` e `tests/onboardingAccess.postgres.integration.ts`. O documento 29 recebeu este adendo. Nenhum arquivo foi staged, commitado ou enviado.

### Riscos operacionais remanescentes

| Evidência/risco | Classe | Condição de aceite/mitigação |
|---|---|---|
| CLI emite link no stdout e aceita operador autodeclarado | BLOCKER DE ATIVAÇÃO OPERACIONAL | Operar somente em shell autorizado com captura/entrega protegida; adicionar guardrail verificável de destino não produtivo antes de emissão operacional. A aplicação não autentica individualmente o operador. |
| `DATABASE_URL` produtivo poderia ser selecionado pela CLI se o ambiente for configurado incorretamente | BLOCKER DE ATIVAÇÃO OPERACIONAL | Impedir/validar explicitamente destino de produção no comando administrativo; esta missão não executou emissão via CLI. |
| Confiança em proxy/`X-Forwarded-For`/`X-Forwarded-Proto` e cookie Secure | BLOCKER DE DEPLOY | Antes de deploy, fixar proxy confiável e validar origem/protocolo no provedor real. |
| Rate limit em memória | BLOCKER DE DEPLOY para múltiplas instâncias; DÍVIDA CONTROLADA em instância única | Confirmar topologia ou adotar limite compartilhado antes de escalar horizontalmente. |
| Scanner que simula clique, retenção de sessões/auditoria/hashes expirados e fila legada em localStorage | DÍVIDA CONTROLADA | Testar scanner do provedor de e-mail e decidir retenção/privacidade; sem prazo legal inferido nesta unidade. |
| Drift de datas/defaults nos modelos legados | DÍVIDA CONTROLADA / gate de migration futura | ADR/migration de reconciliação separada; não declarar convergência global. |

### Resultado e estado Git

**Resultado técnico dos blockers: PASS. Resultado de prontidão para ativação: BLOCKED.** A execução não autoriza emissão operacional, deploy, produção ou envio ao cliente enquanto os blockers operacionais acima permanecerem.

O worktree continua na branch `p2-home-cases-consolidation`, HEAD `5e7f2a85c316db8fe28af4ff2800520a6b75c921`, sem staging e sem commit. O diff local de P1.2E foi preservado. O container descartável foi parado após a validação; `--rm` e tmpfs descartaram seus dados. Nenhum container existente, volume compartilhado, banco persistente, ClickUp ou Sheets foi tocado. P1.2E permanece aguardando revisão humana antes de qualquer commit.

## P1.2E.3 — FINAL SECURITY AND COMMIT READINESS

Data: 2026-10-21. Modo: `REVIEW / DECIDE / COMMIT READINESS`. Esta revisão não alterou código nem testes, não repetiu as suítes PostgreSQL/E2E já executadas na P1.2E.2 e não fez commit, push, deploy ou acesso a ambiente persistente. Os resultados da P1.2E.2 permanecem a evidência mais recente para o runtime e banco isolado; este adendo separa prontidão de versionamento, deploy e ativação operacional.

### Roteamento e revisões independentes

- Skill líder: `solution-architecture-guardian`, responsável por reconciliar os limites entre aplicação, API, dados e operação.
- Skills complementares: `project-continuity-governance-guardian` (baseline e preservação), `data-architecture` (schema/migration/concorrência), `api-contract-guardian` (superfícies HTTP), `quality-guardian` (validade e alcance das evidências) e `delivery-operations-guardian` (readiness independente de deploy/ativação).
- Especialista dedicado de Application Security/Authentication não estava disponível como skill no runtime. Para não alegar uma skill inexistente, foi feita revisão independente somente leitura de segurança da aplicação, CLI, token, sessão, proxy e rate limit. Também foram feitas revisões independentes de dados/concorrência e de readiness. `CATALOGO.md` e `_ecosystem/EVALUATION_BASELINE.md`, referenciados pelo `skill-router`, não estavam presentes no diretório esperado.

### Baseline Git e escopo revisado

- Branch: `p2-home-cases-consolidation`; HEAD: `5e7f2a85c316db8fe28af4ff2800520a6b75c921`; upstream: `origin/p2-home-cases-consolidation`; ahead/behind: `0/0`.
- Staging vazio. Foram encontrados 9 arquivos tracked modificados e 12 paths untracked (21 paths no conjunto), todos atribuíveis à P1.2E: configuração de headers e script de testes, schema e migration, CLI/helper, rotas/API, UI/draft, testes e este relatório. Nenhuma alteração de Contact → CRM ou artefato sem relação foi identificado. Não houve necessidade de separar ou descartar qualquer arquivo.
- Paths do conjunto: `next.config.ts`; `package.json`; `prisma/schema.prisma`; `prisma/migrations/202610200001_onboarding_magic_link/migration.sql`; `server/onboardingAccess.ts`; `server/submissionStore.ts`; `src/app/[locale]/[[...segments]]/page.tsx`; `src/app/[locale]/cliente/onboarding/page.tsx`; `src/app/api/onboarding/route.ts`; `src/app/api/onboarding/access/redeem/route.ts`; `src/app/api/onboarding/progress/route.ts`; `src/app/api/onboarding/session/route.ts`; `src/features/site/pages/ClienteOnboarding.tsx`; `src/features/site/onboarding/OnboardingRouteClient.tsx`; `src/lib/api/response.ts`; `src/lib/onboardingDraft.ts`; `tests/e2e/onboarding-flow.spec.ts`; `tests/onboardingAccess.postgres.integration.ts`; `tests/onboardingAccess.test.ts`; `tools/onboarding-access.ts`; `docs/architecture-consolidation/29_P1_2E_SECURE_ONBOARDING_MAGIC_LINK.md`.
- Nenhuma alteração de dependência foi identificada; `package.json` apenas registra o teste de contrato de onboarding no script existente. O novo endpoint de resgate é same-origin e não fornece emissão. A rota de onboarding permanece dinâmica/noindex, com canonical fixo, cache privado/no-store e fora do sitemap; não foram identificadas alterações em URLs públicas canônicas.

### Controles confirmados e limites da evidência

- A P1.2E.2 já validou, em PostgreSQL 16 descartável, migrations, hash/token de 256 bits, TTL de link de 24h e sessão absoluta de 8h, resgate único, replay, expiração, reemissão concorrente 2/5/10, competição resgate/reemissão/revogação, revogação de sessões, isolamento entre jornadas, progresso/retomada, submissão/outbox/idempotência e rollback. O E2E relevante passou 7/7; os gates gerais registrados na seção anterior passaram. Nenhum dado persistente ou integração externa foi usado.
- A reemissão, resgate e revogação serializam pela linha da jornada (`server/onboardingAccess.ts`, `lockOnboardingJourney`) e os testes reais anteriores comprovam a invariante no caminho de aplicação. Não existe constraint independente no banco que impeça um futuro escritor de contornar esses helpers; manter emissão centralizada é dívida controlada.
- A leitura de APIs privadas revalida sessão, jornada e revogação; o progresso e a submissão derivam a jornada da sessão, não de um ID confiado ao cliente. A UI não resgata no mount: o resgate exige ação afirmativa. Resposta para credencial inválida é neutra, o fragmento é removido antes do POST e não é persistido em storage.
- Não foi identificada rota HTTP de emissão. Sem token/sessão, `/cliente/onboarding` apresenta somente estado neutro e as APIs de progresso/submissão negam acesso. O endpoint público de resgate apenas aceita um token opaco de 256 bits, verifica same-origin, aplica limite por processo e consome o token uma vez; não há evidência de exploração remota sem obtenção prévia do bearer. Isso não torna segura uma execução indevida do CLI nem substitui a validação do proxy no deploy.
- O schema/migration novo da P1.2E foi comparado em banco descartável e não introduz drift novo. A divergência temporal/default nos modelos legados precede esta mudança e permanece dívida controlada, não uma afirmação de convergência total.
- Não se repetiram testes nesta revisão: não há evidência de alteração posterior à P1.2E.2. A revisão leu o diff acumulado, os testes e o relatório; os resultados executáveis permanecem atribuídos à execução anterior, não a esta revisão.

### Riscos classificados

| Risco/evidência | Classificação | Consequência e condição de aceite |
|---|---|---|
| CLI exige `NODE_ENV` não-production e `ONBOARDING_ADMIN_ENV=local|staging`, mas não valida a identidade/destino efetivo de `DATABASE_URL` (`tools/onboarding-access.ts`). | `BLOCKER DE ATIVAÇÃO OPERACIONAL` | O comando poderia atingir banco errado se executado com configuração equivocada. Antes de qualquer emissão, exigir destino verificado por procedimento/guardrail independente e operador em shell autorizado. |
| CLI exibe o magic link bearer no stdout (`tools/onboarding-access.ts`); o segredo precisa de entrega manual, mas stdout pode ser capturado por transcript, CI ou redirecionamento. | `BLOCKER DE ATIVAÇÃO OPERACIONAL` | Executar apenas em terminal controlado, com captura/transcript desabilitados; nunca executar via CI/redirecionamento e verificar entrega protegida. A captura segura ainda não é tecnicamente imposta pelo CLI. |
| O campo `operator` é declarado na chamada CLI e não corresponde a uma identidade autenticada individualmente pela aplicação, conforme limite explicitamente aprovado. | `DÍVIDA CONTROLADA` | O evento de auditoria registra uma declaração, não prova criptográfica da identidade. Preservar a fronteira de autorização no acesso ao shell e não apresentar esse campo como autenticação individual; reavaliar se a governança exigir atribuição autenticada. |
| `Host`, `X-Forwarded-Proto`, `X-Forwarded-For`/`X-Real-IP` são usados em validação de origem, determinação do cookie `Secure` e rate limit (`server/onboardingAccess.ts`). | `BLOCKER DE DEPLOY` | A topologia e a política de saneamento do proxy ainda não foram comprovadas. O ingresso deve sobrescrever headers forwarded e o deploy deve provar HTTPS/cookie `Secure`, origem e IP efetivos antes de exposição. |
| Rate limiter é um `Map` em memória por processo (`server/onboardingAccess.ts`). | `BLOCKER DE DEPLOY` enquanto topologia não comprovar instância única; dívida controlada apenas se essa condição for garantida | Em múltiplas instâncias os limites divergem. Provar topologia single-instance ou aprovar mecanismo compartilhado antes de escalar horizontalmente. |
| Retenção de auditoria, sessões expiradas, hashes expirados e possíveis payloads antigos em `tag08_onboarding_queue` não tem política final definida. | `DÍVIDA CONTROLADA` | Resolver política de privacidade/retention antes de acumular dados reais; a fila antiga não é apagada automaticamente para não destruir conteúdo existente. |
| Drift de tipo nativo/default em timestamps de modelos legados e ausência de constraint DB isolada para escritores que bypassarem os helpers. | `DÍVIDA CONTROLADA` | Não editar migrations históricas nesta unidade; manter todas as emissões no serviço centralizado e reconciliar drift legado em mudança específica antes de depender de convergência global. |

### Vereditos independentes

- **COMMIT READINESS: `READY`.** A mudança forma unidade P1.2E coerente; todos os 21 paths são parte necessária ou evidência/documentação desta unidade, sem arquivo residual estranho. A migration é aditiva, o drift novo foi resolvido e os blockers técnicos corrigidos passaram testes reais isolados. `READY` autoriza preparar versionamento local, não deploy nem uso do CLI. Não há alteração de código/teste nesta revisão.
- **DEPLOY READINESS: `BLOCKED`.** Falta provar a configuração real do proxy, saneamento de headers, HTTPS/cookie `Secure` e topologia do rate limit. Não fazer deploy/exposição da jornada até esses itens serem validados; a limitação não invalida a revisão do código nem os testes em loopback.
- **OPERATIONAL ACTIVATION: `BLOCKED`.** Não emitir ou entregar link para cliente: o CLI não comprova o destino real de `DATABASE_URL`, o operador não é autenticado individualmente e o bearer pode ser capturado em stdout. É necessária salvaguarda verificável de destino e procedimento de execução/entrega sem transcript ou CI.

### Estratégia de versionamento recomendada

Como `COMMIT READINESS = READY`, recomenda-se um único commit para a unidade indivisível, com a mensagem `feat: secure onboarding with magic link`. Fazer staging explícito dos 21 paths listados acima, incluindo esta atualização do relatório 29. Nenhum path tracked/untracked atual deve ser deixado de fora por ser “resíduo”; manter fora apenas caches/artefatos ignorados que não constem do diff. Não executar staging ou commit nesta missão.

Antes do futuro commit: conferir novamente branch/HEAD e `git status`; revisar `git diff` e `git diff --cached`; verificar lista exata staged; executar `git diff --cached --check`; confirmar ausência de segredo/arquivo local e manter os resultados de teste atribuídos à P1.2E.2. Não repetir PostgreSQL/E2E sem evidência de mudança posterior. Antes de deploy, executar gates da topologia alvo; antes de ativação, fechar os blockers operacionais desta seção.

**Próxima ação recomendada:** revisão humana final e, se aprovada, commit único da P1.2E. O veredito `READY` é somente para commit local. P1.2E continua bloqueada para deploy e para ativação operacional; não houve commit, push ou início de nova fase.

## P1.2E.7 — Hardening incremental do CLI administrativo

Adendo de 2026-10-21. A alteração cobre somente o CLI de administração, seus testes focados, o script de contratos e este registro. O estado preexistente de `next-env.d.ts` foi preservado e não pertence a esta missão.

### Correções aplicadas

- Emissão e reemissão agora exigem stdin e stdout conectados a TTY e recusam ambientes CI reconhecidos. A checagem ocorre antes da inicialização do cliente Prisma e é repetida imediatamente antes da escrita do link. Saída redirecionada/piped e execução não interativa falham fechadas com código neutro; a função de escrita não é chamada.
- O carregamento de dotenv foi movido para depois da recusa de CI/TTY: o teste subprocesso encontrou uma mensagem de dotenv em stdout antes do gate na primeira versão; após mover o gate, a recusa ocorre sem qualquer saída stdout.
- As operações administrativas exigem identidade esperada do destino: `ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME` e `ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER`. Esses pins são capturados do ambiente pai antes do carregamento de `.env`, não podem ser supridos pelo arquivo dotenv e não são aceitos como argumentos da CLI. Ausência, formato inválido, erro de leitura ou divergência interrompem a operação antes de create/reissue/revoke. Erros de consulta não são repassados ao terminal.
- A identidade observada consulta `current_database()` e `pg_control_system().system_identifier`; valores reais, URL, credenciais e identificadores não são impressos. A verificação preserva os helpers transacionais existentes, histórico, auditoria, TTL, uso único e locking.
- O novo teste de contrato está incluído em `test:contracts`. Não foi executada a CLI contra qualquer banco; o teste de processo usa CI e stdio não interativo com URL sintética `.invalid`, devendo ser recusado antes da conexão.

### Limites e evidência pendente

Os pins ainda não estão provisionados neste ambiente e nenhum destino PostgreSQL foi consultado. Portanto, não há prova operacional de isolamento nem autorização para executar emissão. Um administrador deve obter o nome do database e o `system_identifier` diretamente do PostgreSQL descartável/staging aprovado, validar por canal independente que a instância é dedicada, e provisionar ambos os pins fora de `.env` (por exemplo, environment controlado/secret manager). A permissão de leitura de `pg_control_system()` também precisa ser validada no destino; falha de privilégio bloqueia o CLI, não deve ser contornada.

O `system_identifier` identifica o cluster, não a origem/proveniência dos dados; clones físicos podem conservar o mesmo identificador. Em conjunto com `current_database()`, o pin reduz seleção acidental de destino, mas não prova ausência de dados copiados de produção. Essa proveniência e a gestão segura dos pins permanecem responsabilidade de infraestrutura e bloqueiam ativação operacional até validação humana. A identidade do operador continua autodeclarada, e um terminal interativo ainda pode ter gravação de sessão/transcript habilitada; a barreira TTY/CI não protege contra captura deliberada ou gravação local. Não há garantia de entrega protegida pelo CLI.

### Validação e vereditos

- Teste focado `tests/onboardingAccessCli.test.ts`: PASS, incluindo subprocesso com CI/stdin/stdout não interativos, stdout vazio, nenhuma conexão ao host `.invalid`, validação de pin ausente/inválido, correspondência/divergência de identidade e sanitização de falha de consulta.
- `tests/onboardingAccess.test.ts`: PASS (contratos existentes de token, sessão, revogação e draft).
- `npx tsc --noEmit`: PASS.
- `git diff --check`: PASS.
- Não foram repetidos PostgreSQL, migrations, E2E, build ou auditorias P1.2E.2/.3; esta missão não acessou banco nem infraestrutura externa.
- **Prontidão para commit local:** READY para staging explícito apenas de `tools/onboarding-access.ts`, `tests/onboardingAccessCli.test.ts`, `package.json` e deste adendo, sujeito à revisão humana final. `next-env.d.ts` é alteração preexistente e deve permanecer fora. Nenhum commit foi criado.
- **Prontidão para deploy:** BLOCKED — configuração efetiva de proxy/topologia e validação dos pins no ambiente alvo continuam pendentes.
- **Ativação operacional:** BLOCKED — pins confiáveis ainda não provisionados/verificados, proveniência do banco não comprovada, operador autodeclarado e risco de captura local do terminal permanecem.
