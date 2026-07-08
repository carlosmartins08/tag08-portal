import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const FRONTEND_PORT = 3000;
const DEFAULT_BACKEND_PORT = 3001;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const onboardingPort = Number(env.ONBOARDING_PORT || DEFAULT_BACKEND_PORT);
  const disableHmr = env.DISABLE_HMR === "true";

  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: "0.0.0.0",
      port: FRONTEND_PORT,
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
      port: 4173
    }
  };
});
