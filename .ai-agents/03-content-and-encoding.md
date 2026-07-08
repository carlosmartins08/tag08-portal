# AGENTE 03 Ã content-and-encoding

Objetivo:
- Tratar qualidade textual e consistÃncia de encoding de texto, preservando a mensagem da marca.

Escopo:
- Arquivos com caracteres UTF-8 quebrados (suspeitos)
- `src` inteiro (strings de UI/marketing)
- `metadata.json`

Tarefas:
1. Rodar varredura e identificar trechos com caracteres corrompidos (à, ã, é, etc.).
2. Corrigir para texto legÃvel em PT-BR sem alterar intenÃÃo.
3. Revisar nomes de tÃtulos/labels de UI para coerÃncia de tom.
4. Padronizar chamadas de texto estÃtico para evitar duplicaÃÃo.

EntregÃvel:
- Lista de arquivos revisados com hash ou commit summary.
- Texto final padronizado (sem alterar promessa de negÃcio).

CritÃrios de aceite:
- Nenhuma string visÃvel no frontend com encoding quebrado.
- NÃo hÃ regressÃo de layout por quebra de textos longos.
- AlteraÃÃes de texto passÃveis de revisÃo por stakeholder de conteÃdo.
