import { defineConfig } from "@playwright/test";

const chromeExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const configuredWorkers = Number(process.env.PLAYWRIGHT_WORKERS);
const workers = Number.isInteger(configuredWorkers) && configuredWorkers > 0 ? configuredWorkers : 1;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  timeout: 45_000,
  fullyParallel: true,
  workers,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    browserName: "chromium",
    launchOptions: {
      executablePath: chromeExecutable
    },
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  }
});
