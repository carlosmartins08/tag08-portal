# P0.7A — Reconciliação documental

**Data:** 2026-10-19
**Escopo:** documentos e referências; nenhum documento histórico foi restaurado e nenhum comportamento de produção foi alterado.
**Base:** commit `22bee39` (`chore: remove retired project documentation`), baseline de arquitetura 01–17 e estado atual observado.

## Resultado executivo

O commit removeu 78 arquivos. A auditoria classificou **6 como substituídos**, **29 como referenciados mas ausentes**, **43 como incertos**, **0 como comprovadamente obsoletos com remoção correta** e **0 como comprovadamente ainda necessários como os mesmos arquivos**. “Incerto” não significa que devam ser restaurados: significa que não há evidência suficiente de substituição completa nem de aposentadoria segura. Nenhum dos 78 foi restaurado.

As referências operacionais de `PROJECT_STATE.md`, README e instruções `.ai-agents` foram atualizadas para os mapas atuais. O histórico do `CHANGELOG.md` e as observações retrospectivas dos documentos 01 e 17 foram preservados como histórico, não como instruções atuais. O gerador editorial continua dependendo de 29 fontes retiradas; sua execução manual continua sem suporte até decisão sobre o destino do fluxo editorial.

## Inventário dos 78 arquivos removidos

### Substituídos por fontes atuais — 6

| Arquivo removido | Classificação | Cobertura/sucessor atual | Observação |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | SUBSTITUÍDO | `01_CURRENT_STATE_MAP.md`, `02_CANONICAL_VS_PARALLEL.md` | Cobertura atual do sistema, não cópia integral do documento antigo. |
| `docs/ROUTES.md` | SUBSTITUÍDO | `03_ROUTE_AND_PAGE_INVENTORY.md`, `src/config/routeRegistry.ts` | O registry é a fonte executável das rotas. |
| `docs/ROADMAP.md` | SUBSTITUÍDO | `10_CONSOLIDATION_WAVES.md` | Ondas aprovadas; não é restauração do roadmap histórico. |
| `docs/CONTENT_EVIDENCE_INVENTORY.md` | SUBSTITUÍDO | `13_PUBLIC_EVIDENCE_APPROVAL_MATRIX.md`, `14_PUBLIC_EVIDENCE_DECISIONS.md` | Cobertura deliberada dos 22 registros decididos; não declara cobrir todo o inventário editorial histórico. |
| `docs/INTEGRATION_AUDIT.md` | SUBSTITUÍDO | `07_INTEGRATION_MAP.md`, `09_RISK_REGISTER.md` | Estado atual, alvo e gaps de integração são mantidos nos documentos atuais. |
| `docs/DECISION_MATRIX.md` | SUBSTITUÍDO | `09_RISK_REGISTER.md`, `10_CONSOLIDATION_WAVES.md` | Riscos e ordem de trabalho; não é uma matriz genérica de decisão para qualquer alteração. |

### Referenciados mas ausentes — 29

Estes 29 arquivos Markdown dentro das fontes editoriais são percorridos pelo gerador `tools/generate-editorial-review.mjs`, que ainda referencia suas cinco raízes de conteúdo. Não foi encontrada evidência de que tenham sido migrados integralmente para `src/` ou para os documentos 01–18. Não restaurar automaticamente nem tratar o gerador como gate ativo.

