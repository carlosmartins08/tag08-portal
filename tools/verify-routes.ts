import assert from "node:assert/strict";
import {
  getLocalizedPath,
  getRouteByPath,
  isRouteLocalePublished,
  renderableRoutePaths,
  routeRegistry
} from "../src/config/routeRegistry";
import { isOnboardingEnabled } from "../server/onboardingAvailability.mjs";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const onboardingEnabled = isOnboardingEnabled();

const check = async (path: string, expectedStatus: number) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert.equal(response.status, expectedStatus, `${path} returned ${response.status}`);
  return response;
};

const checkDisabledLocalizedOnboarding = async (path: string) => {
  const redirect = await check(path, 308);
  const location = redirect.headers.get("location");
  assert.ok(location, `${path} must redirect unpublished onboarding locales to Portuguese`);

  const target = new URL(location, baseUrl);
  assert.equal(target.origin, new URL(baseUrl).origin, `${path} must not redirect outside the local origin`);
  assert.equal(target.pathname, "/cliente/onboarding", `${path} must redirect to the canonical Portuguese onboarding route`);
  assert.equal(target.search, "", `${path} must not carry locale-specific query data to onboarding`);
  await check(target.pathname, 404);
};

for (const path of renderableRoutePaths) {
  await check(path, path === "/cliente/onboarding" && !onboardingEnabled ? 404 : 200);
  const route = getRouteByPath(path);
  assert.ok(route, `Missing route registry entry for ${path}`);

  for (const locale of ["en", "es"] as const) {
    const localizedPath = getLocalizedPath(path, locale);
    const isPublished = isRouteLocalePublished(route, locale);
    if (path === "/cliente/onboarding") continue;
    await check(localizedPath, isPublished ? 200 : 308);
  }
}

for (const route of routeRegistry) {
  for (const alias of route.aliases || []) {
    const response = await check(alias, 308);
    assert.equal(response.headers.get("location"), route.canonicalPath);
  }
}

const onboardingRoute = getRouteByPath("/cliente/onboarding");
assert.ok(onboardingRoute, "The protected onboarding route must remain registered");
for (const locale of ["en", "es"] as const) {
  const localizedPath = getLocalizedPath(onboardingRoute.canonicalPath, locale);
  if (onboardingEnabled) {
    const response = await check(localizedPath, 308);
    const location = response.headers.get("location");
    assert.ok(location, `${localizedPath} must redirect to the Portuguese onboarding route`);
    const target = new URL(location, baseUrl);
    assert.equal(target.origin, new URL(baseUrl).origin);
    assert.equal(target.pathname, onboardingRoute.canonicalPath);
  } else {
    await checkDisabledLocalizedOnboarding(localizedPath);
  }
}

const languageRedirect = await check("/sobre?lang=en&utm_source=route-check", 308);
assert.equal(languageRedirect.headers.get("location"), "/en/sobre?utm_source=route-check");
await check("/not-a-route", 404);
await check("/robots.txt", 200);
await check("/sitemap.xml", 200);

const llmsTxt = await check("/llms.txt", 200);
assert.match(llmsTxt.headers.get("content-type") || "", /^text\/plain;\s*charset=utf-8/i);
assert.match(await llmsTxt.text(), /^# TAG08\s/m);
