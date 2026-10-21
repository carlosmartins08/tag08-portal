# P1.1 — Reconciliação de portfólio, oferta e política de rotas

**Modo:** ANALYZE / DECIDE — sem implementação.  
**Baseline observado:** branch `p2-home-cases-consolidation`, commit `09937bb`, worktree limpo no início da análise.  
**Data:** 2026-10-19.

## 1. Fontes, escopo e limites de evidência

### Decisões de negócio tratadas como aprovadas

Este relatório considera como **ALVO APROVADO** as famílias e regras explicitadas na missão: Presença Digital/Gestão de Redes Sociais (planos Start, Base e Performance, sem preço público), Produção Audiovisual, Tecnologia (websites, e-commerce e soluções digitais específicas), Assessoria Estratégica/Negócios, Branding/Posicionamento e Processos/Operação (Process Intelligence e Process Activation). SEO, tráfego pago e mecanismos de performance são capacidades, não famílias independentes por padrão. A nomenclatura pública de parceria é **Programa de Parceria**.

### Limitação sobre o BRM

Não foi localizado no repositório um arquivo ou artefato identificável como BRM. As decisões acima são portanto a fonte de negócio aprovada fornecida diretamente nesta missão; não afirmo ter comparado uma versão documental externa do BRM. A ausência impede validar detalhes comerciais além do contrato explícito, como escopo/termos atuais de hospedagem, comissões, preços de referência e prioridade de cada canal.

### Fontes técnicas

- Registro e política de rotas: `src/config/routeRegistry.ts` (tipos e definições, linhas 14–60 e 61–305; aliases e derivados, 308–490).
- Renderização: `src/features/site/RouteContent.tsx` (imports e dispatch, linhas 8–50).
- Resolução, canonical, robots e redirects de locale: `src/app/[locale]/[[...segments]]/page.tsx` (resolução e metadata, aproximadamente 52–115).
- Sitemap e robots: `src/app/sitemap.ts`, `src/app/robots.ts`.
- Navegação: `src/components/Header.tsx` (links principais e grupos de serviço, aproximadamente 47–74); `src/components/Footer.tsx` (listas localizadas de serviços/programas/institucional, aproximadamente 69–96).
- Página central de ofertas: `src/features/site/pages/Servicos.tsx` (domínios e destinos, linhas 19–97; caminhos por necessidade, aproximadamente 240–280).
- Home: `src/features/site/pages/Home.tsx` (`SERVICOS_TILES` e portfólio de serviços).
- Conteúdo e evidência pública: `src/content/publicEvidence.ts`; checkpoint P1: `docs/architecture-consolidation/22_P1_START_CHECKPOINT.md`; baseline: `docs/architecture-consolidation/01_CURRENT_STATE_MAP.md`, `03_ROUTE_AND_PAGE_INVENTORY.md` e `10_CONSOLIDATION_WAVES.md`.

## 2. Contagem e política atual observada

`routeRegistry` contém **19 definições**: 16 caminhos estáticos indexáveis, um padrão dinâmico de case, onboarding não indexável e o registro técnico `/404`. No estado atual, os 22 registros editoriais decididos como `investigate` não podem satisfazer o gate público; por isso o padrão `/casos/:id` produz **zero rotas públicas de case**. Assim:

- **16 caminhos canônicos estáticos** têm `indexable: true` e `includeInSitemap: true` e estão no sitemap em PT.
- **17 caminhos estáticos renderizáveis** existem no fluxo de página quando se inclui `/cliente/onboarding` (não indexável e fora do sitemap).
- O padrão de cases está registrado, mas hoje não tem instâncias publicáveis.
- `/404` está no registry com flags de não indexação, porém é excluído de `renderableRoutePaths` e não possui branch no `RouteContent`; a implementação Next de not-found é separada. Não deve ser tratado como oferta nem URL comercial.
- PT é o único locale indexável/publicado (`INDEXABLE_LOCALES = ["pt"]`). Prefixos EN/ES não representam páginas publicadas; a página localizada redireciona para o canonical PT quando a tradução não está pronta.
- O sitemap usa `routeSitemapMeta`, filtra novamente rotas e locales publicados. Aliases não são listados como URLs próprias; a resolução do catch-all canonicaliza e responde com redirect permanente.

“Indexável” aqui significa configuração do código, não confirmação de indexação efetiva pelo Google.

## 3. Inventário e classificação das rotas

Cada rota recebe exatamente uma classificação de destino. “Navegação” descreve links atuais em Header, Home, Serviços ou Footer; “sitemap/SEO” descreve a política no registry, não observação externa.

| Rota / tipo | Página e intenção atual; família | Navegação / consumer relevante | Estado técnico atual | Classificação e justificativa / impacto / destino recomendado |
|---|---|---|---|---|
| `/` | `Home.tsx`; command center institucional e caminhos de aquisição | Header; consumer principal das páginas e CTAs | Indexável, sitemap, PT; canonical `/` | **MANTER E EVOLUIR**. Deve orientar decisão, não repetir catálogo exaustivo. Home já encaminha para `/servicos`, páginas de família e `/contato`, mas os módulos `SERVICOS_TILES` ainda apresentam capacidades como Tráfego & Aquisição e Copywriting como tiles paralelos. UX/SEO: manter autoridade na Home e direcionar intenção para páginas canônicas; avaliar redundância sem remover blocos sem decisão de conteúdo. |
| `/sobre` | `Sobre.tsx`; confiança institucional, equipe e evidências | Header e Footer | Indexável, sitemap, PT; perfis de equipe sob gate público `investigate` não aparecem; outros ativos dependem de evidência própria | **MANTER**. Sustenta confiança, não é oferta. Preservar os gates de evidência; não inferir que existência de logos/cases ou de rota autoriza publicação. |
| `/servicos` | `Servicos.tsx`; triagem por necessidade e orientação para ofertas | Header (dropdown/CTA), Home e Footer | Indexável, sitemap, PT; apresenta quatro domínios explícitos (Presença, Marca, Audiovisual, Web) e caminhos para diagnóstico/contato | **MANTER E EVOLUIR**. É a LP central de decisão e o melhor ponto para tornar visíveis, sem catálogo inflado, as seis famílias aprovadas. Lacuna atual: Processos e Assessoria não estão no mesmo agrupamento inicial de quatro ofertas, embora tenham páginas próprias. Impacto UX: caminhos incompletos podem fazer o usuário supor que são mecanismos ou não existem. |
| `/servicos/gestao-de-redes-sociais` | `GestaoRedesSociais.tsx`; presença digital recorrente | Header (cluster), Home e Footer; plano/diagnóstico interno | Indexável, sitemap, PT | **MANTER E EVOLUIR**. É a rota canônica da família Social. Planos Start/Base/Performance aparecem nesta página e em Serviços, sem preço; isso coincide com o alvo. Consolidar a matriz de responsabilidades/escopo dos três planos aqui, sem abrir rotas de plano nem publicar preço. |
| `/servicos/producao-audiovisual` | `ProducaoAudiovisual.tsx`; produção audiovisual | Header (cluster), Home e Footer | Indexável, sitemap, PT | **MANTER**. É uma das famílias aprovadas e tem destino próprio; CTA leva a contato/consulta contextual. SEO: manter URL estável e links internos. |
| `/servicos/desenvolvimento-web` | `DesenvolvimentoWeb.tsx`; website e unidade digital | Header (cluster), Home e Footer | Indexável, sitemap, PT; alias `/desenvolvimento-web` | **MANTER E EVOLUIR**. Canonical apropriado para Websites, E-commerce e soluções digitais específicas; a própria página central descreve unidade digital/e-commerce e prontidão operacional. E-commerce e soluções específicas não possuem rotas próprias — não é necessariamente lacuna, desde que a LP explique escopo e encaminhe para `/contato`. Evitar criar páginas sem intenção de busca/oferta aprovada. |
| `/servicos/branding-identidade` | `Branding.tsx`; branding, identidade e posicionamento | Header (cluster), Home e Footer; alias `/branding` | Indexável, sitemap, PT | **MANTER**. Corresponde diretamente à família aprovada. CTA deve levar a conversa/diagnóstico, sem criar plano ou preço não aprovado. |
| `/servicos/assessoria-marketing-digital-estrategico` | `AssessoriaMarketingDigitalEstrategico.tsx`; direção estratégica e negócio, com diagnóstico próprio | Header (cluster), Footer e páginas de serviço; alias sem `/servicos` | Indexável, sitemap, PT; conteúdo menciona prioridades, posicionamento, canais e planejamento | **MANTER E EVOLUIR**. Corresponde à família Assessoria Estratégica/Negócios, mas título/slug focam marketing digital e podem sugerir uma oferta mais estreita. Preservar diagnóstico como mecanismo de qualificação, não família independente. Destino: LP de decisão de assessoria, integrada à rota de Contato. Exige alinhar nomenclatura de página/metadata sem perder histórico SEO. |
| `/servicos/process-intelligence` | `ProcessIntelligence.tsx`; diagnóstico, playbooks, processos e previsibilidade | Header (cluster), Home e Footer; alias `/process-intelligence` | Indexável, sitemap, PT | **MANTER**. Oferta aprovada da família Processos/Operação. Preservar autonomia de intenção e rota; diagnosticar processos é parte da oferta, não substitui o router geral de contato. |
| `/servicos/process-activation` | `ProcessActivation.tsx`; ativação/acompanhamento de processos | Header (cluster), Footer e páginas relacionadas; alias `/process-activation` | Indexável, sitemap, PT | **MANTER**. Oferta aprovada distinta de Process Intelligence; há diferença de intenção entre desenhar/entender o processo e apoiar adoção/execução. Evitar consolidar as duas rotas apenas por pertencerem à mesma família. |
| `/contato` | `Contato.tsx`; router de intenção/qualificação, canais e formulário | CTA principal do Header, Home, Serviços e Footer | Indexável, sitemap, PT | **MANTER E EVOLUIR**. Cumpre o papel de router, mas `CONTACT_SERVICE_OPTIONS` ainda lista “Tráfego e performance” e “Hospedagem e infraestrutura” como opções paralelas. Reclassificar posteriormente como capacidades/contexto ou decisão de necessidade, mantendo possibilidade de orientação; destino comercial é pré-venda/diagnóstico. O gap Contact→ClickUp já está documentado na P0 como implementação, não incerteza de rota. |
| `/trabalhe-conosco` | `TrabalheConosco.tsx`; candidatura e banco permanente de talentos | Footer; formulário/API de talentos | Indexável, sitemap, PT | **MANTER E EVOLUIR**. Alvo aprovado é banco permanente de talentos, não apenas vagas abertas. A descrição SEO atual fala em “candidate-se a nossas vagas”; pode criar expectativa de vaga ativa. Ajuste futuro deve comunicar candidatura espontânea/banco sem afetar a jornada de lead comercial. |
| `/insights` | `Insights.tsx`; conteúdo editorial/educacional | Header e Footer; alias `/blog` | Indexável, sitemap, PT | **MANTER**. Canal editorial, não família de serviço. Preservar conteúdo e URL; conferir ligações de artigos para famílias e diagnósticos. Não converter SEO/tráfego em ofertas por causa de categorias de conteúdo. |
| `/casos/:id` | `CaseStudyDetail.tsx`; prova detalhada | Acessível por links de cases quando houver; não aparece por case atualmente | Registry indexável/sitemap condicional; atualmente zero IDs por gate `investigate`; PT | **MANTER E EVOLUIR**. A infraestrutura deve continuar condicionada a aprovação editorial/comercial explícita. Impacto atual: nenhum case detalhado público nem entrada de case no sitemap. Só liberar após decisão de evidência por item; presença em `CASE_STUDIES` não é autorização. |
| `/cliente/onboarding` | `ClienteOnboarding.tsx`; coleta de briefing de projeto | Footer atual (link amplo), além de fluxo/contexto de cliente | Renderizável, `indexable: false`, fora do sitemap, PT | **MANTER E EVOLUIR**. Alvo: somente novos projetos/contratos e retomada segura por link mágico, sem portal/senha permanente nesta fase. O acesso atual é uma rota diretamente alcançável e o Footer a expõe a qualquer visitante; não há evidência de gate por magic link. Noindex reduz SEO, mas não controla acesso. Requer evoluir acesso/contexto e remover exposição genérica do Footer em etapa própria, sem criar conta pública. |
| `/sebraetec-impulsionando-empreendedores` | `Sebraetec.tsx`; orientação sobre programa, elegibilidade regional e contato | Footer (Programas), CTA por contexto; não aparece no dropdown principal de serviços | Indexável, sitemap, PT; metadata diz “até 70% de subsídio”; corpo ressalva que elegibilidade, percentual e aprovação dependem do Sebrae regional | **DECISÃO HUMANA NECESSÁRIA**. É um fluxo de programa/orientação, não uma das seis famílias. O corpo observado é consultivo e encaminha para consulta/contato, sem comprovar simulador de elegibilidade. A descrição de metadata mantém claim numérico “até 70%”, mais forte que as ressalvas do corpo. Decidir se a rota dedicada continua, se permanece apenas contextual, qual conteúdo/claim oficial pode ser publicado e qual posição de navegação é aprovada. Não inferir elegibilidade nem regra regional. |
| `/programa-afiliados` | `ProgramaAfiliados.tsx`; cadastro e simulador de comissão por indicação | Footer (Programas); links e CTAs de cadastro/WhatsApp | Indexável, sitemap, PT; terminologia “afiliados” em registry, página, CTA, rastreamento e links | **MANTER E EVOLUIR**. A oferta de parceria é válida como programa, mas nomenclatura pública aprovada é “Programa de Parceria”. Manter a rota existente durante reconciliação; em etapa futura decidir slug/canonical e eventual 301 antes de rename, preservando backlinks. Atualizar somente nomenclatura pública; identificadores internos de analytics não precisam de rename em massa. Confirmar separadamente se os termos atuais de comissão, percentuais, limite de 12 meses e tickets de referência seguem autorizados. |
| `/hospedagem-manutencao-sites` | `HospedagemManutencaoSites.tsx`; venda de hospedagem/manutenção com planos/simuladores e chamadas a infraestrutura | Footer (Serviços); não está no cluster do dropdown principal | Indexável, sitemap, PT; página extensa, ofertas de hosting e planos, referências de preço e CTAs de contratação | **DECISÃO HUMANA NECESSÁRIA**. Hospedagem/manutenção não está aprovada como família independente no conjunto informado. Pode ser capacidade/continuidade associada a Websites, mas a página parece uma oferta autônoma e contém condições comerciais extensas. Decidir se a oferta ainda é comercialmente ativa, o que é de fato prestado pela TAG08, se preço/planos permanecem públicos e se a página deve virar seção da LP Web ou continuar independente. Não remover/redirecionar por antiguidade. |
| `/404` | Registro `not-found`; intenção técnica de erro | Sem navegação; não é destino comercial | `indexable: false`, fora do sitemap e de `renderableRoutePaths`; sem branch explícita em `RouteContent`; Next tem `not-found.tsx` próprio | **NOINDEX**. Manter apenas como comportamento técnico de não encontrado, não URL pública de oferta. Não criar canonical/links de negócio; resolver a inconsistência de dispatch/not-found numa tarefa técnica separada, sem incluí-la na reconciliação comercial. |

