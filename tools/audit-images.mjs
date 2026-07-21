import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const collectSourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(path);
    }

    return SOURCE_EXTENSIONS.has(path.slice(path.lastIndexOf("."))) ? [path] : [];
  });

const lineAt = (source, offset) => source.slice(0, offset).split(/\r?\n/).length;
const nextImageTags = /<Image\b[\s\S]*?\/>/g;
const rawImageTags = /<img\b[^>]*>/g;
const findings = [];
const remoteMedia = [];
const remoteUrlPattern = /https:\/\/[A-Za-z0-9.-]+[^\s"'`)<>{}]*/g;

for (const file of collectSourceFiles("src")) {
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(remoteUrlPattern)) {
    const url = match[0].replace(/[.,;]+$/, "");
    let host;
    try {
      host = new URL(url).hostname;
    } catch {
      continue;
    }
    remoteMedia.push({
      file,
      line: lineAt(source, match.index),
      host,
      url,
      type: host === "images.unsplash.com" || host === "i.ytimg.com" ? "image" : "external"
    });
  }

  for (const match of source.matchAll(rawImageTags)) {
    findings.push({ severity: "P1", file, line: lineAt(source, match.index), rule: "raw_img" });
  }

  for (const match of source.matchAll(nextImageTags)) {
    const tag = match[0];
    const line = lineAt(source, match.index);

    if (!/\balt\s*=/.test(tag)) {
      findings.push({ severity: "P1", file, line, rule: "next_image_without_alt" });
    }

    if (/\bfill\b/.test(tag) && !/\bsizes\s*=/.test(tag)) {
      findings.push({ severity: "P2", file, line, rule: "fill_without_sizes" });
    }
  }
}

mkdirSync(".audit", { recursive: true });
writeFileSync(".audit/images.json", JSON.stringify({
  findings,
  remoteMedia: remoteMedia.sort((left, right) => left.host.localeCompare(right.host) || left.file.localeCompare(right.file) || left.line - right.line)
}, null, 2));
const blockers = findings.filter((finding) => finding.severity === "P1");
console.log(JSON.stringify({ event: "image_audit_complete", findings: findings.length, blockers: blockers.length, report: ".audit/images.json" }));

if (blockers.length) process.exitCode = 1;
