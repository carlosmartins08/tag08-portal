import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const replacementsByFile = {
  "src/features/site/pages/Sobre.tsx": [
    [/SOBRE A TAG08 \/\/ ESTRAT.*GIA/g, "SOBRE A TAG08 // ESTRATÉGIA"],
    [/AGENDE UM DIAGN.*STICO/g, "AGENDE UM DIAGNÓSTICO"],
    [/Taxa de Reten.* de/g, "Taxa de Retenção de"],
    [/Marcas, Cl.*nicas e/g, "Marcas, Clínicas e"],
    [/Consult.*rios Premium/g, "Consultórios Premium"],
    [/C.*d\. sem Construtores/g, "Cód. sem Construtores"],
    [/CONSELHO E DIRE.*O OPERACIONAL/g, "CONSELHO E DIREÇÃO OPERACIONAL"],
    [/MENTES ATIVAS POR TR.*S DOS M.*TODOS/g, "MENTES ATIVAS POR TRÁS DOS MÉTODOS"],
    [/Voc.* conversa diretamente com os idealizadores do projeto nas pontas de dire.*o, sem intermedi.*rios juniores ou burocr.*ticos\./g, "Você conversa diretamente com os idealizadores do projeto nas pontas de direção, sem intermediários juniores ou burocráticos."],
    [/RECRUTAMENTO S.*NIORES ATIVOS \/\/ RECRUIT_CORE/g, "RECRUTAMENTO SÊNIORES ATIVOS // RECRUIT_CORE"],
    [/PORTF.*LIOS OBSTINADOS/g, "PORTFÓLIOS OBSTINADOS"],
    [/padr.*o/g, "padrão"],
    [/CONT.*NUO/g, "CONTÍNUO"],
    [/N.*O ACHOU SUA VAGA DE PREFER.*NCIA\?/g, "NÃO ACHOU SUA VAGA DE PREFERÊNCIA?"],
    [/APLICAR PORTF.*LIO/g, "APLICAR PORTFÓLIO"],
    [/AGENDAMENTO S.*NIORES \/\/ SOLV.*NCIA/g, "AGENDAMENTO SÊNIORES // SOLVÊNCIA"],
    [/É?0 UM TRABALHO DE ELITE\./g, "É UM TRABALHO DE ELITE."],
    [/RESERVAR DIAGN.*STICO/g, "RESERVAR DIAGNÓSTICO"],
  ],
  "src/features/site/pages/DesenvolvimentoWeb.tsx": [
    [/M.*TRICAS DE PERFORMANCE REAL \/\/ VISÃO DE ENGENHARIA/g, "MÉTRICAS DE PERFORMANCE REAL // VISÃO DE ENGENHARIA"],
    [/SOLU.*ES MODULARES DE TECNOLOGIA/g, "SOLUÇÕES MODULARES DE TECNOLOGIA"],
    [/ENGENHARIA DIGNA DE ADMIRA.*O/g, "ENGENHARIA DIGNA DE ADMIRAÇÃO"],
    [/AUDITORIA E SUPORTE P.*S-IMPLANTA.*O/g, "AUDITORIA E SUPORTE PÓS-IMPLANTAÇÃO"],
    [/APLICA.*ES WEB <br \/>/g, "APLICAÇÕES WEB <br />"],
    [/C.*DIGO NATIVO EST.*TICO DE CARREGAMENTO IMEDIATO/g, "CÓDIGO NATIVO ESTÁTICO DE CARREGAMENTO IMEDIATO"],
    [/LENTID.*O DO WORDPRESS/g, "LENTIDÃO DO WORDPRESS"],
    [/FERRAMENTA INTERATIVA \/\/ SIMULA.*O EM TEMPO REAL/g, "FERRAMENTA INTERATIVA // SIMULAÇÃO EM TEMPO REAL"],
    [/REPUTAÇÃO S.*NIOR/g, "REPUTAÇÃO SÊNIOR"],
    [/impec.*veis/g, "impecáveis"],
    [/solu.*es e chancelando negociações/g, "soluções e chancelando negociações"],
    [/AN.*aNCIOS & CONVERSÃO/g, "ANÚNCIOS & CONVERSÃO"],
    [/transform.*los/g, "transformá-los"],
    [/convers.*es com vídeos embutidos e layouts adaptados para fechamento r.*pido de checkout\./g, "conversões com vídeos embutidos e layouts adaptados para fechamento rápido de checkout."],
    [/p.*gina de buscas orgânicas do Google\./g, "página de buscas orgânicas do Google."],
    [/COMPUTA.*O S.*NIOR TAG08/g, "COMPUTAÇÃO SÊNIOR TAG08"],
    [/SE.*O PORTFÓLIO WEB PREMIUM/g, "SEÇÃO PORTFÓLIO WEB PREMIUM"],
    [/SOLUÇÃO T.*CNICA E DESIGN SOBERANO/g, "SOLUÇÃO TÉCNICA E DESIGN SOBERANO"],
    [/OR.*AMENTO SOB DESIGN S.*NIOR/g, "ORÇAMENTO SOB DESIGN SÊNIOR"],
    [/Cl.*nicos e Corporativos/g, "Clínicos e Corporativos"],
    [/t.*cnica para dar autenticidade e humanidade .*s páginas\./g, "técnica para dar autenticidade e humanidade às páginas."],
    [/<span className="text-brand">.* ALTURA DO SEU PRESTÍGIO COMERCIAL\.<\/span>/g, '<span className="text-brand">ELEVE A ALTURA DO SEU PRESTÍGIO COMERCIAL.</span>'],
  ],
};

for (const [relativeFile, rules] of Object.entries(replacementsByFile)) {
  const filePath = path.join(root, relativeFile);
  const original = fs.readFileSync(filePath, "utf8");
  let updated = original;

  for (const [pattern, replacement] of rules) {
    updated = updated.replace(pattern, replacement);
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`updated ${relativeFile}`);
  } else {
    console.log(`unchanged ${relativeFile}`);
  }
}