### 3.1 Aliases atuais

| Alias | Canonical | Política/observação |
|---|---|---|
| `/process-intelligence` | `/servicos/process-intelligence` | Redirect permanente pelo canonicalizador; preservar sinal e links históricos. |
| `/process-activation` | `/servicos/process-activation` | Idem. |
| `/desenvolvimento-web` | `/servicos/desenvolvimento-web` | Idem. |
| `/branding` | `/servicos/branding-identidade` | Idem. |
| `/gestao-redes-sociais` | `/servicos/gestao-de-redes-sociais` | Idem. |
| `/blog` | `/insights` | Idem; corresponde a rótulo histórico de conteúdo editorial. |
| `/assessoria-marketing-digital-estrategico` | `/servicos/assessoria-marketing-digital-estrategico` | Idem; não resolve a decisão futura sobre nome mais amplo/estreito da oferta. |

Aliases não são rotas indexáveis independentes; não remover nem alterar sem revisar Search Console/backlinks e validar redirect 301.

## 4. Matriz de oferta aprovada

| Família aprovada | Oferta / subofertas observadas ou previstas | Rota canônica | Papel da página | CTA principal atual / destino da jornada | Situação |
|---|---|---|---|---|---|
| Gestão de Redes Sociais / Presença Digital | Planos Start, Base e Performance; escopo varia por profundidade e participação do cliente; sem preço público | `/servicos/gestao-de-redes-sociais` | LP de decisão de presença recorrente | Diagnóstico/conversa e CTA de contato contextual → `/contato` | Família presente; plano e responsabilidades já aparecem em GestaoRedesSociais e Servicos. Não criar uma rota por plano. |
| Produção Audiovisual | Captação, direção, edição, Reels/podcast e outros formatos segundo escopo | `/servicos/producao-audiovisual` | LP de decisão audiovisual | Consulta/contato contextual → `/contato` ou canal comercial | Família presente. Evitar confundir formato (Reels/podcast) com produto separado sem decisão. |
| Tecnologia | Websites; E-commerce; soluções digitais específicas | `/servicos/desenvolvimento-web` | LP de decisão tecnológica e de prontidão operacional | Diagnóstico de escopo/contato → `/contato` | Website presente. E-commerce e soluções específicas aparecem como subofertas em Serviços, mas não têm seção/rota dedicada identificada; confirmar suficiência da LP, não abrir URLs por padrão. |
| Assessoria Estratégica / Negócios | Organização de posicionamento, prioridades, comunicação, canais, planejamento e diagnóstico | `/servicos/assessoria-marketing-digital-estrategico` | LP consultiva de direção de negócio | Diagnóstico integrado → contato/consulta | Oferta presente; atual naming/slug pode restringir semanticamente “negócios” a “marketing digital”. Alinhar com BRM antes de renomear. |
| Branding / Posicionamento | Identidade, clareza de marca, reposicionamento e aplicação | `/servicos/branding-identidade` | LP de decisão de marca | Conversa/briefing → `/contato` | Família presente e rota dedicada coerente. |
| Processos e Operação | Process Intelligence; Process Activation | `/servicos/process-intelligence`; `/servicos/process-activation` | Duas LPs especializadas, com intenções distintas dentro da família | Diagnóstico/consulta → `/contato` | Ambas presentes e aprovadas. Não consolidar automaticamente: cada uma descreve uma etapa/intenção diferente. |

### Ofertas/capacidades sem página própria

- **E-commerce** e **soluções digitais específicas** estão absorvidos em Web/Unidade Digital; não há rota autônoma, e isso pode ser uma composição correta se a LP cobrir contexto, escopo e prontidão.
- **SEO, tráfego pago e performance** aparecem como tile/capacidade na Home e como opção no contato, sem rota dedicada canônica. Recomendação: tratá-los como mecanismos ligados a uma família/contexto, não criar LP independente sem decisão de oferta/BRM.
- **Planos sociais** aparecem em duas páginas, mas não há preço público. A página de Gestão é a fonte natural para escopo e comparação; Serviços deve resumir e encaminhar.
- Não foi identificada uma rota específica de “Soluções Digitais Específicas”; confirmar se deve ser conteúdo de Desenvolvimento Web, não nova família.

## 5. Inconsistências e gaps frente ao alvo

### Nomenclatura e catálogo

1. **Programa de Afiliados → Programa de Parceria:** diverge da nomenclatura pública aprovada em título/description do registry, headings, textos, CTAs e rótulos do Footer. O slug pode ficar temporariamente, pois uma mudança de canonical exige decisão SEO separada. Ocorrências técnicas de `affiliate` em tracking, função/simulador não precisam ser renomeadas para alinhar a interface.
2. **Home:** tiles “Tráfego & Aquisição” e “Copywriting Estratégico” apontam para `/servicos`, e não para ofertas/capacidades específicas. Isso é sinal de arquitetura de catálogo herdada, não necessariamente uma oferta autônoma. Evoluir Home como command center e manter essas capacidades subordinadas a uma família aprovada.
3. **Contato:** opções “Tráfego e performance” e “Hospedagem e infraestrutura” competem visualmente com as famílias aprovadas. Podem ser mantidas como necessidades/capacidades qualificadoras, mas devem ser agrupadas no router e não apresentadas como categorias de oferta de mesmo nível sem confirmação.
4. **Serviços:** seu primeiro agrupamento oferece quatro domínios; não torna Assessoria e Processos igualmente evidentes nessa seleção, embora exista cluster em Header/Footer e páginas indexáveis. É um gap de descoberta/navegação, não prova de oferta não aprovada.

### Acesso e jornada

- **Contato:** a rota atual é publicável e apropriada para intenção/qualificação; o formulário oferece orientação de serviço e o próprio texto chama o diagnóstico de inicial. A reconciliação comercial é manter uma entrada única que encaminha por necessidade.
- **Diagnóstico:** há diagnóstico contextual na página de Assessoria e em simuladores/setores. Esses instrumentos não devem criar novas famílias nem automaticamente virar tarefas no CRM; a rota `/contato` deve continuar como router adaptativo geral.
- **Onboarding:** está corretamente noindex e fora do sitemap, mas link no Footer o transforma em acesso amplo. Alvo é apenas novos projetos/contratos e retomada com link mágico; o código observado tem mecanismo de fila/localStorage e modo cliente/equipe, não evidência de autenticação por magic link. Acessibilidade URL direta não equivale a autorização de uso.
- **Carreiras:** rota existe e recebe candidaturas, mas title/description atuais enquadram como vagas; o alvo é banco de talentos permanente. Atualizar promessa/copy em etapa própria para evitar expectativa de vagas abertas.

