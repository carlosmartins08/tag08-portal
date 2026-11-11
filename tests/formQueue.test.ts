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
    return new Response(JSON.stringify({
      ok: true,
      leadId: "lead-123",
      status: "accepted",
      deliveryStatus: { sheets: "delivered", sheetsRowReference: "Leads!A2:W2" }
    }), { status: 202, headers: { "Content-Type": "application/json" } });
  };

  try {
    const payload = { email: "synthetic@example.test", source: "contact-page:offer" };
    assert.equal(queueFormSubmission({ endpoint: "/api/contact", idempotencyKey: "contact-request-001", payload }), true);
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

test("queue keeps a submission when a 2xx response lacks a confirmed Sheets receipt", async () => {
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
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true, status: "accepted" }), {
    status: 202,
    headers: { "Content-Type": "application/json" }
  });

  try {
    assert.equal(queueFormSubmission({
      endpoint: "/api/talent-applications",
      idempotencyKey: "talent-request-unconfirmed",
      payload: { email: "synthetic@example.test" }
    }), true);

    await flushFormQueue();
    const remaining = JSON.parse(values.get("tag08_form_delivery_queue_v1") || "[]");
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].idempotencyKey, "talent-request-unconfirmed");
    assert.equal(remaining[0].attempts, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("queued talent submission is removed only after its Talentos Sheets receipt is confirmed", async () => {
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
  globalThis.fetch = async () => new Response(JSON.stringify({
    ok: true,
    applicationId: "application-123",
    status: "accepted",
    deliveryStatus: { sheets: "delivered", sheetsRowReference: "Talentos!A2:X2" }
  }), { status: 202, headers: { "Content-Type": "application/json" } });

  try {
    assert.equal(queueFormSubmission({
      endpoint: "/api/talent-applications",
      idempotencyKey: "talent-request-confirmed",
      payload: { email: "synthetic@example.test" }
    }), true);

    await flushFormQueue();
    assert.deepEqual(JSON.parse(values.get("tag08_form_delivery_queue_v1") || "[]"), []);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("queue reports when browser storage refuses to persist a retry", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => null,
      setItem: () => { throw new Error("storage_denied"); }
    }
  });

  try {
    assert.equal(queueFormSubmission({
      endpoint: "/api/contact",
      idempotencyKey: "contact-request-storage-denied",
      payload: { email: "synthetic@example.test" }
    }), false);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
