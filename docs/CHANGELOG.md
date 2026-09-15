# CHANGELOG - TAG08

## 2026-09-15

- Convertidos os retratos da equipe em `/sobre` para `next/image`, mantendo os mesmos assets, textos e critérios de publicação, para cumprir a auditoria de imagens no CI.
- Feito o `lint` gerar o cliente Prisma antes da checagem de tipos. Isso elimina a divergência em que o CI, iniciado sem artefatos locais, tentava resolver imports gerados antes do build.
- Normalizada a assinatura de revisão do onboarding para que a mesma fonte não pareça alterada apenas por trocar `CRLF` por `LF` entre desenvolvimento local e CI.
- Corrigido o gate de continuidade no CI: o checkout agora traz o histórico necessário para validar o commit-base da integração, sem desativar a checagem remota.
- Aprovada e liberada a equipe em `/sobre`, além de mini-cases e depoimentos internos em `/servicos/assessoria-marketing-digital-estrategico`; a autorização é limitada a essas rotas. Home, portfólio e cases indexáveis continuam pendentes.
- Transformada a continuidade em fluxo executável: `npm run continuity:status` valida branch, commit-base e checkpoint; os modos de desenvolvimento exibem essa checagem antes de iniciar e o hook de commit bloqueia alterações de comportamento sem atualização simultânea de estado e changelog.
- Evoluído o gate de evidências para registro estruturado por item, contrato de publicação por rota, relatório `content:status` e prévia local identificada por `npm run dev:content-review`; produção continua excluindo itens pendentes e removidos.
- Adicionados testes que impedem publicação indevida, validam os metadados de aprovação e verificam a diferença entre site público e prévia local.
- Registrada a reconciliação de continuidade: `p0-routing-secret-containment` é a candidata à integração e `main` permanece o destino, sem merge direto nesta etapa.
- Criados `docs/DECISIONS.md` e `docs/ROADMAP.md` para separar decisão, estado e execução futura.
- Atualizado `docs/PROJECT_STATE.md` com a relação real entre branches, alterações locais a preservar, mapa das fontes de conteúdo e conflitos editoriais pendentes.
- Nenhuma página, rota, contrato, asset publicado ou integração foi removido ou alterado nesta etapa.
- Publicado `/llms.txt` como rota estática do Next, com links derivados do registry, proteção contra reescrita pelo `proxy` e verificação de resposta no teste de rotas.
- Criado `docs/CONTENT_EVIDENCE_INVENTORY.md` para tornar rastreáveis pessoas, cases, depoimentos, logos, métricas e imagens que exigem prova antes de uma decisão pública.
- Criado `docs/INTEGRATION_AUDIT.md` para separar os commits por risco e impedir que melhorias técnicas validem automaticamente conteúdo pendente.
- Implementado `src/content/publicEvidence.ts`: equipe, cases, candidatos de portfólio, métricas, mini-cases e depoimentos pendentes permanecem preservados, mas não renderizam nem podem gerar rota ou sitemap até aprovação individual.

## 2026-09-02

- Refinada `/servicos/gestao-de-redes-sociais` com as estruturas oficiais Start, Base e Performance, sem preços, volumes ou escopo universal.
- Retiradas da rota as provas não validadas (`MiniCases` e `TrustTestimonialsSection`), o bloco stock de “especialista”, CTA intermediário e barra de confiança redundante.
- Mantidos diagnóstico, tracking e WhatsApp; vídeo agora só exibe conteúdo oficial live e apresenta estado vazio neutro quando indisponível.
- Revisados FAQ, limites de escopo, ciclo mensal, CTA final, encoding visível e metadados da rota.
- Alinhado o hub `/servicos` ao Índice Oficial do portfólio: quatro categorias públicas substituíram a apresentação equivalente de oito ofertas históricas.
- Retiradas apenas da promoção principal do hub as ofertas pendentes de validação comercial (Assessoria, Process Intelligence, Process Activation e Hospedagem); as rotas existentes foram preservadas.
- Agrupados Reposicionamento Estratégico, Edição de Reels e Unidade Digital/E-commerce nas categorias públicas compatíveis, sem criar rotas, preços ou escopos novos.
- Removidos marquee com texto corrompido, cópia de escopo, CTAs redundantes e `MiniCases` do hub por ausência de fonte de portfólio validada.
- Atualizados FAQ, linguagem do método e metadados de `/servicos` para orientar a decisão antes da contratação.
- Refinada a página `/sobre` sem redesign: equipe não validada foi convertida em competências conectadas; perfis, LinkedIns, marcas e marquee sem fonte institucional foram removidos.
- Consolidada a seção de diferenciais, reduzida a parte inferior de crenças, corrigido o CTA final e atualizados os metadados de `/sobre`.
- Removidos estados, handlers, constantes e imports sem consumidor em `Sobre.tsx`.
- Consolidada a Home sem reconstrução visual: removidas da renderização as redundâncias de método, diferenciais, planos de redes e a segunda galeria de portfólio.
- Ajustada a linguagem do diagnóstico e do bento de diferenciais para eliminar termos técnicos, promessas e estruturas institucionais não comprovadas.
- Bloqueada a exibição de avaliações Google quando a integração não retorna conteúdo live; fallback editorial não é apresentado como prova real.
- Registrado `docs/PROJECT_STATE.md` como checkpoint obrigatório para retomadas da Home e validação de cases.

