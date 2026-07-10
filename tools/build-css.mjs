import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { collectTailwindCandidates } from "./tailwind-candidates.mjs";

const projectRoot = process.cwd();
const inputCssPath = join(projectRoot, "src", "index.css");
const tailwindPackageCssPath = join(projectRoot, "node_modules", "tailwindcss", "index.css");
const outputCssPath = join(projectRoot, "dist", "assets", "main.css");

const sourceCss = readFileSync(inputCssPath, "utf8");
const fontImports = sourceCss.match(/^@import url\([^\n]+\);\s*$/gm) ?? [];
const tailwindSource = sourceCss.replace(/^@import url\([^\n]+\);\s*$/gm, "");
const candidates = collectTailwindCandidates(projectRoot);

const { compile } = await import("tailwindcss");

const result = await compile(tailwindSource, {
  from: inputCssPath,
  loadStylesheet: async (id, base) => {
    const resolvedPath =
      id === "tailwindcss"
        ? tailwindPackageCssPath
        : resolve(base ? dirname(base) : projectRoot, id);

    return {
      content: readFileSync(resolvedPath, "utf8"),
      base: dirname(resolvedPath)
    };
  }
});

const compiledCss = result.build(candidates);
const outputCss = [...fontImports, compiledCss].filter(Boolean).join("\n\n");

mkdirSync(dirname(outputCssPath), { recursive: true });
writeFileSync(outputCssPath, outputCss);
