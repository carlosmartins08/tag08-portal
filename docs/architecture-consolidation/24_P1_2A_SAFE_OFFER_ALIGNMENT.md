# P1.2A — Alinhamento seguro de ofertas

**Estado:** implementação local concluída; revisão humana pendente. Nenhum push foi feito.

## Decisões autorizadoras

Esta execução aplica somente as decisões explícitas da missão P1.2A: manter URLs e canonicals atuais; reposicionar Hospedagem e Manutenção como continuidade tecnológica; adotar publicamente “Programa de Parceria” e “Assessoria Estratégica de Negócios”; descrever Tecnologia com Websites, E-commerce/Unidade Digital e Soluções Digitais Específicas; remover o onboarding de links públicos genéricos, mantendo seu fluxo e rota; e usar comunicação condicional para Sebraetec.

## Matriz canônica de famílias e ofertas

| Família aprovada | Oferta/capacidade | Rota atual | Papel público | CTA/jornada atual |
|---|---|---|---|---|
| Gestão de Redes Sociais / Presença Digital | Planos Start, Base e Performance (sem preço público) | `/servicos/gestao-de-redes-sociais` | Oferta de presença e gestão recorrente | Página da família → contato/qualificação |
| Produção Audiovisual | Produção de conteúdo audiovisual | `/servicos/producao-audiovisual` | Oferta de produção | Página da família → contato |
| Tecnologia | Websites | `/servicos/desenvolvimento-web` | Oferta de estrutura web | Página de Tecnologia → diagnóstico/contato |
| Tecnologia | E-commerce / Unidade Digital | `/servicos/desenvolvimento-web` | Oferta sob decisão de prontidão operacional; sem LP própria por padrão | Diagnóstico → modelagem → validação → estruturação → desenvolvimento |
| Tecnologia | Soluções Digitais Específicas | `/servicos/desenvolvimento-web` | Oferta tecnológica conforme problema e escopo | Diagnóstico/contato → definição do escopo |
| Tecnologia | Continuidade tecnológica / Hospedagem e Manutenção | `/hospedagem-manutencao-sites` | Serviço adjacente de continuidade Web após publicação, não uma sétima família | Página atual → conversa sobre hospedagem/manutenção; termos comerciais seguem pendentes |
| Assessoria Estratégica / Negócios | Assessoria Estratégica de Negócios | `/servicos/assessoria-marketing-digital-estrategico` | Direção estratégica, posicionamento, prioridades, canais, planejamento e decisões | Leitura inicial/contato → conversa consultiva |
| Branding / Posicionamento | Branding e reposicionamento | `/servicos/branding-identidade` | Oferta própria de marca e posicionamento | Página da família → contato |
| Processos / Operação | Process Intelligence | `/servicos/process-intelligence` | Diagnóstico e inteligência de processos | Página da família → diagnóstico/contato |
| Processos / Operação | Process Activation | `/servicos/process-activation` | Ativação e sustentação da operação | Página da família → contato |

SEO, tráfego pago, copywriting e performance permanecem capacidades/mecanismos por padrão, não famílias independentes. Esta matriz não cria novas ofertas, preço, promessa, rota ou redirect.

## Mudanças aplicadas

