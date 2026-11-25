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
} from "../tools/dev-preview.mjs";

test("the launcher resolves one public-safe renderer on localhost:3101", () => {
  assert.deepEqual(resolvePreviewPlan([], {}), {
    mode: "public",
    port: 3101,
    cacheDirectory: ".next-dev",
    portsToCheck: [3101]
  });
  assert.deepEqual(resolvePreviewPlan([], { PORT: "3211" }).portsToCheck, [3211]);
});

test("legacy review and alternate-preview arguments fail with status-report guidance", () => {
  for (const args of [["--review"], ["--public-preview"]]) {
    assert.throws(() => resolvePreviewPlan(args, {}), /único modo.*npm run dev.*content:status.*i18n:status/i);
  }
  assert.throws(() => resolvePreviewPlan([], { PORT: "70000" }), /Porta de desenvolvimento inválida/);
});

test("the port checker detects an occupied listener without touching its process", async (context) => {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, resolve); });
  context.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const port = server.address().port;
  assert.equal(await isPortInUse(port), true);
  assert.deepEqual(await findOccupiedPorts([port], async (candidate) => candidate === port), [port]);
  assert.match(formatPortConflict([port]), /Nenhum processo foi reutilizado ou encerrado automaticamente/);
});

test("a port conflict is reported before starting Next", async () => {
  const output = [];
  const errors = [];
  const exitCode = await runPreview({
    args: [],
    env: { PORT: "3101" },
    dependencies: {
      readGitIdentity: () => ({ directory: "C:\\TAG08", branch: "main", commit: "abc1234", workingTree: "modified" }),
      findOccupiedPorts: async () => [3101],
      log: (message) => output.push(message),
      error: (message) => errors.push(message)
    }
  });
  assert.equal(exitCode, 1);
  assert.equal(output.length, 0);
  assert.match(errors[0], /porta/i);
});

test("legacy flags fail before inspecting process identity or touching a port", async () => {
  const errors = [];
  const exitCode = await runPreview({
    args: ["--review"],
    dependencies: {
      readGitIdentity: () => { throw new Error("must not inspect after invalid args"); },
      findOccupiedPorts: async () => { throw new Error("must not inspect ports after invalid args"); },
      error: (message) => errors.push(message)
    }
  });
  assert.equal(exitCode, 1);
  assert.match(errors[0], /uma experiência|único modo/i);
});

test("the terminal identity states the checkout and the single rendering policy", () => {
  const output = formatPreviewIdentity({
    directory: "C:\\TAG08",
    branch: "main",
    commit: "abc123456789",
    workingTree: "modified",
    url: "http://localhost:3101"
  });
  assert.match(output, /diretório: C:\\TAG08/);
  assert.match(output, /branch: main/);
  assert.match(output, /commit: abc123456789/);
  assert.match(output, /worktree: modified/);
  assert.match(output, /experiência pública única/);
  assert.match(output, /URL: http:\/\/localhost:3101/);
  assert.doesNotMatch(output, /REVISÃO LOCAL|dev:content-review|3212/);
});
