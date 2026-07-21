import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

const health = await fetch(new URL("/api/onboarding/health", baseUrl));
assert.equal(health.status, 200, "Health endpoint is unavailable");

const healthBody = await health.json();
assert.equal(healthBody.ok, true, "Health endpoint did not confirm database availability");
assert.equal(healthBody.status, "online", "Health endpoint is not online");
assert.equal(healthBody.service, "tag08-onboarding-api", "Health endpoint returned an unexpected service");

const metrics = await fetch(new URL("/api/onboarding/metrics", baseUrl));
assert.equal(metrics.status, 401, "Operational metrics must require an internal token");

const internalApiToken = process.env.INTERNAL_API_TOKEN?.trim();
if (internalApiToken) {
  const authorizedMetrics = await fetch(new URL("/api/onboarding/metrics", baseUrl), {
    headers: { Authorization: `Bearer ${internalApiToken}` }
  });
  assert.equal(authorizedMetrics.status, 200, "Authorized operational metrics are unavailable");
  const metricsBody = await authorizedMetrics.json();
  assert.equal(metricsBody.ok, true, "Authorized operational metrics did not confirm success");
  for (const field of ["onboardingTotal", "onboardingAccepted", "failedDeliveries", "pendingDeliveries", "processingDeliveries"]) {
    assert.equal(typeof metricsBody[field], "number", `Operational metric ${field} is missing`);
  }
}

console.log(JSON.stringify({ event: "health_verification_passed" }));
