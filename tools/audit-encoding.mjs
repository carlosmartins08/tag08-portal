import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_EXTENSIONS = new Set([".css", ".js", ".json", ".md", ".mjs", ".ts", ".tsx"]);
// A lone "Ã" is legitimate Portuguese in words such as "REAÇÃO". Only flag
// byte-decoding sequences that cannot occur in correctly decoded copy.
const MOJIBAKE_MARKERS = /(?:\u00c3[\u00a0-\u00bf]|\u00c2[\u0080-\u00bf]|\u00e2[\u0080-\u00bf\u2018-\u201f\u20ac\u2122]{1,2}|\ufffd)/u;

const collectSourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(path);
    }

    return SOURCE_EXTENSIONS.has(path.slice(path.lastIndexOf("."))) ? [path] : [];
  });

// Read files directly. Windows console encoding can corrupt subprocess output and create false positives.
const files = ["src", "server", "docs"].flatMap(collectSourceFiles);
const findings = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");

  content.split(/\r?\n/).forEach((line, index) => {
    if (MOJIBAKE_MARKERS.test(line)) {
      findings.push({ severity: "P2", file, line: index + 1, text: line.trim().slice(0, 180) });
    }
  });
}

mkdirSync(".audit", { recursive: true });
writeFileSync(".audit/encoding.json", JSON.stringify({ findings }, null, 2));
console.log(JSON.stringify({ event: "encoding_audit_complete", findings: findings.length, report: ".audit/encoding.json" }));
