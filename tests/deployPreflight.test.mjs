import assert from "node:assert/strict";
import { evaluateDeployPreflight } from "../tools/preflight-deploy.mjs";
import {
  GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID,
  GOOGLE_SHEETS_STAGING_SPREADSHEET_ID
} from "../server/sheetsDestinations.mjs";

const baseEnv = (overrides = {}) => ({
  ALLOWED_ORIGINS: "https://tag08.example",
  INTERNAL_API_TOKEN: "synthetic-internal-token",
  ONBOARDING_ENABLED: "false",
  TAG08_DEPLOYMENT_ENV: "staging",
  SUBMISSIONS_ENABLED: "false",
  INTEGRATIONS_ENABLED: "false",
  GOOGLE_SHEETS_ENABLED: "false",
  CLICKUP_ENABLED: "false",
  ...overrides
});

const noOnboardingDatabase = evaluateDeployPreflight(baseEnv({ DATABASE_URL: "not-a-database-url" }));
assert.deepEqual(noOnboardingDatabase.missing, []);
assert.deepEqual(noOnboardingDatabase.invalid, []);

const stagingPreflightWrongDestination = evaluateDeployPreflight(baseEnv({
  GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID
}));
assert.ok(stagingPreflightWrongDestination.invalid.some((message) => message.includes("does not match the approved staging spreadsheet")));

const onboardingWithoutDatabase = evaluateDeployPreflight(baseEnv({ ONBOARDING_ENABLED: "true" }));
assert.ok(onboardingWithoutDatabase.missing.includes("DATABASE_URL"));

const onboardingWithInvalidDatabase = evaluateDeployPreflight(baseEnv({
  ONBOARDING_ENABLED: "true",
  DATABASE_URL: "postgresql://qa-user:synthetic@localhost:5432/qa"
}));
assert.ok(onboardingWithInvalidDatabase.invalid.some((message) => message.includes("remote PostgreSQL service")));

const productionOnboardingEnabled = evaluateDeployPreflight(baseEnv({
  NODE_ENV: "production",
  TAG08_DEPLOYMENT_ENV: "production",
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
    TAG08_DEPLOYMENT_ENV: "production",
    TRANSLATIONS_AUTOPUBLISH: "true",
    TRANSLATION_SERVICE_URL: "https://translation.example",
    TRANSLATION_ENGINE_VERSION: "synthetic",
    SUBMISSIONS_ENABLED: "true",
    INTEGRATIONS_ENABLED: "true",
    GOOGLE_SHEETS_ENABLED: "true",
    CLICKUP_ENABLED: "false",
    GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "qa@example.invalid", private_key: "synthetic" }),
    CLICKUP_API_TOKEN: "",
    CLICKUP_ONBOARDING_LIST_ID: ""
  })
};
const productionArgs = ["--production", "--allow-integrations"];

const stageSheet = evaluateDeployPreflight({
  ...productionBase,
  GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_STAGING_SPREADSHEET_ID
}, productionArgs);
assert.ok(stageSheet.invalid.some((message) => message.includes("staging spreadsheet")));

const unknownProductionSheet = evaluateDeployPreflight({
  ...productionBase,
  GOOGLE_SHEETS_SPREADSHEET_ID: "unapproved-sheet-id"
}, productionArgs);
assert.ok(unknownProductionSheet.invalid.some((message) => message.includes("does not match the approved production spreadsheet")));

const missingProductionSheet = evaluateDeployPreflight({
  ...productionBase,
  GOOGLE_SHEETS_SPREADSHEET_ID: ""
}, productionArgs);
assert.ok(missingProductionSheet.missing.includes("GOOGLE_SHEETS_SPREADSHEET_ID"));

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
  GOOGLE_SHEETS_SPREADSHEET_ID: GOOGLE_SHEETS_STAGING_SPREADSHEET_ID,
  CLICKUP_ONBOARDING_LIST_ID: "901327894265"
}), ["--production"]);
assert.ok(disabledIntegrationsWithStagingIds.invalid.some((message) => message.includes("staging spreadsheet")));

const productionTargets = evaluateDeployPreflight(productionBase, productionArgs);
assert.deepEqual(productionTargets.missing, []);
assert.deepEqual(productionTargets.invalid, []);
assert.equal(productionTargets.submissionsEnabled, true);

const missingDeploymentEnvironment = evaluateDeployPreflight({
  ...productionBase,
  TAG08_DEPLOYMENT_ENV: ""
}, productionArgs);
assert.ok(missingDeploymentEnvironment.missing.includes("TAG08_DEPLOYMENT_ENV"));

for (const name of ["SUBMISSIONS_ENABLED", "INTEGRATIONS_ENABLED", "GOOGLE_SHEETS_ENABLED"]) {
  const missingFlagEnvironment = { ...productionBase };
  delete missingFlagEnvironment[name];
  const missingFlag = evaluateDeployPreflight(missingFlagEnvironment, productionArgs);
  assert.ok(missingFlag.missing.includes(name), `${name} must be required`);

  const disabledFlag = evaluateDeployPreflight({ ...productionBase, [name]: "false" }, productionArgs);
  assert.ok(disabledFlag.invalid.some((message) => message.includes("must all be true or all be false")), `${name} cannot be disabled alone`);
}

const malformedOperationalFlag = evaluateDeployPreflight({
  ...productionBase,
  SUBMISSIONS_ENABLED: "yes"
}, productionArgs);
assert.ok(malformedOperationalFlag.invalid.some((message) => message.includes("SUBMISSIONS_ENABLED must be explicitly set to true or false")));

const mismatchedDeploymentEnvironment = evaluateDeployPreflight({
  ...productionBase,
  TAG08_DEPLOYMENT_ENV: "staging"
}, productionArgs);
assert.ok(mismatchedDeploymentEnvironment.invalid.some((message) => message.includes("TAG08_DEPLOYMENT_ENV must match")));

const productionWithFormsDisabled = { ...productionBase };
for (const name of ["SUBMISSIONS_ENABLED", "INTEGRATIONS_ENABLED", "GOOGLE_SHEETS_ENABLED"]) {
  productionWithFormsDisabled[name] = "false";
}
delete productionWithFormsDisabled.GOOGLE_SHEETS_SPREADSHEET_ID;
delete productionWithFormsDisabled.GOOGLE_SERVICE_ACCOUNT_JSON;
const disabledProduction = evaluateDeployPreflight(productionWithFormsDisabled, ["--production"]);
assert.deepEqual(disabledProduction.missing, []);
assert.deepEqual(disabledProduction.invalid, []);
assert.equal(disabledProduction.submissionsEnabled, false);

for (const spreadsheetId of [GOOGLE_SHEETS_STAGING_SPREADSHEET_ID, "unapproved-sheet-id"]) {
  const disabledProductionWrongDestination = evaluateDeployPreflight({
    ...productionWithFormsDisabled,
    GOOGLE_SHEETS_SPREADSHEET_ID: spreadsheetId
  }, ["--production"]);
  assert.ok(disabledProductionWrongDestination.invalid.some((message) => message.includes("GOOGLE_SHEETS_SPREADSHEET_ID")));
}

const clickUpCannotBeEnabledOutsideOnboarding = evaluateDeployPreflight(baseEnv({
  CLICKUP_ENABLED: "true",
  ONBOARDING_ENABLED: "false"
}), ["--production"]);
assert.ok(clickUpCannotBeEnabledOutsideOnboarding.invalid.some((message) => message.includes("only supported for Onboarding")));

console.log("deployPreflight: PASS (Sheets-only Contact/Talent; Onboarding controls ClickUp and database requirements)");
