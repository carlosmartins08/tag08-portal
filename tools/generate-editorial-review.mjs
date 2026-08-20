import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const outputPath = join(root, "docs", "DOSSIE-EDITORIAL-PARA-REVISAO.md");
const contentRoots = [
  "docs/tag08-content-global/content",
  "docs/tag08-content-pages/content",
  "docs/tag08-content-services/content",
  "docs/tag08-content-flows/content",
  "docs/tag08-content-microcopy/content"
];

const pageRoutes = {
  "Home.tsx": "/",
  "Sobre.tsx": "/sobre",
  "Servicos.tsx": "/servicos",
  "Contato.tsx": "/contato",
  "TrabalheConosco.tsx": "/trabalhe-conosco",
  "Branding.tsx": "/servicos/branding-identidade",
  "DesenvolvimentoWeb.tsx": "/servicos/desenvolvimento-web",
  "GestaoRedesSociais.tsx": "/servicos/gestao-de-redes-sociais",
  "ProducaoAudiovisual.tsx": "/servicos/producao-audiovisual",
  "AssessoriaMarketingDigitalEstrategico.tsx": "/servicos/assessoria-marketing-digital-estrategico",
  "ProcessIntelligence.tsx": "/servicos/process-intelligence",
  "ProcessActivation.tsx": "/servicos/process-activation",
  "HospedagemManutencaoSites.tsx": "/hospedagem-manutencao-sites",
  "ClienteOnboarding.tsx": "/cliente/onboarding",
  "Sebraetec.tsx": "/sebraetec-impulsionando-empreendedores",
  "ProgramaAfiliados.tsx": "/programa-afiliados",
  "Insights.tsx": "/insights",
  "CaseStudyDetail.tsx": "/casos/:id",
  "NotFound.tsx": "404"
};

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function walk(relativePath, extension) {
  const absolutePath = join(root, relativePath);
  const entries = readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const item = join(relativePath, entry.name);
    if (entry.isDirectory()) return walk(item, extension);
    return entry.isFile() && item.endsWith(extension) ? [item] : [];
  }).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function relativePath(filePath) {
  return filePath.split(sep).join("/");
}

function inline(value) {
  return value.replace(/\s+/g, " ").trim();
}

function markdownCell(value) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function decode(value) {
  return value
    .replace(/\\n/g, " ")
    .replace(/\\"/g, "\"")
    .replace(/\\'/g, "'")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

const windows1252Byte = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87],
  [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e], [0x2018, 0x91],
  [0x2019, 0x92], [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97], [0x02dc, 0x98],
  [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f]
]);

function normalizeForReview(value) {
  // The source contains a few legacy strings decoded as Windows-1252. Keep the
  // source untouched, but make the editorial dossier readable and flag the item.
  const looksMojibake = [...value].some((character, index, characters) => {
    const code = character.codePointAt(0);
    const next = characters[index + 1]?.codePointAt(0) ?? 0;
    return code === 0x00c2 || code === 0x00e2 || (code === 0x00c3 && !((next >= 65 && next <= 90) || (next >= 97 && next <= 122)));
  });
  if (!looksMojibake) return { value, normalized: false };
  const bytes = [];
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code <= 0xff) bytes.push(code);
    else if (windows1252Byte.has(code)) bytes.push(windows1252Byte.get(code));
    else return { value, normalized: false };
  }
  const repaired = Buffer.from(bytes).toString("utf8");
  if (!repaired.includes("�") && repaired !== value) return { value: repaired, normalized: true };
  return { value, normalized: false };
}

