import { spawnSync } from "node:child_process";
import { join } from "node:path";

const projectRoot = process.cwd();
const esbuildBinary = join(projectRoot, "node_modules", "@esbuild", "win32-x64", "esbuild.exe");

const powershellScript = [
  `$env:ESBUILD_BINARY_PATH = '${esbuildBinary.replace(/'/g, "''")}'`,
  `Set-Location -LiteralPath '${projectRoot.replace(/'/g, "''")}'`,
  `node .\\generate-sitemap.js`,
  `node .\\node_modules\\vite\\bin\\vite.js build --configLoader native`
].join("; ");

const encodedCommand = Buffer.from(powershellScript, "utf16le").toString("base64");
const buildResult = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedCommand], {
  stdio: "inherit",
  env: process.env,
  cwd: projectRoot
});

if (buildResult.error) {
  throw buildResult.error;
}

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}
