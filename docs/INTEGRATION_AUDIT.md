# Auditoria de integração — TAG08

Atualizado em: `2026-09-15`

## Conclusão

`p0-routing-secret-containment` não é uma coleção de versões concorrentes. É uma única linha com dez commits históricos após `main`, aos quais foram acrescentados checkpoints locais. O problema é que essa linha mistura objetivos incompatíveis para um merge cego.

Não fazer merge direto enquanto o conteúdo público pendente não tiver uma decisão comercial. O caminho abaixo preserva as evoluções técnicas sem transformar uma aprovação técnica em aprovação de pessoas, cases ou métricas.

## Auditoria dos dez commits históricos

| Grupo | Commits | Conteúdo | Decisão de integração |
| --- | --- | --- | --- |
| Rotas e segurança | `d57fc27`, `c19894e` | Corrigem o loop de locale no standalone e impedem arquivos de ambiente no artefato. | Candidatos técnicos independentes; manter com seus testes. |
| Localização, consentimento e publicação | `9541449`, `37b64b3`, `13c6c7f` | Cookie consent, analytics, cabeçalhos, rota/localização, SEO, tradução e conteúdo oficial. `9541449` abre todos os idiomas; `37b64b3` corrige isso com o gate de revisão. | Tratar como um bloco ordenado. Não selecionar `9541449` isoladamente, pois ele expõe idiomas antes da revisão. |
| Sistema visual e acessibilidade | `b735000`, `d15b69e` | Primitivas visuais, layout, componentes de foco, navegação, WhatsApp e testes de páginas críticas. | Há valor técnico, mas `d15b69e` reintroduz `TrustTestimonialsSection` na Assessoria. Manter o restante; decidir explicitamente o destino desse bloco de prova. |
| Editorial e redução de risco | `a1f1791`, `38a3a76` | Revisão editorial da Home; em 02/09 reduz provas não validadas em Home, Sobre, Serviços e Gestão. | Não é um pacote técnico neutro. Serve como referência de conteúdo e só entra junto de decisão comercial. |
| Reintrodução de conteúdo público | `3314b39` | Sete fotos de equipe, perfis em `/sobre`, alteração de 8.906 linhas em `src/data.ts` e mudanças em três serviços. | Bloqueado para integração técnica até classificar equipe, cases, depoimentos e métricas no inventário. O assunto do commit não descreve sua amplitude real. |

## Checkpoints posteriores à auditoria

| Commit | Conteúdo | Estado |
| --- | --- | --- |
| `6aa639b` | Decisões, roadmap e estado de continuidade. | Mantido como governança. |
| `99827ff` | Rota estática `/llms.txt`, ajuste de proxy e teste de rotas. | Candidato técnico independente; `npm run check` passou. |
| `6974a4f`, `7235f25` | Correção do estado e inventário de evidências públicas. | Mantidos como governança. |

## Sequência segura

1. Confirmar a política para conteúdo `pendente`: manter visível até prova ou ocultar da renderização enquanto permanece no código.
2. Criar uma única integração revisável a partir de `main` apenas depois dessa política, sem merge direto de `p0`.
3. Aplicar primeiro rotas/segurança, depois o bloco completo de localização e, por fim, `/llms.txt`.
4. Aplicar sistema visual/acessibilidade somente com o destino de `TrustTestimonialsSection` decidido.
5. Tratar conteúdo editorial e o commit `3314b39` em revisão própria, vinculada a `CONTENT_EVIDENCE_INVENTORY.md`.
6. Rodar `npm run check`, verificações de rotas/SEO e os testes de navegador pertinentes antes de qualquer merge.

## Regra para eliminar o retrabalho

Uma branch temporária de integração só existe para um objetivo e termina em PR/merge ou descarte. Ela não vira nova fonte de verdade. A fonte de verdade continua sendo `main` após a integração aprovada; `p0` permanece apenas como histórico até então.

## Decisão pendente do dono comercial

Definir uma política única para todo item `pendente` do inventário:

- `conservadora` — ocultar da renderização pública até existir prova, preservando código e ativos para revisão;
- `manter visível` — manter como está até classificação individual, aceitando o risco comercial atual.

Sem essa decisão, nenhuma alteração visual de equipe, cases, depoimentos, marcas ou métricas deve ser feita.
