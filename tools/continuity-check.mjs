import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const statePath = resolve(root, "docs/PROJECT_STATE.md");
const args = new Set(process.argv.slice(2));
const isCi = args.has("--ci");

function git(command) {
  return execFileSync("git", command, { cwd: root, encoding: "utf8" }).trim();
}

function getPaths(command) {
  const output = git(command);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function readState() {
  if (!existsSync(statePath)) throw new Error("docs/PROJECT_STATE.md não existe.");

  const content = readFileSync(statePath, "utf8");
  const expectedBranch = content.match(/Linha de trabalho esperada:\s*`([^`]+)`/)?.[1];
  const integrationBase = content.match(/Commit-base de integração:\s*`([0-9a-f]{7,40})`/)?.[1];
  const lastMission = content.match(/Última missão concluída:\s*([^\n]+)/)?.[1]?.trim();
  const nextMission = content.match(/Próxima missão autorizada:\s*([^\n]+)/)?.[1]?.trim();

  if (!expectedBranch || !integrationBase || !lastMission || !nextMission) {
    throw new Error("O checkpoint executável em docs/PROJECT_STATE.md está incompleto.");
  }

  return { expectedBranch, integrationBase, lastMission, nextMission };
}

function isKnownPreservedPath(path) {
  return path === "public/clients/" || path.startsWith("public/clients/");
}

function fail(messages) {
  messages.forEach((message) => console.error(`ERRO: ${message}`));
  process.exitCode = 1;
}

function isAllowedWorkBranch(branch, expectedBranch) {
  return branch === expectedBranch || /^p\d+-[a-z0-9-]+$/i.test(branch);
}

try {
  const state = readState();
  const branch = git(["branch", "--show-current"]);
  const head = git(["rev-parse", "--short", "HEAD"]);
  const trackedChanges = getPaths(["status", "--porcelain", "--untracked-files=no"]);
  const untrackedPaths = getPaths(["ls-files", "--others", "--exclude-standard"]);
  const unexpectedUntracked = untrackedPaths.filter((path) => !isKnownPreservedPath(path));
  const errors = [];

  if (!isCi && !isAllowedWorkBranch(branch, state.expectedBranch)) {
    errors.push(`a branch atual é \`${branch}\`, mas o checkpoint exige \`${state.expectedBranch}\` ou uma missão no padrão \`p<numero>-<tema>\`. Atualize o checkpoint em uma missão explícita antes de continuar.`);
  }

  try {
    execFileSync("git", ["merge-base", "--is-ancestor", state.integrationBase, "HEAD"], { cwd: root, stdio: "ignore" });
  } catch {
    errors.push(`o HEAD não descende do commit-base registrado \`${state.integrationBase}\`.`);
  }

  console.log("\nTAG08 — checkpoint de continuidade");
  console.log(`  branch: ${branch}${isAllowedWorkBranch(branch, state.expectedBranch) ? " ✓" : ""}`);
  console.log(`  base: ${state.integrationBase} ✓`);
  console.log(`  HEAD: ${head}`);
  console.log(`  última missão: ${state.lastMission}`);
  console.log(`  próximo passo: ${state.nextMission}`);
  console.log(`  alterações rastreadas: ${trackedChanges.length}`);
  console.log(`  itens isolados conhecidos: ${untrackedPaths.filter(isKnownPreservedPath).length}`);
  if (unexpectedUntracked.length) console.warn(`  atenção: ${unexpectedUntracked.length} arquivo(s) não rastreado(s) sem classificação.`);

  if (errors.length) fail(errors);
  else console.log("  resultado: contexto válido para esta missão.\n");
} catch (error) {
  fail([error instanceof Error ? error.message : String(error)]);
}