function looksLikeCopy(raw) {
  const value = inline(decode(raw));
  if (value.length < 2 || value.length > 1000) return false;
  if (/\$\{/.test(value)) return false;
  if (/^(https?:|\/|#|mailto:|tel:)/i.test(value)) return false;
  if (/^(?:\.\.\/|\.\/)/.test(value)) return false;
  if (/^[\w.-]+\.(tsx?|jsx?|json|svg|webp|png|jpg)$/i.test(value)) return false;
  if (/^[a-z][a-z0-9-]*(?:\s+[a-z][a-z0-9-]*)*$/i.test(value) && !/[À-ÿ]/.test(value) && !/[A-Z]/.test(value) && !/[.!?,:;]/.test(value)) return false;
  if (/^(use client|use server|pt|en|es|true|false|null|undefined)$/i.test(value)) return false;
  if (/^[\w-]+(?:\/[\w-]+)*$/.test(value)) return false;
  const cssToken = /^(?:text|bg|border|ring|shadow|hover|focus|py|px|p|m|w|h|min|max|grid|flex|items|justify|gap|rounded|absolute|relative|inset|transition|duration|opacity|font|tracking|leading|z|sm|md|lg|xl|dark|group|overflow|cursor|sr|col|row|space|divide|backdrop|sticky|top|bottom|left|right|transform|scale|rotate|translate)(?:[-:/\[]|$)/i;
  const tokens = value.split(/\s+/);
  if (tokens.length > 0 && tokens.every((token) => cssToken.test(token) || /^(?:border|flex|grid|block|hidden|inline|underline)$/i.test(token))) return false;
  return /[A-Za-zÀ-ÿ]/.test(value);
}

function literalCopy(text) {
  const found = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const quoted = /(["'`])((?:\\.|(?!\1).)*)\1/g;
    const isNonEditorialLine = /^\s*import\b/.test(line) || /\bclassName\s*=/.test(line);
    if (!isNonEditorialLine) {
      for (const match of line.matchAll(quoted)) {
        const value = inline(decode(match[2]));
        if (looksLikeCopy(value)) found.push({ line: index + 1, ...normalizeForReview(value) });
      }
    }
    for (const match of line.matchAll(/>([^<>{}][^<>{}]{1,800})</g)) {
      const value = inline(match[1].replace(/\{\s*\}/g, ""));
      if (looksLikeCopy(value)) found.push({ line: index + 1, ...normalizeForReview(value) });
    }
  });
  return found.filter((item, index, all) => index === 0 || item.line !== all[index - 1].line || item.value !== all[index - 1].value);
}

function sourceHeading(file) {
  const name = file.split("/").at(-1);
  if (file.includes("src/features/site/pages/")) return `Rota: \`${pageRoutes[name] ?? "a confirmar"}\``;
  if (file.includes("src/components/")) return "Componente reutilizado em varias rotas";
  if (file.includes("src/i18n/")) return "Texto de internacionalizacao e estados globais";
  if (file.includes("server/")) return "Mensagem retornada por fluxo ou API";
  if (file.endsWith("src/data.ts")) return "Conteudo dinamico: Insights e estudos de caso";
  return "Fonte de texto do produto";
}

function routeTable() {
  const registry = read("src/config/routeRegistry.ts");
  const blocks = registry.matchAll(/\{\s*key:\s*"([^"]+)"([\s\S]*?)\n\s*\},/g);
  const rows = [];
  for (const match of blocks) {
    const [, key, block] = match;
    const path = block.match(/canonicalPath:\s*"([^"]+)"/)?.[1];
    const title = block.match(/title:\s*"([^"]+)"/)?.[1];
    const description = block.match(/description:\s*\n?\s*"([^"]+)"/)?.[1];
    if (path && title && description) rows.push({ key, path, title, description });
  }
  return rows;
}

const runtimeSources = Array.from(new Set([
  ...walk("src/features/site", ".tsx"),
  ...walk("src/components", ".tsx"),
  ...walk("src/content", ".ts"),
  ...walk("src/i18n", ".ts"),
  ...walk("src/i18n", ".json"),
  ...walk("src/lib", ".ts"),
  ...walk("src/app", ".tsx"),
  ...walk("src/app", ".ts"),
  ...walk("src/config", ".ts"),
  ...walk("server", ".ts"),
  "src/data.ts"
])).sort((a, b) => a.localeCompare(b, "pt-BR"));

const generatedAt = new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
const output = [];
output.push("# Dossiê editorial para revisão — TAG08");
output.push("");
output.push(`Gerado em: ${generatedAt}`);
output.push("");
output.push("## Como revisar este material");
output.push("");
output.push("Este documento reúne, em um só lugar, as mensagens do site e o material editorial já produzido. Cada item da interface em execução tem um identificador estável (`RT-...`), caminho de origem e linha; use esse identificador nas observações para que a alteração posterior seja objetiva. Itens marcados como **[corrigir codificação]** foram normalizados apenas para facilitar a leitura; a origem ainda precisa ser corrigida no código.");
output.push("");
output.push("Há duas camadas que não devem ser confundidas:");
output.push("");
output.push("- **Copy em execução**: texto encontrado no código que compõe o produto hoje. É a referência para corrigir o site atual.");
output.push("- **Proposta editorial**: rascunhos estruturados por página e seção. Eles indicam intenção, posição visual e texto sugerido, mas vários arquivos estão marcados como não implementados.");
output.push("");
output.push("Ao comentar, informe: `ID`, decisão (`manter`, `editar`, `remover` ou `criar`), texto proposto e justificativa. Não altere SEO, valores financeiros, condições legais ou promessas de resultado sem validar a fonte responsável.");
output.push("");
output.push("## Mapa de rotas e SEO em execução");
output.push("");
output.push("| Chave | Rota | Title atual | Meta description atual |");
output.push("| --- | --- | --- | --- |");
for (const route of routeTable()) {
  output.push(`| ${markdownCell(route.key)} | \`${markdownCell(route.path)}\` | ${markdownCell(route.title)} | ${markdownCell(route.description)} |`);
}

output.push("");
output.push("## Copy em execução");
output.push("");
output.push("A posição descrita abaixo é a origem de implementação. Nas páginas, o arquivo corresponde à rota indicada; em componentes globais, o texto aparece onde o componente é reutilizado.");

for (const source of runtimeSources) {
  const content = read(source);
  const items = literalCopy(content);
  if (!items.length) continue;
  output.push("");
  output.push(`### ${relativePath(source)}`);
  output.push("");
  output.push(`**Local:** ${sourceHeading(relativePath(source))}`);
  output.push("");
  const itemsAtLine = new Map();
  for (const item of items) {
    const order = (itemsAtLine.get(item.line) ?? 0) + 1;
    itemsAtLine.set(item.line, order);
    const id = `RT-${relativePath(source).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase()}-L${item.line}-I${order}`;
    output.push(`- [ ] **${id}** — \`${relativePath(source)}:${item.line}\` — ${item.normalized ? "**[corrigir codificação]** " : ""}${item.value}`);
  }
}

output.push("");
output.push("## Propostas editoriais por página e seção");
output.push("");
output.push("Os blocos abaixo preservam a organização original por rota, seção, CTA, SEO e observação de implementação. Status e campos entre colchetes não são copy para publicar; são instruções e pendências editoriais.");

for (const contentRoot of contentRoots) {
  for (const file of walk(contentRoot, ".md")) {
    const normalized = relativePath(file);
    const content = read(file).replace(/^(#{1,6})\s/gm, "#$1 ").trim();
    output.push("");
    output.push(`### Documento-fonte: \`${normalized}\``);
    output.push("");
    output.push(content);
  }
}

output.push("");
output.push("## Riscos editoriais a decidir antes da implementação");
output.push("");
output.push("- Há divergências entre títulos e descrições SEO do registry e os rascunhos editoriais. Escolher uma versão por rota antes de publicar.");
output.push("- Benefícios financeiros, percentuais de subsídio e comissões exigem validação vigente antes de qualquer reescrita ou publicação.");
output.push("- Cases, avaliações e métricas só podem permanecer se houver fonte verificável. Onde houver marcador de preenchimento, não substituir por dado estimado.");
output.push("- O site publica PT-BR como idioma padrão; EN e ES só devem entrar após revisão integral da página e dos fluxos correspondentes.");
output.push("");
output.push("## Formato sugerido para devolutiva do redator");
output.push("");
output.push("```md");
output.push("- ID: RT-SRC-FEATURES-SITE-PAGES-HOME-TSX-L123-I1");
output.push("  Decisão: editar");
output.push("  Texto proposto: ...");
output.push("  Justificativa: ...");
output.push("```");

writeFileSync(outputPath, `${output.join("\n")}\n`, "utf8");
console.log(`${relative(root, outputPath)} (${output.length} linhas estruturadas)`);