## 2026-08-17

- Adicionada a matriz de prontidao de localizacao: idiomas estrangeiros publicados precisam de revisao aprovada vinculada a assinatura do conteudo-fonte.
- Removida a pagina resumida que era apresentada como equivalente em EN/ES.
- Adicionado controle de publicacao por rota e idioma em `routeRegistry.ts`.
- URLs de idiomas sem pagina integralmente localizada agora retornam para o canonico PT-BR; sitemap, `hreflang` e indexacao respeitam a mesma regra.
- Mantido o onboarding como fluxo multilíngue publicado, pois ele possui copia e interacao completas nos tres idiomas.
- Adicionados testes de regressao para impedir o retorno de fallback resumido e a exposicao de idiomas nao aprovados.

## 2026-07-09

- Criado `docs/AGENT_ROUTER.md` para decidir o agente principal antes da escolha de skill.
- Criado `docs/AGENTOS_BRIDGE.md` para ligar o repositorio TAG08 ao AgentOS externo sem duplicar autoridade.
- Atualizadas as referencias de arquitetura e decisao para apontar para o bridge e para as fontes reais de agentes e skills.
- Adicionada camada explicita de orquestracao de agentes e skills em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.

## 2026-07-06

- Fechada a decisao de conteudo: `/insights` virou a rota canonica do hub editorial, e `/blog` ficou como alias legado.
- Atualizados links, breadcrumbs, sitemap e metadados para refletir o hub de insights como face publica principal.
- Ajustadas copias auxiliares para reduzir o uso de "blog" onde o projeto ja se posiciona como biblioteca de insights.
- Criada a base editorial com `BlogPost` ligado a servico, note e CTA para suportar o reaproveitamento futuro dos conteudos.
- Adicionado `docs/INSIGHTS_EDITORIAL_RULES.md` com regra de relacionamento, revisao humana e distribuicao.

## 2026-07-03

- Corrigidos erros de JSX que impediam build em `AssessoriaMarketingDigitalEstrategico.tsx` e `ProducaoAudiovisual.tsx`.
- `npm run lint` e `npm run build` passaram novamente.
- `README.md` reescrito com instrucoes reais do projeto.
- `.env.example` alinhado ao fluxo de desenvolvimento local.
- `package.json` ganhou `npm run check` e um `clean` portatil para Windows.
- Os registros externos do AgentOS foram reescritos com encoding correto.

## 2026-06-30

- Implementado controle de `alternates` no `App.tsx` para canonicals e `hreflang` dinamicos.
- Adicionado `hreflang` estatico em `index.html` para `pt-BR`, `en`, `es-ES` e `x-default`.
- Ajustado controle de canonical por idioma sem quebrar o roteador SPA.
- Atualizado o onboarding para contrato versionado, fila local e sincronizacao automatica.
- Endpoint onboarding real em `server/index.ts` com contrato versionado (`server/onboardingContract.ts`) e metricas basicas.
- O onboarding client-side agora separa estados de envio confirmado, fallback local e erro tecnico.
- Implementado fallback seguro em `localStorage` com retencao e retry controlado.
- `routeRegistry` confirmado como fonte canonica e usado por `App.tsx` e `generate-sitemap.ts`.
- Documentacao operacional e de governanca criada ou atualizada:
  - `docs/DECISION_MATRIX.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ROUTES.md`
  - `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md`
- Integracao SEO cross-domain ajustada para o dominio principal e subdominios do ecossistema.
- Resumo do TAG08 Knowledge System incorporado em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.

## Riscos abertos

- Ainda existem trechos de texto com encoding ruim em paginas longas do frontend.
- Falta automacao de smoke test alem do build.
- Landing pages externas seguem fora deste repositorio.
