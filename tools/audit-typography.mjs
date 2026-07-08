import fs from "node:fs";
import path from "node:path";

const srcDir = path.resolve(process.cwd(), "src");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(ts|tsx|css|js|jsx|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

walk(srcDir);

const patterns = [
  { label: "font-display", regex: /\bfont-display\b/g },
  { label: "font-sans", regex: /\bfont-sans\b/g },
  { label: "font-mono", regex: /\bfont-mono\b/g },
  { label: "font-heading (legacy)", regex: /\bfont-heading\b/g },
  { label: "direct font-family outside index.css", regex: /font-family\s*:/g, exclude: /src[\\/]+index\.css$/i },
];

console.log("TAG08 typography audit\n");

for (const pattern of patterns) {
  let count = 0;
  const hits = [];

  for (const file of files) {
    if (pattern.exclude && pattern.exclude.test(file)) continue;
    const content = fs.readFileSync(file, "utf8");
    const matches = content.match(pattern.regex);
    if (!matches?.length) continue;
    count += matches.length;
    hits.push({ file, count: matches.length });
  }

  hits.sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  console.log(`${pattern.label}: ${count}`);
  for (const hit of hits.slice(0, 10)) {
    console.log(`  ${hit.count.toString().padStart(3, " ")}  ${path.relative(process.cwd(), hit.file)}`);
  }
  console.log("");
}

