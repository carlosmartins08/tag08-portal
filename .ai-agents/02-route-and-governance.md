# AGENTE 02 Ã route-and-governance

Objetivo:
- Consolidar rotas, SEO e documentaÃÃo mÃnima do projeto para reduzir ambiguidade operacional.

Escopo:
- `src/App.tsx` (roteamento e validaÃÃo de caminho)
- `generate-sitemap.ts` (paths cobertos)
- `README.md` (instruÃÃes de execuÃÃo/estrutura)
- Arquivos de documentaÃÃo que faltam criaÃÃo: `docs/ARCHITECTURE.md`, `docs/ROUTES.md`

Tarefas:
1. Padronizar rotas existentes: lista canÃnica Ãnica de pÃginas vÃlidas e redirecionamentos.
2. Garantir que sitemap e SEO usem a mesma fonte de rotas.
3. Criar `docs/ARCHITECTURE.md` com visÃo de app (stack, camada SPA, integraÃÃes).
4. Criar `docs/ROUTES.md` com mapa completo de URLs pÃblicas, legado e destino.

EntregÃvel:
- Documentos rastreÃveis com versÃo e data.
- ObservaÃÃo explÃcita de qualquer rota nÃo coberta por pÃgina fÃsica.

CritÃrios de aceite:
- Toda rota pÃblica importante estÃ em ao menos um documento e no sitemap.
- NÃo hÃ rota ÃfantasmaÃ sem destino real.
- MudanÃa de rota exige atualizaÃÃo do `routes document`. 
