---
target: src/lib/simulators/processIntelligence.ts
total_score: 25
max_score: 40
na_heuristics: 7,8,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\lib\\simulators\\processIntelligence.ts"
target_fingerprint: "sha256:7bb26dff40b307de71c3cc246fceea97a567c6226d5304c3b4d4964cfa4a70bb"
target_path: "C:\\Users\\leobe\\Documents\\Aplicacao_vibe code_CarlosHenrique\\Site.26_TAG08\\src\\lib\\simulators\\processIntelligence.ts"
timestamp: 2026-09-25T01-09-10Z
slug: src-lib-simulators-processintelligence-ts
---
# Auditoria — processIntelligence.ts

## Checklist

- Contrato de entrada e validação
- Correção matemática e premissas
- Rounding, limites e edge cases
- Uso no simulador e mensagem comercial
- Testes, manutenção e consistência do domínio

## Diagnóstico

### P1 — Entradas não são validadas no domínio

`calculateProcessIntelligenceWaste` aceita negativos, `NaN`, `Infinity`, salários zerados e horas acima da jornada. A UI usa sliders, mas a função é exportada e pode ser chamada por outros módulos.

Impacto: resultados negativos ou `NaN` podem aparecer na página ou ser enviados ao WhatsApp.

Correção: validar finitude, limites mínimos e coerência das entradas; definir se a função lança erro ou normaliza valores.

### P1 — Premissas comerciais ficam invisíveis

`22` dias/mês, `176` horas/mês e `80%` recuperável são constantes sem documentação ou retorno de contexto.

Impacto: o usuário pode interpretar a estimativa como medição real, embora seja um modelo fixo.

Correção: nomear/documentar as premissas e exibir na interface como estimativa, não como diagnóstico factual.

### P1 — Custo usa horas já arredondadas

`annualWasteHours` é arredondado antes do custo. Com valores fracionários, isso cria descontinuidade e pode distorcer o resultado financeiro.

Correção: calcular custo com horas brutas e arredondar apenas os valores exibidos, preservando o contrato existente com teste atualizado.

### P2 — Modelo não representa variações reais

O cálculo assume a mesma quantidade de horas improdutivas por colaborador em todos os 264 dias úteis anuais e aplica 80% de recuperação universal.

Impacto: números muito altos podem parecer promessa ou prova.

Correção: tratar como cenário indicativo, incluir aviso de estimativa e, se necessário, permitir percentual de fricção configurável em etapa futura.

### P2 — Cobertura de testes insuficiente

Existe apenas um teste de caminho feliz.

Adicionar casos para zero, negativos, decimais, valores máximos da UI, `NaN`, `Infinity` e invariantes como custo não negativo.

### P3 — Contrato de retorno pouco explicativo

O retorno é um objeto inferido sem tipo nomeado e sem unidade explícita.

Correção: exportar tipos de resultado e documentar que horas são anuais e custo está em moeda corrente.

## Pontos positivos

- Fórmula simples e determinística.
- Constantes centralizadas.
- Integração direta com o simulador e mensagem contextual de WhatsApp.
- Teste existente protege o cálculo aprovado atual.

## Prioridade de execução

1. Validar/documentar premissas sem alterar o resultado aprovado.
2. Cobrir entradas inválidas e limites com testes.
3. Corrigir arredondamento financeiro, caso o contrato permita.
4. Só depois considerar um modelo de fricção configurável.
