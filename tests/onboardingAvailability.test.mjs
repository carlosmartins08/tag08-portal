import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isOnboardingEnabled } from "../server/onboardingAvailability.mjs";

assert.equal(isOnboardingEnabled({ NODE_ENV: "production" }), false);
assert.equal(isOnboardingEnabled({ NODE_ENV: "development" }), true);
assert.equal(isOnboardingEnabled({ NODE_ENV: "test" }), true);
assert.equal(isOnboardingEnabled({ NODE_ENV: "production", ONBOARDING_ENABLED: "true" }), true);
assert.equal(isOnboardingEnabled({ NODE_ENV: "development", ONBOARDING_ENABLED: "false" }), false);
assert.equal(isOnboardingEnabled({ NODE_ENV: "production", ONBOARDING_ENABLED: "yes" }), false);

const guardedFiles = [
  "src/app/[locale]/cliente/onboarding/page.tsx",
  "src/app/api/onboarding/route.ts",
  "src/app/api/onboarding/access/redeem/route.ts",
  "src/app/api/onboarding/progress/route.ts",
  "src/app/api/onboarding/session/route.ts",
  "src/app/api/onboarding/health/route.ts",
  "src/app/api/onboarding/metrics/route.ts"
];

for (const file of guardedFiles) {
  const source = readFileSync(file, "utf8");
  assert.match(source, /isOnboardingEnabled\(\)/, `${file} must enforce the release gate`);
}

const preflight = readFileSync("tools/preflight-deploy.mjs", "utf8");
assert.match(preflight, /ONBOARDING_ENABLED must be explicitly set/);
assert.match(preflight, /target === "production" && onboardingEnabled !== "false"/);
assert.match(readFileSync("tools/verify-routes.ts", "utf8"), /path === "\/cliente\/onboarding" && !onboardingEnabled \? 404 : 200/);
assert.match(readFileSync("tools/verify-health.mjs", "utf8"), /if \(!isOnboardingEnabled\(\)\)[\s\S]*onboarding_disabled_verified/);
assert.match(readFileSync("tools/onboarding-access.ts", "utf8"), /if \(!isOnboardingEnabled\(\)\) throw new Error\("onboarding_disabled"\)/);

console.log("onboardingAvailability: PASS (6 policy cases, 7 guarded entry points, route/health verifiers, production preflight, admin CLI)");
