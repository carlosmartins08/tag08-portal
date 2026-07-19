import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const files = execFileSync("rg", ["-l", "<(Image|img)", "src"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
const findings = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  source.split(/\r?\n/).forEach((line, index) => {
    if (/<img\b/.test(line)) findings.push({ severity: "P1", file, line: index + 1, rule: "raw_img" });
    if (/<Image\b/.test(line) && !/alt=/.test(line)) findings.push({ severity: "P2", file, line: index + 1, rule: "inspect_alt_in_multiline_component" });
    if (/<Image\b/.test(line) && /fill/.test(line) && !/sizes=/.test(line)) findings.push({ severity: "P2", file, line: index + 1, rule: "inspect_sizes_in_multiline_component" });
  });
}
mkdirSync(".audit", { recursive: true });
writeFileSync(".audit/images.json", JSON.stringify({ findings }, null, 2));
const blockers = findings.filter((finding) => finding.severity === "P1");
console.log(JSON.stringify({ event: "image_audit_complete", findings: findings.length, blockers: blockers.length, report: ".audit/images.json" }));
if (blockers.length) process.exitCode = 1;
