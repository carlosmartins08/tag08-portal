import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const publicDir = join(projectRoot, "public");
const distDir = join(projectRoot, "dist");

if (existsSync(publicDir)) {
  mkdirSync(distDir, { recursive: true });
  cpSync(publicDir, distDir, { recursive: true });
}
