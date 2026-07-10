import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  { name: "backend", command: npmCommand, args: ["run", "dev:backend"] },
  {
    name: "frontend",
    command: npmCommand,
    args: ["run", "dev"],
    env: { FRONTEND_PORT: "3002" }
  }
];

let shuttingDown = false;
const children = [];

const stopAll = (signal = "SIGTERM") => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

for (const processConfig of processes) {
  const child = spawn(processConfig.command, processConfig.args, {
    stdio: "inherit",
    shell: false,
    env: processConfig.env ? { ...process.env, ...processConfig.env } : process.env
  });

  children.push(child);

  child.on("error", (error) => {
    console.error(`[${processConfig.name}] failed to start: ${error.message}`);
    stopAll();
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (code === 0 && signal === null) {
      stopAll();
      process.exit(0);
      return;
    }

    console.error(`[${processConfig.name}] exited with code ${code ?? "null"}${signal ? ` signal ${signal}` : ""}`);
    stopAll();
    process.exit(code ?? 1);
  });
}

process.on("SIGINT", () => stopAll("SIGINT"));
process.on("SIGTERM", () => stopAll("SIGTERM"));