| Arquivo | Classificação | Fonte que ainda o referencia |
|---|---|---|
| `docs/tag08-content-flows/content/flows/cliente-onboarding.md` | REFERENCIADO MAS AUSENTE | Raiz `docs/tag08-content-flows/content` do gerador editorial |
| `docs/tag08-content-flows/content/flows/programa-afiliados.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-flows/content/flows/sebraetec.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-global/content/global/brand-messages.md` | REFERENCIADO MAS AUSENTE | Raiz `docs/tag08-content-global/content` do gerador editorial |
| `docs/tag08-content-global/content/global/ctas.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-global/content/global/footer.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-global/content/global/navigation.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-global/content/global/seo-defaults.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-global/content/global/slogans.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/buttons.md` | REFERENCIADO MAS AUSENTE | Raiz `docs/tag08-content-microcopy/content` do gerador editorial |
| `docs/tag08-content-microcopy/content/microcopy/empty-states.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/errors.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/forms.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/popups.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/privacy-notices.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-microcopy/content/microcopy/success-messages.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-pages/content/pages/contato.md` | REFERENCIADO MAS AUSENTE | Raiz `docs/tag08-content-pages/content` do gerador editorial |
| `docs/tag08-content-pages/content/pages/home.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-pages/content/pages/servicos.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-pages/content/pages/sobre.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-pages/content/pages/trabalhe-conosco.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/assessoria-marketing-estrategico.md` | REFERENCIADO MAS AUSENTE | Raiz `docs/tag08-content-services/content` do gerador editorial |
| `docs/tag08-content-services/content/services/branding-identidade.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/desenvolvimento-web.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/gestao-redes-sociais.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/hospedagem-manutencao.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/process-activation.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/process-intelligence.md` | REFERENCIADO MAS AUSENTE | Idem |
| `docs/tag08-content-services/content/services/producao-audiovisual.md` | REFERENCIADO MAS AUSENTE | Idem |

### Incertos — 43

Não há prova suficiente de que cada documento abaixo seja inútil nem de que seu conteúdo tenha sucessor completo. São necessários triagem por owner/domínio e comparação do conteúdo antes de qualquer restauração, migração ou declaração de aposentadoria.

