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
