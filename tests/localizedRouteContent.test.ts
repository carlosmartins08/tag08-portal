import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("route rendering has no shortened foreign-language page fallback", () => {
  const routeContent = readFileSync(resolve("src/features/site/RouteContent.tsx"), "utf8");
  assert.doesNotMatch(routeContent, /LocalizedRoutePage/);
  assert.doesNotMatch(routeContent, /editorially localized content/);
});
