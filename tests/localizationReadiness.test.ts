import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { routeRegistry } from "../src/config/routeRegistry";
import { isLocaleTranslationReady, localizationReadiness } from "../src/i18n/localizationReadiness";

const fingerprint = (files: readonly string[]) => {
  const hash = createHash("sha256");
  for (const file of [...files].sort()) {
    const source = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    hash.update(file).update("\0").update(source).update("\0");
  }
  return hash.digest("hex");
};

test("every route has a localization ownership record", () => {
  for (const route of routeRegistry) {
    const readiness = localizationReadiness[route.key];
    assert.ok(readiness, `${route.key} has no localization readiness record`);
    assert.ok(readiness.sourceFiles.length > 0, `${route.key} has no localization source manifest`);
    for (const sourceFile of readiness.sourceFiles) {
      assert.ok(existsSync(sourceFile), `${route.key} source manifest points to missing file ${sourceFile}`);
    }
  }
});

test("every approved foreign locale has a review matching all current route sources", () => {
  for (const route of routeRegistry) {
    const entry = localizationReadiness[route.key];
    for (const locale of ["en", "es"] as const) {
      if (entry.locales[locale].state !== "approved") continue;

      assert.equal(isLocaleTranslationReady(route.key, locale), true, `${route.key} ${locale} is not approved`);
      assert.equal(fingerprint(entry.sourceFiles), entry.sourceFingerprint, `${route.key} source manifest changed and needs a new translation review`);
      assert.equal(entry.locales[locale].sourceFingerprint, entry.sourceFingerprint, `${route.key} ${locale} review fingerprint is stale`);
    }
  }
});

test("shared shell, navigation, and SEO sources participate in every route review", () => {
  const sharedSources = [
    "src/features/site/RouteContent.tsx",
    "src/features/site/SiteShell.tsx",
    "src/components/Header.tsx",
    "src/components/Footer.tsx",
    "src/components/Breadcrumbs.tsx",
    "src/components/WhatsAppButton.tsx",
    "src/i18n/siteI18n.ts",
    "src/config/routeRegistry.ts",
    "src/lib/seo.ts",
    "src/i18n/languageAvailability.mjs",
    "src/app/[locale]/[[...segments]]/page.tsx",
    "src/app/sitemap.ts"
  ];

  for (const route of routeRegistry) {
    const sources = localizationReadiness[route.key].sourceFiles;
    for (const sharedSource of sharedSources) {
      assert.ok(sources.includes(sharedSource), `${route.key} does not fingerprint shared source ${sharedSource}`);
    }
  }
});

test("route-specific content dependencies are included in their review manifests", () => {
  assert.ok(localizationReadiness.home.sourceFiles.includes("src/i18n/homeCopy.ts"));
  assert.ok(localizationReadiness.home.sourceFiles.includes("src/content/publicEvidence.ts"));
  assert.ok(localizationReadiness.insights.sourceFiles.includes("src/data.ts"));
  assert.ok(localizationReadiness.insights.sourceFiles.includes("src/features/site/pages/insightsTranslations.ts"));
  assert.ok(localizationReadiness["case-study-detail"].sourceFiles.includes("src/content/publicEvidence.ts"));
  assert.ok(localizationReadiness["hospedagem-manutencao-sites"].sourceFiles.includes("src/lib/simulators/hostingPrice.ts"));
  assert.ok(localizationReadiness.home.sourceFiles.includes("src/lib/officialContent.ts"));
  assert.ok(localizationReadiness["servicos-process-activation"].sourceFiles.includes("src/lib/simulators/processActivation.ts"));

  const routesUsingEditorialBridge = [
    "servicos-process-intelligence",
    "servicos-process-activation",
    "servicos-desenvolvimento-web",
    "servicos-branding-identidade",
    "servicos-gestao-redes-sociais",
    "servicos-producao-audiovisual",
    "servicos-assessoria-marketing-digital-estrategico",
    "programa-afiliados",
    "hospedagem-manutencao-sites"
  ] as const;

  for (const routeKey of routesUsingEditorialBridge) {
    const sources = localizationReadiness[routeKey].sourceFiles;
    assert.ok(sources.includes("src/components/ServiceInsightsBridge.tsx"), `${routeKey} does not fingerprint the editorial bridge component`);
    assert.ok(sources.includes("src/content/serviceInsightsBridge.ts"), `${routeKey} does not fingerprint editorial bridge copy`);
  }
});

test("the hosting service route passes the selected locale to its page", () => {
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");
  assert.match(routeContent, /HospedagemManutencaoSites onNavigate=\{navigate\} locale=\{locale\}/);
});