| Arquivo removido | Classificação | Evidência/limite atual |
|---|---|---|
| `docs/DECISIONS.md` | INCERTO | `PROJECT_STATE` o usava como índice de decisões. Os documentos 10 e 14 cobrem decisões delimitadas, não um decision log geral. Referências operacionais foram redirecionadas, sem afirmar substituição integral. |
| `docs/STAGING-HOSTING-CHECKLIST.md` | INCERTO | README descreve deploy, variáveis, jobs e verificações, mas não comprova cobertura de todos os passos e owners do checklist removido. O link quebrado foi removido e a lacuna foi declarada. |
| `docs/AGENTOS_BRIDGE.md` | INCERTO | Histórico menciona bridge para sistema externo; não foi comprovado que o contrato externo deixou de existir. |
| `docs/AGENT_ROUTER.md` | INCERTO | Sobreposição provável com `.ai-agents`/skills, mas não foi verificada equivalência histórica completa. |
| `docs/AI_SEARCH_CONTENT_STRATEGY.md` | INCERTO | Estratégia editorial específica sem successor identificado no baseline. |
| `docs/CONTENT-TEAM-GUIDE.md` | INCERTO | Governança de equipe editorial não é equivalente aos mapas técnicos atuais. |
| `docs/DESIGN-SYSTEM-GOVERNANCE.md` | INCERTO | Há `DESIGN.md` e decisões de marca, mas a governança operacional antiga não foi comparada integralmente. |
| `docs/DOSSIE-EDITORIAL-PARA-REVISAO.md` | INCERTO | Artefato gerado de 15.335 linhas pode conter propostas agregadas; não se provou que toda informação única seja descartável. |
| `docs/GOOGLE-MONITORING-GUIDE.md` | INCERTO | Monitoramento externo não é integralmente coberto pelo inventário arquitetural. |
| `docs/ICON_MOTION_SYSTEM.md` | INCERTO | Há decisões visuais em fontes atuais, mas não comparação integral das regras de motion/ícones. |
| `docs/IMPLEMENTATION_PLAN_TAG08.md` | INCERTO | Pode ter plano histórico específico; waves atuais têm objetivos diferentes e decisões posteriores. |
| `docs/INSIGHTS_EDITORIAL_RULES.md` | INCERTO | Há regras/conteúdo em código, porém não foi demonstrada cobertura editorial completa. |
| `docs/OFFICIAL-CONTENT-SYNC-SETUP.md` | INCERTO | Integração de conteúdo oficial existe no sistema; instruções de setup podem conter dados operacionais únicos. |
| `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md` | INCERTO | O fluxo de produto atual não prova equivalência com playbook operacional da equipe. |
| `docs/PENDENCIAS-ANTES-DA-PUBLICACAO.md` | INCERTO | Alguns riscos aparecem em 09/10/14, mas o estado histórico completo não foi reconciliado item a item. |
| `docs/TAG08_KNOWLEDGE_SYSTEM.md` | INCERTO | Índice do knowledge system removido; os documentos atuais são baseline técnico e não substituem todo conhecimento institucional. |
| `docs/TRACKING-GTM-ACTIVATION.md` | INCERTO | Configuração e operação de analytics não foram comprovadamente migradas integralmente. |
| `docs/TRANSLATION-RUNBOOK.md` | INCERTO | 06 cobre arquitetura i18n, mas não necessariamente o procedimento operacional histórico de tradução. |
| `docs/TYPOGRAPHY-GOVERNANCE.md` | INCERTO | Decisões tipográficas existem no histórico/código, mas o procedimento antigo não foi comparado integralmente. |
| `docs/tag08-content-flows/README.md` | INCERTO | Guia de estrutura/formato das fontes editoriais; o gerador não o lê, mas pode preservar regras de autoria. |
| `docs/tag08-content-global/README.md` | INCERTO | Guia de autoria das fontes globais; não é consumido pelo gerador. |
| `docs/tag08-content-microcopy/README.md` | INCERTO | Guia de autoria de microcopy; não é consumido pelo gerador. |
| `docs/tag08-content-pages/README.md` | INCERTO | Guia de autoria de páginas; não é consumido pelo gerador. |
| `docs/tag08-content-services/README.md` | INCERTO | Guia de autoria de serviços; não é consumido pelo gerador. |
| `docs/tag08-knowledge-system/00_CATALOGO.md` | INCERTO | Catálogo do acervo institucional, sem sucessor integral comprovado. |
| `docs/tag08-knowledge-system/01_TAG08_DNA_MASTER.md` | INCERTO | DNA de marca pode ter conteúdo normativo fora do escopo do baseline técnico. |
| `docs/tag08-knowledge-system/02_POSICIONAMENTO_ESTRATEGICO.md` | INCERTO | Posicionamento comercial não foi comparado com fonte autoritativa atual. |
| `docs/tag08-knowledge-system/03_TOM_DE_VOZ_E_LINGUAGEM.md` | INCERTO | Diretrizes de voz não foram comparadas integralmente. |
| `docs/tag08-knowledge-system/04_CLIENTE_IDEAL_E_PERSONAS.md` | INCERTO | Personas não são substituídas por inventário arquitetural. |
| `docs/tag08-knowledge-system/05_PORTFOLIO_E_OFERTAS.md` | INCERTO | Ofertas/portfólio exigem validação comercial e BRM; presença técnica não basta. |
| `docs/tag08-knowledge-system/06_FILOSOFIA_COMERCIAL.md` | INCERTO | Filosofia comercial não tem successor técnico comprovado. |
| `docs/tag08-knowledge-system/07_FILOSOFIA_OPERACIONAL.md` | INCERTO | Processos operacionais não são integralmente cobertos pelo mapa de integrações. |
| `docs/tag08-knowledge-system/08_GOVERNANCA_E_DECISAO.md` | INCERTO | Pode conter governança institucional que não deve ser presumida obsoleta. |
| `docs/tag08-knowledge-system/09_QUALIDADE_E_REVISAO.md` | INCERTO | Quality gates atuais estão em CI, mas equivalência das políticas não foi demonstrada. |
| `docs/tag08-knowledge-system/10_ONBOARDING_DE_CLIENTES.md` | INCERTO | Conteúdo de processo pode divergir da jornada digital; exige owner operacional. |
| `docs/tag08-knowledge-system/11_PLAYBOOK_DE_CONTEUDO.md` | INCERTO | Workflow editorial não é substituído pelo mapa técnico de fontes. |
| `docs/tag08-knowledge-system/12_PLAYBOOK_DE_VENDAS.md` | INCERTO | Playbook comercial sem substituto técnico identificado. |
| `docs/tag08-knowledge-system/13_PLAYBOOK_DE_PROJETOS_DIGITAIS.md` | INCERTO | Processo de delivery não foi mapeado integralmente pelos documentos atuais. |
| `docs/tag08-knowledge-system/14_AGENTOS_E_SKILLS_USAGE.md` | INCERTO | Uso atual de agentes/skills tem fontes externas; equivalência do documento não comprovada. |
| `docs/tag08-knowledge-system/15_GLOSSARIO_TAG08.md` | INCERTO | Glossário pode conter vocabulário de domínio útil não preservado no código. |
| `docs/tag08-knowledge-system/16_ANTI_PADROES.md` | INCERTO | Algumas regras aparecem em AGENTS.md, mas não foi comparada a cobertura integral. |
| `docs/tag08-knowledge-system/17_CHANGELOG.md` | INCERTO | Histórico do knowledge system pode não estar coberto pelo changelog técnico atual. |
| `docs/tag08-knowledge-system/README.md` | INCERTO | Instruções de uso do acervo sem sucessor integral comprovado. |

