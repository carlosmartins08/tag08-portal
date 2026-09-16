import { existsSync, rmSync } from "node:fs";
import net from "node:net";
import { resolve } from "node:path";

const port = Number(process.argv[2] ?? "3212");
const devCache = resolve(process.cwd(), ".next-dev");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Porta de desenvolvimento inv\u00e1lida: ${process.argv[2] ?? ""}.`);
}

async function assertPortIsAvailable() {
  await new Promise((resolvePromise, reject) => {
    const probe = net.createServer();

    probe.once("error", (error) => {
      reject(new Error(`A porta ${port} j\u00e1 est\u00e1 em uso. Encerre a pr\u00e9via existente antes de executar npm run dev; o cache n\u00e3o foi alterado.`, { cause: error }));
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
