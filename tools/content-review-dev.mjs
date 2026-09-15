import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "3101";
const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const continuity = spawnSync(process.execPath, ["tools/continuity-check.mjs"], { stdio: "inherit" });

if (continuity.status !== 0) {
  process.exit(continuity.status ?? 1);
}

const child = spawn(process.execPath, [nextCli, "dev", "--port", port], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_TAG08_CONTENT_REVIEW: "1" }
});

child.on("exit", (code) => process.exit(code ?? 0));
