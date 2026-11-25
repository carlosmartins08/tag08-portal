import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { INDEXABLE_LOCALES, getIndexableLocales, getPublishedLocales, isLocaleIndexable, isRouteLocalePublished, routeRegistry } from "../src/config/routeRegistry";

test("translated public routes are browsable while EN/ES indexing stays disabled", () => {
  const visitorRouteKeys = new Set([
    "home", "sobre", "servicos", "servicos-process-intelligence", "servicos-process-activation",
    "servicos-desenvolvimento-web", "servicos-branding-identidade", "servicos-gestao-redes-sociais",
    "servicos-producao-audiovisual", "contato", "privacidade", "trabalhe-conosco", "insights",
    "sebraetec-impulsionando-empreendedores", "programa-afiliados", "hospedagem-manutencao-sites",
    "servicos-assessoria-marketing-digital-estrategico"
  ]);

  assert.deepEqual(INDEXABLE_LOCALES, ["pt"]);
  assert.equal(isLocaleIndexable("pt"), true);
  assert.equal(isLocaleIndexable("en"), false);
  assert.equal(isLocaleIndexable("es"), false);

  const routePage = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  const seo = readFileSync("src/lib/seo.ts", "utf8");
  assert.match(routePage, /route\.indexable && localePublished && isLocaleIndexable\(locale\)/);
  assert.match(sitemap, /getIndexableLocales\(route\)/);
  assert.match(seo, /getIndexableLocales\(route\)/);

  for (const route of routeRegistry.filter((entry) => entry.key !== "not-found")) {
    const expected = visitorRouteKeys.has(route.key) ? ["pt", "en", "es"] : ["pt"];
    assert.deepEqual(getPublishedLocales(route), expected, `${route.key} visitor language availability`);
    assert.deepEqual(getIndexableLocales(route), ["pt"], `${route.key} must stay out of EN/ES search indexing`);
    assert.equal(isRouteLocalePublished(route, "en"), visitorRouteKeys.has(route.key), `${route.key} EN availability`);
    assert.equal(isRouteLocalePublished(route, "es"), visitorRouteKeys.has(route.key), `${route.key} ES availability`);
  }

  const privacy = routeRegistry.find((entry) => entry.key === "privacidade");
  assert.ok(privacy);
  assert.equal(privacy.indexable, false, "the provisional privacy summary must remain noindex");
  assert.deepEqual(getPublishedLocales(privacy), ["pt", "en", "es"]);

  for (const restrictedKey of ["case-study-detail", "cliente-onboarding"] as const) {
    const route = routeRegistry.find((entry) => entry.key === restrictedKey);
    assert.ok(route);
    assert.deepEqual(getPublishedLocales(route), ["pt"], `${restrictedKey} remains outside the translated public rollout`);
  }
});
