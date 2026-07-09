# TAG08 Agent Router

## Objetivo

Definir a logica para escolher o agente responsavel por uma missao e, em seguida, permitir que esse agente selecione a melhor skill para executar o trabalho.

## Regra central

Skill nao escolhe agente.
Agente nao escolhe autoridade fora do proprio escopo.
O router escolhe o menor conjunto de agentes com autoridade suficiente.

## Ordem correta

1. Entender a missao.
2. Classificar a camada afetada.
3. Escolher o agente principal.
4. Definir se existe agente de apoio.
5. Escolher a skill principal.
6. Acrescentar skills de apoio apenas se houver ganho real.
7. Registrar a decisao.

## Camadas de roteamento

### 1. Continuacao e contexto

Agente principal:
- `project-continuity-governance-guardian`

Quando usar:
- retomada de projeto
- sessao nova sem contexto
- risco de retrabalho
- estado real incerto

### 2. Estrategia e escopo

Agente principal:
- `product-strategy-guardian`

Quando usar:
- problema vago
- prioridade indefinida
- criterio de aceite ausente
- valor de negocio ainda confuso

### 3. Mudanca sistemica

Agente principal:
- `system-product-architecture-guardian`

Quando usar:
- impacto em mais de uma camada
- front + back + dados
- dependencias cruzadas
- risco de duplicidade

### 4. Experiencia e interface

Agente principal:
- `experience-design-guardian`

Quando usar:
- jornada
- UI
- fluxo
- acessibilidade
- navegacao

### 5. Execucao tecnica

Agente principal:
- `implementation-guardian`

Quando usar:
- implementacao frontend
- implementacao backend
- integracao
- ajuste sem nova decisao arquitetural

### 6. Qualidade e liberacao

Agente principal:
- `quality-guardian`

Quando usar:
- risco de regressao
- necessidade de confianca ampla
- criterios de liberacao

### 7. Operacao e entrega

Agente principal:
- `delivery-operations-guardian`

Quando usar:
- deploy
- observabilidade
- readiness operacional
- caminho ate producao

### 8. Dados e inteligencia

Agente principal:
- `data-intelligence-database-architecture-guardian`

Quando usar:
- metrica
- SQL
- modelagem
- performance
- qualidade de dados

### 9. Conteudo e SEO

Agente principal:
- `seo-ia-guardian`

Quando usar:
- pagina
- slug
- headings
- canonical
- discoverability

## Escolha de skills pelo agente

Depois que o agente principal for escolhido, ele aplica a logica do `skill-router` para decidir a skill principal e as skills de apoio.

Regra pratica:
- um agente pode carregar uma skill principal
- skills de apoio entram so quando a complexidade pede
- se houver conflito entre skills, o agente responsavel decide ou escala

## Sinais de escolha

### Escolher agente de continuidade se:
- o usuario fala em voltar, retomar, continuar ou descobrir onde parou

### Escolher agente sistemico se:
- a mudanca atravessa modulo, fluxo, contrato, dado ou operacao

### Escolher agente de estrategia se:
- o problema real ainda nao esta claro

### Escolher agente de execucao se:
- a decisao principal ja existe e falta implementar

### Escolher agente de qualidade se:
- o risco de regressao domina a missao

## Saida obrigatoria

Toda decisao do router deve gerar:

- agente principal
- agente de apoio, se houver
- skill principal
- skills de apoio, se houver
- motivo da escolha
- risco principal
- proximo passo

## Anti-padroes

- chamar mais de um agente sem necessidade
- escolher skill antes de escolher agente
- usar skill para compensar falta de escopo
- pular continuidade e depois tentar reconstruir contexto no meio da execucao
- chamar agente de baixa autoridade para decidir algo estrutural

## Resultado esperado

Menos improviso.
Menos retrabalho.
Menos contexto desperdicado.
Mais precisao na primeira tentativa.
