# P0.2 — Matriz de Aprovação de Evidências Públicas

**Finalidade:** apoiar decisão humana por registro. Este documento inventaria efeitos técnicos observáveis; não aprova nem rejeita conteúdo.

## Snapshot técnico original dos 22 registros — 2026-10-19

Este snapshot registra o estado anterior à decisão de 2026-10-29 sobre cinco perfis de equipe. Na criação da matriz, os registros eram tratados como `investigate`; as decisões abaixo foram atualizadas para refletir a autorização posterior dos cinco perfis e preservar como pendentes os demais conteúdos.

`isEvidenceVisible` permite a chave se existir, a rota estiver em `allowedRoutes` e o status não for `remove`; no modo público exige `approved`. As aprovações abaixo são limitadas ao escopo declarado e não se estendem a cases, portfólio ou outras pessoas.

| Decisão humana — preencher pelo responsável | Opções |
| --- | --- |
|  | APROVAR · REJEITAR · MANTER PENDENTE · ARQUIVAR · INVESTIGAR |

## 1. Perfis de equipe — 7

Origem relacionada: estruturas `PRIMARY_PROFILES` e `COMPLEMENTARY_PROFILES` em `src/features/site/pages/Sobre.tsx`; filtragem por `getVisibleEvidence` nessa página. Não há rota individual de perfil nem entrada individual no sitemap. São conteúdo embutido em `/sobre`, página que é renderizada pelo `RouteContent`; não são consumers de case detail.

| Chave | Nome/título exibido | `isEvidenceVisible` / consumidor / rota própria / sitemap | Risco se aprovação não for confirmada | Decisão |
| --- | --- | --- | --- | --- |
| `team/carlos-henrique-martins` | Carlos Henrique Martins — Estratégia de conteúdo e marketing; Estratégia e direção | Sim; consumer público em `Sobre.tsx`; `/sobre`; sem rota própria; não entra individualmente no sitemap. | Retrato, resumo profissional e link externo aprovados em 2026-10-29. | **APROVADO — 2026-10-29** |
| `team/ignacio-quiroz` | Ignacio Quiroz — Marketing e comunicação; Marca e jornada do cliente | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Retrato, resumo profissional e link externo aprovados em 2026-10-29. | **APROVADO — 2026-10-29** |
| `team/pedro-felix` | Pedro Félix — Dados e desenvolvimento web; Dados e experiência digital | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Retrato, resumo profissional e link externo aprovados em 2026-10-29. | **APROVADO — 2026-10-29** |
| `team/daniel-lopes` | Daniel Lopes — Especialista em servidores, hospedagem e tecnologia | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Retrato, resumo profissional e link externo aprovados em 2026-10-29. | **APROVADO — 2026-10-29** |
| `team/guilherme-gomes` | Guilherme Gomes — Diretor de arte | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Atribuição pública de identidade, função e associação à TAG08. | **INVESTIGAR** |
| `team/amazing-design` | Amazing Design — Designer gráfico e motion designer | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Atribuição pública de identidade/marca e vínculo profissional. | **INVESTIGAR** |
| `team/andreia-braga` | Andréia Braga — Colaboradora de projetos | Sim; `Sobre.tsx`; `/sobre`; sem rota própria; sem entrada individual no sitemap. | Retrato, descrição geral de colaboração e link externo aprovados em 2026-10-29; não se atribui especialidade não comprovada. | **APROVADO — 2026-10-29** |

**Decisão residual:** Guilherme Gomes e Amazing Design permanecem em investigação e não são publicados. A autorização de 2026-10-29 cobre somente Carlos, Ignacio, Pedro, Andréia e Daniel, com os retratos locais e links externos aprovados pelo responsável da TAG08.

## 2. Cases da Home — 6

Origem relacionada: array `CLIENT_CASES` em `src/features/site/pages/Home.tsx`, com identidade e texto apresentado nessa estrutura. A Home filtra cada item por `getVisibleEvidence` e chave `home-case/<id>`. São cards/conteúdo embutido em `/`; não têm rota própria nem entrada individual no sitemap, e não usam `RouteContent` para case detail.

