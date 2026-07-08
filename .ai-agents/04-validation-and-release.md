# AGENTE 04 Ã validation-and-release

Objetivo:
- Fechar riscos de regressÃo, dependÃncias e prontidÃo para produÃÃo.

Escopo:
- `package.json`
- `tsconfig.json`
- `README.md`
- `src/types.ts`

Tarefas:
1. Revisar dependÃncias nÃo utilizadas e remover ruÃdos (`express`, `dotenv`, etc.) se nÃo houver backend local.
2. Criar checklist de prÃ-release com 10 itens crÃticos (performance, LGPD, acessibilidade bÃsica, SEO, rotas).
3. Definir estratÃgia de observaÃÃo pÃs-change (o que monitorar).
4. Atualizar README com ordem de execuÃÃo e limitaÃÃes atuais.

EntregÃvel:
- `docs/DECISION_MATRIX.md` com risco/impacto de cada mudanÃa.
- `docs/CHANGELOG.md` resumindo decisÃes e prÃximos passos obrigatÃrios.

CritÃrios de aceite:
+- Checklist executÃvel por nÃo tÃcnico em 15 minutos.
+- DependÃncias de projeto em `package.json` coerentes com uso real.
+- Documento de release com owner e data da prÃxima revisÃo.
