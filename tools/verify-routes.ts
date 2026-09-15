import assert from "node:assert/strict";
import {
  getLocalizedPath,
  getRouteByPath,
  isRouteLocalePublished,
  renderableRoutePaths,
  routeRegistry
} from "../src/config/routeRegistry";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const check = async (path: string, expectedStatus: number) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert.equal(response.status, expectedStatus, `${path} returned ${response.status}`);
  return response;
};

for (const path of renderableRoutePaths) {
  await check(path, 200);
  const route = getRouteByPath(path);
  assert.ok(route, `Missing route registry entry for ${path}`);

  for (const locale of ["en", "es"] as const) {
    const localizedPath = getLocalizedPath(path, locale);
    const isPublished = isRouteLocalePublished(route, locale);
    await check(localizedPath, isPublished ? 200 : 308);
  }
}

for (const route of routeRegistry) {
  for (const alias of route.aliases || []) {
    const response = await check(alias, 308);
    assert.equal(response.headers.get("location"), route.canonicalPath);
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
