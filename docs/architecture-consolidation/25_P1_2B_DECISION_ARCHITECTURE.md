# P1.2B — Arquitetura de decisão: Home, Serviços e Contato

Data: 2026-10-19
Base: `p2-home-cases-consolidation` em `52139c2`

## Estado anterior

- A Home apresentava caminhos de oferta e continuidade tecnológica como frentes paralelas; sua lista ativa não refletia as seis famílias aprovadas.
- `/servicos` apresentava quatro agrupamentos, sem representação equivalente de Assessoria e Processos.
- `/contato` oferecia uma lista plana organizada por nomes internos de serviço; Tráfego e Performance apareciam no mesmo nível visual das ofertas e não havia uma opção clara para outra necessidade.
- Header e Footer já encaminhavam para páginas relevantes; Onboarding já estava fora do link institucional do Footer.

## Matriz canônica aplicada

| Família | Ofertas/contexto | Rota atual | Papel público e CTA | Jornada |
|---|---|---|---|---|
| Gestão de Redes Sociais / Presença Digital | Planos Start, Base e Performance; capacidades aplicadas conforme necessidade | `/servicos/gestao-de-redes-sociais` | Organizar presença e rotina de comunicação; “Conhecer presença digital” | Família → página de serviço → Contato |
| Produção Audiovisual | Captação, edição e conteúdo dirigido | `/servicos/producao-audiovisual` | Produzir comunicação audiovisual com função; CTA de audiovisual | Família → página de serviço → Contato |
| Tecnologia | Websites, E-commerce/Unidade Digital, soluções específicas; Hospedagem e Manutenção como continuidade adjacente | `/servicos/desenvolvimento-web`; continuidade em `/hospedagem-manutencao-sites` | Avaliar estrutura e prontidão operacional; CTAs para Tecnologia e continuidade | Família → página adequada → Contato |
| Assessoria Estratégica / Negócios | Direção, prioridades, posicionamento, canais e planejamento | `/servicos/assessoria-marketing-digital-estrategico` | Apoiar decisões do negócio; CTA para Assessoria | Família → página de serviço → Contato |
| Branding / Posicionamento | Identidade, posicionamento e reposicionamento | `/servicos/branding-identidade` | Organizar expressão e percepção de marca; CTA para Branding | Família → página de serviço → Contato |
| Processos / Operação | Process Intelligence e Process Activation como ofertas distintas | `/servicos/process-intelligence`; `/servicos/process-activation` | Identificar necessidade operacional e encaminhar para a oferta correspondente | Família → oferta/página → Contato |

SEO, Tráfego, Copywriting e Performance aparecem como capacidades/meios, não como famílias principais. Diagnóstico permanece um mecanismo transversal; o próximo passo genérico é uma conversa de contato, sem prometer diagnóstico automático completo.

## Mudanças aplicadas

### Home — command center

- A área ativa de caminhos foi organizada nas seis famílias aprovadas, com textos orientados a problema/contexto e CTA para rotas existentes.
- Tecnologia explicita websites, e-commerce sujeito a prontidão operacional, soluções específicas e continuidade de hospedagem/manutenção.
- Process Intelligence e Process Activation aparecem como ofertas distintas dentro de Processos.
- Uma chamada do mosaico deixou de usar Performance como caminho paralelo e passou a contextualizar Gestão de Redes, Audiovisual e Branding conforme o diagnóstico.
- O rótulo “QUATRO FRENTES” foi ajustado para “QUATRO PILARES” no módulo metodológico, evitando confusão com a taxonomia de seis famílias.

### `/servicos` — hub de decisão

- A grade agora representa as seis famílias aprovadas, com necessidades, ofertas e encaminhamentos para rotas existentes.
- Tecnologia inclui E-commerce/Unidade Digital e prontidão operacional; Hospedagem e Manutenção é apresentada como continuidade adjacente, sem nova família ou preço.
- Process Intelligence e Process Activation têm descrições e CTAs distintos.
- Assessoria e Processos também aparecem na matriz de necessidades.
- O bloco-resumo acompanha as seis famílias.
- O CTA secundário de continuidade tecnológica e os rótulos de Process Activation preservam as rotas atuais.
- Os micro-rótulos de caminho e de ofertas nos cards passaram de `text-zinc-500` a `text-zinc-400` após o axe detectar contraste 3,77:1. A mudança foi restrita a esses rótulos do hub; não altera estrutura ou linguagem visual.

### `/contato` — router de intenção

- A lista plana foi agrupada por necessidade do visitante: presença/comunicação/marca; estratégia/tecnologia; processos/operação; capacidades de apoio.
- Tráfego, SEO, Copywriting e Performance estão em grupo contextual e explicados como capacidades, não famílias.
- A opção “Preciso de orientação ou tenho outra necessidade” atende casos não listados sem criar novo código de interesse.
- Os IDs internos existentes foram mantidos e a lista continua dentro do limite contratual atual de nove interesses; orientação continua usando `needsServiceGuidance`.
- O resumo e a mensagem de encaminhamento refletem o rótulo atual da opção de orientação.

## Header, Footer e navegação pública

Header/Footer foram preservados. Os testes confirmaram que Onboarding continua ausente de links genéricos de navegação pública. Programa de Parceria e Sebraetec continuam como programa e contexto específico, não como famílias.

## URLs e SEO

Não foram alterados `routeRegistry`, slugs, aliases, canonicals, redirects, sitemap estrutural, política de locale ou metadata. As rotas de CTA usadas acima já existiam. Os testes existentes de route registry e canonicalização passaram.

