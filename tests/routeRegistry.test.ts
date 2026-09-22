import assert from "node:assert/strict";
import { CASE_STUDIES } from "../src/data";
import { getVisibleEvidence } from "../src/content/publicEvidence";
import { canonicalizeRoute, getLocalizedPath, getRouteByPath, indexedRoutePaths, routeRegistry, routeSitemapMeta } from "../src/config/routeRegistry";
import { getRouteSeo } from "../src/lib/seo";
import { i18n } from "../src/i18n/siteI18n";

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

const assessoriaPath = "/servicos/assessoria-marketing-digital-estrategico";
const assessoriaRoute = getRouteByPath(assessoriaPath);
assert.ok(assessoriaRoute, "Assessoria route must resolve");
assert.equal(assessoriaRoute.title, "Assessoria de Marketing Estratégico | TAG08");
assert.equal(
  assessoriaRoute.description,
  "Assessoria de marketing estratégico para empresas que precisam organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
);
assert.deepEqual(getRouteSeo(assessoriaRoute, assessoriaPath, "pt"), {
  title: "Assessoria de Marketing Estratégico | TAG08",
  description: "Assessoria de marketing estratégico para empresas que precisam organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
});
assert.equal(
  i18n.pt.header.servicePages.find((service) => service.path === assessoriaPath)?.desc,
  "Diagnóstico, prioridades e planejamento de marketing"
);
assert.equal(
  i18n.pt.breadcrumbs.servicePages.find((service) => service.path === assessoriaPath)?.name,
  "Assessoria de Marketing Estratégico"
);

assert.deepEqual(
  CASE_STUDIES.filter((caseStudy) => getVisibleEvidence([caseStudy], (item) => `case-study/${item.id}`, `/casos/${caseStudy.id}`).length > 0),
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