### Sebraetec e parceria

- **Sebraetec:** página separada e em sitemap; atualmente funciona como orientação e captação por WhatsApp, não como simulador computacional de elegibilidade identificado. O corpo atual condiciona subsídio/aprovação ao Sebrae regional/projeto, mas o meta description do registry diz “até 70% de subsídio”. Esse contraste exige validação humana/jurídica/editorial. Não inferir elegibilidade nem números a partir de exemplos.
- **Programa de Parceria:** o nome está aprovado, mas regras comerciais existentes na página (10%, período de recorrência, tickets médios e prazos) não foram confirmadas pelo conjunto de decisões fornecido. O rename público não equivale à aprovação desses termos.

## 6. SEO, canonicalização e navegação

| Candidato | Risco observado | Canonical/destino provável (proposta, não decisão executada) | 301 futura? | Efeito em sitemap e links internos |
|---|---|---|---|---|
| Alias de serviço → rota `/servicos/...` | Baixo se alias preservado; risco de perda se removido | Canonical atual do registry | Não criar novo redirect: canonicalização já existe | Manter apenas canonical no sitemap; conservar links históricos como aliases até medir tráfego/backlinks. |
| `/programa-afiliados` → eventual `/programa-de-parceria` | Médio/alto: slug e copy indexados; eventual mudança pode perder sinais e backlinks | Decidir primeiro se o slug deve acompanhar a nova nomenclatura; recomendado preservar slug como alias se canonical mudar | Provável, somente depois de decisão comercial e SEO | Atual sitemap tem só `/programa-afiliados`; futuro rename requer 301, canonical, sitemap e links internos alinhados. Não decidir URL nesta etapa. |
| `/hospedagem-manutencao-sites` → possível seção da oferta Web | Alto: página longa, ofertas/planos, intenção própria e links no Footer; canibalização pode existir com Web sem medição | `/servicos/desenvolvimento-web` apenas se BRM confirmar manutenção como parte de Web e não houver intenção independente a preservar | Possível 301, condicionado a decisão e Search Console/backlinks | Se consolidada, retirar antiga URL do sitemap e substituir links internos; preservar conteúdo útil de suporte e manter redirect. Atualmente **DECISÃO HUMANA NECESSÁRIA**. |
| Assessoria URL/nome atual | Médio: nome “Marketing Digital” pode canibalizar capacidades de tráfego/serviço e estreitar “Negócios” | Canonical atual enquanto a oferta é validada; alternativa de slug não definida | Só se renomear após decidir posicionamento | Evitar duas páginas de assessoria; analisar consultas e backlinks antes de redirect. Alias atual deve permanecer. |
| Cases `/casos/:id` | Alto para publicação indevida; atualmente mitigado pelo gate `investigate` | Cada case individual após aprovação explícita | Sem redirect necessário agora; acesso a case não aprovado segue not-found conforme P0 | Zero cases atuais no sitemap; não reabrir gate por existir conteúdo ou links em dados. |
| Sebraetec | Médio: programa pode competir com páginas de Branding/Web/processos; meta description contém claim numérico divergente | Manter canonical atual enquanto a decisão humana define papel de programa | Ainda não justificável | Atualmente no sitemap e no Footer de programas. Se virar recurso contextual, retirar apenas após avaliar procura/backlinks e encaminhar links internos às ofertas adequadas. |
| `/cliente/onboarding` | Baixo em SEO (noindex e fora do sitemap), alto em acesso/contexto por estar no Footer | Manter path técnico atual; acessibilidade deve ser condicionada ao processo de contratação/link aprovado | Sem redirect previsto | Seguir noindex, fora do sitemap e canonical técnico coerente; retirar de navegação pública apenas após mudança funcional de acesso autorizada. |
| `/trabalhe-conosco` | Baixo; intenção de “vagas” pode divergir do banco permanente de talentos | Preservar canonical | Sem redirect previsto | Continuar indexável se candidatura permanente estiver aprovada; alinhar title/description/links para candidatura contínua. |

Robots atual permite crawling (`allow: /`) e aponta ao sitemap; controles de indexação são por metadata/route flags. Não foi encontrada política de robots dedicada a nenhuma rota comercial individual.

## 7. Decisões humanas necessárias

1. **BRM fonte/versionamento:** indicar a versão aprovada do BRM e sua localização consultável para validar detalhes não reproduzidos no resumo desta missão.
2. **Hospedagem/manutenção:** a TAG08 continua vendendo hospedagem como oferta separada? Quais planos, preços, responsabilidades e SLA estão vigentes? Ou hospedagem/manutenção é capacidade inclusa/adjacente à oferta Web?
3. **Programa de Parceria:** confirmar termos públicos do programa (percentuais, limites, tickets e forma/prazo de pagamento) separadamente da nomenclatura aprovada. O slug deve ser alterado para refletir o nome ou permanecer como URL histórica com título/copy novos?
4. **Sebraetec:** rota dedicada indexável é necessária ou a página deve ser apoio contextual? Deve aparecer apenas em Footer/programas ou também em páginas de oferta elegíveis? Confirmar texto/uso do claim “até 70%”, que aparece no meta description, conforme fonte oficial atual.
5. **Assessoria:** a oferta aprovada “Assessoria Estratégica / Negócios” deve adotar esse naming na página/metadata ou “Assessoria de Marketing Estratégico” é a forma pública escolhida? O slug atual deve permanecer?
6. **Onboarding:** confirmar qual mecanismo de distribuição do link mágico e quais papéis podem iniciá-lo. O alvo diz somente novos projetos/contratos, mas o app atual não mostra proteção de acesso por magic link e o Footer expõe a rota.
7. **Home / capacidades:** definir se Tráfego, SEO e Copywriting devem aparecer exclusivamente como capacidades dentro de famílias, ou se algum é produto autônomo aprovado (a premissa desta missão recomenda que não sejam famílias por padrão).
8. **E-commerce e soluções específicas:** confirmar se conteúdo e conversão dentro da LP Web bastam, ou se há volume/intenção de busca comprovada que justifique landing pages filhas.
9. **Carreiras:** confirmar a redação pública do banco permanente de talentos e se a rota deve explicitar candidatura espontânea, não vagas ativas.

## 8. Ordem recomendada de implementação após decisões

1. Anexar/identificar o BRM autoritativo e fechar as decisões acima; congelar nomes, escopos, claims, preços, termos e donos de cada oferta.
2. Aprovar uma tabela canônica Família → oferta → página → CTA → jornada; estabelecer `/servicos` como hub de decisão e `/contato` como router geral.
3. Resolver primeiro riscos de promessa/condição comercial: Sebraetec “até 70%”, termos do Programa de Parceria e planos/preços de hospedagem. Não publicar claims não validados.
4. Especificar o acesso de onboarding (link mágico, emissão/expiração/uso), remover exposição genérica de navegação e manter noindex/sitemap exclusion; então validar fluxo de novos contratos.
5. Definir destino da hospedagem/manutenção e estratégia de preservação SEO antes de qualquer remoção/consolidação de URL.
6. Alinhar nomes de oferta, metadata, CTAs, Contact options, Footer/Header e Home sem quebrar aliases; tratar SEO, canonical e 301 junto da mudança de naming e somente após medir links/consultas quando aplicável.
7. Ajustar a apresentação de Home/Serviços para cobrir as seis famílias sem transformar capacidades ou formatos em categorias paralelas; manter os três planos de Social sem preço público.
8. Atualizar gates de rota/SEO e testes de redirect, sitemap, robots, locale, onboarding e public evidence; executar browser QA das jornadas; só então liberar as alterações em commit separado por decisão.

## 9. Decisões seguras agora vs. ainda abertas

### Seguro para preservar sem implementação nesta missão

- PT como único locale publicado; gates de tradução/public evidence; canonicalização dos sete aliases existentes.
- Manter as páginas das seis famílias aprovadas e suas URLs canônicas enquanto o BRM é reconciliado.
- Não criar rotas de case enquanto a evidência estiver `investigate`.
- Não criar página/pricing separado para planos Start/Base/Performance.
- Tratar SEO/tráfego/performance como capacidades por padrão, não novas famílias.

### Ainda não autorizado para implementação

- Excluir, arquivar, redirecionar ou consolidar qualquer página comercial histórica.
- Alterar o canonical/slug do Programa de Parceria, Sebraetec, Hospedagem ou Assessoria.
- Prometer valor, subsídio, elegibilidade, comissão, SLA, hosting ou vaga sem validação comercial.
- Alterar navegação, Home, formulário, onboarding, sitemap, robots ou metadata.

## 10. Resultado da missão

- **19 definições no registry.**
- **16 rotas estáticas indexáveis e incluídas no sitemap em PT.**
- **1 padrão dinâmico de cases sem instância pública atualmente.**
- **1 rota de onboarding renderizável, noindex e fora do sitemap.**
- **1 registro técnico `/404`, noindex e sem render branch explícito.**
- Rotas que exigem decisão de negócio antes de consolidação: Sebraetec e hospedagem/manutenção; decisions adicionais de escopo/slug sobre Programa de Parceria e Assessoria permanecem abertas.
- Nenhum código, rota, navegação, conteúdo ou política SEO foi alterado nesta missão.

## P1.1B — Reconciliação com o TAG08 Knowledge System

### Autoridade e leitura das evidências

Esta seção complementa — não apaga nem reescreve — o diagnóstico P1.1. A seção original registrou corretamente o que o código fazia, mas sua afirmação de que o BRM não foi localizado no repositório não deve ser interpretada como ausência de decisões de negócio: o **TAG08 Knowledge System (TKS)** foi consultado em sua fonte externa, fora do repositório, em `C:\Users\leobe\.codex\.chatgpt-projects\g-p-6a47b988642081919ca96290eed2f4a5\sources`. Os arquivos consultados não foram alterados.

Aplicou-se a precedência indicada nesta missão: `01_TAG08_DNA_MASTER.md` → `02_POSICIONAMENTO_ESTRATEGICO.md` → `06_FILOSOFIA_COMERCIAL.md`, `07_FILOSOFIA_OPERACIONAL.md` e `08_GOVERNANCA_E_DECISAO.md` → portfólio/playbooks → implementação. O TKS decide intenção e princípios de oferta; o registry e as páginas servem como evidência do estado atual, não como aprovação comercial.