## Arquivos alterados

- `src/features/site/pages/Home.tsx`
- `src/features/site/pages/Servicos.tsx`
- `src/features/site/pages/Contato.tsx`
- `tests/e2e/contact-experience.spec.ts`
- `tests/e2e/decision-architecture.spec.ts` (novo)
- `docs/architecture-consolidation/25_P1_2B_DECISION_ARCHITECTURE.md` (este documento)

## QA e validação

- Browser QA em 390, 768 e 1440 px para Home, Serviços e Contato: conteúdo e famílias visíveis, sem overflow horizontal.
- 10 testes Playwright aprovados, incluindo fluxos existentes de Contato, presença das seis famílias, destinos principais de Home/Serviços, ausência de Onboarding no Header/Footer e verificações axe na área alterada.
- Um scan axe inicial de página inteira na Home encontrou contrastes inferiores a 4,5:1 em conteúdo de outras seções não alteradas. Esses achados foram mantidos fora desta mudança e não foram tratados como regressões da área atualizada. A área do mapa alterado passou no scan focado.
- O scan focado da área principal de Serviços identificou os rótulos pequenos mencionados acima; após o ajuste, a área passou.
- `npm test`: PASS.
- `npm run lint`: PASS após execução autorizada fora do sandbox; o `prelint` executou `prisma generate` local e o lint executou `tsc --noEmit`.
- `npx tsc --noEmit`: PASS.
- `npm run continuity:check`: PASS. O checker reportou 1 arquivo untracked sem classificação durante a execução (o novo teste desta missão); contexto permaneceu válido.
- `npm run build`: PASS; Prisma Client e checagem i18n foram executados. Autopublicação de tradução permaneceu desabilitada.
- `git diff --check`: PASS.

## Deliberadamente não alterado

- URLs, metadata, canonicals, redirects, aliases, sitemap e política de idiomas.
- Header/Footer, backend, APIs, persistência, integrações, banco, onboarding funcional e regras econômicas.
- Conteúdo integral de páginas de oferta ou estrutura de navegação global.
- Capacidades como ofertas/famílias independentes.

## Riscos e próximos passos

- O scan axe completo da Home revelou achados de contraste em outras áreas preexistentes; devem ser triados separadamente, sem ampliar esta unidade.
- EN/ES não foram adaptados porque PT permanece o locale publicado principal e a política de tradução não foi alterada.
- A validação de navegação confirma destinos de CTA representativos; não implica revisão de conteúdo ou SEO de todas as páginas finais.
- Próxima etapa recomendada: P1.2C, após revisão humana desta arquitetura, para tratar as jornadas e superfícies restantes conforme o plano aprovado, sem reabrir as decisões congeladas.

## P1.2I — Correção localizada de contraste da Home

- O registro da P1.2B preservou achados de contraste do scan axe de página inteira, mas não enumerou os nós. A verificação encontrou oito textos afetados no agrupamento metodológico da seção `#solucao`: rótulo “ENTREGA”, rótulos “03 // PROCESSO” e “04 // TECNOLOGIA” e cinco descrições de apoio, incluindo “Cada entrega respeita contexto, escopo e capacidade real da operação”. Axe mediu `text-zinc-500` em fundos escuros entre **3,28:1 e 3,87:1** (alvo normal: 4,5:1). Os achados eram usos locais, não falha do token global.
- Alteradas somente essas oito aplicações locais para o token existente `text-zinc-400`; nenhum token, texto, estrutura, CTA ou animação foi alterado. A cor zinc-400 nos fundos efetivos verificados resulta em **6,20:1–7,30:1** por cálculo WCAG, acima do mínimo AA.
- Evidência browser do build intermediário: axe ficou sem violações a 390 px; a 768 e 1440 px apontou uma das descrições remanescentes da mesma seção, também corrigida no código. Overflow horizontal não ocorreu nos três breakpoints; controle de teclado preservou foco visível (outline de 2 px) e hover preservou mudança de borda.
- Na primeira validação intermediária, `npx tsc --noEmit` e `git diff --check` passaram. Uma nova execução direta do build no worktree foi recusada pelo controle de segurança porque o lifecycle de Next pode sobrescrever `next-env.d.ts`; naquele ponto, o scan axe final automatizado também permanecia pendente. Nenhuma proteção foi contornada.
- Na validação final, o snapshot temporário independente passou em `npm run build` completo (Prisma 7.8.0 com engine local, `i18n:check`, Next.js 16.2.10 e postbuild). O scan Axe final da região `#solucao`, com regras WCAG 2.0/2.1 A/AA, passou em 390, 768 e 1440 px: zero violações, oito elementos de texto alvo visíveis com `text-zinc-400`, sem overflow horizontal, foco de teclado visível (outline 2 px) e hover preservando a mudança de borda. Requisições a hosts externos foram bloqueadas no browser; nenhum envio ou integração externa foi executado. O `next-env.d.ts` do workspace principal manteve o mesmo SHA-256 antes/depois (`1BEC57E49CD162A5E86AF6CAF5626BDA964581330AC53813A5F68985D14F0A9B`).
- `next-env.d.ts` continua sendo uma alteração local preexistente e fora desta unidade, sem mudança no workspace principal. Nenhuma outra página foi modificada. Conclusão: correção local aplicada; gates finais de Axe/build aprovados no snapshot isolado e unidade pronta para consolidação local. Esta validação não autoriza push, deploy ou ativação.