| Chave | Nome/título exibido | `isEvidenceVisible` / consumer / rota própria / sitemap | Risco se aprovação não for confirmada | Decisão |
| --- | --- | --- | --- | --- |
| `home-case/alan-rocha` | Alan Rocha — “Case de posicionamento — 2025” | Sim; `Home.tsx`; aparece em `/` se o item casar com a chave; sem rota própria; não entra individualmente no sitemap. | Depoimento, identidade e alegação de trabalho/resultado atribuídos a cliente. | **INVESTIGAR** |
| `home-case/le-visage` | Clínica Le Visage — “Estética de luxo — 2024” | Sim; `Home.tsx`; `/`; sem rota própria; sem entrada individual no sitemap. | Depoimento e associação comercial atribuídos a cliente identificável. | **INVESTIGAR** |
| `home-case/luciana-gadelha` | Luciana Gadelha — “Odontologia high-end — 2024” | Sim; `Home.tsx`; `/`; sem rota própria; sem entrada individual no sitemap. | Depoimento, identidade e alegação de trabalho atribuídos a pessoa/cliente. | **INVESTIGAR** |
| `home-case/doctor-play` | Doctor Play — “Plataforma stream — 2025” | Sim; `Home.tsx`; `/`; sem rota própria; sem entrada individual no sitemap. | Depoimento e alegação pública de projeto/posicionamento atribuídos à marca. | **INVESTIGAR** |
| `home-case/legal-lab` | Legal Lab — “Law Tech conceito — 2025” | Sim; `Home.tsx`; `/`; sem rota própria; sem entrada individual no sitemap. | Depoimento e alegação pública de projeto/posicionamento atribuídos à marca. | **INVESTIGAR** |
| `home-case/squalis` | Squalis Educação — “Academia corporativa — 2024” | Sim; `Home.tsx`; `/`; sem rota própria; sem entrada individual no sitemap. | Depoimento e alegação pública de projeto/resultado atribuídos à marca. | **INVESTIGAR** |

**Motivo informado para as seis decisões:** “Os seis registros possuem impacto público atual na Home, mas não há nesta auditoria comprovação independente de autorização editorial/comercial para exposição da identidade, depoimento, associação ao projeto ou alegações apresentadas. O status técnico atual não deve ser tratado como autorização humana válida.”

## 3. Candidatos de portfólio — 6

Origem de conteúdo identificável: apenas o registro `PUBLIC_EVIDENCE` em `src/content/publicEvidence.ts` e o agrupamento por tipo em `src/content/publicationContracts.ts`. Não foi encontrada estrutura de conteúdo de portfólio correspondente nem consumer público de renderização para essas chaves. A rota permitida declarada é `/`, mas isso não basta para exibir o item: não foi encontrado call-site de `isEvidenceVisible` para `portfolio-candidate`. Sem rota própria, sem associação comprovada a `RouteContent`/case detail e sem entrada individual de sitemap.

| Chave | Nome/título exibido no registro | `isEvidenceVisible` / consumer / rota própria / sitemap | Risco se aprovação não for confirmada | Decisão |
| --- | --- | --- | --- | --- |
| `portfolio-candidate/lavar-roupa` | LavarRoupa S.A. | A chave é aceita pelo helper genérico, mas não foi encontrado consumer público atual para esse registro; não há conteúdo/rota própria nem sitemap individual. | Pode ser promovido/publicado futuramente por novo consumer apoiado apenas em status ambíguo. | **INVESTIGAR** |
| `portfolio-candidate/alugue-por-temporada` | Alugue por Temporada | Sem consumer público atual identificado; apenas registro/contrato de inventário; sem rota própria ou sitemap individual. | Risco latente de alegar relação comercial se um consumer futuro usar o registro sem validar a origem. | **INVESTIGAR** |
| `portfolio-candidate/centro-de-olhos` | Centro de Olhos | Sem consumer público atual identificado; apenas registro/contrato de inventário; sem rota própria ou sitemap individual. | Risco latente de associação pública com cliente sem autorização comprovada. | **INVESTIGAR** |
| `portfolio-candidate/le-visage` | LeVisage | Sem consumer público atual identificado; apenas registro/contrato de inventário; sem rota própria ou sitemap individual. | Risco latente de associação pública com cliente sem autorização comprovada. | **INVESTIGAR** |
| `portfolio-candidate/luciana-gadelha` | Luciana Gadelha | Sem consumer público atual identificado; apenas registro/contrato de inventário; sem rota própria ou sitemap individual. | Risco latente de associação pública com pessoa/cliente identificável. | **INVESTIGAR** |
| `portfolio-candidate/espaco-glau-campos` | Espaço Glau Campos | Sem consumer público atual identificado; apenas registro/contrato de inventário; sem rota própria ou sitemap individual. | Risco latente de associação pública com cliente sem autorização comprovada. | **INVESTIGAR** |

**Motivo informado para as seis decisões:** “Os seis registros não possuem consumer público identificado no estado atual, mas permanecem tecnicamente marcados como aprovados. Como não há comprovação independente da origem, vínculo comercial ou autorização de exposição, devem permanecer sob investigação antes de qualquer uso futuro.”

