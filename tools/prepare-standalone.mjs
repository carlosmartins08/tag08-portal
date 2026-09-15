import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneRoot = path.join(root, ".next", "standalone");
const copies = [
  [path.join(root, "public"), path.join(standaloneRoot, "public")],
  [path.join(root, ".next", "static"), path.join(standaloneRoot, ".next", "static")]
];

for (const [source, destination] of copies) {
  if (!existsSync(source)) continue;
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
}

for (const environmentFile of [".env", ".env.local", ".env.development", ".env.production", ".env.test"]) {
  rmSync(path.join(standaloneRoot, environmentFile), { force: true });
}
