import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const FRONTEND_PORT = 3000;
const DEFAULT_BACKEND_PORT = 3001;
const localOfficialContentFallback = {
  ok: true,
  status: "fallback",
  sources: {
    youtube: "fallback",
    googleBusiness: "fallback"
  },
  youtubeVideos: [],
  gmbReviews: []
} as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const onboardingPort = Number(env.ONBOARDING_PORT || DEFAULT_BACKEND_PORT);
  const disableHmr = env.DISABLE_HMR === "true";

  return {
    plugins: [
      {
        name: "tag08-local-official-content-fallback",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.method !== "GET" || !req.url) {
              next();
              return;
            }

            const pathname = new URL(req.url, "http://127.0.0.1").pathname;
            if (pathname !== "/api/official-content") {
              next();
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Cache-Control", "no-store");
            res.end(JSON.stringify(localOfficialContentFallback));
          });
        }
      }
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: "0.0.0.0",
      port: FRONTEND_PORT,
      strictPort: true,
      hmr: disableHmr ? false : undefined,
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${onboardingPort}`,
          changeOrigin: true
        }
      }
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      strictPort: true
    },
    build: {
      sourcemap: false,
      minify: "esbuild"
    }
  };
});
