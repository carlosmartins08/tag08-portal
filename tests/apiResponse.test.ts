import assert from "node:assert/strict";
import test from "node:test";
import { corsHeadersForRequest } from "../src/lib/api/response";

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
