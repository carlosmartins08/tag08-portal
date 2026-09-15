import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/content-review",
  timeout: 60_000,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3101", browserName: "chromium", headless: true },
  webServer: {
    command: "node tools/content-review-dev.mjs",
    url: "http://127.0.0.1:3101",
    timeout: 120_000,
    reuseExistingServer: false,
    env: { ...process.env, PORT: "3101" }
  }
});
