import assert from "node:assert/strict";
import { evaluateDeployPreflight } from "../tools/preflight-deploy.mjs";

const baseEnv = (overrides = {}) => ({
  ALLOWED_ORIGINS: "https://tag08.example",
  INTERNAL_API_TOKEN: "synthetic-internal-token",
  ONBOARDING_ENABLED: "false",
  INTEGRATIONS_ENABLED: "false",
  GOOGLE_SHEETS_ENABLED: "false",
  CLICKUP_ENABLED: "false",
  ...overrides
});

const noOnboardingDatabase = evaluateDeployPreflight(baseEnv({ DATABASE_URL: "not-a-database-url" }));
assert.deepEqual(noOnboardingDatabase.missing, []);
assert.deepEqual(noOnboardingDatabase.invalid, []);

const onboardingWithoutDatabase = evaluateDeployPreflight(baseEnv({ ONBOARDING_ENABLED: "true" }));
assert.ok(onboardingWithoutDatabase.missing.includes("DATABASE_URL"));

const onboardingWithInvalidDatabase = evaluateDeployPreflight(baseEnv({
  ONBOARDING_ENABLED: "true",
  DATABASE_URL: "postgresql://qa-user:synthetic@localhost:5432/qa"
}));
assert.ok(onboardingWithInvalidDatabase.invalid.some((message) => message.includes("remote PostgreSQL service")));

const productionOnboardingEnabled = evaluateDeployPreflight(baseEnv({
  NODE_ENV: "production",
  ONBOARDING_ENABLED: "true",
  DATABASE_URL: "postgresql://qa-user:synthetic@db.example:5432/qa",
  TRANSLATIONS_AUTOPUBLISH: "true",
  TRANSLATION_SERVICE_URL: "https://translation.example",
  TRANSLATION_ENGINE_VERSION: "synthetic"
}), ["--production"]);
assert.ok(productionOnboardingEnabled.invalid.some((message) => message.includes("ONBOARDING_ENABLED must be false")));

const productionBase = {
  ...baseEnv({
    NODE_ENV: "production",
    TRANSLATIONS_AUTOPUBLISH: "true",
    TRANSLATION_SERVICE_URL: "https://translation.example",
    TRANSLATION_ENGINE_VERSION: "synthetic",
    INTEGRATIONS_ENABLED: "true",
    GOOGLE_SHEETS_ENABLED: "true",
    CLICKUP_ENABLED: "false",
    GOOGLE_SHEETS_SPREADSHEET_ID: "production-sheet-id",
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "qa@example.invalid", private_key: "synthetic" }),
    CLICKUP_API_TOKEN: "",
    CLICKUP_ONBOARDING_LIST_ID: ""
  })
};
const productionArgs = ["--production", "--allow-integrations"];

const stageSheet = evaluateDeployPreflight({
  ...productionBase,
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE"
}, productionArgs);
assert.ok(stageSheet.invalid.some((message) => message.includes("staging spreadsheet")));

const onboardingStagingListIsIrrelevantWhenClickUpDisabled = evaluateDeployPreflight({
  ...productionBase,
  CLICKUP_ONBOARDING_LIST_ID: "901327894265"
}, productionArgs);
assert.deepEqual(onboardingStagingListIsIrrelevantWhenClickUpDisabled.missing, []);
assert.deepEqual(onboardingStagingListIsIrrelevantWhenClickUpDisabled.invalid, []);

const disabledIntegrationsWithStagingIds = evaluateDeployPreflight(baseEnv({
  TRANSLATIONS_AUTOPUBLISH: "true",
  TRANSLATION_SERVICE_URL: "https://translation.example",
  TRANSLATION_ENGINE_VERSION: "synthetic",
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE",
  CLICKUP_ONBOARDING_LIST_ID: "901327894265"
}), ["--production"]);
assert.ok(disabledIntegrationsWithStagingIds.invalid.some((message) => message.includes("staging spreadsheet")));

const productionTargets = evaluateDeployPreflight(productionBase, productionArgs);
assert.deepEqual(productionTargets.missing, []);
assert.deepEqual(productionTargets.invalid, []);

const clickUpCannotBeEnabledOutsideOnboarding = evaluateDeployPreflight(baseEnv({
  CLICKUP_ENABLED: "true",
  ONBOARDING_ENABLED: "false"
}), ["--production"]);
assert.ok(clickUpCannotBeEnabledOutsideOnboarding.invalid.some((message) => message.includes("only supported for Onboarding")));

console.log("deployPreflight: PASS (Sheets-only Contact/Talent; Onboarding controls ClickUp and database requirements)");
