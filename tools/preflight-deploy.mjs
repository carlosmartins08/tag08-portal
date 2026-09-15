import "dotenv/config";

const target = process.argv.includes("--production") ? "production" : "staging";
const allowIntegrations = process.argv.includes("--allow-integrations");
const missing = [];
const invalid = [];
const present = (name) => Boolean(process.env[name]?.trim());
const requireValue = (name) => {
  if (!present(name)) missing.push(name);
};

for (const name of ["DATABASE_URL", "ALLOWED_ORIGINS", "INTERNAL_API_TOKEN"]) requireValue(name);

if (present("DATABASE_URL")) {
  try {
    const databaseUrl = new URL(process.env.DATABASE_URL);
    if (!databaseUrl.protocol.startsWith("postgres")) invalid.push("DATABASE_URL must use a PostgreSQL URL");
    if (["localhost", "127.0.0.1", "postgres"].includes(databaseUrl.hostname)) {
      invalid.push("DATABASE_URL must point to the remote PostgreSQL service for staging or production");
    }
  } catch {
    invalid.push("DATABASE_URL is not a valid URL");
  }
}

if (present("ALLOWED_ORIGINS")) {
  for (const origin of process.env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean)) {
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

const integrationsEnabled = process.env.INTEGRATIONS_ENABLED === "true";
const sheetsEnabled = process.env.GOOGLE_SHEETS_ENABLED === "true";
const clickUpEnabled = process.env.CLICKUP_ENABLED === "true";
const processingLeaseSeconds = Number.parseInt(process.env.INTEGRATION_PROCESSING_LEASE_SECONDS || "900", 10);
const deliveryIdFilter = process.env.INTEGRATION_DELIVERY_ID?.trim();
const retentionAggregateIdFilter = process.env.RETENTION_AGGREGATE_ID?.trim();
const translationsAutopublish = process.env.TRANSLATIONS_AUTOPUBLISH === "true";

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
      const translationUrl = new URL(process.env.TRANSLATION_SERVICE_URL);
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
      const account = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (!account.client_email || !account.private_key) invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is incomplete");
    } catch {
      invalid.push("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
  }
}

if (clickUpEnabled) {
  for (const name of ["CLICKUP_API_TOKEN", "CLICKUP_TALENT_LIST_ID", "CLICKUP_ONBOARDING_LIST_ID"]) requireValue(name);
}

if (missing.length || invalid.length) {
  console.error(JSON.stringify({ event: "deploy_preflight_failed", target, missing, invalid }));
  process.exit(1);
}

console.log(JSON.stringify({
  event: "deploy_preflight_passed",
  target,
  integrationsEnabled,
  sheetsEnabled,
  clickUpEnabled,
  translationsAutopublish,
  processingLeaseSeconds,
  databaseSsl: process.env.DATABASE_SSL === "true"
}));
