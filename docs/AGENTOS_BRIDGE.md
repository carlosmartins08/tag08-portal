# TAG08 AgentOS Bridge

## Objetivo

Conectar este repositorio ao AgentOS externo sem criar uma segunda verdade sobre agentes, roles ou skills.

## Principio central

Agente executa dentro de um papel.
Skill amplia capacidade.
Documento de projeto define contexto.
Registry define autoridade.

Se um destes quatro elementos faltar, o agente deve parar e recuperar contexto antes de agir.

## Fontes oficiais externas

- Agent registry: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\registry\AGENT_REGISTRY.md`
- Runtime: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\runtime\AGENTOS_RUNTIME_V1.md`
- Constitution: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\governance\CONSTITUTION.md`
- Skill registry: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\skill-registry\README.md`
- Skill policy: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\skill-registry\SKILL_LOADING_POLICY.md`
- Skill matrix: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\skill-registry\AGENT_SKILL_MATRIX.md`
- Skill source of truth: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\skills\CATALOGO.md`
- Skill library: `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\skills`

## Fontes oficiais do projeto

1. `docs/TAG08_KNOWLEDGE_SYSTEM.md`
2. `docs/ROUTES.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DECISION_MATRIX.md`
5. `src/config/routeRegistry.ts`
6. `server/onboardingContract.ts`

## Ordem de leitura por missao

1. `docs/TAG08_KNOWLEDGE_SYSTEM.md`
2. `docs/ROUTES.md` quando a tarefa tocar pagina, rota, copy ou SEO
3. `docs/ARCHITECTURE.md` quando a tarefa tocar fluxo, API, dados ou operacao
4. `docs/DECISION_MATRIX.md` quando a tarefa tocar trade-off ou rollout
5. `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\registry\AGENT_REGISTRY.md`
6. `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents\skill-registry\AGENT_SKILL_MATRIX.md`
7. `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\skills\CATALOGO.md`

## Regra de roteamento

- Se a missao pedir selecao de agente, usar `docs/AGENT_ROUTER.md`.
- Se a solicitacao for continuidade, usar primeiro `project-continuity-governance-guardian`.
- Se a solicitacao tocar mais de uma camada, usar primeiro `system-product-architecture-guardian`.
- Se a solicitacao vier descrita por cargo ou area, usar `product-delivery-coordinator` para traduzir o pedido em decisao.
- Se a solicitacao tocar execucao tecnica, usar a skill mais especifica para a camada afetada.
- Se houver risco de regressao, usar o bloco de qualidade antes de concluir.

## Matrizes de missao

### 1. Continuacao ou retomada

Agente principal:
- `project-continuity-governance-guardian`

Skills de apoio:
- `skill-router`
- `documentation-governance-guardian`

Saida esperada:
- contexto recuperado
- pendencias reais
- limite claro do que nao deve ser refeito

### 2. Mudanca cross-layer

Agente principal:
- `system-product-architecture-guardian`

Skills de apoio:
- `solution-architecture-guardian`
- `engineering-foundation-guardian`
- `quality-guardian`

Saida esperada:
- impacto mapeado
- fronteiras claras
- ordem de execucao sem retrabalho

### 3. Produto, escopo e prioridade

Agente principal:
- `product-strategy-guardian`

Skills de apoio:
- `product-delivery-coordinator`
- `intelligence-coordinator`

Saida esperada:
- problema real
- prioridade
- criterio de aceite

### 4. UX, interface e experiencia

Agente principal:
- `experience-design-guardian`

Skills de apoio:
- `product-interface-architect-guardian`
- `design-system-guardian`
- `mobile-experience-guardian`
- `role-based-ux-flow-guardian`
- `accessibility-guardian`

Saida esperada:
- jornada clara
- interface coerente
- estados resilientes

### 5. Execucao frontend e backend

Agente principal:
- `implementation-guardian`

Skills de apoio:
- `engineering-foundation-guardian`
- `api-contract-guardian`
- `data-architecture`
- `test-strategy`
- `observability-guardian`

Saida esperada:
- implementacao alinhada
- contrato respeitado
- risco conhecido

### 6. Conteudo e SEO

Agente principal:
- `seo-ia-guardian`

Skills de apoio:
- `semantic-seo-ai-content-architecture-guardian`
- `documentation-governance-guardian`
- `ux-writing-interface-language-guardian`

Saida esperada:
- pagina indexavel
- copy coerente
- hierarquia correta

### 7. Dados, metricas e analise

Agente principal:
- `data-intelligence-database-architecture-guardian`

Skills de apoio:
- `data-collection-guardian`
- `behavior-analytics-interpreter`
- `experimentation-engine`
- `ml-personalization-architect`

Saida esperada:
- metrica confiavel
- pergunta bem definida
- decisao acionavel

### 8. Operacao, entrega e liberacao

Agente principal:
- `software-delivery-governance-guardian`

Skills de apoio:
- `delivery-operations-guardian`
- `change-incident-guardian`
- `quality-assurance-guardian`

Saida esperada:
- release segura
- rollback claro
- rastreabilidade minima

## Pacote minimo de missao

Antes de delegar qualquer trabalho, o agente responsavel deve ter:

- objetivo
- contexto atual
- arquivos afetados
- restricoes
- risco principal
- saida esperada
- owner da decisao
- skill principal
- skills de apoio, se houver ganho real

## Regras de uso de skills

- Uma skill principal por missao.
- Skills de apoio so entram se reduzirem erro, retrabalho ou ambiguidade.
- Nao carregar skill por costume.
- Nao carregar skill para compensar falta de escopo.
- Nao usar skill para roubar autoridade de outro agente.

## Regras de escrita e registro

- Toda mudanca relevante deve passar pelo changelog do projeto.
- Todo ajuste de papel, matriz ou ordem de leitura deve ser rastreavel.
- Se um agente nao existir no registry externo, ele nao deve ser tratado como oficial.
- Se uma skill nao existir no catalogo externo, ela nao deve ser presumida.

## Falhas que precisam bloquear

- contexto insuficiente
- conflito de autoridade
- duplicidade de papel
- referencial inexistente
- tentativa de executar sem leitura previa
- tentativa de alterar memoria ou governanca sem aprovacao

## Resultado esperado

Este bridge reduz improviso, corta retrabalho e faz cada missao entrar direto na camada certa, com o menor conjunto de agentes e skills necessario.
