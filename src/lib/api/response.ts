import { NextResponse } from "next/server";

export const CONTACT_REQUEST_MAX_BYTES = 32 * 1024;
export const ONBOARDING_REQUEST_MAX_BYTES = 256 * 1024;

type JsonBodyResult =
  | { ok: true; payload: unknown }
  | { ok: false; error: "invalid_payload" | "payload_too_large" };

const allowedOrigins = () =>
  new Set(
    (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

export const corsHeadersForRequest = (request?: Request): Record<string, string> => {
  const origin = request?.headers.get("origin");
  if (!origin || !allowedOrigins().has(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Idempotency-Key"
  };
};

export const jsonResponse = (body: unknown, status = 200, request?: Request) =>
  NextResponse.json(body, {
    status,
    headers: {
      ...corsHeadersForRequest(request),
      "Cache-Control": "no-store"
    }
  });

export const optionsResponse = (request: Request) =>
  new NextResponse(null, { status: 204, headers: corsHeadersForRequest(request) });

export const createRequestId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export const readJsonBody = async (request: Request, maxBytes: number): Promise<JsonBodyResult> => {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, error: "payload_too_large" };
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return { ok: false, error: "invalid_payload" };
  }

  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    return { ok: false, error: "payload_too_large" };
  }

  try {
    return { ok: true, payload: JSON.parse(body) };
  } catch {
    return { ok: false, error: "invalid_payload" };
  }
};

export const hasHoneypotValue = (payload: unknown) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const value = (payload as { website?: unknown }).website;
  return typeof value === "string" && value.trim().length > 0;
};
