import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_POSTS } from "../src/data";
import { INSIGHTS_TRANSLATIONS, INSIGHTS_UI, getInsightTranslation, getInsightsUiCopy, localizeInsightPost } from "../src/features/site/pages/insightsTranslations";

test("EN and ES draft catalogs cover every current Insight without changing source identity", () => {
  assert.equal(BLOG_POSTS.length, 19);

  for (const locale of ["en", "es"] as const) {
    const translations = INSIGHTS_TRANSLATIONS[locale];
    assert.deepEqual(Object.keys(translations).sort(), BLOG_POSTS.map(({ slug }) => slug).sort());

    for (const source of BLOG_POSTS) {
      const sourceSnapshot = structuredClone(source);
      const translated = getInsightTranslation(source, locale);
      for (const field of ["title", "excerpt", "content", "category", "serviceTitle", "author", "readingTime"] as const) {
        assert.ok(translated[field].trim().length > 0, `${locale}:${source.slug}:${field} is empty`);
      }
      assert.ok(translated.content.length >= 30, `${locale}:${source.slug}:content is incomplete`);
      assert.doesNotMatch(translated.content, /â€œ|â€/, `${locale}:${source.slug}: contains corrupted quotation marks`);

      const localized = localizeInsightPost(source, locale);
      assert.equal(localized.id, source.id);
      assert.equal(localized.slug, source.slug);
      assert.equal(localized.image, source.image);
      assert.equal(localized.servicePath, source.servicePath);
      assert.equal(localized.relatedServicePath, source.relatedServicePath);
      assert.deepEqual(localized.relatedInsights, source.relatedInsights);
      assert.equal(localized.relatedServiceTitle, translated.serviceTitle);
      assert.notEqual(localized.title, source.title);
      assert.notEqual(localized.content, source.content);
      assert.notEqual(localized.category, source.category);
      assert.deepEqual(source, sourceSnapshot, `${source.slug} Portuguese source was mutated`);
    }
  }
});

test("translated Insights shell supplies localized filters, navigation labels, and next-step copy", () => {
  for (const locale of ["en", "es"] as const) {
    const ui = INSIGHTS_UI[locale];
    assert.equal(ui.categories.length, 6);
    assert.equal(ui.categories[0], locale === "en" ? "All" : "Todos");
    for (const field of ["hubTitle", "hubDescription", "filterLabel", "filterAria", "featured", "readFeatured", "moreReads", "read", "empty", "showAll", "nextStepTitle", "nextStep", "nextStepCta", "outline", "recommended", "understand", "back", "related", "date", "reading", "author"] as const) {
      assert.ok(ui[field].trim().length > 0, `${locale}:UI:${field} is empty`);
    }
    const { hubTitle: _missing, ...incompleteDictionary } = ui;
    assert.throws(() => getInsightsUiCopy(locale, "hubTitle", incompleteDictionary), /Missing .* Insights UI string/);
    assert.equal(getInsightsUiCopy(locale, "hubTitle"), ui.hubTitle);
  }
});
