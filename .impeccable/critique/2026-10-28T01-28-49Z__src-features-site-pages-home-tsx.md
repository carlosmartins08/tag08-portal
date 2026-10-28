---
target: TAG08 homepage and first Contact step
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Home.tsx"
target_fingerprint: "sha256:41e1ea83659df0a0ca3a3790256221b8ad0a1b84672983c147a69aac7c897fd0"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\features\\site\\pages\\Home.tsx"
timestamp: 2026-10-28T01-28-49Z
slug: src-features-site-pages-home-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/detector_evidence)

# TAG08 — avaliação heurística da Home e primeiro passo de Contato

## Escopo
Homepage de http://localhost:3101/ e destino do CTA principal até a primeira etapa de Contato. Não avaliei envio, estado final do formulário, todas as páginas do site nem a experiência mobile. Análise heurística, não teste com usuários.

## Diagnóstico geral
A identidade escura com acento lime e a chamada principal comunicam bem a proposta. Quem não sabe qual serviço precisa encontra orientação no Contato. O maior atrito é a repetição de listas com seis opções, somada a termos especializados e elementos flutuantes, que pode desviar a atenção da próxima ação.

## Nielsen

| # | Heurística | Nota | Evidência |
|---|---|---:|---|
| 1 | Visibilidade do estado | 3/4 | Contato mostra etapa 1 de 3 e progresso. |
| 2 | Correspondência com o mundo real | 3/4 | Mensagem trata de problemas de negócio; alguns serviços usam jargão. |
| 3 | Controle e liberdade | 3/4 | Quatro intenções e opção de orientação; caminho de voltar não verificado. |
| 4 | Consistência e padrões | 2/4 | Apresentação editorial convive com rótulos técnicos e faixa de revisão local. |
| 5 | Prevenção de erros | 2/4 | Primeira escolha simples; validação posterior não avaliada. |
| 6 | Reconhecimento em vez de memorização | 2/4 | Seis atalhos e outras listas exigem classificar a necessidade. |
| 7 | Flexibilidade e eficiência | 2/4 | Atalhos existem; caminho abreviado para recorrentes não avaliado. |
| 8 | Estética e minimalismo | 2/4 | Hierarquia do hero clara; listas e elementos flutuantes competem. |
| 9 | Recuperação de erros | 2/4 | Contexto do formulário observado; recuperação de erros não testada. |
| 10 | Ajuda e documentação | 3/4 | Home tem FAQ e Contato explica por que pede contexto. |
| **Total** |  | **24/40 — aceitável** | Estimativa heurística, não pesquisa quantitativa. |

## Os 20 princípios

