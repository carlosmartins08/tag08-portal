const fs = require("fs");

const files = [
  "src/pages/ClienteOnboarding.tsx",
  "src/pages/Home.tsx",
  "src/pages/Servicos.tsx",
  "src/pages/GestaoRedesSociais.tsx",
  "src/pages/HospedagemManutencaoSites.tsx",
  "src/pages/ProcessActivation.tsx",
  "src/pages/ProducaoAudiovisual.tsx",
  "src/pages/Sobre.tsx",
  "src/pages/AssessoriaMarketingDigitalEstrategico.tsx",
  "src/pages/TrabalheConosco.tsx",
  "src/components/Footer.tsx",
  "src/i18n/siteI18n.ts",
];

const map = new Map([
  ["\u2021", "Ã‡"],
  ["\u0192", "Ãƒ"],
  ["\u0160", "ÃŠ"],
  ["\u0161", "Ãš"],
  ["\u0081", "Ã"],
  ["\u201c", "Ã“"],
  ["\u201d", "Ã“"],
  ["\u201a", "Ã‚"],
  ["\u2030", "Ã‰"],
  ["\u00a1", "Ã¡"],
  ["\u00a3", "Ã£"],
  ["\u00a7", "Ã§"],
  ["\u00a9", "Ã©"],
  ["\u00aa", "Ãª"],
  ["\u00ab", "Ã"],
  ["\u00ad", "Ã­"],
  ["\u00b1", "Ã±"],
  ["\u00b2", "Ãº"],
  ["\u00b3", "Ã³"],
  ["\u00b5", "Ãµ"],
  ["\u00ba", "Ãº"],
  ["\u00bc", "Ã¶"],
  ["\u00bd", "Ã¼"],
  ["\u00be", "ÃŸ"],
  ["\u00e0", "Ã "],
  ["\u00e2", "Ã¢"],
  ["\u00e1", "Ã¡"],
  ["\u00e9", "Ã©"],
  ["\u00e4", "Ã¤"],
  ["\u00e8", "Ã¨"],
  ["\u00ea", "Ãª"],
  ["\u00ec", "Ã¬"],
  ["\u00ed", "Ã­"],
  ["\u00f0", "Ã°"],
  ["\u00f1", "Ã±"],
  ["\u00f3", "Ã³"],
  ["\u00f4", "Ã´"],
  ["\u00f5", "Ãµ"],
  ["\u00f6", "Ã¶"],
  ["\u00f9", "Ã¹"],
  ["\u00fa", "Ãº"],
  ["\u00fc", "Ã¼"],
]);

const punctuationReplacements = [
  ["\u00e2\u20ac\u201d", "â€”"],
  ["\u00e2\u20ac\u201c", "â€“"],
  ["\u00e2\u20ac\u00a2", "â€¢"],
  ["\u00e2\u20ac\u0153", "â€œ"],
  ["\u00e2\u20ac\u009d", "â€"],
  ["\u00e2\u20ac\u0152", "â€˜"],
  ["\u00e2\u20ac\u2122", "â€™"],
  ["\u00e2\u20ac\u00a6", "â€¦"],
];

