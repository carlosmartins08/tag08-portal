# Matriz de decisao TAG08 - implantacao

Atualizado: `2026-07-09`
Proxima revisao sugerida: `2026-08-01`

## Objetivo

Consolidar decisoes tecnicas para manter estabilidade, previsibilidade e velocidade de evolucao no plano de implantacao ponta a ponta.

| Topico | Opcoes avaliadas | Decisao | Risco | Mitigacao |
| --- | --- | --- | --- | --- |
| Contrato do onboarding | API externa dedicada x endpoint proprio minimo | **Route Handler em `src/app/api/onboarding/route.ts` com o contrato existente e fallback local** | Medio | Manter integracao externa so em fase futura usando o mesmo contrato |
| Validacao de envio | Validar so no cliente x validar tambem no backend | **Validacao minima no backend com normalizacao** | Baixo/medio | Ajuste em `server/onboardingContract.ts` com retorno padronizado |
| Fila de erro de rede | Perder envio x manter local e reprocessar | **`localStorage` com `maxRetries`, `maxAgeDays` e janela de sincronizacao** | Baixo | Script de operacao orientado em `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md` |
| Rotas e SEO | Rotas soltas em multiplos locais x registro unico | **`routeRegistry` como fonte canonica** | Baixo | `src/app/[locale]/[[...segments]]/page.tsx`, `src/app/sitemap.ts` e docs sincronizados |
| Texto/idioma | Strings estaticas quebradas x centralizar por idioma | **Idiomas ativos: PT-BR (default), EN, ES** | Medio | Revisao de strings visiveis e checklist de QA |
| Orquestracao de agentes e skills | Cada agente improvisa x contrato de missao com registry e catalogo | **`docs/AGENT_ROUTER.md` + `docs/AGENTOS_BRIDGE.md` + `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\.ai-agents` + `C:\Users\leobe\Documents\Aplicacao_vibe code_CarlosHenrique\skills\CATALOGO.md`** | Baixo | Revisar quando mudar papel, cobertura ou prioridade de skill |
| Controle de liberacao | Deploy sem checklist x pre-check de release | **Checklist curto em `docs/AGENTOS_BRIDGE.md` + validacoes de risco** | Medio | `docs/CHANGELOG.md` e revisao obrigatoria com owner |
| SEO entre dominios | LPs em subdominios com canonicals/links inconsistentes | **Documento padrao em `docs/AGENTOS_BRIDGE.md` + revisao mensal dos blocos de ecossistema** | Baixo | Validacao em `docs/ROUTES.md` e runbook de release |

## Dono da decisao

- Operacao: produto
- Execucao tecnica: engenharia
- Conteudo/SEO: marketing

## Criterio de aceitacao minima

- Nao perder submissoes locais apos reload
- Metas de status da API e fila rastreadas
- Toda rota indexavel no registry e sitemap
- Sem regressao de idioma visivel em fluxos criticos
