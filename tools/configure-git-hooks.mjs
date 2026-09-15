import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

if (!existsSync(resolve(root, ".git"))) process.exit(0);

execFileSync("git", ["config", "--local", "core.hooksPath", ".githooks"], {
  cwd: root,
  stdio: "inherit"
});

console.log("Hooks locais da TAG08 ativados.");
