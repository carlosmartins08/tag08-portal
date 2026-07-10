import { prepareEsbuildRuntime } from "./esbuild-runtime.mjs";

prepareEsbuildRuntime();

const frontendPort = Number(process.env.FRONTEND_PORT || 3000);
const { createServer } = await import("vite");
const server = await createServer({
  configLoader: "native",
  server: {
    host: "0.0.0.0",
    port: frontendPort,
    strictPort: false
  }
});

await server.listen();
server.printUrls();

const shutdown = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
