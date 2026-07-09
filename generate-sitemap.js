import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import * as ts from "typescript";

const require = createRequire(import.meta.url);
const projectRoot = process.cwd();
const srcRoot = resolve(projectRoot, "src");
const DOMAIN = "https://tag08.com.br";
const currentDate = new Date().toISOString().split("T")[0];

const moduleCache = new Map();

function resolveTsFile(filePath) {
  if (existsSync(filePath)) {
    return filePath;
  }

  if (existsSync(`${filePath}.ts`)) {
    return `${filePath}.ts`;
  }

  if (existsSync(`${filePath}.tsx`)) {
    return `${filePath}.tsx`;
  }

  return filePath;
}

function loadTsModule(entryFile) {
  const absoluteEntry = resolveTsFile(resolve(projectRoot, entryFile));
  if (moduleCache.has(absoluteEntry)) {
    return moduleCache.get(absoluteEntry);
  }

  const source = readFileSync(absoluteEntry, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX
    },
    fileName: absoluteEntry
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absoluteEntry, module.exports);

  const localRequire = (specifier) => {
    if (specifier.startsWith(".")) {
      const resolved = resolveTsFile(resolve(dirname(absoluteEntry), specifier));
      const relativePath = resolved.startsWith(srcRoot) ? resolved : resolve(dirname(absoluteEntry), specifier);
      return loadTsModule(relativePath);
    }

    return require(specifier);
  };

  const script = new vm.Script(transpiled, { filename: absoluteEntry });
  const context = vm.createContext({
    module,
    exports: module.exports,
    require: localRequire,
    __dirname: dirname(absoluteEntry),
    __filename: absoluteEntry,
    console,
    process,
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  });
  script.runInContext(context);

  moduleCache.set(absoluteEntry, module.exports);
  return module.exports;
}

function generateSitemap() {
  console.log("Generating XML sitemap dynamically based on existing routes...");

  const routeRegistry = loadTsModule("src/config/routeRegistry.ts");
  const data = loadTsModule("src/data.ts");

  const routeSitemapMeta = routeRegistry.routeSitemapMeta || [];
  const caseStudies = Array.isArray(data.CASE_STUDIES) ? data.CASE_STUDIES : [];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const seenPaths = new Set();

  routeSitemapMeta.forEach((entry) => {
    if (seenPaths.has(entry.path)) return;
    seenPaths.add(entry.path);
    xml += "  <url>\n";
    xml += `    <loc>${DOMAIN}${entry.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  caseStudies.forEach((caseStudy) => {
    const casePath = `/casos/${caseStudy.id}`;
    if (seenPaths.has(casePath)) return;
    seenPaths.add(casePath);
    xml += "  <url>\n";
    xml += `    <loc>${DOMAIN}${casePath}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";
  });

  xml += "</urlset>\n";

  const publicDir = join(projectRoot, "public");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = join(publicDir, "sitemap.xml");
  writeFileSync(outputPath, xml, "utf8");

  console.log(`Successfully generated sitemap.xml at ${outputPath}`);
}

generateSitemap();