Evidências particularmente relevantes: `05_PORTFOLIO_E_OFERTAS.md` (Presença, Unidade Digital/E-commerce, Hospedagem e Manutenção, Reposicionamento Estratégico); `10_ONBOARDING_DE_CLIENTES.md` (confirmação comercial e condições prévias); `13_PLAYBOOK_DE_PROJETOS_DIGITAIS.md` (diagnóstico, modelagem e prontidão operacional antes de desenvolver); `02_POSICIONAMENTO_ESTRATEGICO.md` e `06_FILOSOFIA_COMERCIAL.md` (tráfego como captação orientada por dados e “tráfego não resolve tudo”); `15_GLOSSARIO_TAG08.md` (definição de Unidade Digital); `16_ANTI_PADROES.md` (não desenvolver e-commerce sem diagnóstico nem ignorar manutenção). Não foi encontrada definição TKS de regra oficial do Sebraetec, política econômica do Programa de Parceria ou política de carreiras; nesses pontos, prevalecem apenas as decisões já fornecidas diretamente nesta missão/P1, sem atribuição falsa ao TKS.

### Reconciliação dos temas

| Tema | Estado P1.1 | Evidência do TKS | Novo estado | Decisão restante |
|---|---|---|---|---|
| Hospedagem e Manutenção | Dúvida se o serviço existe, se é oferta autônoma e se deve permanecer em rota própria | `05_PORTFOLIO_E_OFERTAS.md` reconhece o serviço para infraestrutura, segurança, suporte e continuidade; `13_PLAYBOOK_DE_PROJETOS_DIGITAIS.md` inclui hospedagem e manutenção pós-entrega no ciclo digital; `16_ANTI_PADROES.md` alerta contra ignorar manutenção | **PARCIALMENTE RESOLVIDO** — serviço real; posicionamento coerente é oferta adjacente à família Tecnologia e continuidade/pós-entrega, não uma sétima família institucional | Decidir exposição: rota independente ou seção/continuidade da rota Web. Confirmar planos, preços, responsabilidades e condições atualmente publicados. Antes de eventual consolidação, avaliar procura, backlinks e links internos; não redirecionar agora. |
| E-commerce / Unidade Digital | Dúvida sobre oferta real, rota própria ou suficiência da rota Web | `05_PORTFOLIO_E_OFERTAS.md` define Unidade Digital/E-commerce como diagnóstico, modelagem, estruturação operacional e desenvolvimento tecnológico; `13_PLAYBOOK_DE_PROJETOS_DIGITAIS.md` condiciona desenvolvimento à prontidão operacional e define etapas/gates; `15_GLOSSARIO_TAG08.md` define unidade digital como operação, tecnologia, oferta, logística, atendimento e governança | **RESOLVIDO PELO KNOWLEDGE SYSTEM** quanto à oferta e sua sequência. A rota canônica atual de Tecnologia é `/servicos/desenvolvimento-web`; `/servicos` já nomeia “E-commerce”, mas a página individual Desenvolvimento Web não evidencia essa jornada de forma explícita | Não há evidência para uma LP/slug independente. Evoluir a página Web com uma seção/jornada interna de Unidade Digital e prontidão é a recomendação de menor duplicação. Reabrir LP filha somente com evidência de intenção de busca e decisão comercial. |
| Soluções digitais específicas | Dúvida sobre rota/página própria | DNA e posicionamento definem tecnologia como meio para estrutura, eficiência e crescimento; `05_PORTFOLIO_E_OFERTAS.md` e `13_PLAYBOOK_DE_PROJETOS_DIGITAIS.md` abrangem websites, e-commerce, sistemas/plataformas e projetos digitais conforme diagnóstico | **PARCIALMENTE RESOLVIDO** — pertence à família Tecnologia e deve ser absorvido pela rota Web/Unidade Digital por padrão; não há evidência de família independente | Nenhuma rota nova aprovada. Uma seção ou qualificação por tipo de solução pode ser definida na evolução da página, sem inventar escopo específico não descrito pelo TKS. |
| Onboarding | A rota e a exposição no Footer estavam descritas como possível dúvida de negócio | `10_ONBOARDING_DE_CLIENTES.md` inicia o processo após validação comercial e cobre contrato, pagamento, escopo, plano e condições; `16_ANTI_PADROES.md` proíbe iniciar sem contrato ou pagamento validados | **RESOLVIDO PELO KNOWLEDGE SYSTEM** quanto ao propósito e elegibilidade; o link amplo no Footer é **GAP CONFIRMADO** perante o alvo | Só permanece decisão técnica: mecanismo seguro de convite/acesso e retomada. Não é CTA genérico, geração de lead, suporte ou portal público. A URL técnica pode permanecer noindex, mas acesso e navegação precisam ser tratados em uma etapa funcional autorizada. |
| Assessoria e posicionamento | Dúvida se “Assessoria Estratégica / Negócios” é família ou se a rota atual define a categoria | `01_TAG08_DNA_MASTER.md` e `02_POSICIONAMENTO_ESTRATEGICO.md` colocam estratégia, posicionamento, crescimento e visão de negócio no centro; `02` associa “Consultoria” a clareza estratégica e decisão com método; `06_FILOSOFIA_COMERCIAL.md` estabelece diagnóstico antes da proposta | **RESOLVIDO PELO KNOWLEDGE SYSTEM** quanto à família: Assessoria Estratégica / Negócios. “Marketing digital estratégico” é formulação atual mais estreita, não evidência de uma família distinta. Diagnóstico é método de venda/qualificação, não oferta separada | Não definir novo slug nesta etapa. Naming público final da página/metadata e estratégia de canonical/redirect precisam ser fechados com intenção de busca e preservação SEO. |
| Branding / Reposicionamento | Dúvida se reposicionamento demanda serviço/rota paralela | `05_PORTFOLIO_E_OFERTAS.md` lista Reposicionamento Estratégico no portfólio de marca; posicionamento e linguagem do TKS tratam percepção, identidade e clareza como conectadas | **RESOLVIDO PELO KNOWLEDGE SYSTEM** — Reposicionamento pertence a Branding / Posicionamento; não justifica duplicar a família nem criar rota por padrão | Nenhuma decisão de negócio pendente sobre agrupamento. A URL atual `/servicos/branding-identidade` permanece canônica; não criar slug novo. A organização de conteúdo interna pode ser definida na evolução da página. |
| Tráfego / SEO / performance | Dúvida se são famílias/ofertas autônomas | `02_POSICIONAMENTO_ESTRATEGICO.md` traduz tráfego pago como captação orientada por dados e melhoria contínua e alerta contra tráfego sem posicionamento; `06_FILOSOFIA_COMERCIAL.md` afirma “Tráfego não resolve tudo” e exige diagnóstico antes da proposta | **RESOLVIDO PELO KNOWLEDGE SYSTEM**, em conjunto com a decisão de negócio já aprovada: capacidades/mecanismos por padrão, não famílias nem LPs independentes | Sem decisão para criar rota própria. Home deve priorizar famílias e pode contextualizar mecanismos subordinados; Serviços pode apresentá-los dentro da oferta pertinente; páginas de família os explicam somente quando parte do escopo; Contato pode capturar “tráfego” como necessidade percebida e encaminhar ao diagnóstico, não como produto equivalente. SEO segue capacidade, salvo aprovação comercial futura específica. |
| Carreiras / banco de talentos | A página atual parecia focada em vagas; havia dúvida sobre a intenção aprovada | O conjunto TKS consultado não define política de carreiras. A regra de negócio dada nesta missão/P1 aprova carreiras como banco permanente de talentos; o código atual já contém “Banco de Talentos / Candidatura Espontânea” e aviso de processamento para banco | **PARCIALMENTE RESOLVIDO** — destino de negócio vem da decisão aprovada, não do TKS; o estado atual contém sinal misto entre vagas e banco | Gap de copy/expectativa confirmado pelo registry/metadata e partes da página que falam em vagas. Não é necessária nova decisão sobre a existência do banco; a comunicação deve refletir candidatura contínua, sem prometer vaga ou seleção. |
| Programa de Parceria | P1.1 já reconhecia o nome aprovado, mas agregava decisões de slug, regras e economia | Nenhuma regra econômica do programa encontrada nos documentos TKS consultados; a decisão autoritativa da missão anterior fixa apenas o nome público | **PARCIALMENTE RESOLVIDO** — nomenclatura pública “Programa de Parceria” está resolvida; identificadores internos `affiliate` podem continuar técnicos | Permanecem: confirmar percentuais, prazo/recorrência e demais condições econômicas; decidir slug/canonical após análise de intenção, backlinks e links internos. Não inferir comissão, prazo ou regra a partir da página atual. |
| Sebraetec | Dúvida sobre a rota dedicada, claims, eligibilidade e posição de navegação | Não há regra Sebraetec nos documentos TKS consultados; DNA/anti-padrões sustentam linguagem responsável, mas não substituem fonte oficial externa | **CONTINUA EXIGINDO DECISÃO HUMANA/VALIDAÇÃO EXTERNA** | Confirmar com fonte oficial vigente elegibilidade, percentuais, abrangência regional, aprovação e claims. Decidir se mantém rota indexável dedicada e sua posição contextual. O claim “até 70%” no metadata é risco de publicação até prova oficial; não inferir regra do conteúdo histórico. |

### DECISÕES HUMANAS REALMENTE NECESSÁRIAS

As perguntas abaixo são as remanescentes após retirar dúvidas respondidas pelo TKS e pelas decisões já aprovadas:

1. **Hospedagem — exposição:** manter `/hospedagem-manutencao-sites` como rota pública independente ou apresentá-la como seção/continuidade da oferta Web? O serviço existe; a questão é de arquitetura de oferta e exposição. Até decisão, preservar a URL e não redirecionar.
2. **Hospedagem — termos comerciais:** os planos, preços, limites, responsabilidades e condições exibidos hoje estão vigentes e aprovados? O TKS reconhece a oferta, mas não aprova os valores publicados.
3. **Programa de Parceria — economia:** quais regras econômicas atuais podem ser publicadas? Nenhuma taxa, janela de recorrência, ticket ou prazo deve ser inferido do código.
4. **Programa de Parceria — slug/canonical:** manter `/programa-afiliados` como URL histórica com nomenclatura pública corrigida ou migrar futuramente para slug novo? Decidir após dados de busca, backlinks e dependências; sem mudança nesta etapa.
5. **Sebraetec — fonte externa e exposição:** obter validação oficial vigente dos claims/eligibilidade/percentuais/região; decidir se a rota segue indexável e se fica apenas em contexto/programas ou recebe outro nível de navegação. Nenhuma regra é inferida do TKS.
6. **Assessoria — SEO/naming da página:** família e papel estão resolvidos; falta decidir se o nome público/metadata adota linguagem mais ampla que “marketing digital estratégico” e se haverá mudança de URL, após análise de intenção e sinais SEO. Manter canonical atual enquanto isso.
7. **Onboarding — mecânica de acesso:** definir emissão, expiração, validação, retomada e destinatário do link seguro para cliente já contratado. O propósito não é questão aberta.

