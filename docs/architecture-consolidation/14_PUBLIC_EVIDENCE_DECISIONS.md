# P0.3 — Decisões humanas de evidências públicas

**Data das decisões registradas:** 2026-10-19  
**Responsável:** usuário responsável da TAG08 que forneceu explicitamente as decisões nesta conversa; identificação nominal não informada.  
**Fonte da matriz:** `docs/architecture-consolidation/13_PUBLIC_EVIDENCE_APPROVAL_MATRIX.md`.

## Decisão consolidada

Os 22 registros receberam a decisão humana **INVESTIGAR**. A decisão significa que a autorização editorial/comercial, a origem e as alegações ainda precisam ser verificadas. Não equivale a aprovação, rejeição nem autorização para publicação.

O status técnico atual `approved`, a data e a referência presentes em `publicEvidence.ts` permanecem como estado do código, sem alteração nesta etapa. Eles não substituem as decisões humanas registradas aqui. Consequentemente, **a decisão INVESTIGAR ainda não está aplicada ao runtime**.

## Grupo 1 — Cases detalhados (3)

| Chave | Identidade/título | Decisão | Impacto público atual | Impacto técnico esperado se a decisão for aplicada |
| --- | --- | --- | --- | --- |
| `case-study/case-clinica-alphaville` | Clínica Médica Alphaville — reposicionamento que alega triplicar ticket médio | INVESTIGAR | Publicado na rota `/casos/case-clinica-alphaville`; listado no sitemap. | Deixar de qualificar como publicado; excluir da lista de rotas de cases e do sitemap até decisão posterior. O tratamento HTTP de URL direta requer definição/validação na implementação futura. |
| `case-study/case-saas-process` | ProcessFlow SaaS — aceleração B2B, ROAS e resultados comerciais | INVESTIGAR | Publicado na rota `/casos/case-saas-process`; listado no sitemap. | Deixar de qualificar como publicado; excluir da lista de rotas de cases e do sitemap até decisão posterior. O tratamento HTTP de URL direta requer definição/validação na implementação futura. |
| `case-study/case-branding-advocacia` | Nunes & Associados — branding e presença digital | INVESTIGAR | Publicado na rota `/casos/case-branding-advocacia`; listado no sitemap. | Deixar de qualificar como publicado; excluir da lista de rotas de cases e do sitemap até decisão posterior. O tratamento HTTP de URL direta requer definição/validação na implementação futura. |

## Grupo 2 — Cases da Home (6)

| Chave | Identidade/título | Decisão | Impacto público atual | Impacto técnico esperado se a decisão for aplicada |
| --- | --- | --- | --- | --- |
| `home-case/alan-rocha` | Alan Rocha — Case de posicionamento, 2025 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |
| `home-case/le-visage` | Clínica Le Visage — Estética de luxo, 2024 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |
| `home-case/luciana-gadelha` | Luciana Gadelha — Odontologia high-end, 2024 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |
| `home-case/doctor-play` | Doctor Play — Plataforma stream, 2025 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |
| `home-case/legal-lab` | Legal Lab — Law Tech conceito, 2025 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |
| `home-case/squalis` | Squalis Educação — Academia corporativa, 2024 | INVESTIGAR | Pode aparecer publicamente na Home. | Ocultar do consumer público da Home enquanto estiver em investigação; não cria rota nem entrada individual de sitemap. |

## Grupo 3 — Equipe (7)

