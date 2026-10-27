import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { getContactStagingExpected } from "./contactStagingGate.mjs";

export const CONTACT_STAGING_TARGETS = Object.freeze(getContactStagingExpected());

export const evaluateIntegrationPreflight = (env, scope = "all", contactMode = "inspect") => {
  const missing = [];
  const invalid = [];
  const present = (name) => Boolean(env[name]?.trim());
  const requireValue = (name) => { if (!present(name)) missing.push(name); };
  const enabled = env.INTEGRATIONS_ENABLED === "true";
  const sheetsEnabled = env.GOOGLE_SHEETS_ENABLED === "true";
  const clickUpEnabled = env.CLICKUP_ENABLED === "true";

  if (scope === "contact") {
    if (!["inspect", "simulate-failure", "deliver"].includes(contactMode)) {
      invalid.push("Contact staging mode is unsupported");
    }
    if (!env.GOOGLE_SHEETS_SPREADSHEET_ID || env.GOOGLE_SHEETS_SPREADSHEET_ID !== CONTACT_STAGING_TARGETS.spreadsheetId) {
      invalid.push("GOOGLE_SHEETS_SPREADSHEET_ID does not match the approved Contact staging sheet");
    }
    if (!env.CLICKUP_PRE_SALES_LIST_ID || env.CLICKUP_PRE_SALES_LIST_ID !== CONTACT_STAGING_TARGETS.clickUpListId) {
      invalid.push("CLICKUP_PRE_SALES_LIST_ID does not match the approved Contact staging list");
    }
    if (present("CLICKUP_TALENT_LIST_ID") || present("CLICKUP_ONBOARDING_LIST_ID")) {
      invalid.push("Contact staging must not configure Talent or Onboarding ClickUp destinations");
    }
    if (!Object.hasOwn(env, "INTEGRATION_DELIVERY_ID")) missing.push("INTEGRATION_DELIVERY_ID");
    else if (env.INTEGRATION_DELIVERY_ID !== "") {
      invalid.push("INTEGRATION_DELIVERY_ID must be supplied only to the one-delivery runner");
    }
    for (const name of ["INTEGRATIONS_ENABLED", "GOOGLE_SHEETS_ENABLED", "CLICKUP_ENABLED", "INTEGRATION_MOCK_MODE"]) {
      if (!Object.hasOwn(env, name)) missing.push(name);
      else if (env[name] !== "false") invalid.push(`${name} must be exactly false in the persistent staging configuration`);
    }

    for (const name of ["DATABASE_URL", "DATABASE_SSL", "TAG08_STAGING_DATABASE_HOST", "TAG08_STAGING_DATABASE_NAME", "TAG08_STAGING_DATABASE_APPROVED", "BASE_URL", "ALLOWED_ORIGINS"]) requireValue(name);
    if (present("DATABASE_SSL") && env.DATABASE_SSL !== "true") invalid.push("DATABASE_SSL must be exactly true for Contact staging");
    if (present("TAG08_STAGING_DATABASE_APPROVED") && env.TAG08_STAGING_DATABASE_APPROVED !== "true") {
      invalid.push("Contact staging database requires independent operator approval after verifying the provider resource");
    }
    if (contactMode === "deliver") {
      requireValue("GOOGLE_SERVICE_ACCOUNT_JSON");
      requireValue("CLICKUP_API_TOKEN");
    }
    const hasSheetsCredential = present("GOOGLE_SERVICE_ACCOUNT_JSON");
    const hasClickUpCredential = present("CLICKUP_API_TOKEN");
    if (hasSheetsCredential !== hasClickUpCredential) invalid.push("Contact staging credentials must be configured as a pair or both left blank");
    if (hasClickUpCredential && /replace_me|placeholder/i.test(env.CLICKUP_API_TOKEN)) invalid.push("CLICKUP_API_TOKEN still contains a placeholder");
    if (hasSheetsCredential) {
      try {
        const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        if (!account.client_email || !account.private_key) invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is incomplete");
      } catch { invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON"); }
    }

    if (present("DATABASE_URL") && present("TAG08_STAGING_DATABASE_HOST") && present("TAG08_STAGING_DATABASE_NAME")) {
      try {
        const databaseUrl = new URL(env.DATABASE_URL);
        const databaseName = decodeURIComponent(databaseUrl.pathname.replace(/^\//, ""));
        if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) invalid.push("DATABASE_URL must use PostgreSQL");
        const sslMode = databaseUrl.searchParams.get("sslmode");
        if (sslMode !== "verify-full") invalid.push("DATABASE_URL must explicitly use sslmode=verify-full");
        if (["localhost", "127.0.0.1", "postgres"].includes(databaseUrl.hostname)) invalid.push("DATABASE_URL must use the dedicated remote staging database");
        if (databaseUrl.hostname !== env.TAG08_STAGING_DATABASE_HOST) invalid.push("DATABASE_URL host does not match TAG08_STAGING_DATABASE_HOST");
        if (databaseName !== env.TAG08_STAGING_DATABASE_NAME) invalid.push("DATABASE_URL database does not match TAG08_STAGING_DATABASE_NAME");
        if (/example|replace_me|placeholder/i.test(`${databaseUrl.hostname}${databaseName}`)) invalid.push("DATABASE_URL still contains a placeholder");
      } catch {
        invalid.push("DATABASE_URL is not a valid PostgreSQL URL");
      }
    }
    if (present("BASE_URL")) {
      try {
        const baseUrl = new URL(env.BASE_URL);
        if (baseUrl.protocol !== "https:") invalid.push("BASE_URL must use HTTPS for staging");
        if (baseUrl.pathname !== "/" || baseUrl.search || baseUrl.hash) invalid.push("BASE_URL must be an origin without path, query, or fragment");
        const allowedOrigins = (env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean);
        if (allowedOrigins.length !== 1 || allowedOrigins[0] !== baseUrl.origin) invalid.push("ALLOWED_ORIGINS must contain only the exact staging BASE_URL origin");
      } catch { invalid.push("BASE_URL is not a valid URL"); }
    }
    return { event: missing.length || invalid.length ? "contact_integration_preflight_failed" : "contact_staging_config_preflight_passed", enabled: false, secretsConfigured: hasSheetsCredential && hasClickUpCredential, missing, invalid };
  }

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
  const envFileArg = args.find((arg) => arg.startsWith("--env-file="));
  return { scope: scopeArg?.slice("--scope=".length) || "all", envFile: envFileArg?.slice("--env-file=".length) || null };
};

const main = async () => {
  const { scope, envFile } = parseArgs(process.argv.slice(2));
  let env = process.env;
  if (scope === "contact") {
    const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const expectedFile = path.join(projectRoot, ".env.staging.local");
    if (!envFile || path.resolve(process.cwd(), envFile) !== expectedFile) {
      console.error(JSON.stringify({ event: "contact_integration_preflight_failed", missing: [], invalid: ["contact scope requires the explicit project .env.staging.local file"] }));
      process.exitCode = 1;
      return;
    }
    try {
      env = dotenv.parse(await readFile(expectedFile));
    } catch {
      console.error(JSON.stringify({ event: "contact_integration_preflight_failed", missing: [".env.staging.local"], invalid: [] }));
      process.exitCode = 1;
      return;
    }
  } else if (envFile) {
    console.error(JSON.stringify({ event: "integration_preflight_failed", missing: [], invalid: ["--env-file is supported only for contact staging scope"] }));
    process.exitCode = 1;
    return;
  }

  const result = evaluateIntegrationPreflight(env, scope);
  console.log(JSON.stringify(result));
  if (result.missing.length || result.invalid.length) process.exitCode = 1;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
