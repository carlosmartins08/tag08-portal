import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { routeRegistry } from "../src/config/routeRegistry";
import { isLocaleTranslationReady, localizationReadiness } from "../src/i18n/localizationReadiness";

const fingerprint = (file: string) => createHash("sha256").update(readFileSync(file, "utf8").replace(/\r\n/g, "\n")).digest("hex");

test("every route has a localization ownership record", () => {
  for (const route of routeRegistry) {
    assert.ok(localizationReadiness[route.key], `${route.key} has no localization readiness record`);
  }
});

test("a published foreign locale has an approved review for the current source content", () => {
  for (const route of routeRegistry) {
    const entry = localizationReadiness[route.key];
    for (const locale of route.publishedLocales || ["pt"] as const) {
      if (locale === "pt") continue;

      assert.equal(isLocaleTranslationReady(route.key, locale), true, `${route.key} ${locale} is not approved`);
      assert.equal(fingerprint(entry.sourceFile), entry.sourceFingerprint, `${route.key} source changed and needs a new translation review`);
    }
  }
});