| Chave | Identidade/função apresentada | Decisão | Impacto público atual | Impacto técnico esperado se a decisão for aplicada |
| --- | --- | --- | --- | --- |
| `team/carlos-henrique-martins` | Carlos Henrique Martins — Estrategista de negócios digitais | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/ignacio-quiroz` | Ignacio Quiroz — Analista de marketing e comunicações | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/pedro-felix` | Pedro Félix — Analista de dados e desenvolvedor front-end | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/daniel-lopes` | Daniel Lopes — Gerente de infraestrutura de TI | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/guilherme-gomes` | Guilherme Gomes — Diretor de arte | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/amazing-design` | Amazing Design — Designer gráfico e motion designer | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar a associação profissional/comercial enquanto marca, função/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |
| `team/andreia-braga` | Andréia Braga — Colaboração de projeto | INVESTIGAR | Exibido publicamente em `/sobre`. | Ocultar o perfil enquanto identidade, colaboração/vínculo e autorização não forem confirmados; sem rota individual ou entrada individual de sitemap. |

## Grupo 4 — Candidatos de portfólio (6)

| Chave | Identidade registrada | Decisão | Impacto público atual | Impacto técnico esperado se a decisão for aplicada |
| --- | --- | --- | --- | --- |
| `portfolio-candidate/lavar-roupa` | LavarRoupa S.A. | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |
| `portfolio-candidate/alugue-por-temporada` | Alugue por Temporada | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |
| `portfolio-candidate/centro-de-olhos` | Centro de Olhos | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |
| `portfolio-candidate/le-visage` | LeVisage | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |
| `portfolio-candidate/luciana-gadelha` | Luciana Gadelha | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |
| `portfolio-candidate/espaco-glau-campos` | Espaço Glau Campos | INVESTIGAR | Nenhum consumer público identificado; sem rota ou sitemap. | Manter fora de qualquer publicação enquanto em investigação; se houver consumer futuro, ele só poderá publicar mediante aprovação explícita. |

## Situação pública consolidada

- **Efetivamente publicados segundo os consumers atuais:** 16 registros — 7 perfis em `/sobre`, 6 cases na Home e 3 cases detalhados em rotas próprias. Os 3 cases detalhados também entram no sitemap.
- **Sem consumer público identificado:** 6 candidatos de portfólio. Estão registrados como evidência, mas a auditoria não encontrou renderer que os exiba nem rota própria ou URL no sitemap.
- **Decisão humana versus runtime:** todos os 22 estão decididos como `INVESTIGAR` nesta documentação; ainda assim, o runtime não conhece essa decisão e mantém o status de código que permite publicação dos 16 itens acima. Este documento não altera essa situação.

## Mudanças técnicas futuras necessárias

Uma implementação futura, mediante autorização explícita, precisará representar `INVESTIGAR` como estado editorial não publicável — por estado de evidência dedicado ou campo de decisão separado — e garantir que somente aprovação humana explícita satisfaça o gate público. Não se deve mapear investigação para `approved` nem inferir aprovação a partir de data, owner ou referência técnica.

O gate deverá ser aplicado de forma consistente aos consumers de equipe (`Sobre`), Home, detail de cases e geração de rotas públicas, `staticRouteSegments`, metadata/indexabilidade e sitemap. Candidatos de portfólio devem continuar sem consumer até aprovação e fonte de conteúdo verificáveis. Testes futuros devem cobrir que registros em investigação não renderizam publicamente, não criam rota de case, não entram no sitemap e não são tratados como aprovados em modo de review/publicação; a política do modo local de review deverá permanecer explicitamente separada.

Não foi tomada nesta etapa decisão sobre ocultação imediata, status HTTP de URLs antigas, redirect, remoção de conteúdo ou descarte de dados. Esses comportamentos precisam de escopo e autorização próprios.

## Blockers restantes

1. Verificar a existência e origem dos três cases detalhados e sustentar suas métricas, alegações, relação com os clientes e autorização de exposição.
2. Verificar origem, relação comercial, autorização de exposição e conteúdo/depoimentos dos seis cases da Home.
3. Confirmar identidade, vínculo, função/título e autorização de exposição dos sete perfis de equipe; confirmar também a associação comercial de Amazing Design com a TAG08.
4. Determinar origem, vínculo comercial e autorização de exposição dos seis candidatos de portfólio antes de criar qualquer consumer.
5. Decidir em missão futura se e quando aplicar tecnicamente `INVESTIGAR` como não publicável, incluindo o tratamento compatível de URLs de cases hoje públicas. Nenhuma alteração de produção está autorizada por este documento.

## Registro posterior — aplicação ao runtime (P0.4)

Em 2026-10-19, por autorização explícita na missão P0.4, a decisão humana `INVESTIGAR` foi aplicada ao runtime para os 22 registros listados acima. Este registro é um adendo ao snapshot decisório original: o texto histórico acima descreve corretamente o estado na data em que esta consolidação foi criada, mas a afirmação de que a decisão ainda não está aplicada foi superada pela implementação P0.4.

O estado editorial executável passou a distinguir `investigate` de `approved`, `pending` e `remove`. Somente `approved` satisfaz o gate público. O modo local de review continua podendo apresentar registros `investigate`, com identificação visual própria, sem incluí-los em rotas públicas ou sitemap. Nenhum conteúdo foi apagado ou substituído.

Os três cases detalhados deixaram de compor as rotas públicas, paths estáticos/indexáveis e sitemap; acesso direto em modo público segue o tratamento existente para rota de case sem evidência pública. Os cases da Home e perfis de equipe em investigação deixam de passar pelo consumer público. Os seis candidatos de portfólio continuam sem consumer público e também falham no gate. As evidências e os motivos humanos originais permanecem preservados neste documento e na matriz P0.2.

Referência técnica da aplicação: `docs/architecture-consolidation/15_P0_4_INVESTIGATE_IMPLEMENTATION.md`.

