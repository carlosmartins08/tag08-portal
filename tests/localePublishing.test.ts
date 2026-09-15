import assert from "node:assert/strict";
import test from "node:test";
import { INDEXABLE_LOCALES, getPublishedLocales, getRouteByPath, isLocaleIndexable, isRouteLocalePublished } from "../src/config/routeRegistry";

test("only routes with complete, reviewed copy are published outside Portuguese", () => {
  assert.deepEqual(INDEXABLE_LOCALES, ["pt"]);
  assert.equal(isLocaleIndexable("pt"), true);
  assert.equal(isLocaleIndexable("en"), false);
  assert.equal(isLocaleIndexable("es"), false);

  const home = getRouteByPath("/");
  const onboarding = getRouteByPath("/cliente/onboarding");
  assert.ok(home);
  assert.ok(onboarding);
  assert.deepEqual(getPublishedLocales(home), ["pt"]);
  assert.equal(isRouteLocalePublished(home, "en"), false);
  assert.deepEqual(getPublishedLocales(onboarding), ["pt", "en", "es"]);
  assert.equal(isRouteLocalePublished(onboarding, "en"), true);
});