- **Programa de Parceria:** nomes visíveis em PT, heading/FAQ, rótulos acessíveis e mensagens de CTA; title e description efetivos em PT; Footer e ponte editorial. `/programa-afiliados` e seu canonical foram preservados. Identificadores internos `affiliate` e analytics foram mantidos.
- **Assessoria Estratégica de Negócios:** H1, texto de enquadramento, FAQ, mensagens de WhatsApp, navegação, breadcrumbs, metadados PT e ponte editorial atualizados. A página mantém o foco em direção e decisão de negócio sem absorver Branding, Process Intelligence, Process Activation ou Tráfego Pago. Slug/canonical foram preservados.
- **Tecnologia / Unidade Digital:** o texto de abertura de Desenvolvimento Web explicita Websites, E-commerce/Unidade Digital e Soluções Digitais Específicas. Reforça diagnóstico, modelagem, validação e estruturação antes do desenvolvimento e inclui prontidão operacional para E-commerce. Nenhuma LP filha foi criada.
- **Hospedagem e Manutenção:** H1, descrição de abertura e rótulos Home/Footer/Contato enquadram o serviço como continuidade tecnológica ligada a Tecnologia/Web. A página e a URL permanecem. Nenhum preço, plano, SLA, limite, adicional ou condição foi editado.
- **Onboarding:** removido das listas de links genéricos do Footer em PT/EN/ES. A rota permanece implementada, noindex e fora do sitemap; não foi criado login, conta, senha ou mecanismo de magic link.
- **Sebraetec:** metadados PT, hero, chamadas, FAQs e CTA passaram a indicar consulta às condições regionais, disponibilidade e aprovação pelo Sebrae. Não se promete aprovação, elegibilidade, percentual uniforme ou serviço coberto; não foi criado simulador.
- **Home/Serviços/Contato:** somente rótulos existentes para continuidade foram clarificados; sem redesenho ou reorganização estrutural.

## URLs, SEO e publicação

Nenhum `canonicalPath`, slug, redirect, alias, indexabilidade, `includeInSitemap` ou estrutura do sitemap foi alterado. Os testes confirmam os canonicals atuais de Programa de Parceria, Hospedagem, Sebraetec e Assessoria, e confirmam que onboarding continua não indexável e fora do sitemap. Os metadados textuais efetivos em PT foram atualizados onde autorizado. EN/ES continuam não publicados; suas traduções editoriais não foram tratadas como aprovadas nesta missão.

## Valores e claims bloqueados

- **Programa de Parceria:** a página ainda mostra percentuais de comissão, prazo/recorrência, tickets de referência e resultados do simulador. Não foram removidos nem alterados, conforme a instrução de interromper esta parte antes de retirar números de risco. Esses dados são estado legado do código, não aprovação comercial. Exigem decisão e validação econômica própria antes de serem usados como condição vigente. O campo de descrição legado no `routeRegistry` ainda contém `até 10%`; o SEO efetivo em PT usa a description neutra de `siteI18n`. Esse registro redundante deve ser reconciliado depois da decisão comercial, sem inferir autorização.
- **Hospedagem e Manutenção:** preços, planos, limites, SLA, adicionais e condições atuais foram preservados sem validação. A página ainda contém essas informações; a revisão comercial/operacional específica continua necessária.
- **Sebraetec:** não há promessa percentual na metadata efetiva nem no texto alterado. Permanece um exemplo de projeto de R$ 10.000,00 explicitamente descrito como simulação ilustrativa; foi preservado. Validar sua necessidade e interpretação junto com a revisão comercial externa. As condições locais e qualquer percentual continuam dependentes de confirmação oficial vigente do Sebrae/PB.

## Arquivos alterados

- `src/components/Footer.tsx`
- `src/config/routeRegistry.ts`
- `src/content/serviceInsightsBridge.ts`
- `src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx`
- `src/features/site/pages/Contato.tsx`
- `src/features/site/pages/DesenvolvimentoWeb.tsx`
- `src/features/site/pages/Home.tsx`
- `src/features/site/pages/HospedagemManutencaoSites.tsx`
- `src/features/site/pages/ProgramaAfiliados.tsx`
- `src/features/site/pages/Sebraetec.tsx`
- `src/i18n/siteI18n.ts`
- `tests/content-review/content-review.spec.ts`
- `tests/e2e/assessoria-layout.spec.ts`
- `tests/routeRegistry.test.ts`
- `docs/architecture-consolidation/24_P1_2A_SAFE_OFFER_ALIGNMENT.md`

## Validação