| Princípio | Diagnóstico | Próxima ação |
|---|---|---|
| Hick | Atrito observado: seis atalhos de solução. | Priorizar orientação e agrupar atalhos. |
| Fitts — alvo | Código prevê mínimo de 44 px nos atalhos; dimensão real não medida. | Confirmar alvos em mobile. |
| Jakob | Navegação, CTA e FAQ usam padrões familiares. | Preservar rótulos e destinos previsíveis. |
| Proximidade | Título, explicação e CTA do hero estão agrupados. | Agrupar opções de solução por necessidade. |
| Miller | Sequências com seis escolhas excedem agrupamento curto. | Mostrar poucas categorias iniciais. |
| Doherty | Tempo de resposta não medido. | Medir carregamento e resposta antes de afirmar velocidade. |
| Von Restorff | Lime destaca o CTA, mas outros destaques concorrem. | Reservar o acento forte à ação principal. |
| Fitts — distância | CTA visível no desktop; alcance do polegar não verificado. | Validar posição e sobreposição em viewport móvel. |
| Posição serial | A abertura é forte; o fechamento da Home não foi percorrido. | Reforçar um próximo passo no fim da página. |
| Pico-fim | Início confiante; fim do formulário não observado. Faixa local reduz acabamento nesta instância. | Verificar confirmação final e manter faixa restrita ao modo local. |
| Zeigarnik | Indicador 1/3 torna o progresso visível; retomada não testada. | Testar interrupção e retorno. |
| Occam | Muitas listas para chegar a uma ação simples. | Simplificar a escolha sem remover conteúdo aprovado. |
| Tesler | Visitante absorve parte da classificação do problema. | Deixar o caminho de orientação absorver essa complexidade. |
| Postel | Tolerância e normalização de input não testadas. | Testar formatos comuns e validação clara. |
| Murphy | Erros nas etapas posteriores não testados. | Validar erros sem perder respostas nem exibir detalhes técnicos. |
| Semelhança | CTAs e atalhos parecem coerentes; todos os destinos não percorridos. | Diferenciar ações distintas e manter padrão para equivalentes. |
| Conectividade uniforme | Cards e elementos próximos formam grupos claros. | Usar agrupamento para reduzir decisões simultâneas. |
| Parkinson | Extensão da Home pode prolongar a busca; tempo não medido. | Tornar orientação e contato encontráveis sem leitura integral. |
| Carga cognitiva | 4/8 verificações falharam: foco único, chunking curto, poucas escolhas, baixa demanda de memória. | Reduzir decisões simultâneas e explicar termos no contexto. |
| Gradiente de meta | Progresso 1/3 é favorável; conclusão não observada. | Manter progresso honesto e confirmação final clara. |

## Design specificity e detector
A linguagem escura/lime é coerente, mas poderia pertencer a outras consultorias estratégicas. Os temas de serviço e a mensagem de diagnóstico antes da execução dão identidade TAG08, enquanto rótulos técnicos e overlays às vezes competem com a clareza editorial.

O detector encontrou seis avisos de tamanho tipográfico fora da escala reconhecida em Home.tsx: linhas 1971 (76px), 1983 (0.65rem), 2698 (40px), 2849 (180px e 230px) e 2855 (28px). São avisos determinísticos, não prova isolada de defeito: DESIGN.md descreve a hierarquia, mas não uma escala numérica completa para tamanhos editoriais. Não recomendo alteração automática.

## O que funciona
- Título, explicação e CTA formam um caminho inicial claro.
- Contato oferece orientação para visitantes indecisos.
- Paleta e tipografia estão alinhadas ao DESIGN.md e reconhecíveis.

## Prioridades
1. **P2 — Muitas escolhas paralelas:** seis atalhos e listas extensas podem atrasar visitantes indecisos. Agrupar e priorizar orientação. $impeccable distill.
2. **P2 — Jargão sem explicação imediata:** “Process Intelligence”, “Process Activation” e “Discovery” elevam o custo de entrada. Acrescentar explicação curta orientada ao problema. $impeccable clarify.
3. **P2 — Ações concorrentes no viewport:** chat flutuante e CTA principal disputam atenção; mobile não verificado. Avaliar hierarquia e sobreposição em telas pequenas. $impeccable adapt.

A faixa “REVISÃO LOCAL — NÃO PUBLICADO” e selos editoriais são visíveis nesta instância, mas o código os limita a NODE_ENV=development e NEXT_PUBLIC_TAG08_CONTENT_REVIEW=1. Trato isso como sinal ambiental; confirme a flag no build de produção, sem inferir exposição pública.

## Personas
- **Primeira visita:** orientação reduz pressão, mas seis categorias e termos especializados podem gerar hesitação.
- **Stress tester:** erros, refresh durante o formulário e confirmação final não foram verificados.
- **Pessoa mobile:** código sugere alvos de 44 px, mas alcance, sobreposição e rolagem não foram observados.

## Observações menores
- Contato mostra um indicador de três etapas.
- Cabeçalho mantém CTA de contato.
- Não houve envio de formulário nem interação com integrações.

## Pergunta provocativa
Se a pessoa ainda não sabe qual serviço precisa, por que a Home pede que ela escolha entre seis categorias antes de aprofundar a orientação?
