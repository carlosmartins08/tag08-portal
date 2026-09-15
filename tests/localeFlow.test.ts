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
