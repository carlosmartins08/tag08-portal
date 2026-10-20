import assert from "node:assert/strict";
import test from "node:test";
import { flushFormQueue, queueFormSubmission } from "../src/lib/formQueue";

test("queued contact retry retains its idempotency key and payload across a reload boundary", async () => {
  const values = new Map<string, string>();
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const originalFetch = globalThis.fetch;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); }
    }
  });

  let requestKey = "";
  globalThis.fetch = async (_input, init) => {
    requestKey = new Headers(init?.headers).get("Idempotency-Key") || "";
    return new Response(null, { status: 202 });
  };

  try {
    const payload = { email: "synthetic@example.test", source: "contact-page:offer" };
    queueFormSubmission({ endpoint: "/api/contact", idempotencyKey: "contact-request-001", payload });
    const saved = JSON.parse(values.get("tag08_form_delivery_queue_v1") || "[]");
    assert.equal(saved[0].idempotencyKey, "contact-request-001");
    assert.deepEqual(saved[0].payload, payload);

    await flushFormQueue();
    assert.equal(requestKey, "contact-request-001");
    assert.deepEqual(JSON.parse(values.get("tag08_form_delivery_queue_v1") || "[]"), []);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
