import assert from "node:assert/strict";
import test from "node:test";
import {
  EDITORIAL_CONTRACT_VERSION,
  parseEditorialContentEnvelopeV1,
  selectEditorialCardsForSection,
  type EditorialContentEnvelopeV1,
} from "../src/content/editorialContentV1";
import { readEditorialProjection } from "../server/editorialProjectionReader";

const envelope: EditorialContentEnvelopeV1 = {
  contractVersion: EDITORIAL_CONTRACT_VERSION,
  generatedAt: "2026-10-28T12:00:00.000Z",
  items: [{
    id: "wp:6214",
    slug: "article-v1",
    title: "Artigo de demonstração de contrato",
    summary: "Resumo sintético para teste.",
    body: { format: "html", value: "<p>Corpo sintético.</p>" },
    categories: [{ id: "cat:1", slug: "branding", name: "Branding" }],
    tags: [],
    image: { url: "https://blog.tag08.com.br/media/article.webp", altText: "Imagem sintética" },
    author: { id: "author:1", name: "Autoria de teste" },
    publishedAt: "2026-10-27T10:00:00.000Z",
    updatedAt: null,
    locale: "pt-BR",
    status: "published",
    canonicalUrl: "https://blog.tag08.com.br/artigo/article-v1",
  }],
};

test("v1 accepts normalized published content and its canonical blog URL", () => {
  assert.deepEqual(parseEditorialContentEnvelopeV1(envelope), envelope);
});

test("portal cards are distributed only by an explicit stable-ID relationship", () => {
  const parsed = parseEditorialContentEnvelopeV1(envelope);
  assert.ok(parsed);
  assert.equal(selectEditorialCardsForSection(parsed, "service:branding", { "wp:6214": ["service:branding"] }).length, 1);
  assert.equal(selectEditorialCardsForSection(parsed, "home").length, 0);
});

test("unpublished, duplicate-ID, wrong-version, and non-canonical records fail closed", () => {
  assert.equal(parseEditorialContentEnvelopeV1({ ...envelope, contractVersion: "tag08.editorial.v2" }), null);
  assert.equal(parseEditorialContentEnvelopeV1({
    ...envelope,
    items: [{ ...envelope.items[0], status: "draft" }],
  }), null);
  assert.equal(parseEditorialContentEnvelopeV1({
    ...envelope,
    items: [envelope.items[0], envelope.items[0]],
  }), null);
  assert.equal(parseEditorialContentEnvelopeV1({
    ...envelope,
    items: [{ ...envelope.items[0], canonicalUrl: "https://tag08.com.br/artigo/article-v1" }],
  }), null);
});

test("portal reader is inert without configuration and handles empty content, transport errors, and refreshed updates", async () => {
  let requests = 0;
  const missing = await readEditorialProjection("home", {
    apiUrl: "",
    fetcher: async () => { requests += 1; return Response.json(envelope); },
  });
  assert.deepEqual(missing, { ok: false, error: "not_configured" });
  assert.equal(requests, 0);

  const empty = await readEditorialProjection("home", {
    apiUrl: "https://blog.tag08.com.br/api/v1/editorial-content",
    fetcher: async (_input, init) => {
      assert.equal(init?.cache, "no-store");
      return Response.json({ ...envelope, items: [] });
    },
  });
  assert.deepEqual(empty.ok && empty.items, []);

  const failure = await readEditorialProjection("home", {
    apiUrl: "https://blog.tag08.com.br/api/v1/editorial-content",
    fetcher: async () => { throw new Error("synthetic network failure"); },
  });
  assert.deepEqual(failure, { ok: false, error: "upstream_unavailable" });

  let title = envelope.items[0].title;
  const read = () => readEditorialProjection("service:branding", {
    apiUrl: "https://blog.tag08.com.br/api/v1/editorial-content",
    relationships: { "wp:6214": ["service:branding"] },
    fetcher: async () => Response.json({ ...envelope, items: [{ ...envelope.items[0], title }] }),
  });
  const first = await read();
  title = "Artigo atualizado";
  const second = await read();
  assert.equal(first.ok && first.items[0]?.title, "Artigo de demonstração de contrato");
  assert.equal(second.ok && second.items[0]?.title, "Artigo atualizado");
});

test("unknown institutional sections and unsafe upstream URLs are rejected", async () => {
  assert.deepEqual(await readEditorialProjection("service:unapproved"), {
    ok: false,
    error: "invalid_section",
  });
  assert.deepEqual(await readEditorialProjection("home", {
    apiUrl: "https://example.com/api/v1/editorial-content",
    fetcher: async () => Response.json(envelope),
  }), { ok: false, error: "not_configured" });
});
