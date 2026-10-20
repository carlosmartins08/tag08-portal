# P1.2C — Continuidade da jornada: intenção → qualificação → contato

Data: 2026-10-19
Base: `p2-home-cases-consolidation` em `ac073498c8fb6eb87bf221619566d62da23c5bc5`

## Estado anterior

- `/contato` já permitia selecionar mais de uma necessidade, solicitar orientação, editar respostas e revisar motivo/frentes antes do envio.
- Os CTAs internos navegavam para `/contato` sem preservar a origem nem uma necessidade selecionada na página anterior.
- O payload já separava identidade, intenção (`requestType`, `serviceInterests` e `needsServiceGuidance`), mensagem, `source` e UTM. O backend aceitava `source` como texto limitado a 120 caracteres e persistia esse campo.
- A confirmação existente e os eventos de analytics já estavam definidos. Esta mudança não os substituiu.

## Mapa dos CTAs auditados

| Origem | CTA/destino atual | Contexto enviado | Observação |
|---|---|---|---|
| Home | CTA principal de contato/diagnóstico → `/contato` | `intent=orientacao`, `origin=home` | Diagnóstico continua orientação transversal; chegar ao contato não significa que foi concluído. |
| Home | CTAs de contato nas áreas de contexto, diagnóstico, cases e avaliações → `/contato` | `orientacao` / `home` | A seleção é editável; links que apenas rolam para uma seção local continuam rolando. |
| Home | CTA de plano editorial dentro de `false &&` | Nenhum: bloco não renderizado | O bloco legado está inativo; não foi alterado nem contado como jornada pública ativa. |
| `/servicos` | CTA de caminho/conversa → `/contato` | `intent=orientacao`, `origin=services` | Mantém o router neutro da página-hub. |
| Gestão de Redes / Presença | CTAs de conversa → `/contato` | `redes-sociais`, `offer` | ID já aceito pelo formulário. |
| Produção Audiovisual | CTAs de conversa → `/contato` | `producao-audiovisual`, `offer` | ID existente. |
| Tecnologia / Desenvolvimento Web | “Planejar meu site” → `/contato` | `desenvolvimento-web`, `offer` | Abrange sites, e-commerce/Unidade Digital e soluções específicas na família Tecnologia. |
| Branding / Posicionamento | CTAs de conversa → `/contato` | `branding`, `offer` | ID existente. |
| Assessoria Estratégica de Negócios | CTAs de conversa → `/contato` | `assessoria-estrategica`, `offer` | Slug e canonical preservados. |
| Process Intelligence | CTAs de conversa → `/contato` | `process-intelligence`, `offer` | Permanece distinto de Process Activation. |
| Process Activation | CTAs de conversa → `/contato` | `process-activation`, `offer` | Permanece distinto de Process Intelligence. |
| Hospedagem e Manutenção | CTAs de continuidade → `/contato` | `hospedagem`, `offer` | Continua adjacente à Tecnologia. |
| Sebraetec | “Ir para o contato” → `/contato` | Somente `origin=sebraetec` | Não inventa elegibilidade, claim ou família de serviço. O CTA principal para consultar condições continua em sua jornada própria. |
| Programa de Parceria | CTAs atuais não usam `/contato` | Nenhum | Jornada própria preservada; não foi forçada para o router geral. |

O mapeamento ocorre na fronteira compartilhada de navegação, somente quando o destino canônico é `/contato`. Assim, os CTAs das páginas de oferta reutilizam o contexto da rota sem exigir mudança repetitiva em cada botão.

## Contrato de intenção e propagação

- Foi criado `src/lib/contactJourney.ts` como contrato único e explícito de intenções/origens permitidas.
- Intenções reutilizam os IDs já aceitos por `serviceInterests`; `orientacao` mapeia para o booleano existente `needsServiceGuidance`.
- Origens permitidas: `home`, `services`, `offer` e `sebraetec`.
- Query strings de destinos internos para `/contato` são reconstruídas somente com os campos allowlisted `intent` e `origin`; parâmetros extras não são propagados por esses CTAs. Parâmetros inválidos são ignorados pelo parser.
- Contexto ausente mantém o acesso direto neutro. Contexto válido apenas sugere/preseleciona uma frente após a pessoa escolher “Quero iniciar um projeto”; não avança etapas, não envia formulário e não cria oportunidade comercial.
- A pessoa pode desmarcar a sugestão, selecionar várias frentes ou solicitar orientação. Mudar o tipo de solicitação mantém as regras de limpeza já existentes.
- A origem é codificada no campo existente `source` como `contact-page:<origem>`; sem origem válida permanece `contact-page`. Identidade, mensagem, intenção, UTM, idempotência e consentimento mantêm suas estruturas existentes.
- Nenhum nome, e-mail, telefone ou texto livre é colocado na URL pelos links gerados pelo site. Os testes também verificam que um CTA contextual não recebe tais parâmetros.

