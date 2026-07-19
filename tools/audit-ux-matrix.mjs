import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const sourceFiles = execFileSync("rg", ["-l", "<h1|<section|ServiceInsightsBridge|MiniCases|<form", "src/features/site/pages"], { encoding: "utf8" })
  .trim().split(/\r?\n/).filter(Boolean);
const pages = sourceFiles.map((file) => {
  const source = readFileSync(file, "utf8");
  const sections = (source.match(/<section\b/g) || []).length;
  const risks = [];
  if (!/<h1\b/.test(source)) risks.push({ severity: "P1", rule: "missing_h1" });
  if (/<form\b/.test(source) && !/<label\b/.test(source)) risks.push({ severity: "P1", rule: "form_without_label" });
  return {
    file,
    sections,
    hasH1: /<h1\b/.test(source),
    hasForm: /<form\b/.test(source),
    hasInsightsBridge: /ServiceInsightsBridge/.test(source),
    hasProof: /MiniCases|TrustTestimonialsSection|Case/.test(source),
    hasImage: /<Image\b/.test(source),
    hasVideo: /trackVideoEvent|youtube|YouTube/.test(source),
    risks
  };
});
const findings = pages.flatMap((page) => page.risks.map((risk) => ({ ...risk, file: page.file })));
mkdirSync(".audit", { recursive: true });
writeFileSync(".audit/ux-matrix.json", JSON.stringify({ pages, findings }, null, 2));
console.log(JSON.stringify({ event: "ux_matrix_complete", pages: pages.length, findings: findings.length, report: ".audit/ux-matrix.json" }));
if (findings.some((finding) => finding.severity === "P1")) process.exitCode = 1;
