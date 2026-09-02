# Estado do projeto — TAG08

Atualizado em: `2026-09-02`

## Últimas missões concluídas

**TAG08 — Missão 01 Final: auditoria, refinamento editorial e consolidação da Home (`/`).**

**TAG08 — Missão 02 Final: refinamento cirúrgico da página Sobre (`/sobre`).**

**TAG08 — Missão 03 Final: refinamento comercial do hub Serviços (`/servicos`).**

**TAG08 — Missão 04 Final: refinamento comercial de Gestão de Redes Sociais (`/servicos/gestao-de-redes-sociais`).**

Fonte de escopo: solicitação registrada nesta sessão. Ela substitui orientações anteriores para a Home.

## Estado da página Sobre

- Arquivo-fonte: `src/features/site/pages/Sobre.tsx`; metadados: `src/config/routeRegistry.ts`.
- O grid visual antes apresentado como equipe agora comunica quatro competências: direção, comunicação, tecnologia e operação. Não há pessoas, cargos, perfis sociais ou vínculos externos não validados.
- O logowall e `INTEGRATION_BRANDS` foram removidos. A seção de confiança apresenta diretamente os quatro diferenciais aprovados.
- A área de crenças preserva seus quatro princípios e apenas a ponte “Próximo passo com clareza” para `/servicos`.
- Não reintroduzir equipe, parceiros, marcas, números, prêmios ou história institucional sem fonte oficial e uma missão específica.

## Estado da página Serviços

- Arquivo-fonte: `src/features/site/pages/Servicos.tsx`; metadados: `src/config/routeRegistry.ts`.
- O hub segue o Índice Oficial do portfólio comercial: Presença Digital Recorrente, Marca e Posicionamento, Produção Audiovisual e Web e Unidade Digital.
- Assessoria de Marketing Estratégico, Process Intelligence, Process Activation e Hospedagem foram retirados somente da promoção principal do hub. As rotas históricas permanecem publicadas em `PENDENTE_VALIDACAO_COMERCIAL`.
- Reposicionamento Estratégico, Edição de Reels e Unidade Digital/E-commerce estão agrupados nas categorias com rotas existentes. Permanecem em `PENDENTE_ARQUITETURA_DE_ROTA` até haver páginas próprias aprovadas.
- `MiniCases` não é renderizado em `/servicos`: seus dados padrão contêm marcas e métricas sem validação. Manter `PENDENTE_VALIDACAO_DE_PORTFOLIO` até existir fonte oficial de cases.
- Não inserir preços, volumes de entrega, novas rotas ou escopo contratual no hub sem atualização da fonte comercial vigente.

## Estado da página Gestão de Redes Sociais

- Arquivo-fonte: `src/features/site/pages/GestaoRedesSociais.tsx`; metadados: `src/config/routeRegistry.ts`.
- A página apresenta as estruturas oficiais Start, Base e Performance como diferenças de maturidade, responsabilidade e profundidade operacional, nunca como quantidade de posts.
- Limites de escopo são condicionais à proposta vigente; não há preços, volumes fixos, garantia de resultado ou escopo universal.
- `MiniCases` e `TrustTestimonialsSection` não são renderizados nesta rota. Ambos dependem de conteúdo sem prova externa documentada e permanecem em `PENDENTE_VALIDACAO_DE_PORTFOLIO` e `PENDENTE_VALIDACAO_DE_PROVA`, respectivamente.
- O bloco de vídeo usa apenas itens com fonte YouTube `live`; indisponibilidade gera estado vazio neutro, sem fallback editorial apresentado como conteúdo oficial.
- Reels continua agrupado no contexto de Gestão de Redes Sociais até decisão futura em `PENDENTE_ARQUITETURA_DE_ROTA`.

## Fonte de verdade

- Home: `src/features/site/pages/Home.tsx`
- Metadados da Home: `src/config/routeRegistry.ts`
- Rotas e SEO: `docs/ARCHITECTURE.md`, `docs/ROUTES.md`
- Direção comercial: `docs/tag08-knowledge-system/05_PORTFOLIO_E_OFERTAS.md` e `06_FILOSOFIA_COMERCIAL.md`
- Regras de conteúdo oficial: `src/app/api/official-content/route.ts` e `server/officialContent.ts`

## Decisões aplicadas

- Manter Hero, problema, maturidade, diagnóstico interativo, mapa de soluções, metodologia oficial, audiovisual, institucional, prova, FAQ e CTA final.
- Manter `#metodologia` como explicação oficial do método; `#metodologia-preview` saiu da renderização.
- O bento `#solucao` permanece visualmente intacto, com copy ajustada para diferenciais verificáveis.
- `#diferenciais`, `#planos-redes` e `#portfolio-marcas` saíram da renderização para eliminar repetição e mini landing page dentro da Home.
- `#resultados-cases` é a única experiência principal de portfólio. Os seis candidatos aparecem somente como itens em validação, sem claims, imagens, rotas ou depoimentos.
- Avaliações Google só renderizam quando `contentSources.googleBusiness === "live"` e há itens retornados. Fallback local não é apresentado como review real.
- SEO da rota `/` foi alinhado à referência editorial da missão.

## Pendências que bloqueiam publicação de cases

Todos os candidatos abaixo estão em `PENDENTE_VALIDACAO` até existir confirmação de nome, escopo, situação real, material, direitos de uso, narrativa e rota válida:

- LavarRoupa S.A. — também é o case-piloto.
- Alugue por Temporada.
- Centro de Olhos.
- LeVisage.
- Luciana Gadelha.
- Espaço Glau Campos.

Não criar `/cases`, não migrar `/casos` e não promover repertório histórico a oferta atual.

## Riscos e próximos passos permitidos

- A remoção visual de blocos ainda preserva código local para uma limpeza mecânica posterior; só remover imports, states e componentes depois de confirmar que não há outro consumidor.
- Não alterar Home, outras páginas de serviço, Trabalhe Conosco, Contato, Header, Footer, idiomas EN/ES, Design System, consentimento ou tracking sem uma missão específica.
- Próxima sessão deve começar por este arquivo, conferir `git status`, rodar validação e revisar visualmente `/` em desktop e mobile. Não reabrir decisões editoriais já registradas sem nova fonte comercial ou de portfólio.
