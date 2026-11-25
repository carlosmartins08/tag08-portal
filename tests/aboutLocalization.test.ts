import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/features/site/pages/Sobre.tsx", "utf8");

test("About page accepts the route locale and keeps Portuguese as default", () => {
  assert.match(page, /locale\?: RouteLocale/);
  assert.match(page, /locale = "pt"/);
  assert.match(page, /const ABOUT_COPY = \{\s*en:/);
  assert.match(page, /es:/);
});

test("About hero, team introduction, method, collaboration, and CTAs have EN/ES copy", () => {
  const requiredCopy = [
    "Sobre a TAG08",
    "Profissionais que podem integrar os projetos.",
    "Método na prática.",
    "Cultura e colaboração.",
    "Repertório de colaborações.",
    "Quer fazer parte do jeito TAG08 de trabalhar?",
    "O próximo passo começa pelo entendimento do momento atual.",
  ];

  for (const source of requiredCopy) {
    assert.ok(page.includes(`"${source}":`), `Missing EN/ES catalog entry for ${source}`);
  }

  assert.match(page, /t\("Falar com a TAG08"\)/);
  assert.match(page, /t\("Conhecer soluções"\)/);
  assert.match(page, /t\("Conhecer o Trabalhe Conosco"\)/);
});

test("team names, portraits, profile links, and evidence gates remain data driven", () => {
  assert.match(page, /getVisibleEvidence\(PRIMARY_PROFILES/);
  assert.match(page, /getVisibleEvidence\(COMPLEMENTARY_PROFILES/);
  assert.doesNotMatch(page, /EvidenceReviewBadge|content-review/i);
  assert.match(page, /href=\{visiblePrimaryProfiles\[0\]\.linkedin\}/);
  assert.match(page, /src=\{visiblePrimaryProfiles\[0\]\.photo\}/);
});

test("dynamic profiles, method principles, and collaboration copy use localized strings", () => {
  for (const expression of [
    "t(visiblePrimaryProfiles[0].role)",
    "t(visiblePrimaryProfiles[0].title)",
    "t(visiblePrimaryProfiles[0].description)",
    "t(member.label)",
    "t(member.role)",
    "t(member.description)",
    "t(profile.role)",
    "t(profile.description)",
    "t(principle.title)",
    "t(principle.description)",
    "t(block.area)",
    "t(block.support)",
    "t(block.title)",
    "t(block.description)",
    "t(requirement)",
  ]) {
    assert.ok(page.includes(expression), `Missing localized rendering for ${expression}`);
  }

  assert.match(page, /"Conteúdo, marketing e consultoria": "Content, marketing, and consulting"/);
  assert.match(page, /"Conteúdo, marketing e consultoria": "Contenido, marketing y consultoría"/);
  assert.match(page, /"Servidores, hospedagem e tecnologia": "Servers, hosting, and technology"/);
  assert.match(page, /"Servidores, hospedagem e tecnologia": "Servidores, alojamiento y tecnología"/);
});

test("every About copy key rendered from code data has EN and ES translations", () => {
  const copyStart = page.indexOf("const ABOUT_COPY =");
  const dynamicStart = page.indexOf("const ABOUT_DYNAMIC_COPY");
  const translatorStart = page.indexOf("const translateAbout =");
  const profilesStart = page.indexOf("const PRIMARY_PROFILES =");
  const collaborationTypeStart = page.indexOf("type CollaborationId");
  assert.ok(copyStart >= 0 && dynamicStart > copyStart && translatorStart > dynamicStart);
  assert.ok(profilesStart > translatorStart && collaborationTypeStart > profilesStart);

  const extractCatalogKeys = (source: string) => new Set(
    [...source.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]),
  );
  const copyKeys = extractCatalogKeys(page.slice(copyStart, dynamicStart));
  const dynamicKeys = extractCatalogKeys(page.slice(dynamicStart, translatorStart));
  const translationKeys = new Set([...copyKeys, ...dynamicKeys]);

  const renderedCalls = page.matchAll(/\bt\(([^)]*)\)/gs);
  const renderedKeys = [...renderedCalls].flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((value) => value[1]));
  const dataSource = page.slice(profilesStart, collaborationTypeStart);
  const dynamicValues = [...dataSource.matchAll(/\b(?:role|title|description|label|support|area):\s*"([^"]+)"/g)].map((match) => match[1]);
  const requirementLists = [...dataSource.matchAll(/requirements:\s*\[([^\]]*)\]/g)];
  const requirements = requirementLists.flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((value) => value[1]));
  const missing = [...new Set([...renderedKeys, ...dynamicValues, ...requirements])].filter((key) => !translationKeys.has(key));

  assert.deepEqual(missing, [], `About copy has untranslated source strings: ${missing.join(" | ")}`);
  assert.deepEqual(extractCatalogKeys(page.slice(copyStart, dynamicStart)), copyKeys);
  assert.deepEqual(extractCatalogKeys(page.slice(dynamicStart, translatorStart)), dynamicKeys);
  for (const key of [...copyKeys, ...dynamicKeys]) {
    const entryCount = page.split(`"${key}":`).length - 1;
    assert.equal(entryCount, 2, `Expected one EN and one ES translation for ${key}`);
  }
});

test("About fails closed instead of displaying Portuguese when an EN/ES key is missing", () => {
  assert.match(page, /if \(!translation\)\s*\{\s*throw new Error\(`Missing \$\{locale\} translation in About page copy catalog\.`\);\s*\}/);
  assert.doesNotMatch(page, /ABOUT_COPY\[locale\].*\?\?.*\?\? source/);
});

test("localized About CTAs only point to routes published in that language", () => {
  assert.match(page, /isRouteLocalePublished\(route, locale\)/);
  assert.match(page, /canNavigateToContact && <button/);
  assert.match(page, /canNavigateToServices && <button/);
  assert.match(page, /canNavigateToCareers && <button/);
});
