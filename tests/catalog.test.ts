import assert from "node:assert/strict";
import test from "node:test";
import { flattenCatalog, inflateCatalog } from "../src/i18n/catalog";

test("catalogs retain deterministic segment keys through flattening", () => {
  const source = { cta: { label: "Falar conosco" }, benefits: ["Clareza", "Direção"] };
  const flat = flattenCatalog(source);
  assert.deepEqual(flat.map((segment) => segment.id), ["cta.label", "benefits.0", "benefits.1"]);
  assert.deepEqual(inflateCatalog(Object.fromEntries(flat.map((segment) => [segment.id, segment.text]))), source);
});