Não permanecem como decisões humanas: se Unidade Digital/E-commerce existe; se precisa automaticamente de LP própria; se Reposicionamento pertence a Branding; se tráfego deve ser família independente; se onboarding é um CTA para visitantes. A documentação resolve essas questões.

### Matriz canônica de famílias e ofertas

CTA/jornada abaixo expressa o encaminhamento coerente com o alvo aprovado. Quando diferir do CTA/código observado, a diferença é indicada; a tabela não declara implementação já realizada.

| Família aprovada | Oferta | Rota atual | Papel público | CTA canônico recomendado | Jornada | Status da decisão |
|---|---|---|---|---|---|---|
| Gestão de Redes Sociais / Presença Digital | Presença e gestão recorrente; planos públicos Start, Base e Performance, sem preço público | `/servicos/gestao-de-redes-sociais` | LP de decisão da família; explicar adequação por diagnóstico, não vender plano universal | Conhecer a abordagem / conversar sobre o momento → `/contato` | Necessidade percebida → diagnóstico comercial → recomendação de plano/escopo → proposta | **Decidido**. TKS reforça diagnóstico antes de plano. Não criar rota por plano nem publicar preços por inferência. |
| Produção Audiovisual | Produção audiovisual conforme objetivo, narrativa e formato | `/servicos/producao-audiovisual` | LP da família; formatos são meios, não necessariamente produtos separados | Conversar sobre uma produção → `/contato` | Objetivo e audiência → formato/escopo → proposta → produção | **Decidido** como família. Escopo específico continua sujeito à qualificação comercial. |
| Tecnologia | Websites, landing pages, catálogos e estruturas web | `/servicos/desenvolvimento-web` | LP canônica de tecnologia web; explicar estruturas e conversão/clareza | Conversar sobre estrutura web → `/contato` | Objetivo → diagnóstico → modelagem/escopo → desenvolvimento → teste/ativação → continuidade | **Decidido**. Página atual já cobre estruturas web amplas; não abrir rota duplicada sem intenção comprovada. |
| Tecnologia | Unidade Digital / E-commerce | `/servicos/desenvolvimento-web` (rota canônica atual); `/servicos` já cita e-commerce | Suboferta/jornada dentro da LP Web; demonstrar prontidão operacional antes do desenvolvimento | Avaliar uma unidade digital → `/contato` | Diagnóstico → modelagem → validação estratégica → estruturação operacional → desenvolvimento → teste → ativação/treinamento/acompanhamento | **Decidido** como oferta e sequência; **gap de apresentação** na página individual Web, que não evidencia e-commerce/jornada com a mesma clareza de `/servicos`. LP independente não aprovada. |
| Tecnologia | Soluções digitais específicas (sistemas/plataformas/estruturas conforme necessidade diagnosticada) | `/servicos/desenvolvimento-web` | Suboferta de tecnologia; escopo delimitado caso a caso | Descrever o problema/necessidade → `/contato` | Diagnóstico de problema e operação → definição de escopo → validação → construção/teste | **Decidido** como parte de Tecnologia; nenhum slug ou produto genérico adicional aprovado. |
| Tecnologia — continuidade adjacente | Hospedagem e Manutenção | `/hospedagem-manutencao-sites` | Serviço real de infraestrutura, suporte, segurança e continuidade pós-entrega; status de rota independente não decidido | Consultar continuidade/infraestrutura → contato comercial | Projeto/ambiente → diagnóstico de risco e necessidade → escopo/condições → sustentação | **Serviço decidido; exposição e termos parcialmente abertos.** Preservar rota atual até decisão e validação dos planos/preços. |
| Assessoria Estratégica / Negócios | Clareza estratégica, prioridades, posicionamento, comunicação, canais e planejamento | `/servicos/assessoria-marketing-digital-estrategico` | LP consultiva de direção de negócio; rota atual apresenta formulação mais estreita | Iniciar conversa de diagnóstico → `/contato` | Contexto/maturidade/capacidade → diagnóstico → recomendação → proposta | **Família decidida pelo TKS e aprovação anterior**; naming final/URL e alinhamento SEO ainda pendentes. |
| Branding / Posicionamento | Identidade, posicionamento e reposicionamento estratégico | `/servicos/branding-identidade` | LP de marca que conecta percepção, identidade e posicionamento | Conversar sobre marca/posicionamento → `/contato` | Contexto de marca → diagnóstico → direção/escopo → identidade/reposicionamento → aplicação | **Decidido**. Reposicionamento pertence à família; nenhuma nova rota aprovada. |
| Processos e Operação | Process Intelligence | `/servicos/process-intelligence` | LP de diagnóstico, mapeamento e estruturação de processos | Entender processos e gargalos → `/contato` | Diagnóstico → mapeamento → estruturação/playbooks → validação | **Decidido**; oferta distinta dentro da família. |
| Processos e Operação | Process Activation | `/servicos/process-activation` | LP de ativação, ensino aplicado e acompanhamento da execução | Conversar sobre adoção/execução → `/contato` | Processo estruturado → ativação/ensino → acompanhamento e melhoria | **Decidido**; não consolidar automaticamente com Process Intelligence. |

**Mecanismos, não famílias:** tráfego pago, SEO e performance devem ser explicados dentro da família/escopo que os exige, subordinados a diagnóstico e posicionamento. A Home deve priorizar as famílias em vez de dar a esses mecanismos status visual de oferta equivalente; `/servicos` deve contextualizá-los, não criar LP sem decisão; páginas de família só os incluem quando fizerem parte da recomendação; `/contato` pode capturar a necessidade percebida e encaminhá-la ao diagnóstico. Copywriting também não ganha status de família apenas por aparecer como tile.

### Mudanças de classificação e gaps confirmados

| Rota/área | P1.1 | Estado após reconciliação | Gap/ação futura (não executada) |
|---|---|---|---|
| `/hospedagem-manutencao-sites` | DECISÃO HUMANA NECESSÁRIA sobre existência e exposição | **MANTER E EVOLUIR**, com decisão humana limitada à rota independente/exposição e aos termos comerciais | Serviço real confirmado; relação adjacente à Tecnologia/continuidade. Não consolidar nem retirar URL antes de aprovar termos e avaliar SEO. |
| `/servicos/desenvolvimento-web` | MANTER E EVOLUIR; dúvida se e-commerce exige rota/seção | **MANTER E EVOLUIR**; oferta e fluxo de E-commerce resolvidos, rota filha não justificada | A visão `/servicos` menciona E-commerce; página detalhada atual descreve sites, landing pages, catálogos e estruturas web, mas não apresenta explicitamente a Unidade Digital e o gate de prontidão. Seção interna é o caminho recomendado. |
| `/servicos/assessoria-marketing-digital-estrategico` | MANTER E EVOLUIR; família e naming ainda incertos | **MANTER E EVOLUIR**; família Assessoria Estratégica / Negócios resolvida; slug/naming é questão de SEO | A formulação atual é mais estreita que a família. Preservar canonical e aliases até decisão baseada em intenção e dados SEO. |
| `/servicos/branding-identidade` | MANTER; dúvida de rota adicional para reposicionamento | **MANTER**; reposicionamento incluído na família | Nenhuma rota adicional. Evolução de conteúdo interna pode esclarecer o escopo. |
| `/cliente/onboarding` e Footer | MANTER E EVOLUIR, acesso e posição tratados como decisão de negócio | **MANTER E EVOLUIR**; gap confirmado de exposição ampla; sem dúvida sobre seu propósito | Remover o CTA público genérico em alteração futura e definir link técnico seguro para clientes confirmados. Noindex continua necessário, mas não é controle de acesso. |
| `/trabalhe-conosco` | MANTER E EVOLUIR; intenção do banco precisava confirmação | **MANTER E EVOLUIR**; alvo de banco permanente já aprovado fora do TKS | Conteúdo/metadata atuais ainda misturam vagas e candidatura permanente em alguns pontos; alinhar promessa sem sugerir vaga ativa. |
| `/programa-afiliados` | MANTER E EVOLUIR; nomenclatura resolvida, termos e slug pendentes | **MANTER E EVOLUIR**; nome público “Programa de Parceria” confirmado; regras econômicas não confirmadas | Copy e metadata ainda usam “Afiliados”. Futuro alinhamento de rótulo; preservar identificadores técnicos e slug até decisão SEO/econômica. |
| `/sebraetec-impulsionando-empreendedores` | DECISÃO HUMANA NECESSÁRIA | **DECISÃO HUMANA/EXTERNA NECESSÁRIA** | Metadata contém alegação “até 70%”; conteúdo reconhece dependência regional/projeto. Não publicar claim/eligibilidade como certo sem fonte oficial vigente. |
| Home / Serviços / Contato | Capacidades paralelas observadas como possível catálogo antigo | **GAP CONFIRMADO** com regra de capacidades vs ofertas | Home tem tile “Tráfego & Aquisição” e Contato opções de “Tráfego e performance” e “Hospedagem e infraestrutura”; Serviços distingue famílias/subofertas. Futuro agrupamento deve preservar captura de intenção sem equiparar mecanismo a família. |

As classificações das demais rotas do inventário P1.1 permanecem inalteradas. Nenhuma URL comercial é removida, redirecionada ou alterada por este adendo.

### Riscos comerciais ainda abertos

- **Preço/condições de hospedagem:** o serviço existe, mas o TKS não aprova os planos, valores, limites, SLA ou responsabilidade técnica exibidos.
- **Sebraetec:** claim numérico e elegibilidade dependem de confirmação oficial externa; o histórico do site não valida política atual.
- **Programa de Parceria:** naming aprovado não valida comissões, recorrência, prazos, tickets ou condições atuais; também falta decisão SEO sobre slug/canonical.
- **Assessoria:** a família está definida, mas manter um rótulo excessivamente estreito pode confundir intenção/canibalizar capacidades; rename exige evidência SEO.
- **Onboarding:** a regra de negócio está fechada; a mecânica segura de acesso/retomada permanece requisito técnico e não pode ser substituída por rota pública genérica.
- **Cases e depoimentos:** continuam sujeitos ao gate `investigate` e às decisões P0; presença histórica não autoriza publicação.

### Próxima etapa recomendada

Antes de implementar mudanças de navegação/SEO, fechar somente decisões remanescentes de exposição e termos comerciais (Hospedagem, Parceria, Sebraetec e naming/URL de Assessoria), obter fonte oficial Sebraetec e definir a mecânica de acesso do Onboarding. Em paralelo, a futura especificação de página pode tratar E-commerce como seção da rota Web e organizar capacidades de tráfego/SEO sob as famílias, sem criar novas URLs. Depois, converter a matriz canônica desta seção em plano de mudanças por rota, preservando aliases, canonicals, sitemap e evidência SEO; nenhuma implementação foi autorizada nesta missão.

