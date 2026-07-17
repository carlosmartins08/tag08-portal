# Plano de desenvolvimento ponta a ponta TAG08

## Fase 1 (semana 1-2) - Fundação operacional
- Endpoint real `/api/onboarding` com contrato versionado e resposta padrão.
- Validação e normalização de payload no backend.
- Observabilidade mínima (`/api/onboarding/metrics`).
- Fila local estruturada com retenção e tentativas.
- Estado de UI em três cenários:
  - enviado com confirmação
  - enfileirado para retry
  - erro técnico com ação sugerida
- Basear toda ação da fase em `docs/TAG08_KNOWLEDGE_SYSTEM.md` para evitar decisões desalinhadas de posicionamento, linguagem e oferta.

## Fase 2 (semana 3) - Governança de produto e rotas
- Consolidação do route registry como única fonte.
- Sincronização com SEO (`src/app/[locale]/[[...segments]]/page.tsx`, `src/app/sitemap.ts`, metadados).
- Registro de rotas e aliases em `docs/ROUTES.md`.
- Atualização da arquitetura em `docs/ARCHITECTURE.md`.

## Fase 3 (semana 4-6) - Produto e conversão
- Revisão de microcopy e estados visuais.
- Padronização i18n para mensagens de erro, sucesso e loading.
- Ajustes de acessibilidade essenciais:
  - contraste
  - semântica de labels
  - foco
- Limpeza de textos PT/EN/ES quebrados priorizando telas de maior impacto.

## Fase 4 (semana 6+) - Evolução
- Revisão de fila com integração interna (Sheets/ClickUp/CRM).
- Separação futura de CMS sem quebrar SPA.
- Feature flags por ambiente e janelas de rollout.
- Revisão semestral de rota, compatibilidade e SEO.

## Critérios de aceite por fase
1. Onboarding retorna 2xx e registra uma tentativa por envio.
2. Offline salva fila e recupera automaticamente no retorno da conexão.
3. Fila persiste após reload e respeita limites.
4. Registry contém todas as rotas públicas e aliases.
5. Nenhuma rota canônica fica sem metadado ou registro.
6. Sitemap reflete rotas indexáveis e não inclui rotas não canônicas.
7. Não há log de payloads sensíveis no console.

## Pontuação de risco
- Alto risco: integração externa da fila e migração para persistência real.
- Risco médio: texto quebrado ainda presente em componentes complexos com histórico de encoding.
- Baixo risco: ajustes de metadados de rota.
