import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const files = execFileSync("rg", ["-l", "[ÃÂâ�]", "src", "server", "docs"], { encoding: "utf8" })
  .trim().split(/\r?\n/).filter(Boolean);
const findings = [];
for (const file of files) {
  const lines = (await import("node:fs/promises")).readFile(file, "utf8");
  const content = await lines;
  content.split(/\r?\n/).forEach((line, index) => {
    if (/[ÃÂâ�]/.test(line)) findings.push({ severity: "P2", file, line: index + 1, text: line.trim().slice(0, 180) });
  });
}
mkdirSync(".audit", { recursive: true });
writeFileSync(".audit/encoding.json", JSON.stringify({ findings }, null, 2));
console.log(JSON.stringify({ event: "encoding_audit_complete", findings: findings.length, report: ".audit/encoding.json" }));
