"use client";

const STORAGE_KEY = "tag08_form_delivery_queue_v1";
const MAX_ATTEMPTS = 5;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type QueuedSubmission = {
  idempotencyKey: string;
  endpoint: "/api/contact" | "/api/talent-applications";
  payload: unknown;
  attempts: number;
  createdAt: string;
};

const readQueue = (): QueuedSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeQueue = (queue: QueuedSubmission[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // The browser may deny storage; the visible error remains the fallback.
  }
};

export const queueFormSubmission = (submission: Omit<QueuedSubmission, "attempts" | "createdAt">) => {
  const queue = readQueue().filter((entry) => entry.idempotencyKey !== submission.idempotencyKey);
  queue.push({ ...submission, attempts: 0, createdAt: new Date().toISOString() });
  writeQueue(queue);
};

export const flushFormQueue = async () => {
  const now = Date.now();
  const pending = readQueue().filter((entry) => now - Date.parse(entry.createdAt) < MAX_AGE_MS && entry.attempts < MAX_ATTEMPTS);
  const remaining: QueuedSubmission[] = [];

  for (const entry of pending) {
    try {
      const response = await fetch(entry.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": entry.idempotencyKey },
        body: JSON.stringify(entry.payload)
      });
      if (!response.ok) throw new Error("delivery_failed");
    } catch {
      remaining.push({ ...entry, attempts: entry.attempts + 1 });
    }
  }

  writeQueue(remaining);
};