## Referências encontradas e reconciliação

| Origem / contexto | Destino antigo | Estado antes | Ação aplicada ou estado |
|---|---|---|---|
| `docs/PROJECT_STATE.md` — fontes de decisão, roadmap, evidências, integração, rotas e arquitetura | `DECISIONS.md`, `ROADMAP.md`, `CONTENT_EVIDENCE_INVENTORY.md`, `INTEGRATION_AUDIT.md`, `ROUTES.md`, `ARCHITECTURE.md`; também orientação para ler `DECISIONS.md` | Quebradas | Atualizado para os documentos atuais por domínio (01–15), `routeRegistry` e contratos em `server/`. Não se afirma que exista um decision log geral substituto. |
| `README.md` — pacote de staging | `docs/STAGING-HOSTING-CHECKLIST.md` | Quebrada | Link removido. README aponta para suas próprias seções de deploy/manutenção e declara que checklist separado não está versionado. |
| `.ai-agents/02-route-and-governance.md` | `docs/ARCHITECTURE.md`, `docs/ROUTES.md` e tarefa de criá-los | Quebrada/instrução desatualizada | Atualizado para mapas 01, 03 e 10; instrução agora manda atualizar os mapas canônicos, não recriar os arquivos aposentados. |
| `.ai-agents/04-validation-and-release.md` | `docs/DECISION_MATRIX.md` | Quebrada | Atualizado para `09_RISK_REGISTER.md` e `10_CONSOLIDATION_WAVES.md`. |
| `.ai-agents/05-crossdomain-seo-hub.md` | `docs/ARCHITECTURE.md`, `docs/ROUTES.md` e tarefa de criá-los | Quebrada/instrução desatualizada | Atualizado para mapas 01 e 03; não se reabre o mapa de rede no escopo desta missão. |
| `docs/CHANGELOG.md` — entradas históricas | Vários nomes de documentos removidos | Referência histórica, não link/instrução atual | Preservada. A entrada nova registra aposentadoria e a lacuna editorial pendente; não reescrever história para parecer que esses arquivos nunca existiram. |
| `docs/architecture-consolidation/01_CURRENT_STATE_MAP.md` — observação do baseline | `ARCHITECTURE.md`, `ROUTES.md`, `DECISIONS.md`, `ROADMAP.md` | Evidência correta no momento da auditoria | Preservada como observação histórica do baseline. |
| `docs/architecture-consolidation/17_PRE_PUSH_AUDIT.md` — diagnóstico de blocker | referências de `PROJECT_STATE` e gerador editorial | Diagnóstico anterior à reconciliação | Acrescentada nota de atualização, sem apagar o achado ou falsificar que os gates de push foram executados. |
| `tools/generate-editorial-review.mjs` — `contentRoots` | Cinco árvores `docs/tag08-content-*/content` e saída `docs/DOSSIE-EDITORIAL-PARA-REVISAO.md` | Entradas ausentes; execução manual lança erro ao enumerar a primeira raiz ausente | Mantido sem alteração. Não é package script nem etapa de CI. A decisão entre reconstituir fontes editoriais, aposentar o gerador ou criar um novo fluxo precisa de owner editorial; não gerar um dossiê parcial silenciosamente. |
| `tools/continuity-check.mjs` | `docs/PROJECT_STATE.md` | Destino existe; não há referência aos outros 78 removidos | Mantido. O checker extrai checkpoint do arquivo existente e valida branch/base. |
| `.githooks/pre-commit` e `tests/continuityCheck.test.ts` | argumento `--staged` | Argumento sem efeito após `9a934e4` | O commit removeu deliberadamente a política de exigir PROJECT_STATE/CHANGELOG por commit e também removeu a leitura de `--staged`; hook/teste ainda passam essa flag, que é ignorada porque o checker só lê `--ci`. Isso causa uma chamada duplicada no teste e uma opção obsoleta, mas não ressuscita o gate antigo nem aponta para documento ausente. Não alterado nesta missão para não mudar a política de governança; registrar limpeza de flag como ação separada, não blocker documental. |

