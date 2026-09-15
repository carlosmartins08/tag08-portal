import { spawn } from "node:child_process";

const configuredUrl = process.env.BASE_URL?.replace(/\/$/, "");
const port = Number(process.env.ROUTE_CHECK_PORT || 3210);
const baseUrl = configuredUrl || `http://127.0.0.1:${port}`;

const waitForServer = async () => {
  const deadline = Date.now() + 120_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
      lastError = new Error(`Server returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
};

const run = (executable, args, env) => new Promise((resolve, reject) => {
  const child = spawn(executable, args, { stdio: "inherit", env });
  child.once("error", reject);
  child.once("exit", (code, signal) => {
    if (code === 0) resolve();
    else reject(new Error(`${executable} ${args.join(" ")} ended with ${signal || `code ${code}`}`));
  });
});

let server;

try {
  if (!configuredUrl) {
    server = spawn(process.execPath, [".next/standalone/server.js"], {
      stdio: "inherit",
      env: { ...process.env, PORT: String(port) }
    });
    await Promise.race([
      waitForServer(),
      new Promise((_, reject) => server.once("error", reject))
    ]);
  }

  await run(process.execPath, ["node_modules/tsx/dist/cli.mjs", "tools/verify-routes.ts"], { ...process.env, BASE_URL: baseUrl });
} finally {
  if (server && !server.killed) server.kill("SIGTERM");
}
