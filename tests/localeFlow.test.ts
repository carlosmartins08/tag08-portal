import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("conversion forms receive the route locale instead of reading document.lang", () => {
  const contact = readFileSync("src/features/site/pages/Contato.tsx", "utf8");
  const talent = readFileSync("src/features/site/pages/TrabalheConosco.tsx", "utf8");
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");

  assert.doesNotMatch(contact, /document\.documentElement\.lang/);
  assert.doesNotMatch(talent, /document\.documentElement\.lang/);
  assert.match(routeContent, /<Contato locale=\{locale\}/);
  assert.match(routeContent, /<TrabalheConosco onNavigate=\{navigate\} locale=\{locale\}/);
});

test("localized program pages receive the route locale", () => {
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");

  assert.match(routeContent, /<Sebraetec onNavigate=\{navigate\} locale=\{locale\}/);
  assert.match(routeContent, /<ProgramaAfiliados[^\n]*locale=\{locale\}/);
  assert.match(routeContent, /<AssessoriaMarketingDigitalEstrategico onNavigate=\{navigate\} locale=\{locale\}/);
});

test("the localized 404 receives its locale and keeps internal navigation localized", () => {
  const route = readFileSync("src/features/site/NotFoundRoute.tsx", "utf8");
  const page = readFileSync("src/features/site/pages/NotFound.tsx", "utf8");
  const catalog = readFileSync("src/i18n/notFoundCopy.ts", "utf8");

  assert.match(route, /useParams/);
  assert.match(route, /getLocalizedPath\(path, routeLocale\)/);
  assert.match(page, /getNotFoundCopy\(locale\)/);
  assert.match(page, /buildBrazilWhatsAppUrl\(copy\.supportMessage\)/);
  assert.match(catalog, /editorialOverrides/);
});

test("language selector labels follow the active interface language", () => {
  const header = readFileSync("src/components/Header.tsx", "utf8");
  const catalog = readFileSync("src/i18n/siteI18n.ts", "utf8");
  assert.match(header, /aria-label=\{copy\.languageLabel\}/);
  assert.match(header, /copy\.openMenuLabel/);
  assert.match(header, /copy\.primaryNavigationLabel/);
  assert.match(catalog, /skipToContentLabel: "Skip to content"/);
  assert.match(catalog, /openMenuLabel: "Open navigation menu"/);
  assert.match(catalog, /closeMenuLabel: "Cerrar menú de navegación"/);
  assert.match(header, /<p className=\"tag08-meta[^\"]*\">\{copy\.languageLabel\}<\/p>/);
});

test("language switching preserves the current query and fragment", () => {
  const shell = readFileSync("src/features/site/SiteShell.tsx", "utf8");
  assert.match(shell, /router\.push\(`\$\{safePath\}\$\{window\.location\.search\}\$\{window\.location\.hash\}`\)/);
});

test("privacy page receives the route locale and has copy for both foreign locales", () => {
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");
  const privacy = readFileSync("src/features/site/pages/Privacidade.tsx", "utf8");
  assert.match(routeContent, /<Privacidade onNavigate=\{navigate\} locale=\{locale\}/);
  assert.match(privacy, /en: \{/);
  assert.match(privacy, /es: \{/);
  assert.match(privacy, /locale = "pt"/);
});

test("Process Activation receives the route locale instead of assuming Portuguese", () => {
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");
  const processActivation = readFileSync("src/features/site/pages/ProcessActivation.tsx", "utf8");
  assert.match(routeContent, /<ProcessActivation onNavigate=\{navigate\} locale=\{locale\}/);
  assert.match(processActivation, /locale\?: RouteLocale/);
  assert.match(processActivation, /PROCESS_ACTIVATION_COPY/);
});

test("one renderer applies published locale gates without local review placeholders", () => {
  const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");
  const shell = readFileSync("src/features/site/SiteShell.tsx", "utf8");
  assert.doesNotMatch(routeContent, /translationReviewGate|locale-translation-pending|REVISI/);
  assert.doesNotMatch(shell, /ContentReviewBanner/);
});

test("unapproved locale drafts stay noindex and canonicalize to the published Portuguese route", () => {
  const page = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");

  assert.match(page, /const localePublished = isRouteLocalePublished\(route, locale\)/);
  assert.match(page, /getAbsoluteLocalizedUrl\(canonicalPath, localePublished \? locale : "pt"\)/);
  assert.match(page, /route\.indexable && localePublished/);
  assert.match(page, /if \(!isRouteLocalePublished\(route, locale\)\)/);
});

test("Insights render localized drafts while route publication still requires approval", () => {
  const insights = readFileSync("src/features/site/pages/Insights.tsx", "utf8");
  const routePage = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");
  const seo = readFileSync("src/lib/seo.ts", "utf8");

  assert.match(insights, /localizeInsightPost/);
  assert.match(insights, /translatedPosts/);
  assert.doesNotMatch(insights, /The existing articles have not yet been translated and reviewed/);
  assert.match(routePage, /if \(!isRouteLocalePublished\(route, locale\)\)/);
  assert.match(seo, /getLocalizedInsightBySlug/);
});
