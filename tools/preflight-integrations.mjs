const enabled = process.env.INTEGRATIONS_ENABLED === "true";
const sheetsEnabled = process.env.GOOGLE_SHEETS_ENABLED === "true";
const clickUpEnabled = process.env.CLICKUP_ENABLED === "true";
const missing = [];
const invalid = [];
const present = (name) => Boolean(process.env[name]?.trim());
const requireValue = (name) => {
  if (!present(name)) missing.push(name);
};

if (!enabled) {
  console.log(JSON.stringify({ event: "integration_preflight_disabled", integrationsEnabled: false }));
  process.exit(0);
}

if (!sheetsEnabled && !clickUpEnabled) invalid.push("INTEGRATIONS_ENABLED=true requires at least one integration target");

if (sheetsEnabled) {
  requireValue("GOOGLE_SHEETS_SPREADSHEET_ID");
  requireValue("GOOGLE_SERVICE_ACCOUNT_JSON");
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
  requireValue("CLICKUP_API_TOKEN");
  requireValue("CLICKUP_TALENT_LIST_ID");
  requireValue("CLICKUP_ONBOARDING_LIST_ID");
  for (const name of ["CLICKUP_TALENT_LIST_ID", "CLICKUP_ONBOARDING_LIST_ID"]) {
    if (present(name) && !/^\d+$/.test(process.env[name].trim())) invalid.push(`${name} must be numeric`);
  }
}

if (missing.length || invalid.length) {
  console.error(JSON.stringify({ event: "integration_preflight_failed", missing, invalid }));
  process.exit(1);
}

console.log(JSON.stringify({ event: "integration_preflight_passed", integrationsEnabled: true, sheetsEnabled, clickUpEnabled }));
