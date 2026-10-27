import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { getContactTalentStagingExpected } from "./contactStagingGate.mjs";

export const CONTACT_STAGING_TARGETS = getContactTalentStagingExpected();

const STAGING_SCOPES = new Set(["contact", "talent", "contact-talent"]);
const PERSISTENT_STAGING_FLAGS = [
  "SUBMISSIONS_ENABLED",
  "INTEGRATIONS_ENABLED",
  "GOOGLE_SHEETS_ENABLED",
  "CLICKUP_ENABLED",
  "INTEGRATION_MOCK_MODE"
];

const evaluateDirectStagingPreflight = (env, scope, mode) => {
  const missing = [];
  const invalid = [];
  const present = (name) => Boolean(env[name]?.trim());
  const requireValue = (name) => { if (!present(name)) missing.push(name); };
  const contact = scope === "contact" || scope === "contact-talent";
  const talent = scope === "talent" || scope === "contact-talent";

  if (!["inspect", "deliver"].includes(mode)) invalid.push("staging mode must be inspect or deliver");
  if (env.GOOGLE_SHEETS_SPREADSHEET_ID !== CONTACT_STAGING_TARGETS.spreadsheetId) {
    invalid.push("GOOGLE_SHEETS_SPREADSHEET_ID does not match the approved staging sheet");
  }
  if (contact && env.CLICKUP_PRE_SALES_LIST_ID !== CONTACT_STAGING_TARGETS.clickUpContactListId) {
    invalid.push("CLICKUP_PRE_SALES_LIST_ID does not match the approved staging list");
  }
  if (talent && env.CLICKUP_TALENT_LIST_ID !== CONTACT_STAGING_TARGETS.clickUpTalentListId) {
    invalid.push("CLICKUP_TALENT_LIST_ID does not match the approved staging list");
  }
  if (scope === "contact" && present("CLICKUP_TALENT_LIST_ID")) {
    invalid.push("Contact-only staging must not configure the Talent destination");
  }
  if (scope === "talent" && present("CLICKUP_PRE_SALES_LIST_ID")) {
    invalid.push("Talent-only staging must not configure the Contact destination");
  }
  if (present("CLICKUP_ONBOARDING_LIST_ID")) invalid.push("Onboarding ClickUp destination must remain unconfigured");
  for (const name of PERSISTENT_STAGING_FLAGS) {
    if (!Object.hasOwn(env, name)) missing.push(name);
    else if (env[name] !== "false") invalid.push(`${name} must be exactly false in persistent staging configuration`);
  }
  if (!Object.hasOwn(env, "ONBOARDING_ENABLED")) missing.push("ONBOARDING_ENABLED");
  else if (env.ONBOARDING_ENABLED !== "false") invalid.push("ONBOARDING_ENABLED must be exactly false");
  if (present("DATABASE_URL") || present("DATABASE_SSL")) {
    invalid.push("PostgreSQL settings are not accepted by direct Contact/Talent staging");
  }

  if (mode === "deliver") {
    requireValue("GOOGLE_SERVICE_ACCOUNT_JSON");
    requireValue("CLICKUP_API_TOKEN");
  }
  const hasSheetsCredential = present("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (hasSheetsCredential) {
    try {
      const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (!account.client_email || !account.private_key) invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is incomplete");
    } catch { invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON"); }
  }
  if (present("CLICKUP_API_TOKEN") && /replace_me|placeholder/i.test(env.CLICKUP_API_TOKEN)) {
    invalid.push("CLICKUP_API_TOKEN still contains a placeholder");
  }

  return {
    event: missing.length || invalid.length ? "direct_staging_preflight_failed" : "direct_staging_preflight_passed",
    enabled: false,
    scope,
    mode,
    secretsConfigured: hasSheetsCredential && present("CLICKUP_API_TOKEN"),
    missing,
    invalid
  };
};

export const evaluateIntegrationPreflight = (env, scope = "all", contactMode = "inspect") => {
  if (STAGING_SCOPES.has(scope)) return evaluateDirectStagingPreflight(env, scope, contactMode);
  const missing = [];
  const invalid = [];
  const present = (name) => Boolean(env[name]?.trim());
  const requireValue = (name) => { if (!present(name)) missing.push(name); };
  const enabled = env.INTEGRATIONS_ENABLED === "true";
  const sheetsEnabled = env.GOOGLE_SHEETS_ENABLED === "true";
  const clickUpEnabled = env.CLICKUP_ENABLED === "true";

  if (scope !== "all") return { event: "integration_preflight_failed", enabled, missing, invalid: [`unsupported scope: ${scope}`] };
  if (!enabled) return { event: "integration_preflight_disabled", enabled: false, missing, invalid };
  if (!sheetsEnabled && !clickUpEnabled) invalid.push("INTEGRATIONS_ENABLED=true requires at least one integration target");
  if (sheetsEnabled) {
    requireValue("GOOGLE_SHEETS_SPREADSHEET_ID");
    requireValue("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (present("GOOGLE_SERVICE_ACCOUNT_JSON")) {
      try {
        const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        if (!account.client_email || !account.private_key) invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is incomplete");
      } catch { invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON"); }
    }
  }
  if (clickUpEnabled) {
    for (const name of ["CLICKUP_API_TOKEN", "CLICKUP_PRE_SALES_LIST_ID", "CLICKUP_TALENT_LIST_ID", "CLICKUP_ONBOARDING_LIST_ID"]) requireValue(name);
    for (const name of ["CLICKUP_PRE_SALES_LIST_ID", "CLICKUP_TALENT_LIST_ID", "CLICKUP_ONBOARDING_LIST_ID"]) {
      if (present(name) && !/^\d+$/.test(env[name].trim())) invalid.push(`${name} must be numeric`);
    }
  }
  return { event: missing.length || invalid.length ? "integration_preflight_failed" : "integration_preflight_passed", enabled, sheetsEnabled, clickUpEnabled, missing, invalid };
};

const parseArgs = (args) => {
  const scopeArg = args.find((arg) => arg.startsWith("--scope="));
  const modeArg = args.find((arg) => arg.startsWith("--mode="));
  const envFileArg = args.find((arg) => arg.startsWith("--env-file="));
  return {
    scope: scopeArg?.slice("--scope=".length) || "all",
    mode: modeArg?.slice("--mode=".length) || "inspect",
    envFile: envFileArg?.slice("--env-file=".length) || null
  };
};

const main = async () => {
  const { scope, mode, envFile } = parseArgs(process.argv.slice(2));
  let env = process.env;
  if (STAGING_SCOPES.has(scope)) {
    const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const expectedFile = path.join(projectRoot, ".env.staging.local");
    if (!envFile || path.resolve(process.cwd(), envFile) !== expectedFile) {
      console.error(JSON.stringify({ event: "direct_staging_preflight_failed", missing: [], invalid: ["staging scope requires the explicit project .env.staging.local file"] }));
      process.exitCode = 1;
      return;
    }
    try {
      env = dotenv.parse(await readFile(expectedFile));
    } catch {
      console.error(JSON.stringify({ event: "direct_staging_preflight_failed", missing: [".env.staging.local"], invalid: [] }));
      process.exitCode = 1;
      return;
    }
  } else if (envFile || mode !== "inspect") {
    console.error(JSON.stringify({ event: "integration_preflight_failed", missing: [], invalid: ["--env-file and --mode are supported only for direct Contact/Talent staging scopes"] }));
    process.exitCode = 1;
    return;
  }

  const result = evaluateIntegrationPreflight(env, scope, mode);
  console.log(JSON.stringify(result));
  if (result.missing.length || result.invalid.length) process.exitCode = 1;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
