import "dotenv/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTACT_STAGING_SPREADSHEET_ID } from "./contactStagingGate.mjs";
import { CONTACT_STAGING_CLICKUP_LIST_ID } from "../server/integrationDelivery.mjs";

const CLICKUP_LIST_VARIABLES = [
  "CLICKUP_PRE_SALES_LIST_ID",
  "CLICKUP_TALENT_LIST_ID",
  "CLICKUP_ONBOARDING_LIST_ID"
];

export const evaluateDeployPreflight = (env, args = []) => {
  const target = args.includes("--production") ? "production" : "staging";
  const allowIntegrations = args.includes("--allow-integrations");
  const missing = [];
  const invalid = [];
  const present = (name) => Boolean(env[name]?.trim());
  const requireValue = (name) => {
    if (!present(name)) missing.push(name);
  };

  for (const name of ["ALLOWED_ORIGINS", "INTERNAL_API_TOKEN", "ONBOARDING_ENABLED"]) requireValue(name);

  const onboardingEnabled = env.ONBOARDING_ENABLED?.trim().toLowerCase();
  if (!['true', 'false'].includes(onboardingEnabled || '')) {
    invalid.push("ONBOARDING_ENABLED must be explicitly set to true or false");
  } else if (target === "production" && onboardingEnabled !== "false") {
    invalid.push("ONBOARDING_ENABLED must be false for production until Onboarding is homologated");
  }

  if (onboardingEnabled === "true") requireValue("DATABASE_URL");

  if (onboardingEnabled === "true" && present("DATABASE_URL")) {
    try {
      const databaseUrl = new URL(env.DATABASE_URL);
      if (!databaseUrl.protocol.startsWith("postgres")) invalid.push("DATABASE_URL must use a PostgreSQL URL");
      if (["localhost", "127.0.0.1", "postgres"].includes(databaseUrl.hostname)) {
        invalid.push("DATABASE_URL must point to the remote PostgreSQL service for staging or production");
      }
    } catch {
      invalid.push("DATABASE_URL is not a valid URL");
    }
  }

  if (present("ALLOWED_ORIGINS")) {
    for (const origin of env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean)) {
      try {
        const url = new URL(origin);
        if (!/^https?:$/.test(url.protocol) || url.pathname !== "/" || url.search || url.hash) {
          invalid.push(`ALLOWED_ORIGINS contains an invalid origin: ${origin}`);
        }
      } catch {
        invalid.push(`ALLOWED_ORIGINS contains an invalid origin: ${origin}`);
      }
    }
  }

  const integrationsEnabled = env.INTEGRATIONS_ENABLED === "true";
  const sheetsEnabled = env.GOOGLE_SHEETS_ENABLED === "true";
  const clickUpEnabled = env.CLICKUP_ENABLED === "true";
  const processingLeaseSeconds = Number.parseInt(env.INTEGRATION_PROCESSING_LEASE_SECONDS || "900", 10);
  const deliveryIdFilter = env.INTEGRATION_DELIVERY_ID?.trim();
  const retentionAggregateIdFilter = env.RETENTION_AGGREGATE_ID?.trim();
  const translationsAutopublish = env.TRANSLATIONS_AUTOPUBLISH === "true";

  if (!Number.isSafeInteger(processingLeaseSeconds) || processingLeaseSeconds < 60) {
    invalid.push("INTEGRATION_PROCESSING_LEASE_SECONDS must be an integer of at least 60 seconds");
  }

  if (target === "production" && deliveryIdFilter) {
    invalid.push("INTEGRATION_DELIVERY_ID is only allowed for controlled staging runs");
  }

  if (target === "production" && retentionAggregateIdFilter) {
    invalid.push("RETENTION_AGGREGATE_ID is only allowed for controlled staging runs");
  }

  if (target === "production" && !translationsAutopublish) {
    invalid.push("TRANSLATIONS_AUTOPUBLISH=true is required for production so generated locale artifacts are verified");
  }

  if (translationsAutopublish) {
    for (const name of ["TRANSLATION_SERVICE_URL", "TRANSLATION_ENGINE_VERSION"]) requireValue(name);
    if (present("TRANSLATION_SERVICE_URL")) {
      try {
        const translationUrl = new URL(env.TRANSLATION_SERVICE_URL);
        if (!/^https?:$/.test(translationUrl.protocol) || ["localhost", "127.0.0.1"].includes(translationUrl.hostname)) {
          invalid.push("TRANSLATION_SERVICE_URL must use the private production service hostname");
        }
      } catch {
        invalid.push("TRANSLATION_SERVICE_URL is not a valid URL");
      }
    }
  }

  if ((sheetsEnabled || clickUpEnabled) && !integrationsEnabled) {
    invalid.push("integration targets require INTEGRATIONS_ENABLED=true");
  }

  if (integrationsEnabled && !allowIntegrations) {
    invalid.push("integrations are enabled; rerun with --allow-integrations only after staging approval");
  }

  if (sheetsEnabled) {
    for (const name of ["GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SERVICE_ACCOUNT_JSON"]) requireValue(name);
    if (present("GOOGLE_SERVICE_ACCOUNT_JSON")) {
      try {
        const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
        if (!account.client_email || !account.private_key) invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is incomplete");
      } catch {
        invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
      }
    }
    if (target === "production" && env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() === CONTACT_STAGING_SPREADSHEET_ID) {
      invalid.push("GOOGLE_SHEETS_SPREADSHEET_ID points to the approved staging spreadsheet in production");
    }
  }

  if (clickUpEnabled) {
    for (const name of ["CLICKUP_API_TOKEN", ...CLICKUP_LIST_VARIABLES]) requireValue(name);
    for (const name of CLICKUP_LIST_VARIABLES) {
      if (present(name) && !/^\d+$/.test(env[name].trim())) invalid.push(`${name} must be numeric`);
      if (target === "production" && env[name]?.trim() === CONTACT_STAGING_CLICKUP_LIST_ID) {
        invalid.push(`${name} points to the approved staging ClickUp list in production`);
      }
    }
  }

  return {
    target,
    missing,
    invalid,
    integrationsEnabled,
    sheetsEnabled,
    clickUpEnabled,
    onboardingEnabled: onboardingEnabled === "true",
    translationsAutopublish,
    processingLeaseSeconds,
    databaseSsl: env.DATABASE_SSL === "true"
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = evaluateDeployPreflight(process.env, process.argv.slice(2));
  if (result.missing.length || result.invalid.length) {
    console.error(JSON.stringify({ event: "deploy_preflight_failed", target: result.target, missing: result.missing, invalid: result.invalid }));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ event: "deploy_preflight_passed", ...result }));
  }
}
