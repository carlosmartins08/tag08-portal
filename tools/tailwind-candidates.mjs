import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SOURCE_EXTENSIONS = new Set([".html", ".js", ".jsx", ".ts", ".tsx"]);

function walkFiles(rootDir, currentDir = rootDir, files = []) {
  for (const entry of readdirSync(currentDir)) {
    const fullPath = join(currentDir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkFiles(rootDir, fullPath, files);
      continue;
    }

    if (SOURCE_EXTENSIONS.has(extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

function addTokensFromText(text, candidates) {
  for (const rawToken of text.split(/\s+/)) {
    const token = rawToken.trim().replace(/^[('"`{[\],;]+|[)'"`}\],;]+$/g, "");
    if (!token) {
      continue;
    }

    if (token.length > 160) {
      continue;
    }

    if (/^(?:https?:\/\/|data:|mailto:|tel:|\/|#)/.test(token)) {
      continue;
    }

    candidates.add(token);
  }
}

function extractFromClassExpression(expression, candidates) {
  const stripped = expression.replace(/\$\{[\s\S]*?\}/g, " ");
  addTokensFromText(stripped, candidates);

  const quotedPattern = /(["'`])([\s\S]*?)\1/g;
  let quotedMatch;
  while ((quotedMatch = quotedPattern.exec(expression))) {
    const value = quotedMatch[2].replace(/\$\{[\s\S]*?\}/g, " ");
    addTokensFromText(value, candidates);
  }
}

export function collectTailwindCandidates(rootDir = process.cwd()) {
  const candidates = new Set();
  const files = walkFiles(rootDir, join(rootDir, "src"));
  files.push(join(rootDir, "index.html"));

  const classPattern = /(?:className|class)\s*=\s*(?:{\s*)?([`'"])([\s\S]*?)\1(?:\s*})?/g;

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf8");
    let match;

    while ((match = classPattern.exec(content))) {
      extractFromClassExpression(match[2], candidates);
    }
  }

  return [...candidates];
}