## Qualificação, revisão e submissão

- O fluxo continua com as três etapas já existentes. A intenção pré-selecionada aparece na etapa de qualificação como sugestão identificada pela origem e pode ser alterada.
- Antes do envio, o resumo existente mostra motivo e frentes; os campos de identidade/mensagem seguem visíveis e editáveis na etapa final, e “Voltar” preserva respostas.
- A confirmação atual (“Mensagem Enviada!” e texto de solicitação recebida) foi preservada. Envio bem-sucedido não é descrito como aprovação, contratação ou conclusão de diagnóstico.
- Nenhuma alteração foi feita no backend/schema/persistência. `/api/contact` continua recebendo o contrato existente; os testes verificaram o payload com `requestType`, `serviceInterests`, `source` e `message`.
- Não foi criado evento de analytics nem enviada PII para analytics. Os eventos de formulário existentes permanecem inalterados.
- Onboarding segue separado; não aparece como continuação automática do contato enviado.

## SEO, rotas e comportamento fora de escopo

- `routeRegistry`, slugs, aliases, redirects, canonicals, sitemap, indexação e política de locales não foram alterados.
- O metadata do servidor continua construído a partir do caminho canônico `/contato`; query params não se tornam rotas nem entradas de sitemap.
- Não houve alteração de Header/Footer, páginas comerciais, integração ClickUp, banco, APIs, claims Sebraetec ou regras econômicas.
- Não se implementou magic link, onboarding, nova taxonomia de analytics ou qualificação automática.

## Arquivos alterados

- `src/lib/contactJourney.ts` — whitelist, mapeamento de origem/rota e serialização segura.
- `src/features/site/RouteContent.tsx` — propagação centralizada para `/contato`.
- `src/features/site/pages/Contato.tsx` — preseleção editável, explicação contextual e origem no campo `source` existente.
- `tests/contactJourney.test.ts` — contratos unitários de allowlist, oito caminhos de oferta, destinos, dados não permitidos e origem.
- `tests/e2e/contact-experience.spec.ts` — cobertura browser do fluxo contextual.
- `package.json` — inclusão do teste de contrato no `npm test`; dependências e lockfile não mudaram.
- `docs/architecture-consolidation/26_P1_2C_JOURNEY_CONTINUITY.md` — este registro.

## QA e validação

- `npm test`: PASS; inclui 4 testes do novo contrato.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS; `prelint` executou `prisma generate` localmente e o script de lint executou TypeScript.
- `npm run continuity:check`: PASS; durante a execução, o checker assinalou somente os arquivos novos ainda não classificados e confirmou contexto válido.
- `npm run build`: PASS; `i18n:check` registrou `translations_autopublish_disabled`.
- `npm run test:browser -- tests/e2e/contact-experience.spec.ts`: PASS, 11/11.
- E2E executado em runtime local na porta 3211. O Playwright bloqueou todos os hosts externos e interceptou `/api/contact`; nenhuma integração real foi chamada.
- Cobertura browser: entrada direta neutra; contexto válido/inválido; alteração manual; capability de tráfego no grupo subordinado; Home/Serviços/oferta/SebraeTec; reload; back/forward; payload/confirmação; foco/teclado; layout em 390/768/1440; ausência de query no canonical; ausência de onboarding pós-envio.
- Houve ajustes em seletores E2E sensíveis à codificação de caracteres acentuados; capturas confirmaram que o estado esperado do produto estava presente. A suíte final completa passou.
- `git diff --check`: PASS antes do staging.

## Riscos residuais

- `source` agora ganha sufixo allowlisted para indicar a origem. O contrato aceita e persiste esse valor; consumidores internos condicionais por igualdade exata não foram encontrados. Relatórios externos que agrupem exclusivamente o valor literal `contact-page` devem ser observados quando o dado for consumido fora do site.
- A URL continua recebendo contexto apenas dos parâmetros allowlisted gerados pelo site. Parâmetros arbitrários digitados diretamente pelo visitante não são interpretados como intenção, mas não são removidos automaticamente, preservando o comportamento atual e parâmetros de campanha existentes.
- Rotas adicionais de oferta que venham a surgir precisam entrar explicitamente no mapeamento/teste antes de serem consideradas contextualizadas.

## Próximos gaps

- Validar com a operação se o novo valor detalhado de `source` atende a relatórios já existentes fora do repositório.
- Integração Contact → ClickUp permanece futura e fora desta unidade.
- Não iniciar a etapa seguinte sem autorização humana separada.
