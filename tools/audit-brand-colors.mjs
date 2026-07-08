import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "src");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (/\.(ts|tsx|css|js|jsx|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

walk(rootDir);

const patterns = [
  { label: "#D4FF00 literal", regex: /#D4FF00/gi },
  { label: "#EEFF22 literal", regex: /#EEFF22/gi },
  { label: "rgba brand", regex: /rgba\(212,\s*255,\s*0,/gi },
  { label: "rgba brand-secondary", regex: /rgba\(238,\s*255,\s*34,/gi },
  { label: "brand-secondary class", regex: /\b(?:bg|text|border|ring|fill|from|to|via|accent)-brand-secondary\b/g },
];

const results = patterns.map(({ label, regex }) => {
  let count = 0;
  const hits = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const matches = content.match(regex);
    if (!matches?.length) continue;

    count += matches.length;
    hits.push({ file, count: matches.length });
  }

  hits.sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  return { label, count, hits: hits.slice(0, 10) };
});

console.log("TAG08 brand color audit\n");
for (const result of results) {
  console.log(`${result.label}: ${result.count}`);
  for (const hit of result.hits) {
    console.log(`  ${hit.count.toString().padStart(3, " ")}  ${path.relative(process.cwd(), hit.file)}`);
  }
  console.log("");
}