As referências históricas em `CHANGELOG.md` não foram removidas. As menções antigas em `01_CURRENT_STATE_MAP.md` e `17_PRE_PUSH_AUDIT.md` são relatos de auditorias realizadas antes desta reconciliação e foram mantidas com contextualização temporal. Instruções do skill-router instaladas fora do repositório apontam para documentos antigos; não foram modificadas nesta missão porque não são arquivos do projeto nem estão no escopo permitido.

## Documentos focais

- **`ARCHITECTURE.md`:** não restaurar. O mapa atual de estado e fontes canônicas é 01/02; decisões arquiteturais aprovadas e gaps estão distribuídos por 02/07/10. Não há justificativa para recriar um documento genérico adicional.
- **`ROUTES.md`:** não restaurar. O inventário atual é 03 e a fonte executável é `src/config/routeRegistry.ts`.
- **`DECISIONS.md`:** não restaurar como cópia automática. Há decisões atuais por domínio em 02, 10 e 14, mas um log geral não foi comprovado como substituído; a referência foi redirecionada sem declarar equivalência integral. Uma decisão humana/owner é necessária se um decision log geral continuar sendo requisito.
- **`ROADMAP.md`:** não restaurar. O plano aprovado está em 10; P6 é implementação progressiva do alvo, não escolha arquitetural aberta.
- **`STAGING-HOSTING-CHECKLIST.md`:** não restaurar automaticamente. A informação pública de deploy foi parcialmente descrita no README. O conteúdo histórico e os passos/owners que possam faltar permanecem incertos e precisam de revisão operacional antes de reconstrução.
- **Índice documental/redirect:** não foi criado um redirect documental genérico: referências diretas puderam apontar para fontes atuais e um índice novo duplicaria 01–18. O único mapa geral de continuidade continua `PROJECT_STATE.md`.

## Continuity checker, testes e efeito de governança

`tools/continuity-check.mjs` só lê `docs/PROJECT_STATE.md`, checa campos de checkpoint, branch e ancestralidade da base registrada; não busca os 78 documentos e não depende deles. A opção `--staged` foi removida do checker no commit `9a934e4` junto com a política de exigir `PROJECT_STATE.md`/`CHANGELOG.md` por commit. O hook e o teste ainda passam essa flag sem efeito; o teste executa duas vezes o mesmo contrato com `--ci`. Isso é resíduo de CLI/teste, não falha de continuidade documental. Nenhuma alteração foi feita ao checker, ao hook ou aos testes nesta etapa.

Validações:

