import { prepareEsbuildRuntime } from "./esbuild-runtime.mjs";

prepareEsbuildRuntime();

const { preview: vitePreview } = await import("vite");
const server = await vitePreview({
  configLoader: "native",
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true
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