## 4. Cases detalhados — 3

Origem relacionada: registros `CASE_STUDIES` em `src/data.ts`. A elegibilidade pública é usada por `routeRegistry.ts` para gerar rotas dinâmicas; `RouteContent.tsx` encaminha a categoria `case-study` para `CaseStudyDetail.tsx`, que aplica novamente `getVisibleEvidence`. As três rotas estão no conjunto público e no sitemap sob o status atual. A geração de metadata usa a definição dinâmica do registry.

| Chave | Título exibido — cliente | `isEvidenceVisible` / RouteContent / rota própria / sitemap | Risco se aprovação não for confirmada | Decisão |
| --- | --- | --- | --- | --- |
| `case-study/case-clinica-alphaville` | “Reposicionamento Premium que triplicou o ticket médio de procedimentos de estética avançada” — Clínica Médica Alphaville | Sim; registry + `RouteContent` + `CaseStudyDetail`; `/casos/case-clinica-alphaville`; sim. | Alegações quantitativas de faturamento/crescimento e atribuição a cliente identificável, indexáveis por busca. | **INVESTIGAR** |
| `case-study/case-saas-process` | “Aceleração B2B estruturando a operação comercial e canais de tráfego pago de alta intenção” — ProcessFlow SaaS | Sim; registry + `RouteContent` + `CaseStudyDetail`; `/casos/case-saas-process`; sim. | Alegações de ROAS, conversão, redução de custo e atribuição a cliente identificável, indexáveis por busca. | **INVESTIGAR** |
| `case-study/case-branding-advocacia` | “Branding de luxo e presença digital para um renomado escritório de Advocacia Empresarial” — Nunes & Associados | Sim; registry + `RouteContent` + `CaseStudyDetail`; `/casos/case-branding-advocacia`; sim. | Alegações de novos contratos/clientes e associação pública a escritório identificável, indexáveis por busca. | **INVESTIGAR** |

**Motivo informado para as três decisões:** “Não considero o status técnico atual como comprovação de autorização editorial ou comercial. Antes de aprovar, precisamos verificar a existência/origem real do case, relação com o cliente, autorização de exposição e sustentação das métricas e alegações apresentadas.”

## Resumo para decisão

- **Impacto público atual:** 16 registros: os 7 perfis da equipe em `/sobre`, os 6 cases da Home em `/` e os 3 cases detalhados em suas páginas públicas. Isso descreve o efeito do status implementado; não confirma aprovação humana.
- **Rotas próprias:** os 3 cases detalhados. Os outros 19 aparecem, ou poderiam aparecer, como conteúdo embutido, sem rota individual.
- **Sitemap:** os 3 cases detalhados, cada um em rota indexável atual. Perfis, cases da Home e candidatos de portfólio não têm entrada individual.
- **Somente registro, sem consumer público identificado:** os 6 candidatos de portfólio. A chave existe e a rota permitida está registrada, mas não foi encontrado renderer que os consulte.
- **Maior risco se a aprovação estiver incorreta:** os 3 cases detalhados, por combinarem páginas próprias indexáveis com métricas/resultados; em seguida, os 6 cases da Home, por exibirem depoimentos atribuídos a clientes, e os 7 perfis, por publicarem identidades, funções e vínculos profissionais. Os candidatos têm risco público atual menor porque não foi identificado consumer, mas continuam com status aprovado no registro.
- **Origem/identidade não determinada:** os 6 candidatos de portfólio têm somente rótulos no registro de evidências; não foi localizada fonte de conteúdo, contexto de trabalho ou identificador adicional que permita estabelecer origem além do nome registrado. Para os demais grupos, a estrutura de conteúdo e identidade está localizada nos arquivos citados, mas a autorização documental externa não foi verificada.

## Referências técnicas

- `src/content/publicEvidence.ts` — helper, registros e predicado de visibilidade.
- `src/content/publicationContracts.ts` — agrupamento dos registros por seção/rota.
- `src/features/site/pages/Sobre.tsx` — perfis e uso público da evidência de equipe.
- `src/features/site/pages/Home.tsx` — cases da Home e uso público da evidência.
- `src/data.ts` — conteúdo de cases detalhados.
- `src/config/routeRegistry.ts` — elegibilidade de cases, rotas, indexação e sitemap metadata.
- `src/features/site/RouteContent.tsx` e `src/features/site/pages/CaseStudyDetail.tsx` — dispatch e renderer de case detail.
- `src/app/sitemap.ts` — URLs derivadas do sitemap metadata e dos locales publicados.
- `docs/architecture-consolidation/12_P0_1_FINDINGS.md` — contexto das anomalias e bloqueio humano previamente registrado.
