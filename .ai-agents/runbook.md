# Runbook de execução dos .ai-agents

Sequência recomendada (não paralela):

1. `01-backend-and-integration.md`
2. `02-route-and-governance.md`
3. `03-content-and-encoding.md`
4. `04-validation-and-release.md`
5. `05-crossdomain-seo-hub.md`

Como trabalhar:
- Abra 1 arquivo por vez e execute em ciclos curtos.
- Ao terminar cada ciclo, registrar:
  - O que foi mudado
  - Arquivos tocados
  - Risco residual
  - Dependências abertas
- Só avançar para o próximo ciclo quando o anterior estiver em `OK` ou com risco aceitável justificado.

Critério de “fim de ciclo”:
- Entrega com aceite sem pendências obrigatórias.
- Pendências opcionais entram na próxima iteração em backlog.