### Estado de implementação

Este adendo altera apenas a análise documental. O estado descrito como **ATUAL** permanece o observado no código acima; **ALVO APROVADO** representa as decisões TKS/negócio; **GAP** indica diferença entre ambos. Nenhuma página, registry, navegação, metadata, redirect, sitemap, conteúdo ou comportamento de produto foi alterado.

## P1.1C — Decisões comerciais remanescentes

**Modo:** ANALYZE / DECIDE. Este adendo especifica recomendações e decisões necessárias; não autoriza implementação. Preserva as decisões fechadas da P1.1B: Hospedagem é serviço real; nome público é Programa de Parceria; Assessoria Estratégica / Negócios é família aprovada; onboarding é exclusivo de cliente/projeto contratado, não é CTA público, continua noindex e fora do sitemap.

### 1. Hospedagem e Manutenção

#### Separação das decisões

- **Papel da oferta — resolvido:** serviço real do portfólio TAG08, adjacente à família Tecnologia/Web e adequado como continuidade/pós-entrega. Não constitui, por si só, uma nova família pública aprovada.
- **Exposição — ainda decisão de negócio/SEO:** se permanece com rota independente, se a rota permanece mas é reposicionada como continuidade tecnológica, ou se haverá consolidação futura em Desenvolvimento Web.
- **Preço, planos e SLA — decisão comercial independente:** nenhuma definição do TKS consultado aprova a tabela pública atual. A página atual apresenta planos, valores recorrentes, adicionais e alegações técnicas operacionais. A existência do serviço não valida tais condições. Até confirmação do responsável comercial, não reproduzir nem tratar esses termos como aprovados.

#### Cenários de exposição

| Cenário | Coerência de negócio | UX | SEO/intenção/canibalização | Manutenção futura | Redirect | Preço/planos | Avaliação |
|---|---|---|---|---|---|---|---|
| **A — manter rota independente como oferta** | Pode ser coerente porque hospedagem/manutenção é serviço reconhecido e pode atender necessidades próprias, inclusive pós-entrega. O risco é fazê-la parecer uma das famílias estratégicas principais. | Alta encontrabilidade para quem busca suporte/hosting; a página atual é extensa e apresenta escolha de planos antes de evidência de diagnóstico, o que deve ser confrontado com a filosofia comercial. | Preserva a intenção específica de hospedagem/manutenção e a URL. Pode competir com a rota Web por “site”, infraestrutura e suporte; precisa separar escopo/intenção e medir consultas/links. | Mantém conteúdo e operação próprios, mas exige atualização contínua de disponibilidade, segurança, limites, preços e SLA. | Nenhum redirect; menor risco imediato. | A tabela pública só pode continuar após aprovação comercial explícita; caso contrário há risco material de promessa/expectativa. | Opção viável apenas se houver demanda/intenção independente e operação/termos realmente ativos. Evidência atual insuficiente para confirmar. |
| **B — manter a rota e reposicionar como continuidade tecnológica** | Alinha diretamente o serviço aprovado com Tecnologia e ciclo pós-entrega, sem negar a existência da oferta nem elevá-la a família. | Mantém acesso para clientes e visitantes com necessidade de continuidade, mas pode exigir clareza de que não é obrigatória nem inclusa em todo projeto. | Preserva URL e sinais existentes no curto prazo; conteúdo diferenciado por manutenção, segurança e continuidade reduz canibalização. Requer verificar consultas e links antes de alterar hierarquia interna. | Ainda há página própria a manter, mas escopo e conteúdo ficam ligados ao domínio Web/continuidade; permite decidir consolidação depois, com dados. | Não exige redirect agora; mantém eventual migração reversível. | Não valida preços/planos. Condições continuam separadas e precisam de aprovação; não se deve insinuar que hosting é sempre parte do projeto. | **Recomendação provisória:** caminho de menor risco e maior reversibilidade enquanto a procura e os termos são validados; não é decisão final sobre rota independente. |
| **C — consolidar futuramente em Desenvolvimento Web** | Coerente se hospedagem for majoritariamente continuidade de projetos Web e não houver oferta/mercado independente relevante. | Reduz bifurcação de catálogo; pode tornar difícil encontrar suporte específico se a seção ficar subordinada ou perder profundidade. | Risco maior: apagar intenção orgânica/backlinks ou criar canibalização antes da migração. Exige Search Console, analytics, backlinks, auditoria de links internos, canonical e plano 301; não há dados suficientes para afirmar segurança. | Menos página autônoma, mas a seção pode permanecer grande e exigir conteúdo operacional/comercial atualizado. | Exigiria 301 do path antigo ao destino mais equivalente, atualizar canonical, sitemap e links internos, além de monitorar 404/queda orgânica. Não executar agora. | Termos aprovados precisariam migrar de forma explícita para a seção; não importar preço antigo sem validação. | Não recomendada como ação imediata. É hipótese futura condicionada a evidência de baixa intenção independente e confirmação comercial dos termos. |

**Recomendação técnica atual:** preservar `/hospedagem-manutencao-sites` e adotar o Cenário B como hipótese de posicionamento para a próxima decisão: continuidade tecnológica adjacente a Web, sem consolidar URL agora. É a opção reversível com menor risco de perda de sinal. A decisão humana de exposição independente versus subordinada e a aprovação de preços/planos/SLA continuam separadas. O Cenário A só deve prevalecer se dados mostrarem intenção própria e oferta operacional ativa; o Cenário C requer prova de sobreposição/baixo tráfego e plano de migração.

**Preço/planos/SLA pendentes:** aprovar ou retirar os valores e nomes de plano atualmente presentes; confirmar quais recursos são efetivamente incluídos, limites, custos adicionais, disponibilidade, responsabilidade sobre domínio/SSL/backup/segurança, janela/canal de suporte, SLA e exclusões. Não há evidência suficiente no TKS ou na auditoria para fixar nenhum desses itens.

### 2. Programa de Parceria

#### Decisões de branding e SEO

Nome público **resolvido:** `Programa de Parceria`. “Afiliado(s)”/`affiliate` pode continuar em nomes internos de componente, eventos e cálculo; não deve continuar como nomenclatura pública principal. Isso não autoriza alterar slug nesta etapa.

| Opção de URL | Benefícios | Riscos/custo | Avaliação |
|---|---|---|---|
| **Manter `/programa-afiliados` como canonical histórico** | Nenhum redirect; preserva backlinks, sinais e integrações existentes; menor custo e risco imediato. | Termo público do slug diverge do nome aprovado, mesmo que título e copy sejam corrigidos; mantém associação semântica antiga. | **Recomendação imediata provisória** até obter GSC, analytics, backlinks, links internos e dependências. Evita mudar URL sem evidência. |
| **Migrar para `/programa-de-parceria` com 301** | Alinha slug à nomenclatura aprovada e intenção de parceria; caminho semanticamente claro. | Uma URL mais longa; redirect/canonical/sitemap/internal links/schema, testes e monitoramento de sinais precisam mudar juntos. Há risco de tráfego e referências quebradas se a migração for incompleta. | **Canonical futuro preferido se a decisão de migração for aprovada** após revisão SEO. Manter o path antigo como 301 permanente para o novo; não executar agora. |
| **Novo slug mais curto (ex.: `/parcerias`)** | Curto e flexível. | Menos específico, pode significar ecossistema/alianças diversas, não o programa de indicação; oferece pouco ganho demonstrável sobre `/programa-de-parceria`. | **Não recomendado sem nova evidência de escopo**; não há justificativa estratégica ou SEO observada para preferi-lo. |

**Decisão SEO que falta:** manter a URL atual permanentemente ou migrar depois para `/programa-de-parceria`. Até essa decisão, conservar o canonical atual e corrigir a nomenclatura visível apenas em uma missão de implementação autorizada; medir busca/backlinks antes de 301.

#### Decisões econômicas/comerciais

O código atual exibe 10%, comissão sobre valor líquido, pagamento único em certos projetos, recorrência mensal limitada a 12 meses, pagamento após compensação e recebimento por PIX; essas são **alegações atuais do código, não regras aprovadas**. Precisam de confirmação documental e responsável comercial antes de publicação:

- percentual e base de cálculo (bruto/líquido, impostos, descontos, estornos);
- evento que inicia recorrência e se a comissão só existe após recebimento;
- duração/limite e tratamento de pausa, cancelamento, inadimplência e reativação;
- projetos elegíveis e exclusões; tickets de referência e eventual atualização;
- bônus, critérios de atribuição, conflitos de indicação e anti-fraude;
- forma, calendário, valor mínimo, documentação fiscal, retenções e prazo de pagamento;
- se simulador/FAQ reproduzem a regra vigente e quem aprova alterações.

Até confirmação, não tratar esses números/condições como vigentes por estarem no site. Identificadores internos `affiliate` podem permanecer técnicos.

### 3. Sebraetec — validação oficial externa

Pesquisa em fontes oficiais do Sebrae acessadas em **19/10/2026**. As páginas estaduais abaixo apresentam contextos/ofertas distintos e não são regra automaticamente transferível à TAG08 nem à Paraíba. Quando a fonte não exibe data de publicação/atualização, isso é indicado; a data de consulta não deve ser confundida com data de atualização.

