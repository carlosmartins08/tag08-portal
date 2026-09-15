import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const state = readFileSync("docs/PROJECT_STATE.md", "utf8");

assert.match(state, /Linha de trabalho esperada:\s*`[^`]+`/);
assert.match(state, /Commit-base de integração:\s*`[0-9a-f]{7,40}`/);
assert.match(state, /Última missão concluída:\s*\S+/);
assert.match(state, /Próxima missão autorizada:\s*\S+/);

execFileSync(process.execPath, ["tools/continuity-check.mjs", "--ci"], { stdio: "inherit" });

console.log("continuity check tests passed");
