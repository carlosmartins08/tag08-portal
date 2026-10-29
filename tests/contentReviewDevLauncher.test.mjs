import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import {
  findOccupiedPorts,
  formatPortConflict,
  formatPreviewIdentity,
  isPortInUse,
  resolvePreviewPlan,
  runPreview
} from "../tools/content-review-dev.mjs";

test("a prévia normal em 3101 é pública e separa a porta do cache compartilhado", () => {
  assert.deepEqual(resolvePreviewPlan([], {}), {
    mode: "public preview",
    port: 3101,
    cacheDirectory: ".next-dev",
    contentReviewEnabled: false,
    portsToCheck: [3101, 3212]
  });
});

test("a revisão editorial exige o modo explícito e mantém o cache próprio", () => {
  assert.deepEqual(resolvePreviewPlan(["--review"], {}), {
    mode: "editorial review",
    port: 3101,
    cacheDirectory: ".next-review",
    contentReviewEnabled: true,
    portsToCheck: [3101]
  });
});

test("a prévia de escopo público permanece em 3212 sem compartilhar simultaneamente o cache", () => {
  assert.deepEqual(resolvePreviewPlan(["--public-preview"], {}), {
    mode: "public-scope preview",
    port: 3212,
    cacheDirectory: ".next-dev",
    contentReviewEnabled: false,
    portsToCheck: [3212, 3101]
  });
});

test("modos conflitantes e portas inválidas são rejeitados", () => {
  assert.throws(() => resolvePreviewPlan(["--review", "--public-preview"], {}), /Escolha somente um modo/);
  assert.throws(() => resolvePreviewPlan([], { PORT: "70000" }), /Porta de desenvolvimento inválida/);
});

test("o verificador distingue porta livre de porta ocupada sem tocar no processo", async (context) => {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, resolve);
  });
  context.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

  const occupiedPort = server.address().port;
  assert.equal(await isPortInUse(occupiedPort), true);
  assert.deepEqual(await findOccupiedPorts([occupiedPort, 0], async (port) => port === occupiedPort), [occupiedPort]);
  assert.match(formatPortConflict([occupiedPort]), /Nenhum processo foi reutilizado ou encerrado automaticamente/);
  assert.match(formatPortConflict([occupiedPort]), /Get-NetTCPConnection/);
});

test("um conflito encerra antes de anunciar a identidade da prévia", async () => {
  const output = [];
  const errors = [];
  const exitCode = await runPreview({
    args: [],
    env: { PORT: "3101" },
    dependencies: {
      readGitIdentity: () => ({
        directory: "C:\\TAG08",
        branch: "main",
        commit: "c1aab5f",
        workingTree: "clean"
      }),
      findOccupiedPorts: async () => [3101],
      log: (message) => output.push(message),
      error: (message) => errors.push(message)
    }
  });

  assert.equal(exitCode, 1);
  assert.equal(output.length, 0);
  assert.match(errors[0], /porta/i);
  assert.doesNotMatch(errors.join("\n"), /TAG08 local preview/);
});

test("o lançador imprime a identidade completa da prévia", () => {
  const output = formatPreviewIdentity({
    directory: "C:\\TAG08",
    branch: "main",
    commit: "c1aab5f84bf69bdb244329089b6d641cb7fda882",
    workingTree: "modified",
    url: "http://localhost:3101",
    mode: "public preview"
  });

  assert.match(output, /diretório: C:\\TAG08/);
  assert.match(output, /branch: main/);
  assert.match(output, /commit: c1aab5f84bf69bdb244329089b6d641cb7fda882/);
  assert.match(output, /worktree: modified/);
  assert.match(output, /modo: public preview/);
  assert.match(output, /URL: http:\/\/localhost:3101/);
});
