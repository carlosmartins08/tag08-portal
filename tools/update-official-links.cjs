const fs = require("fs");
const path = require("path");

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".git", "dist", "coverage", "build", ".next"]);
const supportedExts = new Set([".ts", ".tsx", ".js", ".cjs", ".md", ".json", ".html", ".css", ".xml", ".txt"]);

const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (supportedExts.has(ext) || entry.name === "README.md" || entry.name === ".env.example") {
      files.push(fullPath);
    }
  }
}

const replacements = [
  ["+55 83 9.9886-8882", "+55 83 9.9886-8882"],
  ["+55 83 9.9886-8882", "+55 83 9.9886-8882"],
  ["5583998868882", "5583998868882"],
  [
    "https://wa.me/5583998868882?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20TAG08",
    "https://wa.me/5583998868882?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20TAG08"
  ]
];

walk(root);

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  let updated = original;

  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    console.log(`updated ${path.relative(root, file)}`);
  }
}
