import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env, TRANSLATIONS_AUTOPUBLISH: "true" };

const run = (args) => new Promise((resolve, reject) => {
  const child = spawn(npmCommand, args, { stdio: "inherit", env });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`command_failed:${args.join(":")}:${code}`)));
});

try {
  await run(["run", "i18n:sync"]);
  await run(["run", "check"]);
} catch (error) {
  console.error(JSON.stringify({ event: "i18n_release_failed", error: error instanceof Error ? error.message : String(error) }));
  process.exit(1);
}
