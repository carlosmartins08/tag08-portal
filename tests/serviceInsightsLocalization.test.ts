import assert from "node:assert/strict";
import test from "node:test";
import { editorialLocaleMatches, getServiceInsightsBridgeConfig, SERVICE_INSIGHTS_BRIDGE_CONTENT } from "../src/content/serviceInsightsBridge.ts";

test("service editorial bridge copy is available in all supported locales", () => {
  const en = getServiceInsightsBridgeConfig("/servicos/desenvolvimento-web", "en");
  const es = getServiceInsightsBridgeConfig("/servicos/desenvolvimento-web", "es");
  const pt = getServiceInsightsBridgeConfig("/servicos/desenvolvimento-web", "pt");

  assert.match(en?.title ?? "", /^Readings/);
  assert.match(es?.title ?? "", /^Lecturas/);
  assert.equal(pt?.serviceTitle, "Desenvolvimento Web");
});

test("editorial cards are only eligible for the route's language", () => {
  assert.equal(editorialLocaleMatches("en", "en"), true);
  assert.equal(editorialLocaleMatches("en-US", "en"), true);
  assert.equal(editorialLocaleMatches("pt-BR", "pt"), true);
  assert.equal(editorialLocaleMatches("pt-BR", "en"), false);
  assert.equal(editorialLocaleMatches("es-MX", "es"), true);
  assert.equal(editorialLocaleMatches("", "es"), false);
});

test("unknown contextual services remain absent", () => {
  assert.equal(getServiceInsightsBridgeConfig("/not-a-service", "en"), null);
});

test("every configured contextual bridge has explicit EN and ES headings and summaries", () => {
  for (const path of Object.keys(SERVICE_INSIGHTS_BRIDGE_CONTENT)) {
    for (const locale of ["en", "es"] as const) {
      const localized = getServiceInsightsBridgeConfig(path, locale);
      assert.ok(localized?.title, `${path} must have a ${locale} title`);
      assert.ok(localized?.intro, `${path} must have a ${locale} introduction`);
      assert.notEqual(localized?.title, SERVICE_INSIGHTS_BRIDGE_CONTENT[path].title);
      assert.notEqual(localized?.intro, SERVICE_INSIGHTS_BRIDGE_CONTENT[path].intro);
    }
  }
});
