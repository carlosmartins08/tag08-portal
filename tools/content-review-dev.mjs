import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "3101";
const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const continuityArgs = ["tools/continuity-check.mjs"];

const isPortInUse = () =>
  new Promise((resolve, reject) => {
    const probe = net.createServer();

    probe.once("error", (error) => {
      if ("code" in error && error.code === "EADDRINUSE") {
        resolve(true);
        return;
      }
      reject(error);
    });

    probe.once("listening", () => {
      probe.close((error) => error ? reject(error) : resolve(false));
    });

    probe.listen(Number(port));
  });

if (await isPortInUse()) {
  console.log(`TAG08 — a prévia editorial já está ativa em http://localhost:${port}. Reutilize essa aba ou encerre o processo atual antes de iniciar outra cópia.`);
  process.exit(0);
}

if (process.env.CI) continuityArgs.push("--ci");

const continuity = spawnSync(process.execPath, continuityArgs, { stdio: "inherit" });

if (continuity.status !== 0) {
  process.exit(continuity.status ?? 1);
}

const child = spawn(process.execPath, [nextCli, "dev", "--port", port], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_TAG08_CONTENT_REVIEW: "1" }
});

child.on("exit", (code) => process.exit(code ?? 0));
