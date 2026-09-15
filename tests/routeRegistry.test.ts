import assert from "node:assert/strict";
import { CASE_STUDIES } from "../src/data";
import { PUBLIC_EVIDENCE_STATUS, getApprovedEvidence } from "../src/content/publicEvidence";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, indexedRoutePaths, routeRegistry, routeSitemapMeta } from "../src/config/routeRegistry";

for (const route of routeRegistry.filter((entry) => entry.key !== "not-found" && !entry.dynamic)) {
  const canonical = canonicalizeRoute(route.canonicalPath);
  assert.equal(canonical, route.canonicalPath, `Canonical path changed for ${route.key}`);
  assert.ok(getRouteByPath(canonical), `Route not resolvable for ${route.key}`);
  assert.ok(getLocalizedPath(canonical, "en").startsWith("/en"), `English path missing prefix for ${route.key}`);
  assert.ok(getLocalizedPath(canonical, "es").startsWith("/es"), `Spanish path missing prefix for ${route.key}`);

  for (const alias of route.aliases || []) {
    assert.equal(canonicalizeRoute(alias), route.canonicalPath, `Alias does not resolve: ${alias}`);
  }
}

for (const path of indexedRoutePaths) {
  assert.ok(!routeRegistry.some((route) => route.aliases?.includes(path)), `Alias leaked into sitemap: ${path}`);
}

assert.ok(
  Object.values(PUBLIC_EVIDENCE_STATUS).every((status) => status === "pending"),
  "Sensitive public evidence must remain pending until an approval is recorded"
);
assert.deepEqual(
  getApprovedEvidence(CASE_STUDIES, (caseStudy) => `case-study/${caseStudy.id}`),
  [],
  "Unapproved cases must not be eligible for publication"
);
assert.ok(
  CASE_STUDIES.every((caseStudy) => getRouteByPath(`/casos/${caseStudy.id}`) === undefined),
  "Unapproved cases must not resolve as public routes"
);
assert.ok(
  !indexedRoutePaths.some((path) => path.startsWith("/casos/")) &&
    !routeSitemapMeta.some((entry) => entry.path.startsWith("/casos/")),
  "Unapproved cases must not enter the sitemap"
);
