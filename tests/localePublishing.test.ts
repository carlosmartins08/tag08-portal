import assert from "node:assert/strict";
import test from "node:test";
import { INDEXABLE_LOCALES, isLocaleIndexable } from "../src/config/routeRegistry";

test("only human-reviewed locales are eligible for indexing", () => {
  assert.deepEqual(INDEXABLE_LOCALES, ["pt"]);
  assert.equal(isLocaleIndexable("pt"), true);
  assert.equal(isLocaleIndexable("en"), false);
  assert.equal(isLocaleIndexable("es"), false);
});