- `npm run continuity:check` — PASS após executar fora do sandbox restritivo; branch/base/checkpoint válidos. Avisou 253 caminhos untracked, incluindo artefatos de auditoria e documentos desta jornada.
- `npm test` — PASS após executar fora do sandbox restritivo; testes de rotas, evidências, localização, contratos e continuidade passaram.
- `npx tsc --noEmit` — PASS, sem emissão de arquivos.
- `npm run lint` — não concluído: o `prelint` executa `npm run db:generate`; Prisma tentou obter `schema-engine.exe` sem acesso à rede (`ECONNREFUSED`). Não repetido. A verificação TypeScript direta acima passou.
- `git diff --check` — sem erros de whitespace nos diffs; Git emitiu avisos de normalização LF/CRLF em arquivos já modificados no worktree.
- E2E/browser — não executar nesta missão.

## Histórico útil preservado e aposentadorias

Preservados em formato atual: estado e diferenças atual/alvo em 01/02/11; inventário de rotas em 03; conteúdo em 05; i18n em 06; integrações em 07; dependências em 08; riscos em 09; ondas em 10; contratos de evidência em 13/14/15; continuidade do P0.5 em 16 e achados pré-push em 17. `CHANGELOG.md` preserva referências de que os documentos históricos existiram.

Isso não equivale a migração integral dos playbooks, políticas editoriais, knowledge system e dados de staging. Não foi possível provar, somente pelas referências e baseline atual, que qualquer um dos 43 itens incertos esteja completamente aposentado ou que seu conteúdo todo esteja preservado. Nenhum material foi copiado por inferência.

## Blockers e risco residual

1. **Gerador editorial sem fontes:** 29 itens continuam referenciados por diretórios removidos; executar `node tools/generate-editorial-review.mjs` atualmente falha. Não está no fluxo padrão de npm/CI, mas o destino do gerador e das fontes exige decisão do owner editorial.
2. **Conteúdo histórico incerto:** 43 itens precisam triagem por owner; em especial playbooks comerciais/operacionais, knowledge system, checklist de staging e regras editoriais. Não restaurar em massa.
3. **Decision log geral:** as referências foram atualizadas, mas não foi comprovado um sucessor integral de `DECISIONS.md`; decidir se o repositório exige essa fonte geral ou mantém decisões por domínio.
4. **Flag obsoleta `--staged`:** permanece em hook/teste, mas não muda resultado; limpeza pequena possível em tarefa própria, sem reintroduzir exigência documental por commit.
5. **Instruções externas ao repositório:** o skill-router local da máquina ainda enumera documentos aposentados como contexto prioritário. A missão não altera instalação externa; esse é risco de continuidade fora do repositório.

## Recomendação e próximo passo

Referências de continuidade, rotas, arquitetura, roadmap, risco e deploy no README/agentes foram reconciliadas sem restaurar a documentação antiga. A execução do checker permanece semanticamente estável, sem dependência dos arquivos removidos. Para a série poder ser considerada documentalmente reconciliada, a ação futura mínima é decidir com o owner editorial se o gerador/fontes serão reativados ou aposentados e se haverá decision log geral. Depois, executar `npm run continuity:check`, `npm test` e `npm run lint`; E2E continua fora desta missão.

**Classificação desta etapa:** reconciliação das referências operacionais concluída; **resíduo editorial conhecido e documentado**. O blocker de links quebrados em PROJECT_STATE/README/`.ai-agents` foi resolvido. O fluxo opcional do gerador editorial permanece sem suporte; ele não é um gate de CI/push conhecido.

**Arquivos desta missão:** este documento; `docs/PROJECT_STATE.md`; `docs/CHANGELOG.md`; `README.md`; `.ai-agents/02-route-and-governance.md`; `.ai-agents/04-validation-and-release.md`; `.ai-agents/05-crossdomain-seo-hub.md`; atualização histórica aditiva em `docs/architecture-consolidation/17_PRE_PUSH_AUDIT.md`.
