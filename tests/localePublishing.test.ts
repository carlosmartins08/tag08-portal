import assert from "node:assert/strict";
import test from "node:test";
import { INDEXABLE_LOCALES, getPublishedLocales, isLocaleIndexable, isRouteLocalePublished, routeRegistry } from "../src/config/routeRegistry";

test("only routes with complete, reviewed copy are published outside Portuguese", () => {
  assert.deepEqual(INDEXABLE_LOCALES, ["pt"]);
  assert.equal(isLocaleIndexable("pt"), true);
  assert.equal(isLocaleIndexable("en"), false);
  assert.equal(isLocaleIndexable("es"), false);

  for (const route of routeRegistry.filter((entry) => entry.key !== "not-found")) {
    assert.deepEqual(getPublishedLocales(route), ["pt"], `${route.key} must remain PT-only until approved`);
    assert.equal(isRouteLocalePublished(route, "en"), false, `${route.key} must not bypass EN readiness`);
    assert.equal(isRouteLocalePublished(route, "es"), false, `${route.key} must not bypass ES readiness`);
  }
});
