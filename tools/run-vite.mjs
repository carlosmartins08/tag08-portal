import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const viteBin = join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
const sourceEsbuildBinary = join(
  process.cwd(),
  "node_modules",
  "@esbuild",
  process.platform === "win32" ? "win32-x64" : "win32-x64",
  "esbuild.exe"
);
const runtimeDir = join(os.tmpdir(), "tag08-esbuild-runtime");
const runtimeEsbuildBinary = join(runtimeDir, "esbuild.exe");

function ensureRuntimeEsbuild() {
  if (process.platform !== "win32") {
    return null;
  }

  if (!existsSync(sourceEsbuildBinary)) {
    throw new Error(`Não encontrei o binário do esbuild em ${sourceEsbuildBinary}`);
  }

  if (!existsSync(runtimeDir)) {
    mkdirSync(runtimeDir, { recursive: true });
  }

  const sourceStat = statSync(sourceEsbuildBinary);
  const targetStat = existsSync(runtimeEsbuildBinary) ? statSync(runtimeEsbuildBinary) : null;

  if (!targetStat || targetStat.mtimeMs < sourceStat.mtimeMs) {
    copyFileSync(sourceEsbuildBinary, runtimeEsbuildBinary);
  }

  return runtimeEsbuildBinary;
}

function buildEnv() {
  const env = { ...process.env };
  const runtimeBinary = ensureRuntimeEsbuild();
  if (runtimeBinary) {
    process.env.ESBUILD_BINARY_PATH = runtimeBinary;
    env.ESBUILD_BINARY_PATH = runtimeBinary;
  }
  return env;
}

function runNodeScript(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit",
    env: buildEnv()
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runVite(args) {
  const child = spawn(process.execPath, [viteBin, ...args], {
    stdio: "inherit",
    env: buildEnv()
  });

  child.on("error", (error) => {
    console.error(error);
    process.exit(1);
  });

  const stop = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));

  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(1);
      return;
    }

    process.exit(code ?? 0);
  });
}

const mode = process.argv[2];

if (!mode) {
  console.error("Use: node tools/run-vite.mjs <dev|build|preview>");
  process.exit(1);
}

if (mode === "build") {
  runNodeScript(join(process.cwd(), "generate-sitemap.js"));
  runNodeScript(viteBin, ["build", "--configLoader", "native"]);
} else if (mode === "dev") {
  runVite(["--configLoader", "native", `--port=${process.env.FRONTEND_PORT || 3000}`, "--host=0.0.0.0"]);
} else if (mode === "preview") {
  runVite(["preview", "--configLoader", "native", `--port=${process.env.PREVIEW_PORT || 4173}`]);
} else {
  console.error(`Modo desconhecido: ${mode}`);
  process.exit(1);
}
