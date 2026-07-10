import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const inputHtmlPath = join(projectRoot, "index.html");
const outputHtmlPath = join(projectRoot, "dist", "index.html");

const gscToken = (process.env.VITE_GSC_VERIFICATION ?? "").trim();
const html = readFileSync(inputHtmlPath, "utf8")
  .replaceAll("%VITE_GSC_VERIFICATION%", gscToken)
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/assets/main.js"></script>'
  )
  .replace(
    "  </head>",
    '    <link rel="stylesheet" href="/assets/main.css" />\n  </head>'
  );

mkdirSync(join(projectRoot, "dist"), { recursive: true });
writeFileSync(outputHtmlPath, html);
