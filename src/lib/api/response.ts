import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export const jsonResponse = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store"
    }
  });

export const optionsResponse = () => new NextResponse(null, { status: 204, headers: corsHeaders });

export const createRequestId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
