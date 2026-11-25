import { spawn, spawnSync, execFileSync } from "node:child_process";
import net from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextCli = resolve(projectRoot, "node_modules/next/dist/bin/next");
const cacheScript = resolve(projectRoot, "tools/clear-next-dev-cache.mjs");

export function resolvePreviewPlan(args = [], env = process.env) {
  if (args.length) {
    throw new Error("A prévia tem um único modo. Remova argumentos de revisão/preview e use npm run dev; consulte npm run content:status e npm run i18n:status para acompanhar pendências.");
  }

  const portText = env.PORT || "3101";
  const port = Number(portText);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Porta de desenvolvimento inválida: ${portText}.`);
  }

  return { mode: "public", port, cacheDirectory: ".next-dev", portsToCheck: [port] };
}

export const isPortInUse = (port) => new Promise((resolvePromise, reject) => {
  const probe = net.createServer();
  probe.once("error", (error) => error.code === "EADDRINUSE" ? resolvePromise(true) : reject(error));
  probe.once("listening", () => probe.close((error) => error ? reject(error) : resolvePromise(false)));
  probe.listen(port);
});

export async function findOccupiedPorts(ports, isPortInUseFn = isPortInUse) {
  const checks = await Promise.all(ports.map(async (port) => ({ port, occupied: await isPortInUseFn(port) })));
  return checks.filter(({ occupied }) => occupied).map(({ port }) => port);
}

export function formatPortConflict(ports) {
  const portList = ports.join(", ");
  const inspectedPort = ports[0];
  return [
    `TAG08 não iniciou: a(s) porta(s) ${portList} já está/ão em uso.`,
    "Nenhum processo foi reutilizado ou encerrado automaticamente.",
    "Identifique o proprietário antes de agir:",
    `Get-NetTCPConnection -LocalPort ${inspectedPort} -State Listen | Select-Object LocalAddress, OwningProcess`,
    "Get-Process -Id <PID>",
    "Encerre somente o processo que você confirmou pertencer à prévia antiga e tente novamente."
  ].join("\n");
}

function readGitIdentity() {
  const git = (args) => execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
  return {
    directory: git(["rev-parse", "--show-toplevel"]),
    branch: git(["branch", "--show-current"]),
    commit: git(["rev-parse", "HEAD"]),
    workingTree: git(["status", "--porcelain", "--untracked-files=all"]) ? "modified" : "clean"
  };
}

export function formatPreviewIdentity({ directory, branch, commit, workingTree, url }) {
  return [
    "TAG08 local preview — iniciando",
    `diretório: ${directory}`,
    `branch: ${branch || "detached HEAD"}`,
    `commit: ${commit}`,
    `worktree: ${workingTree}`,
    "renderização: experiência pública única; evidências e idiomas dependem dos gates de aprovação",
    `URL: ${url}`
  ].join("\n");
}

export async function runPreview({ args = process.argv.slice(2), env = process.env, dependencies = {} } = {}) {
  const getIdentity = dependencies.readGitIdentity ?? readGitIdentity;
  const checkPorts = dependencies.findOccupiedPorts ?? findOccupiedPorts;
  const log = dependencies.log ?? console.log;
  const reportError = dependencies.error ?? console.error;
  let plan;
  let identity;

  try {
    plan = resolvePreviewPlan(args, env);
    identity = getIdentity();
  } catch (error) {
    reportError(`TAG08 não iniciou: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }

  const url = `http://localhost:${plan.port}`;
  let occupiedPorts;
  try {
    occupiedPorts = await checkPorts(plan.portsToCheck);
  } catch (error) {
    reportError(`TAG08 não iniciou ao verificar as portas: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
  if (occupiedPorts.length) {
    reportError(formatPortConflict(occupiedPorts));
    return 1;
  }

  const continuityArgs = [resolve(projectRoot, "tools/continuity-check.mjs")];
  if (env.CI) continuityArgs.push("--ci");
  const continuity = spawnSync(process.execPath, continuityArgs, { cwd: projectRoot, stdio: "inherit" });
  if (continuity.error) {
    reportError(`TAG08 bloqueou a prévia porque o preflight de continuidade não pôde ser executado: ${continuity.error.message}`);
    return 1;
  }
  if (continuity.status !== 0) return continuity.status ?? 1;

  const cacheReset = spawnSync(process.execPath, [cacheScript, String(plan.port), plan.cacheDirectory], {
    cwd: projectRoot,
    stdio: "inherit"
  });
  if (cacheReset.error) {
    reportError(`TAG08 não conseguiu preparar o cache ${plan.cacheDirectory}: ${cacheReset.error.message}`);
    return 1;
  }
  if (cacheReset.status !== 0) return cacheReset.status ?? 1;

  log(formatPreviewIdentity({ ...identity, url }));
  const child = spawn(process.execPath, [nextCli, "dev", "--port", String(plan.port)], {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...env, PORT: String(plan.port) }
  });

  return new Promise((resolvePromise) => {
    child.once("error", (error) => {
      reportError(`TAG08 não conseguiu iniciar o servidor Next.js: ${error.message}`);
      resolvePromise(1);
    });
    child.once("exit", (code) => resolvePromise(code ?? 1));
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runPreview().then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(`TAG08 não iniciou: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
