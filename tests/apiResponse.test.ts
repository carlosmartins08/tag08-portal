import assert from "node:assert/strict";
import test from "node:test";
import { corsHeadersForRequest, hasHoneypotValue, readJsonBody } from "../src/lib/api/response";

test("CORS only allows configured origins", () => {
  const previous = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = "https://tag08.com.br,https://staging.tag08.com.br";

  assert.equal(
    corsHeadersForRequest(new Request("https://tag08.com.br/api/contact", { headers: { origin: "https://tag08.com.br" } }))[
      "Access-Control-Allow-Origin"
    ],
    "https://tag08.com.br"
  );
  assert.deepEqual(
    corsHeadersForRequest(new Request("https://tag08.com.br/api/contact", { headers: { origin: "https://untrusted.example" } })),
    {}
  );

  if (previous === undefined) delete process.env.ALLOWED_ORIGINS;
  else process.env.ALLOWED_ORIGINS = previous;
});

test("request parser rejects malformed and oversized payloads before validation", async () => {
  const malformed = await readJsonBody(new Request("https://tag08.com.br/api/contact", { method: "POST", body: "{" }), 32);
  assert.deepEqual(malformed, { ok: false, error: "invalid_payload" });

  const oversized = await readJsonBody(
    new Request("https://tag08.com.br/api/contact", { method: "POST", body: JSON.stringify({ message: "x".repeat(128) }) }),
    32
  );
  assert.deepEqual(oversized, { ok: false, error: "payload_too_large" });
});

test("honeypot only rejects a filled top-level website field", () => {
  assert.equal(hasHoneypotValue({ website: "https://spam.invalid" }), true);
  assert.equal(hasHoneypotValue({ website: "   " }), false);
  assert.equal(hasHoneypotValue({ clientData: { website: "https://client.example" } }), false);
});
