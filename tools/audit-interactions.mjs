import { mkdir, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const interactiveSemanticTags = new Set(["a", "button", "input", "select", "textarea", "summary"]);
const allowedStructuralHandlers = ["stopPropagation", "preventDefault"];
const findings = [];

for await (const file of glob("src/**/*.{tsx,jsx}")) {
  const source = await BunLikeRead(file);
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.includes("onClick=")) continue;

    const tag = findOpeningTag(lines, index);
    const handler = collectHandler(lines, index);
    const openingElement = collectOpeningElement(lines, index);
    if (!tag || interactiveSemanticTags.has(tag)) continue;
    if (["CaseStudyCard", "TrackedOutboundLink"].includes(tag)) continue;
    if (openingElement.includes("data-interaction-exception")) continue;
    if (/role\s*=\s*["'](?:button|link|radio|checkbox|tab)["']/.test(openingElement) && /tabIndex\s*=/.test(openingElement)) continue;
    if (allowedStructuralHandlers.some((allowed) => handler.includes(allowed))) continue;

    findings.push({
      severity: "P1",
      file,
      line: index + 1,
      tag,
      handler: handler.slice(0, 180),
      message: `Ação de usuário em <${tag}> sem semântica nativa de link ou botão.`
    });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  scannedFiles: "src/**/*.{tsx,jsx}",
  summary: {
    p1: findings.filter((finding) => finding.severity === "P1").length
  },
  findings
};

await mkdir(".audit", { recursive: true });
await writeFile(".audit/interactions.json", `${JSON.stringify(report, null, 2)}\n`);

if (findings.length > 0) {
  console.error(`Auditoria de interações encontrou ${findings.length} P1. Consulte .audit/interactions.json.`);
  process.exit(1);
}

console.log("Auditoria de interações aprovada: nenhuma ação em elemento não semântico.");

async function BunLikeRead(file) {
  const { readFile } = await import("node:fs/promises");
  return readFile(file, "utf8");
}

function findOpeningTag(lines, lineIndex) {
  for (let index = lineIndex; index >= Math.max(0, lineIndex - 12); index -= 1) {
    const match = lines[index].match(/<(?:(?:motion)\.)?([A-Za-z][\w.-]*)\b/);
    if (match) return match[1];
  }
  return null;
}

function collectHandler(lines, lineIndex) {
  return lines.slice(lineIndex, Math.min(lines.length, lineIndex + 8)).join(" ");
}

function collectOpeningElement(lines, lineIndex) {
  const start = Math.max(0, lineIndex - 12);
  const end = Math.min(lines.length, lineIndex + 40);
  return lines.slice(start, end).join(" ");
}