- `npm test`: **PASS** (rotas, contratos e checker de continuidade incluído na suíte).
- `npx tsc --noEmit`: **PASS**.
- `npm run continuity:check`: **PASS** em execução fora da restrição de spawn do sandbox.
- `npm run i18n:check`: **PASS/SKIPPED** pelo comportamento existente: `translations_autopublish_disabled`.
- `npm run build`: **PASS**; compilação, TypeScript e geração estática concluídos.
- `npm run lint`: **BLOQUEADO PELO AMBIENTE** no pre-hook `prisma generate`, que tentou obter o `schema-engine` e recebeu `ECONNREFUSED 127.0.0.1:9`. O typecheck equivalente passou separadamente; nenhum script ou configuração foi contornado.
- Browser QA: **27/27 PASS**. `critical-pages.spec.ts` verificou Home, Contato, Desenvolvimento Web, Assessoria, Hospedagem, Programa de Parceria e Sebraetec em 390, 768 e 1440 px (21 testes), com frame, overflow horizontal, imagens visíveis e axe sem violações críticas/sérias no desktop. `assessoria-layout.spec.ts` passou em 6 testes adicionais, incluindo foco/accordion e reduced-motion.
- `git diff --check`: **PASS**.
- Nenhum formulário foi enviado; nenhum worker, banco persistente ou integração externa de negócio foi acionado. O runtime de QA local foi encerrado após os testes.

## Riscos restantes e próximo escopo

1. Obter decisão/validação comercial das comissões, tickets, recorrência e pagamento da Parceria; só então decidir a retirada ou substituição dos valores atuais.
2. Validar preço, planos, SLA, limites e adicionais de Hospedagem e Manutenção.
3. Validar com fonte oficial vigente do Sebrae/PB qualquer regra local e rever o exemplo ilustrativo de R$ 10.000,00.
4. Reconciliar a description redundante do `routeRegistry` da Parceria depois da decisão econômica.
5. P1.2B pode planejar Home/Serviços/Contato como arquitetura de navegação, respeitando a matriz aprovada; não deve absorver termos econômicos bloqueados nem iniciar migração de URL/canonical.

**Estado Git ao registrar:** branch `p2-home-cases-consolidation`, base `cdc1f27`; alterações ainda locais. Nenhum commit ou push foi criado nesta etapa porque o gate solicitado `npm run lint` não completou devido à indisponibilidade do binário Prisma. Repetir esse gate quando o `schema-engine` estiver disponível e, então, rever/stagear explicitamente esta unidade antes do commit autorizado.

## P1.2A.1 — Recheck do gate e consolidação

- A primeira execução de `npm run lint` no ambiente restrito foi bloqueada antes do TypeScript: o `prelint` chamou `prisma generate`, que tentou buscar `schema-engine.exe` para o commit Prisma `3c6e192761c0362d496ed980de936e2f3cebcd3a` em `binaries.prisma.sh` e recebeu `ECONNREFUSED 127.0.0.1:9`.
- Contrato dos scripts: `prelint` = `npm run db:generate`; `lint` = `tsc --noEmit`; Prisma e `@prisma/client` = `^7.8.0`. O build anterior concluiu porque a geração do client/engine pôde executar no ambiente em que aquele build foi realizado; a falha de lint era de acesso ao endpoint de binários, não do código do projeto.
- Reexecução de `npm run lint` no ambiente autorizado: **PASS**. `prisma generate` gerou o client 7.8.0 e o comando real `tsc --noEmit` terminou sem erros. Nenhum script, configuração ou Prisma foi alterado.
- Gates repetidos após o lint: `npm test` **PASS**; `npx tsc --noEmit` **PASS**; `npm run continuity:check` **PASS**; `git diff --check` **PASS**. Build e QA browser permanecem válidos: nenhum arquivo de produto mudou desde sua execução.
- Ambiente: retry de lint fora da restrição de rede do sandbox; demais checks no worktree atual. Nenhuma alteração adicional de produto foi feita nesta revalidação.
- Consolidação: commit `feat: align public offers with approved P1 decisions`, contendo exclusivamente os arquivos da unidade P1.2A e este relatório. Push não realizado.
