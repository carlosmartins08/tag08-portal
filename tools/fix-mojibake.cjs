const fs = require("fs");
const path = require("path");

const ROOTS = ["src", "server", "docs", "public"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".cjs", ".mjs", ".json", ".md", ".css", ".html", ".xml", ".txt"]);
const BOM_GARBAGE_RE = /^(?:\uFEFF|ï»¿|Ã¯Â»Â¿)/;
const BAD_CODEPOINTS = new Set([
  0x00bd,
  0x00c2,
  0x00c3,
  0x00bf,
  0x00ef,
  0x00e2,
  0x0192,
  0x0080,
  0x0081,
  0x0082,
  0x0083,
  0x0084,
  0x0085,
  0x0086,
  0x0087,
  0x0088,
  0x0089,
  0x008a,
  0x008b,
  0x008c,
  0x008d,
  0x008e,
  0x008f,
  0x0090,
  0x0091,
  0x0092,
  0x0093,
  0x0094,
  0x0095,
  0x0096,
  0x0097,
  0x0098,
  0x0099,
  0x009a,
  0x009b,
  0x009c,
  0x009d,
  0x009e,
  0x009f,
  0x00a0,
  0x2026,
  0x2018,
  0x2019,
  0x201c,
  0x201d,
  0x2021,
  0x2030,
  0x20ac,
  0xfffd,
  0x203a,
  0x2039,
  0x0160,
  0x0161,
  0x017d,
  0x017e,
]);
const WINDOWS_1252_SPECIAL = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);
const TEXT_REPLACEMENTS = [
  ["ACELERAï¿½ï¿½O", "ACELERAÇÃO"],
  ["CONSOLIDAï¿½ï¿½O", "CONSOLIDAÇÃO"],
  ["ORGANIZAï¿½ï¿½O", "ORGANIZAÇÃO"],
  ["CONSOLIDAï¿½ï¿½O", "CONSOLIDAÇÃO"],
  ["ORGANIZAï¿½ï¿½O", "ORGANIZAÇÃO"],
  ["OPCIï¿½N Cï¿½D", "OPCIÓN CÓD"],
  ["OPï¿½ï¿½O COD", "OPÇÃO COD"],
  ["O que nï¿½s Nï¿½O", "O que nós NÃO"],
  ["Estruturaï¿½ï¿½o", "Estruturação"],
  ["sï¿½pia", "sépia"],
  ["interconectada ï¿½", "interconectada à"],
  ["logï¿½stica", "logística"],
  ["clï¿½nica", "clínica"],
  ["experiï¿½ncia", "experiência"],
  ["ï¿½ mão", "à mão"],
  ["cirï¿½rgica", "cirúrgica"],
  ["espontï¿½nea", "espontânea"],
  ["Presenï¿½a", "Presença"],
  ["Painï¿½is", "Painéis"],
  ["painï¿½is", "painéis"],
  ["prestï¿½gio", "prestígio"],
  ["pï¿½blico", "público"],
  ["Criaï¿½ï¿½o", "Criação"],
  ["sensaï¿½ï¿½o", "sensação"],
  ["inabalï¿½vel", "inabalável"],
  ["Espontï¿½nea", "Espontânea"],
  ["relevï¿½ncia", "relevância"],
  ["INTERAï¿½ï¿½O", "INTERAÇÃO"],
  ["SELEï¿½ï¿½O", "SELEÇÃO"],
  ["Rï¿½GIDA", "RÍGIDA"],
  ["ï¿½ um", "é um"],
  ["ï¿½ inovaï¿½ï¿½o", "à inovação"],
  ["serviï¿½os", "serviços"],
  ["VIABILIZAï¿½ï¿½O", "VIABILIZAÇÃO"],
  ["DOCUMENTAï¿½ï¿½O", "DOCUMENTAÇÃO"],
  ["ï¿½0 preciso", "É preciso"],
  ["cartï¿½o", "cartão"],
  ["cï¿½pia", "cópia"],
  ["certidï¿½o", "certidão"],
  ["dï¿½bitos", "débitos"],
  ["ï¿½rgï¿½os", "órgãos"],
  ["uniï¿½o", "união"],
  ["especï¿½ficas", "específicas"],
  ["Otimizaï¿½ï¿½o", "Otimização"],
  ["Cortes Rï¿½pidos", "Cortes Rápidos"],
  ["Formataï¿½ï¿½o", "Formatação"],
  ["LINHA DE PRODUï¿½ï¿½O", "LINHA DE PRODUÇÃO"],
  ["ESTï¿½0TICA SOBREANA", "ESTÉTICA SOBERANA"],
  ["TEXTO MAGNï¿½0TICO", "TEXTO MAGNÉTICO"],
  ["RETENï¿½!ï¿½O Sï¿½`NIOR", "RETENÇÃO SÊNIOR"],
  ["ALTA INTENï¿½!ï¿½O B2B", "ALTA INTENÇÃO B2B"],
  ["depoimentos", "depoimentos"],
  ["rï¿½pidas", "rápidas"],
  ["ï¿½teis", "úteis"],
  ["Dinï¿½micos", "Dinâmicos"],
  ["FILMAGEM VS EDIï¿½!ï¿½O", "FILMAGEM VS EDIÇÃO"],
  ["atuaï¿½ï¿½o", "atuação"],
  ["estratï¿½gia", "estratégia"],
  ["cï¿½mera", "câmera"],
  ["vï¿½deo", "vídeo"],
  ["vï¿½deos", "vídeos"],
  ["SÃ³cia", "Sócia"],
  ["hÃ¡", "há"],
  ["padrÃµes", "padrões"],
  ["genÃ©ricos", "genéricos"],
  ["clichÃªs", "clichês"],
  ["agÃªncias", "agências"],
  ["conteÃºdo", "conteúdo"],
  ["magnÃ­fica", "magnífica"],
  ["carrossÃ©is", "carrosséis"],
  ["elegÃ¢ncia", "elegância"],
  ["sofisticaÃ§Ã£o", "sofisticação"],
  ["trÃ¡fego", "tráfego"],
  ["JÃ¡", "Já"],
  ["trÃªs", "três"],
  ["OlÃ¡", "Olá"],
  ["diagnÃ³stico", "diagnóstico"],
  ["diagnÃ¯Â¿Â½Ã¯Â¿Â½stico", "diagnóstico"],
  ["ConstruÃ­mos", "Construímos"],
  ["sÃ³brios", "sóbrios"],
  ["memorÃ¡veis", "memoráveis"],
  ["Ã¯Â¿Â½ altura", "à altura"],
  ["percepÃ§Ã£o", "percepção"],
  ["estÃ©tica", "estética"],
  ["DIVISÃ¯Â¿Â½Ã¯Â¿Â½ \u0019O", "DIVISÃO"],
  ["DIVISÃ¯Â¿Â½Ã¯Â¿Â½ O", "DIVISÃO"],
  ["diagnÃ¯Â¿Â½stico", "diagnóstico"],
  ["Ã¯Â¿Â½ ", "→"],
  ["estratï¿½gico", "estratégico"],
  ["estratï¿½gicos", "estratégicos"],
  ["consistï¿½ncia", "consistência"],
  ["orgï¿½nico", "orgânico"],
  ["orgï¿½nica", "orgânica"],
  ["orgï¿½nicas", "orgânicas"],
  ["Sï¿½NIOR", "SÊNIOR"],
  ["sï¿½nior", "sênior"],
  ["PRESTï¿½GIO", "PRESTÍGIO"],
  ["conversï¿½o", "conversão"],
  ["Diagnï¿½stico", "Diagnóstico"],
  ["diagnï¿½stico", "diagnóstico"],
  ["Estï¿½tica", "Estética"],
  ["estï¿½tica", "estética"],
  ["clï¿½nica", "clínica"],
  ["cï¿½digo", "código"],
  ["Instantï¿½neo", "Instantâneo"],
  ["instantï¿½neo", "instantâneo"],
  ["trï¿½fego", "tráfego"],
  ["sï¿½o", "são"],
  ["mï¿½ltiplos", "múltiplos"],
  ["captaï¿½ï¿½o", "captação"],
  ["padrï¿½o", "padrão"],
  ["sofisticaï¿½ï¿½o", "sofisticação"],
  ["percepï¿½ï¿½o", "percepção"],
  ["AGï¿½NCIA", "AGÊNCIA"],
  ["PROJEï¿½ï¿½O", "PROJEÇÃO"],
  ["Mï¿½TRICA", "MÉTRICA"],
  ["SERVIï¿½OS", "SERVIÇOS"],
  ["Construï¿½mos", "Construímos"],
  ["sï¿½brios", "sóbrios"],
  ["memorï¿½veis", "memoráveis"],
  ["concordï¿½ncia", "concordância"],
  ["Hï¿½", "Há"],
  ["Nï¿½s", "Nós"],
  ["nï¿½o", "não"],
  ["jï¿½", "já"],
  ["porï¿½m", "porém"],
  ["frï¿½geis", "frágeis"],
  ["decisï¿½es", "decisões"],
  ["Orï¿½amento", "Orçamento"],
  ["AGï¿½NCIA", "AGÊNCIA"],
  ["AGï¿½NCIAS", "AGÊNCIAS"],
  ["vï¿½deos", "vídeos"],
  ["gravaï¿½ï¿½o", "gravação"],
  ["vocï¿½", "você"],
  ["apï¿½s", "após"],
  ["distribuiï¿½ï¿½o", "distribuição"],
  ["proteï¿½ï¿½o", "proteção"],
  ["responsï¿½veis", "responsáveis"],
  ["cï¿½mera", "câmera"],
  ["cï¿½meras", "câmeras"],
  ["pï¿½ginas", "páginas"],
  ["estï¿½reis", "estéreis"],
  ["ï¿½rvore", "árvore"],
  ["decisï¿½es", "decisões"],
  ["logï¿½stica", "logística"],
  ["fï¿½sica", "física"],
  ["mï¿½o", "mão"],
  ["diï¿½ria", "diária"],
  ["Pï¿½BLICO", "PÚBLICO"],
  ["Pï¿½ginas", "Páginas"],
  ["APLICAï¿½ï¿½O", "APLICAÇÃO"],
  ["REPUTAï¿½ï¿½O", "REPUTAÇÃO"],
  ["SOLUï¿½ï¿½O", "SOLUÇÃO"],
  ["CONTEï¿½DO", "CONTEÚDO"],
  ["TRï¿½FEGO", "TRÁFEGO"],
  ["ORGï¿½NICO", "ORGÂNICO"],
  ["CONEXï¿½O", "CONEXÃO"],
  ["DIREï¿½ï¿½O", "DIREÇÃO"],
  ["RETENï¿½ï¿½O", "RETENÇÃO"],
  ["OPERAï¿½ï¿½O", "OPERAÇÃO"],
  ["COMUNICAï¿½ï¿½O", "COMUNICAÇÃO"],
  ["Sï¿½NIOR", "SÊNIOR"],
  ["SOFISTICAï¿½ï¿½O", "SOFISTICAÇÃO"],
  ["CONVERSï¿½O", "CONVERSÃO"],
  ["impecï¿½vel", "impecável"],
  ["elegï¿½ncia", "elegância"],
  ["constï¿½ncia", "constância"],
  ["Mï¿½XIMA", "MÁXIMA"],
  ["EVOLUï¿½ï¿½O", "EVOLUÇÃO"],
  ["ï¿½NICA", "ÚNICA"],
  ["REAï¿½ï¿½O", "REAÇÃO"],
  ["INOVAï¿½ï¿½O", "INOVAÇÃO"],
  ["SINALIZAï¿½ï¿½O", "SINALIZAÇÃO"],
  ["COESï¿½O", "COESÃO"],
  ["ASSï¿½NCRONA", "ASSÍNCRONA"],
  ["Captaï¿½ï¿½o", "Captação"],
  ["cinematogrï¿½ficas", "cinematográficas"],
  ["acï¿½stico", "acústico"],
  ["ediï¿½ï¿½o", "edição"],
  ["dinï¿½mica", "dinâmica"],
  ["cirï¿½rgico", "cirúrgico"],
  ["retenï¿½ï¿½o", "retenção"],
  ["pï¿½ginas", "páginas"],
  ["redaï¿½ï¿½o", "redação"],
  ["comunicaï¿½ï¿½o", "comunicação"],
  ["dinï¿½mico", "dinâmico"],
  ["ruï¿½do", "ruído"],
  ["assï¿½ncrono", "assíncrono"],
  ["bagunï¿½a", "bagunça"],
  ["gerï¿½ncia", "gerência"],
  ["conteï¿½do", "conteúdo"],
  ["magnï¿½fica", "magnífica"],
  ["carrossï¿½is", "carrosséis"],
  ["agï¿½ncias", "agências"],
  ["Operaï¿½ï¿½es", "Operações"],
  ["Constï¿½ncia", "Constância"],
  ["Hï¿½", "Há"],
  ["traï¿½ï¿½o", "tração"],
  ["porï¿½m", "porém"],
  ["governanï¿½a", "governança"],
  ["DEDICAï¿½ï¿½O", "DEDICAÇÃO"],
  ["EXCELï¿½NCIA", "EXCELÊNCIA"],
  ["SESSï¿½O", "SESSÃO"],
  ["DIAGNï¿½STICA", "DIAGNÓSTICA"],
  ["Pï¿½LULAS", "PÍLULAS"],
  ["ATUAï¿½ï¿½O", "ATUAÇÃO"],
  ["aï¿½ï¿½es", "ações"],
  ["anï¿½ncios", "anúncios"],
  ["concordï¿½ncia", "concordância"],
  ["PRESCRIï¿½ï¿½O", "PRESCRIÇÃO"],
  ["Sï¿½O", "SÃO"],
  ["suposiï¿½ï¿½es", "suposições"],
  ["estï¿½reis", "estéreis"],
  ["tï¿½tico", "tático"],
  ["palpï¿½vel", "palpável"],
  ["RECOMENDAï¿½ï¿½O", "RECOMENDAÇÃO"],
  ["ALOCAï¿½ï¿½O", "ALOCAÇÃO"],
  ["DURAï¿½ï¿½O", "DURAÇÃO"],
  ["PORTFï¿½LIO", "PORTFÓLIO"],
  ["REVOLUï¿½ï¿½O", "REVOLUÇÃO"],
  ["REVOLUï¿½ï¿½O_", "REVOLUÇÃO_"],
  ["PADRï¿½O", "PADRÃO"],
  ["Olï¿½", "Olá"],
  ["Nï¿½o", "Não"],
  ["mï¿½tricas", "métricas"],
  ["prï¿½vio", "prévio"],
  ["questï¿½es", "questões"],
  ["Parï¿½metros", "Parâmetros"],
  ["seguranï¿½a", "segurança"],
  ["formulï¿½rio", "formulário"],
];

