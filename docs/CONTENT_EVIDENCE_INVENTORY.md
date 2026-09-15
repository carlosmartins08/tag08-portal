# Inventário de evidências públicas — TAG08

Atualizado em: `2026-09-15`

## Finalidade e regra de leitura

Este inventário mapeia alegações, pessoas, marcas, cases, depoimentos, imagens e métricas que podem estar expostos publicamente. Ele não comprova a alegação: registra onde ela existe, o alcance técnico e a evidência que ainda precisa ser associada.

Status inicial de todos os itens abaixo: `pendente`. A exceção é uma avaliação retornada ao vivo pela integração oficial do Google Business, que é `fonte externa identificada`, mas ainda deve respeitar a resposta real da API e os termos da plataforma.

| Status | Significado |
| --- | --- |
| `aprovado` | Há autorização e prova verificável vinculadas ao item. |
| `pendente` | O item existe no código ou em um ativo, mas a prova não está associada a ele. |
| `remover` | Há decisão registrada para não mantê-lo público. |

## Inventário prioritário

| Grupo | Itens | Onde aparece | Alcance público | Estado | Evidência necessária |
| --- | --- | --- | --- | --- |
| Equipe | Carlos Henrique Martins, Ignacio Quiroz, Pedro Félix, Daniel Lopes, Guilherme Gomes, Amazing Design e Andréia Braga | `src/features/site/pages/Sobre.tsx`; fotos em `public/team/` | `/sobre` | `pendente` | vínculo, cargo, texto biográfico e autorização de imagem de cada perfil |
| Cases da Home | Alan Rocha, Clínica Le Visage, Luciana Gadelha, Doctor Play, Legal Lab e Squalis Educação | `CLIENT_CASES` em `src/features/site/pages/Home.tsx` | `/` | `pendente` | autorização de marca, pessoa, imagem, citação, data e escopo real; origem das imagens remotas |
| Cases indexáveis | Clínica Médica Alphaville, ProcessFlow SaaS e Nunes & Associados | `CASE_STUDIES` em `src/data.ts`; renderização em `CaseStudyDetail.tsx`; paths derivados em `routeRegistry.ts` | `/casos/*`, sitemap e links internos | `pendente` | contrato/autorização de case, confirmação de dados, método de cálculo e direito de imagem |
| Métricas de case | `+240%`, `4.2x`, `18`, redução de `40%`, conversão de `1.2%` a `5.8%` e demais resultados narrados | `src/data.ts`; `MiniCases.tsx` | Cases indexáveis e páginas de serviço | `pendente` | fonte, período, denominador, método de cálculo e aprovação de publicação |
| Mini cases reutilizados | Clínica Alphaville, ProcessFlow ERP, Nunes & Associados, Grupo Medeiros, Zenith Corporativo e Vanguard Sec | `src/components/MiniCases.tsx` | Assessoria, Branding, Desenvolvimento Web, Produção Audiovisual, Process Intelligence e Process Activation | `pendente` | mesma prova de case; confirmação de que o nome e a métrica podem ser usados em cada contexto |
| Depoimentos internos reutilizados | Dra. Roberta Chaves, Marcus Azevedo, Juliana Reis e Beatriz Nogueira | `src/content/googleReviews.ts`; `TrustTestimonialsSection.tsx` | `/servicos/assessoria-marketing-digital-estrategico` | `pendente` | autoria, consentimento do texto, vínculo, data e autorização de imagem/nome |
| Avaliações estáticas inativas | Dra. Roberta Chaves, Marcus Azevedo, Juliana Reis, Dr. Arthur Mendes, Beatriz Nogueira e Leonardo Castilho | `GMB_REVIEWS` em `Home.tsx` | não renderiza no estado atual | `pendente` | decidir remoção ou substituir exclusivamente pelo fluxo oficial ao vivo |
| Avaliações Google ao vivo | resposta de `official-content` quando `googleBusiness === "live"` | `server/officialContent.ts` e `Home.tsx` | `/`, somente com resposta ao vivo | `fonte externa identificada` | configurar e auditar a integração; não criar fallback apresentado como avaliação real |
| Logos não rastreados | CaYuCa, Harmonic, HomeOffice, Alugue por Temporada, Luciana Gadelha, Raquel Cordeiro, Reavivare, Ruben A, Segura EPI, Vaqrama, VR Imobiliária e WSCOM (23 arquivos) | `public/clients/` | nenhum uso encontrado no código | `pendente` | direito de uso, variante aprovada, associação a case/portfólio e destino de publicação |

## Riscos adicionais identificados

- `Contato.tsx` contém compromissos operacionais concretos, como retorno em até seis horas úteis e proteção integral de dados. São promessas verificáveis e precisam de confirmação operacional/jurídica em uma revisão própria.
- `GMB_REVIEWS` e `TRUST_REVIEWS` repetem parte dos mesmos nomes com conteúdos diferentes. Isso é risco de inconsistência, mesmo quando um item não está renderizado.
- Há imagens remotas do Unsplash usadas como retratos ou fundos de cases. Uma imagem ilustrativa não deve sugerir ser retrato de cliente ou prova de trabalho realizado.

## Decisão necessária por item

Para cada linha, o responsável comercial deve registrar em um canal verificável: `aprovado`, `pendente` ou `remover`, com link para a evidência, titular da autorização, data de validade e rotas autorizadas. Sem isso, esta fase não autoriza promover, retirar ou reciclar a alegação.
