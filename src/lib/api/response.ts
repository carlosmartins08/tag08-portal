import { NextResponse } from "next/server";

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
