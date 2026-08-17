import assert from "node:assert/strict";
import test from "node:test";
import { INDEXABLE_LOCALES, isLocaleIndexable } from "../src/config/routeRegistry";

test("all published locales are eligible for indexing", () => {
  assert.deepEqual(INDEXABLE_LOCALES, ["pt", "en", "es"]);
  assert.equal(isLocaleIndexable("pt"), true);
  assert.equal(isLocaleIndexable("en"), true);
  assert.equal(isLocaleIndexable("es"), true);
});
