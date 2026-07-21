import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_POSTS } from "../src/data";
import { getRouteByPath } from "../src/config/routeRegistry";

test("every insight follows the TAG08 editorial reading contract", () => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const post of BLOG_POSTS) {
    assert.ok(post.id.trim(), "An insight must have a stable id.");
    assert.ok(!ids.has(post.id), `Duplicate insight id: ${post.id}`);
    ids.add(post.id);

    assert.ok(post.slug.trim(), `${post.id} must have a stable slug.`);
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
    assert.ok(sections.length >= 1, `${post.id} must include at least one real content section.`);
    assert.ok(post.content.trim().length > post.excerpt.length, `${post.id} needs an article body beyond its summary.`);

    assert.ok(getRouteByPath(post.relatedServicePath), `${post.id} must point to a resolvable related route.`);
    assert.ok(post.relatedServiceTitle.trim(), `${post.id} must name its related service.`);
    assert.ok(post.strategicSynthesis.problem.trim(), `${post.id} must state the problem it addresses.`);
    assert.ok(post.strategicSynthesis.nextStep.trim(), `${post.id} must state a practical next step.`);
  }
});
