import { existsSync, rmSync } from "node:fs";
import net from "node:net";
import { resolve } from "node:path";

const port = Number(process.argv[2] ?? "3212");
const cacheName = process.argv[3] ?? ".next-dev";
const allowedCaches = new Set([".next-dev", ".next-review"]);

if (!allowedCaches.has(cacheName)) {
  throw new Error(`Cache de desenvolvimento não permitido: ${cacheName}.`);
}

const devCache = resolve(process.cwd(), cacheName);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Porta de desenvolvimento inv\u00e1lida: ${process.argv[2] ?? ""}.`);
}

async function assertPortIsAvailable() {
  await new Promise((resolvePromise, reject) => {
    const probe = net.createServer();

    probe.once("error", (error) => {
      reject(new Error(`A porta ${port} j\u00e1 est\u00e1 em uso; o cache ${cacheName} n\u00e3o foi alterado. Identifique o processo antes de qualquer encerramento.`, { cause: error }));
    });

    probe.once("listening", () => {
      probe.close((error) => error ? reject(error) : resolvePromise());
    });

    probe.listen(port);
  });
}

await assertPortIsAvailable();

if (existsSync(devCache)) {
  rmSync(devCache, { recursive: true, force: true });
}