function walk(dir, output) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, output);
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }
}

function score(text) {
  let total = 0;
  for (const ch of text) {
    if (BAD_CODEPOINTS.has(ch.codePointAt(0))) {
      total += ch.codePointAt(0) === 0xfffd ? 100 : 10;
    }
  }
  return total;
}

function decodeLine(line) {
  const bytes = [];
  for (const ch of line) {
    const cp = ch.codePointAt(0);
    if (cp <= 0xff) {
      bytes.push(cp);
      continue;
    }

    const mapped = WINDOWS_1252_SPECIAL.get(cp);
    if (mapped === undefined) {
      return null;
    }

    bytes.push(mapped);
  }

  return Buffer.from(bytes).toString("utf8");
}

function fixText(text) {
  const hasCRLF = text.includes("\r\n");
  const lines = text.split(/\r?\n/);
  let changed = false;

  const fixed = lines.map((line, index) => {
    const cleaned = line.replace(BOM_GARBAGE_RE, "");
    if (cleaned !== line) {
      changed = true;
      return cleaned;
    }

    const candidatePool = [line];
    for (const source of [line, decodeLine(line)]) {
      if (source === null) {
        continue;
      }

      let output = source;
      for (const [from, to] of TEXT_REPLACEMENTS) {
        output = output.split(from).join(to);
      }
      candidatePool.push(output);
    }

    let best = line;
    let bestScore = score(line);
    for (const candidate of candidatePool) {
      if (candidate === null) {
        continue;
      }
      const candidateScore = score(candidate);
      if (candidateScore < bestScore) {
        best = candidate;
        bestScore = candidateScore;
      }
    }

    if (best !== line) {
      changed = true;
    }

    if (index === 0 && best.startsWith("\uFEFF")) {
      return best.slice(1);
    }

    return best;
  });

  return {
    changed,
    text: fixed.join(hasCRLF ? "\r\n" : "\n"),
  };
}

const files = [];
for (const root of ROOTS) {
  if (fs.existsSync(root)) {
    walk(root, files);
  }
}

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const { changed, text } = fixText(original);

  if (changed && text !== original) {
    fs.writeFileSync(file, text, "utf8");
    console.log(`fixed ${file}`);
  } else {
    console.log(`unchanged ${file}`);
  }
}
