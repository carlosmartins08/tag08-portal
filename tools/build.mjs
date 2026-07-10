import { spawnSync } from "node:child_process";
import { join } from "node:path";

const projectRoot = process.cwd();
const tscBinary = join(projectRoot, "node_modules", "typescript", "bin", "tsc");
const runViteScript = join(projectRoot, "tools", "run-vite.mjs");

const lintResult = spawnSync(process.execPath, [tscBinary, "--noEmit"], {
  stdio: "inherit",
});

if (lintResult.error) {
  throw lintResult.error;
}

if (lintResult.status !== 0) {
  process.exit(lintResult.status ?? 1);
}

const buildResult = spawnSync(process.execPath, [runViteScript, "build"], {
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
