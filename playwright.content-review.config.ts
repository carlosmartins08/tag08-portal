import { defineConfig } from "@playwright/test";

const contentReviewPort = process.env.CONTENT_REVIEW_PORT ?? "3101";
const contentReviewBaseUrl = `http://127.0.0.1:${contentReviewPort}`;

export default defineConfig({
  testDir: "./tests/content-review",
  timeout: 60_000,
  workers: 1,
  use: { baseURL: contentReviewBaseUrl, browserName: "chromium", headless: true },
  webServer: {
    command: "node tools/content-review-dev.mjs --review",
    url: contentReviewBaseUrl,
    timeout: 120_000,
    reuseExistingServer: false,
    env: { ...process.env, PORT: contentReviewPort }
  }
});
