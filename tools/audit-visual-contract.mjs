import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "src");
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(fullPath);
  }
}

function isLegacyVisualSource(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  return normalized.startsWith("src/features/site/pages/") ||
    (normalized.startsWith("src/components/") && !normalized.endsWith("VisualPrimitives.tsx"));
}

walk(rootDir);
const violations = [];

for (const file of files) {
  const relativePath = path.relative(process.cwd(), file);
  if (isLegacyVisualSource(relativePath)) continue;

  const content = fs.readFileSync(file, "utf8");
  for (const utility of content.match(/(?:rounded|shadow)-\[[^\]]+\]/g) ?? []) {
    violations.push(`${relativePath}: novo uso de ${utility}`);
  }
}

if (violations.length) {
  console.error("TAG08 visual contract audit failed\n");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log(`TAG08 visual contract audit passed (${files.length} source files checked).`);
