import assert from "node:assert/strict";
import test from "node:test";
import { hasMatchingProtectedTokens, validateTranslationBundle, type TranslationBundle, type TranslationSegment } from "../src/i18n/translationContract";

const source: TranslationSegment[] = [
  { id: "cta", text: "Fale com a TAG08 em {minutes} minutos: https://tag08.com.br/contato" }
];

test("translation bundles reject missing keys and altered protected tokens", () => {
  const valid: TranslationBundle = {
    schemaVersion: 1,
    route: "home",
    locale: "en",
    sourceLocale: "pt",
    sourceHash: "test",
    engineVersion: "test",
    generatedAt: "2026-01-01T00:00:00.000Z",
    segments: { cta: "Talk to TAG08 in {minutes} minutes: https://tag08.com.br/contato" }
  };
  assert.deepEqual(validateTranslationBundle(valid, source), []);
  assert.equal(hasMatchingProtectedTokens(source[0].text, "Talk to TAG08 in five minutes"), false);
  assert.match(validateTranslationBundle({ ...valid, segments: {} }, source)[0], /^missing_segment/);
});
