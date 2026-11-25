import assert from "node:assert/strict";
import test from "node:test";
import { isLocaleOptionAvailable, resolveLocaleNavigationPath } from "../src/i18n/languageAvailability.mjs";

test("Portuguese stays selectable on known and unknown routes", () => {
  assert.equal(isLocaleOptionAvailable("pt", { hasRoute: true, isPublished: true }), true);
  assert.equal(isLocaleOptionAvailable("pt", { hasRoute: false, isPublished: false }), true);
});

test("English and Spanish require a known route and a published translation", () => {
  for (const locale of ["en", "es"]) {
    assert.equal(isLocaleOptionAvailable(locale, { hasRoute: true, isPublished: false }), false);
    assert.equal(isLocaleOptionAvailable(locale, { hasRoute: false, isPublished: true }), false);
    assert.equal(isLocaleOptionAvailable(locale, { hasRoute: true, isPublished: true }), true);
  }
});

test("language switching keeps a translated route and falls back to the translated Home otherwise", () => {
  assert.equal(resolveLocaleNavigationPath("en", "/sobre", "/en", true), "/sobre");
  assert.equal(resolveLocaleNavigationPath("es", "/sobre", "/es", false), "/es");
  assert.equal(resolveLocaleNavigationPath("pt", "/sobre", "/", false), "/sobre");
});

test("the language selector has no editorial override path", async () => {
  const { readFile } = await import("node:fs/promises");
  const header = await readFile("src/components/Header.tsx", "utf8");
  const availability = await readFile("src/i18n/languageAvailability.mjs", "utf8");
  assert.doesNotMatch(header, /contentReviewMode|isContentReviewMode/);
  assert.doesNotMatch(availability, /review|draft/i);
});

test("the selector announces the action in the active UI language", async () => {
  const { readFile } = await import("node:fs/promises");
  const header = await readFile("src/components/Header.tsx", "utf8");
  const catalog = await readFile("src/i18n/siteI18n.ts", "utf8");
  assert.equal((header.match(/aria-label=\{`\$\{copy\.languageOptionLabel\} \$\{option\.name\}`\}/g) ?? []).length, 2);
  assert.match(catalog, /languageOptionLabel: "Browse in"/);
  assert.match(catalog, /languageOptionLabel: "Navegar en"/);
  assert.match(catalog, /languageOptionLabel: "Navegar em"/);
});

test("localized header and footer only link to routes published in the active language", async () => {
  const { readFile } = await import("node:fs/promises");
  const header = await readFile("src/components/Header.tsx", "utf8");
  const footer = await readFile("src/components/Footer.tsx", "utf8");

  assert.ok(header.includes("const isPathPublishedForLanguage = (path: string) =>"));
  assert.ok(header.includes(".filter((service) => isPathPublishedForLanguage(service.path))"));
  assert.ok(header.includes(".filter((link) => link.isDropdown"));
  assert.ok(header.includes("isPathPublishedForLanguage(link.path)"));
  assert.ok(header.includes("isRouteLocalePublished(homeRoute, candidate)"));
  assert.ok(header.includes("(serviceClusters.length > 0 || servicesHubIsPublished) && <div"));
  assert.ok(header.includes("{servicesHubIsPublished && <button"));
  assert.ok(header.includes("contactIsPublished && <button"));
  assert.ok(footer.includes("const isPathPublishedForLanguage = (path: string) =>"));
  assert.ok(footer.includes("getLocalizedPath(link.path, language)"));
  assert.ok(footer.includes("source.serviceLinks.filter((link) => isPathPublishedForLanguage(link.path))"));
  assert.ok(footer.includes("source.programLinks.filter((link) => isPathPublishedForLanguage(link.path))"));
  assert.ok(footer.includes("source.institutionLinks.filter((link) => isPathPublishedForLanguage(link.path))"));
  assert.ok(footer.includes("copy.serviceLinks.length > 0 && <div"));
  assert.ok(footer.includes("copy.programLinks.length > 0 && <div"));
  assert.ok(footer.includes("copy.institutionLinks.length > 0 && <div"));
  const shell = await readFile("src/features/site/SiteShell.tsx", "utf8");
  assert.ok(shell.includes("resolveLocaleNavigationPath("));
  assert.ok(shell.includes("getLocalizedPath(safePath, locale)"));
});
