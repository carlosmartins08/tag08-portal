import { defineConfig } from "@playwright/test";

const chromeExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const configuredWorkers = Number(process.env.PLAYWRIGHT_WORKERS);
const workers = Number.isInteger(configuredWorkers) && configuredWorkers > 0 ? configuredWorkers : 1;
const localPort = process.env.E2E_PORT ?? "3211";
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${localPort}`;
const usesExternalBaseUrl = Boolean(process.env.E2E_BASE_URL);
const onboardingTestDatabaseUrl = process.env.ONBOARDING_TEST_DATABASE_URL?.trim();

const getOnboardingTestServerEnvironment = () => {
  if (!onboardingTestDatabaseUrl) return { ONBOARDING_ENABLED: "false", DATABASE_URL: "" };

  let databaseUrl: URL;
  try {
    databaseUrl = new URL(onboardingTestDatabaseUrl);
  } catch {
    throw new Error("ONBOARDING_TEST_DATABASE_URL must target the approved disposable local QA database.");
  }

  const isApprovedQaDatabase =
    ["127.0.0.1", "localhost"].includes(databaseUrl.hostname) &&
    databaseUrl.pathname === "/tag08_p1_2e2_qa" &&
    decodeURIComponent(databaseUrl.username) === "tag08_qa";

  if (!isApprovedQaDatabase) {
    throw new Error("ONBOARDING_TEST_DATABASE_URL must target the approved disposable local QA database.");
  }

  return { ONBOARDING_ENABLED: "true", DATABASE_URL: onboardingTestDatabaseUrl };
};

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  timeout: 45_000,
  fullyParallel: true,
  workers,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    browserName: "chromium",
    // CI installs Playwright's bundled Chromium. Developers who need a
    // specific local browser can still opt in through the environment.
    launchOptions: chromeExecutable ? { executablePath: chromeExecutable } : undefined,
    headless: true,
    trace: "retain-on-failure",
      screenshot: "only-on-failure"
  },
  // Browser tests must exercise the production server, not depend on a
  // developer's already-running dev server. An explicit E2E_BASE_URL remains
  // available for staging validation.
  webServer: usesExternalBaseUrl
    ? undefined
    : {
        command: "npm run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
        env: { ...process.env, ...getOnboardingTestServerEnvironment(), PORT: localPort }
      }
});
