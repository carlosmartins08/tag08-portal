import { createHash } from "node:crypto";
import type { TranslationHealth, TranslationSegment, TranslationTargetLocale } from "../src/i18n/translationContract";
import { hasMatchingProtectedTokens } from "../src/i18n/translationContract";

const REQUEST_TIMEOUT_MS = Number.parseInt(process.env.TRANSLATION_REQUEST_TIMEOUT_MS || "15000", 10);
const ENGINE_URL = (process.env.TRANSLATION_SERVICE_URL || "").replace(/\/$/, "");
const ENGINE_TOKEN = (process.env.TRANSLATION_SERVICE_TOKEN || "").trim();
const ENGINE_VERSION = (process.env.TRANSLATION_ENGINE_VERSION || "libretranslate").trim();

export class TranslationServiceError extends Error {
  constructor(public readonly code: string, message = code) {
    super(message);
  }
}

export const isTranslationServiceConfigured = () => Boolean(ENGINE_URL);

const fetchWithTimeout = async (path: string, init?: RequestInit): Promise<Response> => {
  if (!ENGINE_URL) throw new TranslationServiceError("translation_service_not_configured");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${ENGINE_URL}${path}`, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof TranslationServiceError) throw error;
    throw new TranslationServiceError("translation_service_unreachable", error instanceof Error ? error.message : undefined);
  } finally {
    clearTimeout(timeoutId);
  }
};

const protectedTokenPattern = /\{[^{}]+\}|https?:\/\/[^\s"'<>]+|\[\[[A-Z0-9_:-]+\]\]/g;

const protectTokens = (value: string) => {
  const tokens: string[] = [];
  const text = value.replace(protectedTokenPattern, (token) => {
    const index = tokens.push(token) - 1;
    return `[[TAG08_TOKEN_${index}]]`;
  });
  return { text, tokens };
};

const restoreTokens = (value: string, tokens: readonly string[]) =>
  value.replace(/\[\[TAG08_TOKEN_(\d+)\]\]/g, (placeholder, index: string) => tokens[Number(index)] ?? placeholder);

export const sourceFingerprint = (segments: readonly TranslationSegment[]) =>
  createHash("sha256").update(JSON.stringify(segments.map(({ id, text }) => ({ id, text })))).digest("hex");

export const getTranslationHealth = async (): Promise<TranslationHealth> => {
  const checkedAt = new Date().toISOString();
  if (!ENGINE_URL) {
    return { ok: false, engine: "libretranslate", version: ENGINE_VERSION, supportedLocales: [], checkedAt, error: "translation_service_not_configured" };
  }

  try {
    const [healthResponse, languagesResponse] = await Promise.all([fetchWithTimeout("/health"), fetchWithTimeout("/languages")]);
    if (!healthResponse.ok || !languagesResponse.ok) throw new TranslationServiceError("translation_service_unhealthy");
    const languages = (await languagesResponse.json()) as Array<{ code?: string }>;
    return {
      ok: true,
      engine: "libretranslate",
      version: ENGINE_VERSION,
      supportedLocales: languages.map((language) => language.code).filter((code): code is string => Boolean(code)),
      checkedAt
    };
  } catch (error) {
    return {
      ok: false,
      engine: "libretranslate",
      version: ENGINE_VERSION,
      supportedLocales: [],
      checkedAt,
      error: error instanceof TranslationServiceError ? error.code : "translation_service_unhealthy"
    };
  }
};

export const translateText = async (source: string, target: TranslationTargetLocale): Promise<string> => {
  if (!source.trim()) return source;
  const protectedSource = protectTokens(source);
  const body: Record<string, string> = { q: protectedSource.text, source: "pt", target, format: "text" };
  if (ENGINE_TOKEN) body.api_key = ENGINE_TOKEN;

  const response = await fetchWithTimeout("/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(ENGINE_TOKEN ? { Authorization: `Bearer ${ENGINE_TOKEN}` } : {}) },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new TranslationServiceError("translation_service_rejected", `Translation service returned ${response.status}`);

  const payload = (await response.json()) as { translatedText?: unknown };
  if (typeof payload.translatedText !== "string" || !payload.translatedText.trim()) {
    throw new TranslationServiceError("translation_service_invalid_response");
  }

  const translated = restoreTokens(payload.translatedText, protectedSource.tokens);
  if (!hasMatchingProtectedTokens(source, translated)) throw new TranslationServiceError("translation_protected_token_mismatch");
  return translated;
};

export const translateSegments = async (segments: readonly TranslationSegment[], target: TranslationTargetLocale) => {
  const translated = await Promise.all(segments.map(async (segment) => [segment.id, await translateText(segment.text, target)] as const));
  return Object.fromEntries(translated);
};