function fixText(input) {
  let output = input;

  output = output.replace(/\u00c3([\u0081\u00a1\u00a3\u00a7\u00a9\u00aa\u00ab\u00ad\u00b1\u00b2\u00b3\u00b5\u00ba\u00bc\u00bd\u00be\u00e0\u00e1\u00e2\u00e4\u00e8\u00e9\u00ea\u00ec\u00ed\u00f0\u00f1\u00f3\u00f4\u00f5\u00f6\u00f9\u00fa\u00fc\u0160\u0161\u0192\u201c\u201d\u2021\u2030])/g, (match, ch) => {
    return map.get(ch) || match;
  });

  output = output.replace(/\u00c3([\u0000-\u00ff])/g, (match) => Buffer.from(match, "latin1").toString("utf8"));
  output = output.replace(/\u00c2([\u0000-\u00ff])/g, (match) => Buffer.from(match, "latin1").toString("utf8"));

  for (const [from, to] of punctuationReplacements) {
    output = output.split(from).join(to);
  }

  const literalReplacements = [
    ["ACELERAÃ‡ï¿½O", "ACELERAÃ‡ÃƒO"],
    ["CONEXï¿½O", "CONEXÃƒO"],
    ["DIREÃ‡ï¿½O", "DIREÃ‡ÃƒO"],
    ["PRESCRIÃ‡ï¿½O", "PRESCRIÃ‡ÃƒO"],
    ["LINHA DE PRODUÃ‡ï¿½O", "LINHA DE PRODUÃ‡ÃƒO"],
    ["INTEGRAÃ‡ï¿½O", "INTEGRAÃ‡ÃƒO"],
    ["CAPTAÃ‡ï¿½O", "CAPTAÃ‡ÃƒO"],
    ["OPERAÃ‡ï¿½O", "OPERAÃ‡ÃƒO"],
    ["REAÃ‡ï¿½O", "REAÃ‡ÃƒO"],
    ["SOFISTICAÃ‡ï¿½O", "SOFISTICAÃ‡ÃƒO"],
    ["INOVAÃ‡ï¿½O", "INOVAÃ‡ÃƒO"],
    ["SINALIZAÃ‡ï¿½O", "SINALIZAÃ‡ÃƒO"],
    ["COESï¿½O", "COESÃƒO"],
    ["COMUNICAÃ‡ï¿½O", "COMUNICAÃ‡ÃƒO"],
    ["CONVERSï¿½O", "CONVERSÃƒO"],
    ["RETENÃ‡ï¿½O", "RETENÃ‡ÃƒO"],
    ["DEDICAÃ‡ï¿½O", "DEDICAÃ‡ÃƒO"],
    ["SESSï¿½O", "SESSÃƒO"],
    ["EVOLUÃ‡ï¿½O", "EVOLUÃ‡ÃƒO"],
    ["ATUAÃ‡ï¿½O", "ATUAÃ‡ÃƒO"],
    ["RECOMENDAÃ‡ï¿½O", "RECOMENDAÃ‡ÃƒO"],
    ["ALOCAÃ‡ï¿½O", "ALOCAÃ‡ÃƒO"],
    ["REVOLUÃ‡ï¿½O", "REVOLUÃ‡ÃƒO"],
    ["DURAÃ‡ï¿½O", "DURAÃ‡ÃƒO"],
    ["PADRï¿½O", "PADRÃƒO"],
    ["Sï¿½O PAULO", "SÃƒO PAULO"],
    ["SOLUÃ‡Ãƒâ€¢ES", "SOLUÃ‡Ã•ES"],
    ["ENGENHARIA WEB INSTANTï¿½NEA", "ENGENHARIA WEB INSTANTÃ‚NEA"],
    ["DIREÃ‡ï¿½O INTEGRAL // TAG08", "DIREÃ‡ÃƒO INTEGRAL // TAG08"],
    ["PRESCRIÃ‡ï¿½O CORRETIVA TAG08", "PRESCRIÃ‡ÃƒO CORRETIVA TAG08"],
    ["LINHA DE PRODUÃ‡ï¿½O INTEGRAL", "LINHA DE PRODUÃ‡ÃƒO INTEGRAL"],
    ["CONTEÃšDO DE ALTA RETENÃ‡ï¿½O // YOUTUBE CHANNEL", "CONTEÃšDO DE ALTA RETENÃ‡ÃƒO // YOUTUBE CHANNEL"],
    ["&amp; ENGENHARIA DE CONVERSï¿½O", "&amp; ENGENHARIA DE CONVERSÃƒO"],
    ["PORTFÃ“LIO DE SOLUÃ‡Ãƒâ€¢ES DE EXCELÃŠNCIA", "PORTFÃ“LIO DE SOLUÃ‡Ã•ES DE EXCELÃŠNCIA"],
    ["RECOMENDAÃ‡ï¿½O OPERACIONAL", "RECOMENDAÃ‡ÃƒO OPERACIONAL"],
    ["ALOCAÃ‡ï¿½O DE DIRETOR", "ALOCAÃ‡ÃƒO DE DIRETOR"],
    ["DIREÃ‡ï¿½O INTUITIVA & COESï¿½O VISUAL", "DIREÃ‡ÃƒO INTUITIVA & COESÃƒO VISUAL"],
    ["SOPRO DE SOFISTICAÃ‡ï¿½O E ARTE", "SOPRO DE SOFISTICAÃ‡ÃƒO E ARTE"],
    ["COMUNICAÃ‡ï¿½O CONCRETA ASSÃNCRONA", "COMUNICAÃ‡ÃƒO CONCRETA ASSÃNCRONA"],
    ["CONVERSï¿½O DE LEAD", "CONVERSÃƒO DE LEAD"],
    ["RETENÃ‡ï¿½O DE REELS", "RETENÃ‡ÃƒO DE REELS"],
    ["CAOS DE OPERAÃ‡ï¿½O", "CAOS DE OPERAÃ‡ÃƒO"],
    ["DEDICAÃ‡ï¿½O MÃXIMA & EXCELÃŠNCIA SÃŠNIOR", "DEDICAÃ‡ÃƒO MÃXIMA & EXCELÃŠNCIA SÃŠNIOR"],
    ["SESSï¿½O DIAGNÃ“STICA EXCLUSIVA", "SESSÃƒO DIAGNÃ“STICA EXCLUSIVA"],
    ["EVOLUÃ‡ï¿½O DE MARCA", "EVOLUÃ‡ÃƒO DE MARCA"],
    ["PÃLULAS DE ATUAÃ‡ï¿½O", "PÃLULAS DE ATUAÃ‡ÃƒO"],
    ["DIFERENCIAIS DE OPERAÃ‡ï¿½O", "DIFERENCIAIS DE OPERAÃ‡ÃƒO"],
    ["PORTFÃ“LIO DE TESTEMUNHOS & CASOS DE CLIENTES (UNIFICADO - O CLIENTE DICTA A REVOLUÃ‡ï¿½O)", "PORTFÃ“LIO DE TESTEMUNHOS & CASOS DE CLIENTES (UNIFICADO - O CLIENTE DICTA A REVOLUÃ‡ÃƒO)"],
    ["MÃXIMA RETENÃ‡ï¿½O VISUAL", "MÃXIMA RETENÃ‡ÃƒO VISUAL"],
    ["DIREÃ‡ï¿½O DE FLUXO TOTAL", "DIREÃ‡ÃƒO DE FLUXO TOTAL"],
    ["DIREÃ‡ï¿½O CLARA", "DIREÃ‡ÃƒO CLARA"],
    ["DECISï¿½O OPERACIONAL", "DECISÃƒO OPERACIONAL"],
    ["OPERAÃ‡ï¿½O ATIVA", "OPERAÃ‡ÃƒO ATIVA"],
    ["PADRï¿½O SÃŠNIOR", "PADRÃƒO SÃŠNIOR"],
    ["PROPRIETaRIO", "PROPRIETÁRIO"],
    ["CONTRATAÇÃO", "CONTRATAÇÃO"],
    ["RESOLUÇÃO", "RESOLUÇÃO"],
    ["PÓS-PRODUÇÃO", "PÓS-PRODUÇÃO"],
    ["INCLUSÃO", "INCLUSÃO"],
    ["SUA DECISÃO", "SUA DECISÃO"],
    ["CONCEPÇÃO", "CONCEPÇÃO"],
    ["INTENÇÃO", "INTENÇÃO"],
    ["ENROLAÇÃO", "ENROLAÇÃO"],
    ["SELEÇÃO", "SELEÇÃO"],
    ["FORMAÇÃO", "FORMAÇÃO"],
    ["APRESENTAÇÃO", "APRESENTAÇÃO"],
    ["EVAPORAÇÃO", "EVAPORAÇÃO"],
    ["EXECUÇÃO", "EXECUÇÃO"],
    ["PROJEÇÃO", "PROJEÇÃO"],
    ["PROTEÇÃO", "PROTEÇÃO"],
    ["OTIMIZAÇÃO", "OTIMIZAÇÃO"],
    ["INTERAÇÃO", "INTERAÇÃO"],
    ["INFORMAÇÃO", "INFORMAÇÃO"],
    ["CAATICA", "CAÓTICA"],
    ["caatica", "caótica"],
    ["caaatica", "caótica"],
    ["cabeaa", "cabeça"],
    ["davidas", "dúvidas"],
    ["fundores", "fundadores"],
    ["esclareaa", "esclareça"],
    ["cadigo", "código"],
    ["proteaao", "proteção"],
    ["interaçao", "interação"],  ];

  for (const [from, to] of literalReplacements) {
    output = output.split(from).join(to);
  }

  output = output.replace(/\u00c2/g, "");
  return output;
}

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const fixed = fixText(original);
  if (fixed !== original) {
    fs.writeFileSync(file, fixed, "utf8");
    console.log(`fixed ${file}`);
  } else {
    console.log(`unchanged ${file}`);
  }
}

