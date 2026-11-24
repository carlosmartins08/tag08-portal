import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";

test("proxy rewrites PT-BR root internally", () => {
  const response = proxy(new NextRequest("https://tag08.test/"));
  assert.equal(response.headers.get("x-middleware-rewrite"), "https://tag08.test/pt");
});

test("proxy does not redirect the internal PT-BR locale rewrite", () => {
  const response = proxy(
    new NextRequest("https://tag08.test/pt", {
      headers: { "x-tag08-internal-locale-rewrite": "1" }
    })
  );

  assert.equal(response.headers.get("x-middleware-next"), "1");
});

test("proxy leaves public static assets untouched", () => {
  const response = proxy(new NextRequest("https://tag08.test/team/carlos-henrique-martins.jpg"));

  assert.equal(response.headers.get("x-middleware-next"), "1");
});

test("proxy redirects aliases and preserves language query semantics", () => {
  const alias = proxy(new NextRequest("https://tag08.test/blog"));
  assert.equal(alias.status, 308);
  assert.equal(alias.headers.get("location"), "https://tag08.test/insights");

  const language = proxy(new NextRequest("https://tag08.test/sobre?lang=en&utm_source=test"));
  assert.equal(language.status, 308);
  assert.equal(language.headers.get("location"), "https://tag08.test/en/sobre?utm_source=test");
});

test("proxy negotiates Markdown only for missing routes explicitly requesting it", async () => {
  const response = proxy(new NextRequest("https://tag08.test/not-a-real-page", {
    headers: { accept: "text/markdown" }
  }));

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type") ?? "", /^text\/markdown; charset=utf-8$/);
  assert.match(response.headers.get("vary") ?? "", /(?:^|,\s*)Accept(?:,|$)/i);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/i);
  const body = await response.text();
  assert.ok(body.length >= 20);
  assert.match(body, /não corresponde a uma página disponível/i);
  assert.match(body, /\]\(\/llms\.txt\)/);
});

test("proxy preserves HTML and known routes when Markdown is absent or refused", () => {
  const html = proxy(new NextRequest("https://tag08.test/not-a-real-page", {
    headers: { accept: "text/html" }
  }));
  assert.equal(html.headers.get("x-middleware-rewrite"), "https://tag08.test/pt/not-a-real-page");
  assert.equal(html.headers.get("cache-control"), "no-store");

  const refused = proxy(new NextRequest("https://tag08.test/not-a-real-page", {
    headers: { accept: "text/markdown;q=0, text/html;q=1" }
  }));
  assert.equal(refused.headers.get("x-middleware-rewrite"), "https://tag08.test/pt/not-a-real-page");
  assert.equal(refused.headers.get("cache-control"), "no-store");

  const invalidQuality = proxy(new NextRequest("https://tag08.test/not-a-real-page", {
    headers: { accept: "text/markdown;q=2" }
  }));
  assert.equal(invalidQuality.headers.get("x-middleware-rewrite"), "https://tag08.test/pt/not-a-real-page");

  const known = proxy(new NextRequest("https://tag08.test/sobre", {
    headers: { accept: "text/markdown" }
  }));
  assert.equal(known.headers.get("x-middleware-rewrite"), "https://tag08.test/pt/sobre");
  assert.equal(known.headers.get("content-type"), null);
});
