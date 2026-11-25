import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_POSTS } from "../src/data";
import { getRouteByPath, routeSitemapMeta } from "../src/config/routeRegistry";
import { buildArticleSchema, getRouteSeo } from "../src/lib/seo";
import { i18n } from "../src/i18n/siteI18n";

const ASSESSORIA_ROUTE = "/servicos/assessoria-marketing-digital-estrategico";

test("every insight follows the TAG08 editorial reading contract", () => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const post of BLOG_POSTS) {
    assert.ok(post.id.trim(), "An insight must have a stable id.");
    assert.ok(!ids.has(post.id), `Duplicate insight id: ${post.id}`);
    ids.add(post.id);

    assert.ok(post.slug.trim(), `${post.id} must have a stable slug.`);
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${post.id} slug must use URL-safe kebab-case.`);
    assert.ok(!slugs.has(post.slug), `Duplicate insight slug: ${post.slug}`);
    slugs.add(post.slug);

    assert.ok(post.title.trim(), `${post.id} must have an editorial title.`);
    assert.ok(post.excerpt.trim(), `${post.id} must have a summary.`);
    assert.ok(post.excerpt.length <= 260, `${post.id} summary must stay scannable in cards.`);
    assert.ok(post.author.trim(), `${post.id} must identify its editorial source.`);
    assert.ok(post.date.trim(), `${post.id} must expose a publication date.`);
    assert.ok((post.readingTime ?? post.readTime)?.trim(), `${post.id} must expose reading time.`);
    assert.match(post.image, /^https:\/\//, `${post.id} must provide a content image.`);

    const sections = post.content
      .trim()
      .split(/\r?\n\s*\r?\n/)
      .filter((block) => block.trim().startsWith("###"));
    const hasStructuredList = /^\s*(?:[-*]|\d+\.)\s+/m.test(post.content);
    assert.ok(sections.length >= 1 || hasStructuredList, `${post.id} must include a content section or structured list.`);
    assert.ok(post.content.trim().length > post.excerpt.length, `${post.id} needs an article body beyond its summary.`);

    assert.ok(getRouteByPath(post.relatedServicePath), `${post.id} must point to a resolvable related route.`);
    assert.ok(post.relatedServiceTitle.trim(), `${post.id} must name its related service.`);
    assert.ok(post.strategicSynthesis.problem.trim(), `${post.id} must state the problem it addresses.`);
    assert.ok(post.strategicSynthesis.nextStep.trim(), `${post.id} must state a practical next step.`);
    const articlePath = `/insights/${post.slug}`;
    const articleRoute = getRouteByPath(articlePath);
    assert.equal(articleRoute?.canonicalPath, articlePath, `${post.id} must have an individual canonical route.`);
    assert.equal(articleRoute?.indexable, true, `${post.id} must be indexable.`);
    assert.ok(routeSitemapMeta.some((entry) => entry.path === articlePath), `${post.id} must appear in the sitemap metadata.`);
    assert.deepEqual(getRouteSeo(articleRoute!, articlePath, "pt"), {
      title: `${post.title} | TAG08`,
      description: post.excerpt
    });
    assert.equal(buildArticleSchema(articlePath, "pt")?.headline, post.title);
    for (const relatedId of post.relatedInsights ?? []) {
      const related = BLOG_POSTS.find((candidate) => candidate.id === relatedId || candidate.slug === relatedId);
      assert.ok(related, `${post.id} has an unknown related insight: ${relatedId}`);
      assert.notEqual(related?.id, post.id, `${post.id} must not link to itself.`);
    }
  }
});

test("insight service labels match the approved Assessoria public name", () => {
  const approvedName = i18n.pt.header.servicePages.find(
    (service) => service.path === ASSESSORIA_ROUTE,
  )?.name;

  assert.ok(approvedName, "Assessoria must have an approved Portuguese public name.");

  const relatedInsights = BLOG_POSTS.filter(
    (post) => post.relatedServicePath === ASSESSORIA_ROUTE,
  );

  assert.ok(relatedInsights.length > 0, "Assessoria must retain its related insight records.");
  for (const post of relatedInsights) {
    assert.equal(post.relatedServiceTitle, approvedName, `${post.id} must use the approved related-service name.`);
    assert.equal(post.serviceTitle, approvedName, `${post.id} fallback must use the approved service name.`);
  }
});

test("consumer journey insight keeps its complete approved next-step question", () => {
  const post = BLOG_POSTS.find((candidate) => candidate.id === "jornada-do-consumidor-commerce-connections");

  assert.ok(post, "Consumer journey insight must remain available.");
  assert.equal(
    post.relatedObjection,
    "Revise seu calendário pela pergunta: o que a pessoa precisa compreender neste estágio?",
  );
});
