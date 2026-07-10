import { spawnSync } from "node:child_process";
import { join } from "node:path";

const buildScript = join(process.cwd(), "tools", "build.mjs");

const buildResult = spawnSync(process.execPath, [buildScript], {
  stdio: "inherit"
});

if (buildResult.error) {
  throw buildResult.error;
}

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}
