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
    CLICKUP_ENABLED: "true",
    GOOGLE_SHEETS_SPREADSHEET_ID: "production-sheet-id",
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "qa@example.invalid", private_key: "synthetic" }),
    CLICKUP_API_TOKEN: "synthetic-clickup-token",
    CLICKUP_PRE_SALES_LIST_ID: "900700475931",
    CLICKUP_TALENT_LIST_ID: "900700474161",
    CLICKUP_ONBOARDING_LIST_ID: "999000000003"
  })
};
const productionArgs = ["--production", "--allow-integrations"];

const stageSheet = evaluateDeployPreflight({
  ...productionBase,
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE"
}, productionArgs);
assert.ok(stageSheet.invalid.some((message) => message.includes("staging spreadsheet")));

for (const name of ["CLICKUP_PRE_SALES_LIST_ID", "CLICKUP_TALENT_LIST_ID", "CLICKUP_ONBOARDING_LIST_ID"]) {
  const stageList = evaluateDeployPreflight({
    ...productionBase,
    [name]: name === "CLICKUP_ONBOARDING_LIST_ID" ? "901327894265" : "901327894264"
  }, productionArgs);
  assert.ok(stageList.invalid.some((message) => message.includes(`${name} points to an approved staging ClickUp list`)));
}

const productionWithoutOnboardingList = { ...productionBase };
delete productionWithoutOnboardingList.CLICKUP_ONBOARDING_LIST_ID;
const disabledOnboardingWithoutList = evaluateDeployPreflight(productionWithoutOnboardingList, productionArgs);
assert.deepEqual(disabledOnboardingWithoutList.missing, []);
assert.deepEqual(disabledOnboardingWithoutList.invalid, []);

const disabledIntegrationsWithStagingIds = evaluateDeployPreflight(baseEnv({
  TRANSLATIONS_AUTOPUBLISH: "true",
  TRANSLATION_SERVICE_URL: "https://translation.example",
  TRANSLATION_ENGINE_VERSION: "synthetic",
  GOOGLE_SHEETS_SPREADSHEET_ID: "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE",
  CLICKUP_PRE_SALES_LIST_ID: "900700475931",
  CLICKUP_TALENT_LIST_ID: "900700474161",
  CLICKUP_ONBOARDING_LIST_ID: "901327894265"
}), ["--production"]);
assert.ok(disabledIntegrationsWithStagingIds.invalid.some((message) => message.includes("staging spreadsheet")));
assert.ok(disabledIntegrationsWithStagingIds.invalid.some((message) => message.includes("CLICKUP_ONBOARDING_LIST_ID")));

const productionTargets = evaluateDeployPreflight(productionBase, productionArgs);
assert.deepEqual(productionTargets.missing, []);
assert.deepEqual(productionTargets.invalid, []);

console.log("deployPreflight: PASS (database and Onboarding destination conditional; production blocks known staging targets even while integrations are disabled)");
