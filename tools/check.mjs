import { spawnSync } from "node:child_process";
import { join } from "node:path";

const tscBinary = join(process.cwd(), "node_modules", "typescript", "bin", "tsc");
const buildScript = join(process.cwd(), "tools", "build.mjs");

const lintResult = spawnSync(process.execPath, [tscBinary, "--noEmit"], {
  stdio: "inherit"
});

if (lintResult.error) {
  throw lintResult.error;
}

if (lintResult.status !== 0) {
  process.exit(lintResult.status ?? 1);
}

const buildResult = spawnSync(process.execPath, [buildScript], {
  stdio: "inherit"
});

if (buildResult.error) {
  throw buildResult.error;
}

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}