| Fonte oficial | Data/UF/contexto | Evidência útil e limite |
|---|---|---|
| [Regulamento Sebraetec 2.1 — Sebrae Nacional (PDF)](https://sebrae.com.br/Sebrae/Portal%20Sebrae/Anexos/Regulamento%20Sebraetec%202.1.pdf) | Documento nacional; resultado oficial indexado como publicado há cerca de 6 meses no momento da consulta, mas o PDF acessível não expõe data de vigência de forma verificável nesta consulta; acessado em 19/10/2026 | Prevê para ME/EPP/produtor rural faixa de subsídio entre 60% e 80%, com percentual definido pelo Sebrae/UF; para MEI prevê 80%. Demonstra que “30% de contrapartida” não é regra nacional uniforme e não autoriza aplicar um único percentual a todos os perfis/estados/serviços. A fonte foi encontrada no domínio oficial; a abertura via navegador redirecionou para a aplicação geral, então a conclusão do percentual se limita ao texto indexado do PDF. |
| [Sebraetec MS — Sebrae Mato Grosso do Sul](https://ms.loja.sebrae.com.br/sebraetec-ms) | MS; loja estadual e conjunto de consultorias listadas; página sem data editorial visível; consultada em 19/10/2026 | A página afirma 70% para aquela oferta e condiciona às regras/disponibilidade. É evidência de contexto estadual, não regra nacional nem da Paraíba. |
| [Oferta Sebraetec — Hub Sebrae RN](https://hub.rn.sebrae.com.br/servicos/1ae20320-be23-4eeb-8f70-2d9ad0fbc26f) | RN; ficha de serviço específica; página sem data editorial visível, indexada/capturada recentemente; consultada em 19/10/2026 | Ficha mostra subsídio de até 70% sujeito à disponibilidade orçamentária no momento da aprovação. A mesma plataforma oficial apresentou ficha distinta com até 50% sob disponibilidade (resultado oficial: [ficha RN, serviço SST](https://hub.rn.sebrae.com.br/servicos/d0f7aa05-1d11-4355-b4d7-c016a4b84cda)); percentual pode variar até por serviço/contexto estadual. |
| [Edital Sebraetec Indústria 01/2019 — Sebrae CE (PDF)](https://sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/CE/Anexos/Edital%20SEBRAETEC_Indu%CC%81stria_01.19.pdf) | CE; edital específico 01/2019, fonte histórica; consultado em 19/10/2026 | Traz 70%/30% no orçamento daquele edital. **Não é evidência atual**; mantido apenas para provar que percentuais em edital são vinculados ao contexto e período, não como regra aplicável hoje. |
| [Sebrae Paraíba — loja estadual](https://pb.loja.sebrae.com.br/) | PB; catálogo estadual geral, consultado em 19/10/2026 | A busca não localizou nesta pesquisa uma regra atual do Sebraetec/PB que confirme o percentual e condições aplicáveis à oferta da TAG08. Não concluir que a regra inexiste; registrar como validação ainda pendente com o Sebrae/PB e/ou proposta oficial vigente. |

#### Classificação das formulações solicitadas

| Formulação | Classificação | Motivo |
|---|---|---|
| “Até 70% de subsídio” | **SEGURO COM CONDICIONANTE** | Fontes oficiais estaduais recentes usam 70%, mas o regulamento nacional e exemplos estaduais mostram variação por UF/perfil/serviço e disponibilidade. Só usar com contexto explícito (serviço/UF/regra vigente), “pode chegar”, aprovação e disponibilidade; não como promessa genérica da TAG08 ou para a Paraíba sem confirmação local. |
| “O Sebrae pode subsidiar parte do projeto” | **SEGURO COM CONDICIONANTE** | Formulação prudente, desde que complemente que depende do serviço, elegibilidade, regras do Sebrae/UF, orçamento e aprovação da proposta. |
| “Você paga apenas 30%” | **NÃO RECOMENDADO** | “Apenas” sugere contrapartida fixa e garantida. Contradiz variação de percentuais e perfis do regulamento nacional e condicionantes estaduais. |
| “A TAG08 aprova sua empresa no Sebraetec” | **NÃO RECOMENDADO** | A decisão de acesso/subsídio pertence ao Sebrae/UF e às regras vigentes; a TAG08 não deve reivindicar autoridade de aprovação. Pode orientar ou preparar proposta técnica se isso estiver confirmado no escopo operacional, sem garantir resultado. |
| “Consulte elegibilidade e condições vigentes no Sebrae da sua região” | **SEGURO** | Encaminha para fonte competente e explicita variação local. Deve acompanhar qualquer texto que mencione potencial de subsídio. |

**Formulações públicas recomendadas (condicionais, prontas para revisão jurídica/editorial, não implementação):**

- **Title:** `Projetos com Sebraetec | Consulte condições na sua região — TAG08`.
- **Meta description:** `A TAG08 pode orientar projetos de presença digital, marca e tecnologia que se enquadrem no Sebraetec. Elegibilidade, serviço, percentual e disponibilidade dependem das regras vigentes do Sebrae/UF e da aprovação da proposta.`
- **Hero:** `Seu projeto pode se enquadrar no Sebraetec. A TAG08 ajuda a estruturar a proposta técnica; a análise e as condições são definidas pelo Sebrae da sua região.`
- **Disclaimer visível:** `O Sebraetec é operado conforme regras do Sebrae/UF. Serviço disponível, elegibilidade, percentual de subsídio, orçamento, contrapartida e aprovação variam conforme a região e a proposta. A TAG08 não garante enquadramento, subsídio ou aprovação. Confirme as condições vigentes diretamente com o Sebrae responsável.`
- **Resultado de simulador:** não retornar “aprovado”, “elegível” ou valor garantido. Exibir: `Estimativa apenas informativa, baseada nos parâmetros selecionados. Não representa análise ou aprovação do Sebrae. Confirme serviço, elegibilidade, percentual, disponibilidade, contrapartida e condições vigentes com o Sebrae/UF antes de tomar decisão.` Se não houver regra local oficial configurada, não calcular percentual; oferecer somente encaminhamento à fonte regional.

O site TAG08 tem endereço/atuação em João Pessoa/PB; portanto a página comercial deve ter validação específica do **Sebrae/PB** antes de veicular percentual ou claim local. As fontes MS/RN demonstram a variação, não substituem essa validação. O claim atual do metadata (“até 70%”) não está validado para a oferta local e deve ser tratado como risco editorial/comercial até haver fonte oficial aplicável.

### 4. Assessoria Estratégica / Negócios — recomendação de nome

Família aprovada: **Assessoria Estratégica / Negócios**. A decisão abaixo trata apenas da expressão pública, não de rota ou slug.

| Nome considerado | Amplitude semântica | Clareza/coerência | Risco de sobreposição/SEO |
|---|---|---|---|
| Assessoria Estratégica | Ampla e coerente com TKS | Clara, porém pouco explícita sobre aplicação ao negócio | Genérica; pode disputar termos amplos sem intenção qualificada. |
| Assessoria de Negócios | Ampla | Direta, mas pode sugerir consultoria generalista em finanças, jurídico ou operação | Maior risco de expectativa extensa não coberta pelo escopo. |
| **Assessoria Estratégica de Negócios** | Ampla o bastante para a família aprovada, com objeto claro | **Melhor equilíbrio** entre método estratégico e contexto empresarial | Evita reduzir a oferta a marketing e não promete executar Branding, tráfego ou Processos por si só; precisa de validação de termos de busca antes de SEO/slug. |
| Assessoria de Marketing Estratégico | Mais restrita ao marketing | Compreensível, mas aproxima-se de execução de marketing e canal | Pode canibalizar Social/Tráfego e omitir negócio/posicionamento. |
| Assessoria Estratégica de Marketing e Negócios | Muito ampla | Descritiva, mas longa e com duas promessas potencialmente distintas | Maior carga semântica e risco de sobrepor páginas de Marketing, Branding e Processos. |

**Recomendação pública:** `Assessoria Estratégica de Negócios`. O TKS sustenta visão de negócio, diagnóstico, prioridades e decisão com método. Descrever a oferta como orientação/organização de prioridades e direção; Branding, tráfego e Process Intelligence continuam famílias/ofertas próprias quando o diagnóstico indicar. Manter `/servicos/assessoria-marketing-digital-estrategico` e canonical atual até uma decisão SEO posterior com Search Console, analytics e backlinks; a recomendação de rótulo não é autorização de rename de URL.

### 5. Onboarding — contrato funcional proposto do magic link

**Regras de negócio congeladas:** somente projeto/cliente comercialmente confirmado (contrato, pagamento e escopo validados); não é suporte nem aquisição; sem conta/portal completo e sem senha permanente. **Arquitetura congelada:** link mágico de alta entropia, token armazenado como hash, expiração e revogação. O contrato abaixo é especificação proposta para implementação futura, não descreve comportamento atual.

| Aspecto | Contrato funcional proposto |
|---|---|
| Quem emite | Operador TAG08 autorizado no fluxo comercial/operacional, após checklist de confirmação comercial; não autoinscrição pública. Registrar operador, cliente, projeto e momento de emissão em auditoria sem registrar o segredo do token. |
| Destinatário | Endereço de e-mail de contato validado no contrato/registro do projeto. Link associado a um único onboarding/projeto e ao destinatário; não permitir escolher outro registro pelo URL ou payload. |
| Quando | Depois de contrato, pagamento e escopo confirmados e da preparação mínima do onboarding; reemitir somente a pedido do cliente ou operador autorizado após verificar identidade/contexto. |
| Token e armazenamento | Segredo criptograficamente aleatório de alta entropia (mínimo 256 bits), opaco e sem dados pessoais no token; persistir somente hash com algoritmo apropriado, ID do onboarding, destinatário normalizado, `issuedAt`, `expiresAt`, `consumedAt`, `revokedAt` e emissor. Comparação em tempo constante quando aplicável; nunca registrar token completo em logs, analytics, referrer ou erros. |
| Validade | **Proposta inicial:** validade de 24 horas para resgate do link. Prazo é decisão operacional configurável e precisa ser ratificado pelo dono do processo antes de release; não usar prazo indefinido. Sessão pós-resgate curta e renovável somente por reemissão/renovação aprovada, nunca senha persistente. |
| Uso | Link de resgate de uso único. Resgate consome o token atomicamente para impedir replay/concorrência e abre uma sessão temporária vinculada ao onboarding autorizado. Submissão/retomada posterior usa essa sessão temporária; não reutiliza o bearer URL em cada salvamento. |
| Retomada | Cliente volta pelo link ainda válido ou solicita reemissão após expiração. A jornada retoma apenas o rascunho do mesmo onboarding e preserva validação/estado do servidor; não confia em `localStorage` como autorização. Definir duração da sessão temporária e do rascunho conforme política de retenção já aprovada, sem ampliar retenção dos dados. |
| Reemissão e revogação | Nova emissão revoga tokens anteriores daquele onboarding; operador pode revogar imediatamente por solicitação, mudança de destinatário, suspeita de compartilhamento ou encerramento do processo. Encerramento/conclusão também invalida links e sessão correspondente. |
| Link expirado, revogado ou consumido | Não revelar se o e-mail, cliente ou projeto existe. Mostrar orientação neutra para solicitar novo link ao contato TAG08 autorizado; não reabrir acesso, criar conta ou descartar dados. Aplicar limite de tentativas e registrar evento de segurança sem segredo/PII desnecessária. |
| Compartilhamento indevido | Um link bearer não pode impedir absolutamente que o destinatário o encaminhe. Mitigações mínimas: expiração curta, uso único, vínculo ao onboarding e endereço esperado, consumo atômico, revogação/reemissão e nenhuma PII na URL. Para garantia mais forte, exigir verificação adicional por canal independente (por exemplo, código enviado ao endereço/telefone previamente validado); isso eleva fricção e deve ser decisão de segurança/negócio antes de adoção. Não prometer “link intransferível”. |
| Token ↔ jornada | Token autoriza somente leitura/escrita do onboarding associado e ações necessárias à sua conclusão; não é autenticação geral, não dá acesso ao CRM, outros clientes, suporte ou áreas internas. Autorização deve ser verificada no servidor em cada endpoint/submissão, não apenas pela interface. |
| Senha/portal | Nenhuma senha permanente, registro público ou portal multiusuário nesta fase. Sessão temporária de onboarding é capability limitada, não conta de cliente. |

**Ponto a decidir antes da implementação:** confirmar 24h, se será exigido segundo fator para reduzir risco de encaminhamento e a duração da sessão temporária. Restante do contrato segue a arquitetura aprovada; não criar plataforma de conta/portal.

### 6. Decisões humanas restantes — lista mínima

| ID | Tema | Decisão a tomar | Opções válidas | Recomendação técnica | Impacto | Pode ser decidido agora? |
|---|---|---|---|---|---|---|
| HOS-01 | Hospedagem — exposição (negócio/SEO) | Rota independente, rota reposicionada como continuidade, ou consolidação futura em Web? | A, B ou C dos cenários acima; pode-se adotar B provisoriamente sem fechar destino final | **B provisório**, preservar URL; decidir o estado final após consulta de demanda/backlinks | Navegação, intenção SEO, canibalização e eventual 301 | Parcialmente: B pode ser orientação provisória; destino final precisa de dono comercial/SEO e dados. |
| HOS-02 | Hospedagem — oferta econômica (comercial/operacional) | Aprovar preço, planos, limites, suporte/SLA, responsabilidades e adicionais atuais? | Aprovar após revisão; revisar/retirar termos; substituir por escopo sob consulta | Bloquear alegações específicas sem confirmação; manter conteúdo atual tratado como não validado até aprovação | Promessa comercial, custo operacional, suporte e risco de disputa | **Sim**, pelo responsável comercial/operacional; requer inventário da oferta real. |
| PAR-01 | Parceria — regras econômicas (comercial/jurídica) | Quais valores, base, duração, elegibilidade, bônus e pagamento são vigentes? | Aprovar regra documentada; revisar; suspender divulgação econômica até validação | Não propagar número/regra do runtime sem fonte aprovada; validar contrato, fiscal e atribuição | Custos, margem, obrigações, fraude e confiança do parceiro | **Sim**, pelo responsável comercial com revisão jurídica/fiscal pertinente. |
| PAR-02 | Parceria — URL (SEO) | Manter canonical `/programa-afiliados` ou migrar para `/programa-de-parceria`? | Permanecer; migrar com 301 após validação; slug mais curto somente com justificativa | Manter atual no curto prazo; se migrar, preferir `/programa-de-parceria`, 301 e atualização atômica de canonical/sitemap/links | Tráfego orgânico, backlinks, analytics e links externos | **Ainda não** sem GSC, analytics, backlinks e lista de dependências. |
| SEB-01 | Sebraetec — claims/regra (jurídica/externa) | O que Sebrae/PB confirma para esta oferta quanto a percentual, elegibilidade, serviço, região, orçamento e aprovação? | Publicar só condição oficial documentada; usar formulação genérica sem percentual; não anunciar enquadramento até validação | Usar wording condicionado abaixo; sem percentual local e sem simulador de elegibilidade até obter fonte PB vigente | Publicidade, expectativa de preço, risco jurídico/comercial e conversão | **Não** antes de confirmação escrita/fonte oficial vigente do Sebrae/PB e revisão de escopo TAG08. |
| SEB-02 | Sebraetec — papel/SEO (negócio/SEO) | Manter LP indexável dedicada ou reduzir a página a apoio contextual? | Rota própria informativa; destino contextual em páginas elegíveis; manter só após claims/serviços validados | Preservar URL enquanto se valida; não destacar claim; decidir destino com demanda e links após o gate externo | Indexação, aquisição, links e confiança | **Parcialmente**; precisa alinhar com resultado de SEB-01 e evidência de busca. |
| ASS-01 | Assessoria — nome visível (conteúdo) | Adotar o nome recomendado, sem mudar slug nesta fase? | Assessoria Estratégica de Negócios; outro nome aprovado na comparação | **Assessoria Estratégica de Negócios**; manter slug/canonical até estudo SEO | Clareza, amplitude, expectativa e sobreposição com outras famílias | **Sim**, como decisão de copy/branding; rename do slug não incluído. |
| ONB-01 | Onboarding — parâmetros temporais (técnica/operação) | Ratificar expiração do link de 24h e sessão temporária curta; qual duração operacional da sessão? | Aprovar 24h + sessão curta configurada; outro prazo justificado; exigir nova emissão a cada retorno | Link de resgate único de 24h, hash e revogação; sessão isolada, sem senha/portal; calibrar TTL à janela de preenchimento real | Segurança, retomada, fricção e suporte operacional | **Sim**, após confirmação do dono do processo; 24h é proposta, não regra congelada. |
| ONB-02 | Onboarding — prevenção de encaminhamento (segurança/negócio) | Exigir segundo fator independente além do magic link? | Mitigações de bearer link (risco residual aceito); código de verificação por canal previamente validado | Magic link sozinho não é intransferível. Adotar segundo fator se o risco dos dados/contexto exigir; decidir antes de expor dados pessoais sensíveis | Segurança contra compartilhamento versus fricção e custo de suporte | **Sim**, mediante classificação dos dados e aceite explícito do risco residual. |

**Decisões não pendentes nesta fase:** existência da hospedagem; nome público do Programa de Parceria; família da Assessoria; propósito/elegibilidade comercial do onboarding; e-commerce como oferta e fluxo; reposicionamento dentro de Branding. Essas decisões não devem voltar à mesa sem nova evidência material.

### Formulação Sebraetec segura recomendada

Para uso público genérico da TAG08, enquanto a regra da Paraíba não estiver validada:

- **Title:** `Projetos com Sebraetec | Consulte as condições do Sebrae/PB — TAG08`.
- **Meta description:** `A TAG08 pode apoiar a estruturação técnica de projetos que possam se enquadrar no Sebraetec. Serviço, elegibilidade, eventual subsídio, percentual, disponibilidade e aprovação dependem das regras vigentes do Sebrae/PB e da análise da proposta.`
- **Hero:** `Seu projeto pode se enquadrar no Sebraetec. A TAG08 pode orientar a estruturação técnica; o Sebrae/PB confirma elegibilidade, serviço disponível e condições vigentes.`
- **Disclaimer:** `A participação e qualquer subsídio dependem das regras e da disponibilidade do Sebrae/PB, do serviço selecionado e da aprovação da proposta. A TAG08 não garante elegibilidade, percentual, contrapartida ou aprovação. Confirme as condições diretamente com o Sebrae/PB.`
- **Simulador:** sem resposta de elegibilidade nem percentual até integrar regra oficial vigente e versionada. Resultado provisório deve dizer que é apenas orientação e encaminhar à validação oficial. Se as regras oficiais permitirem cálculo, exibir fonte/UF/versão/data e todos os condicionantes.

Essa versão evita percentual até validação Paraíba. Se futuramente houver confirmação documental de “até 70%” para a oferta e contexto específicos, a frase pode ser adaptada para **“O Sebrae/PB pode subsidiar até X% deste serviço, sujeito a elegibilidade, disponibilidade e aprovação conforme regras vigentes”**, substituindo `X` pelo valor comprovado e indicando a fonte/validade. Não usar “você paga apenas 30%”.

### Prontidão da P1.2

Há material suficiente para **planejar** P1.2 com escopo limitado e gates: reposicionar a rota de Hospedagem sem migrar URL por ora; corrigir nomenclatura pública da Parceria sem alterar slug; nomear a Assessoria conforme aprovação de copy mantendo canonical; planejar a seção interna de Unidade Digital na página Web; retirar onboarding do CTA genérico e implementar posteriormente o contrato de acesso magic link. Não há material suficiente para publicar preço/SLA de hospedagem, regras econômicas da Parceria, percentuais/claims específicos do Sebraetec, executar migração SEO de slug, ou liberar onboarding sem decisões ONB-01/02 e implementação segura.

**Recomendação de gate:** P1.2 pode iniciar como planejamento/design técnico para os itens já decididos; execução de cada item deve aguardar as decisões comerciais/externas da tabela. Sebraetec e termos de preço/comissão permanecem bloqueados até evidência autoritativa. Nenhum produto, conteúdo público ou configuração foi alterado nesta missão.

## P1.1D — Decision Freeze

### Recomendações aguardando aprovação humana

Os itens abaixo são recomendações ou parâmetros propostos nas seções anteriores, **não decisões aprovadas**. Não devem orientar implementação, alteração de rota, publicação de conteúdo ou mudança de contrato até aprovação explícita:

- **Hospedagem — cenário B:** manter a rota e reposicionar a oferta como continuidade tecnológica. É recomendação provisória, não política fechada de exposição.
- **Assessoria — “Assessoria Estratégica de Negócios”:** nome público recomendado, ainda aguardando aprovação de conteúdo/branding. Não alterar slug.
- **Parceria — manter `/programa-afiliados` temporariamente:** recomendação de preservação até análise SEO; não é decisão permanente de canonical.
- **Onboarding — validade de 24 horas:** parâmetro sugerido para o magic link, sujeito à aprovação operacional e de segurança.
- **Onboarding — segundo fator:** decisão aberta; o relatório descreve trade-off, sem assumir que link mágico isolado ou segundo fator foi aprovado.
- **Sebraetec — papel/indexabilidade futura:** manter a rota atual enquanto se valida não equivale a aprovar sua permanência indexável. Rota dedicada, indexabilidade e posição futura aguardam decisão apoiada por fonte oficial e evidência SEO.

### Decisões já resolvidas — não reabrir sem nova evidência

- **E-commerce / Unidade Digital** pertence à família **Tecnologia**.
- Não criar LP própria de E-commerce por padrão; a rota de Desenvolvimento Web é o destino canônico atual, com conteúdo/jornada interna como abordagem recomendada.
- **Reposicionamento** pertence à família **Branding / Posicionamento**.
- **Tráfego, SEO e performance** são capacidades/mecanismos por padrão, não famílias independentes.
- **Onboarding** não é jornada pública, geração de lead ou suporte; destina-se ao cliente/projeto contratado.
- **Programa de Parceria** é o nome público aprovado; identificadores técnicos `affiliate` podem permanecer internos.
- **Hospedagem/Manutenção** é serviço real da TAG08 e responsabilidade adjacente ao domínio de Tecnologia/continuidade.
- **Sebraetec** não pode ser apresentado como aprovação garantida, elegibilidade garantida ou percentual uniforme nacional. Percentual e condições exigem confirmação oficial aplicável à UF, oferta e momento.

Este freeze registra a fronteira entre decisões confirmadas e recomendações ainda pendentes; não modifica produto nem transforma as recomendações acima em autorização de implementação.

### Nota de implementação — Banco de Talentos

Em 2026-10-21, a página `/trabalhe-conosco` foi alinhada à decisão já aprovada de candidatura espontânea para o banco permanente: a comunicação de vagas, remunerações e etapas seletivas sem comprovação foi removida; rota, canonical, indexabilidade, sitemap e contrato do formulário foram preservados. Esta nota registra a implementação e não altera o diagnóstico histórico das seções anteriores.
