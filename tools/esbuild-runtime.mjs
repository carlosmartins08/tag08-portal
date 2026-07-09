import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

export function prepareEsbuildRuntime(projectRoot = process.cwd()) {
  if (process.platform !== "win32") {
    return null;
  }

  const sourceBinary = join(projectRoot, "node_modules", "@esbuild", "win32-x64", "esbuild.exe");
  const runtimeDir = join(os.tmpdir(), "tag08-esbuild-runtime");
  const runtimeBinary = join(runtimeDir, "esbuild.exe");

  if (!existsSync(sourceBinary)) {
    throw new Error(`Não encontrei o binário do esbuild em ${sourceBinary}`);
  }

  if (!existsSync(runtimeDir)) {
    mkdirSync(runtimeDir, { recursive: true });
  }

  const sourceStat = statSync(sourceBinary);
  const runtimeStat = existsSync(runtimeBinary) ? statSync(runtimeBinary) : null;
  if (!runtimeStat || runtimeStat.mtimeMs < sourceStat.mtimeMs) {
    copyFileSync(sourceBinary, runtimeBinary);
  }

  process.env.ESBUILD_BINARY_PATH = runtimeBinary;
  return runtimeBinary;
}
