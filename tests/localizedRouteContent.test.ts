import assert from "node:assert/strict";
import test from "node:test";
import { renderableRoutePaths, getRouteByPath } from "../src/config/routeRegistry";
import { getLocalizedRouteCopy } from "../src/features/site/LocalizedRoutePage";

test("every public non-onboarding route has complete English and Spanish editorial copy", () => {
  for (const path of renderableRoutePaths) {
    const route = getRouteByPath(path);
    assert.ok(route, `${path} must resolve to a route`);
    if (route.key === "cliente-onboarding") continue;

    for (const locale of ["en", "es"] as const) {
      const copy = getLocalizedRouteCopy(locale, route.key);
      assert.ok(copy.title.length > 20, `${locale} ${route.key} needs a substantive title`);
      assert.ok(copy.description.length > 50, `${locale} ${route.key} needs a substantive description`);
      assert.equal(copy.outcomes.length, 3, `${locale} ${route.key} needs three value points`);
      assert.ok(copy.outcomes.every((outcome) => outcome.length > 12), `${locale} ${route.key} has incomplete outcomes`);
    }
  }
});
