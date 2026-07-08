# Matriz de decisão TAG08 - implantação

Atualizado: `2026-07-03`
Próxima revisão sugerida: `2026-08-01`

## Objetivo

Consolidar decisões técnicas para manter estabilidade, previsibilidade e velocidade de evolução no plano de implantação ponta a ponta.

| Tópico | Opções avaliadas | Decisão | Risco | Mitigação |
| --- | --- | --- | --- | --- |
| Contrato do onboarding | API externa dedicada x endpoint próprio mínimo | **Endpoint próprio em `server/index.ts` com fallback local** | Médio | Manter integração externa só em fase futura usando o mesmo contrato |
| Validação de envio | Validar só no cliente x validar também no backend | **Validação mínima no backend com normalização** | Baixo/médio | Ajuste em `server/onboardingContract.ts` com retorno padronizado |
| Fila de erro de rede | Perder envio x manter local e reprocessar | **`localStorage` com `maxRetries`, `maxAgeDays` e janela de sincronização** | Baixo | Script de operação orientado em `docs/ONBOARDING_OPERATIONS_PLAYBOOK.md` |
| Rotas e SEO | Rotas soltas em múltiplos locais x registro único | **`routeRegistry` como fonte canônica** | Baixo | `src/App.tsx`, `generate-sitemap.ts` e docs sincronizados |
| Texto/idioma | Strings estáticas quebradas x centralizar por idioma | **Idiomas ativos: PT-BR (default), EN, ES** | Médio | Revisão de strings visíveis e checklist de QA |
| Controle de liberação | Deploy sem checklist x pré-check de release | **Checklist curto em `.ai-agents` + validações de risco** | Médio | `docs/CHANGELOG.md` e revisão obrigatória com owner |
| SEO entre domínios | LPs em subdomínios com canonicals/links inconsistentes | **Documento padrão em `.ai-agents/05-crossdomain-seo-hub.md` + revisão mensal dos blocos de ecossistema** | Baixo | Validação em `docs/ROUTES.md` e runbook de release |

## Dono da decisão

- Operação: produto
- Execução técnica: engenharia
- Conteúdo/SEO: marketing

## Critério de aceitação mínima

- Não perder submissões locais após reload
- Metas de status da API e fila rastreadas
- Toda rota indexável no registry e sitemap
- Sem regressão de idioma visível em fluxos críticos
