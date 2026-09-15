import type { RouteLocale } from "../config/routeRegistry";

export type TranslationTargetLocale = Exclude<RouteLocale, "pt">;

export type TranslationSegment = {
  id: string;
  text: string;
  /** Gives the engine enough context without exposing application internals. */
  context?: string;
};

export type TranslationBundle = {
  schemaVersion: 1;
  route: string;
  locale: TranslationTargetLocale;
  sourceLocale: "pt";
  sourceHash: string;
  engineVersion: string;
  generatedAt: string;
  segments: Record<string, string>;
};

export type TranslationHealth = {
  ok: boolean;
  engine: "libretranslate";
  version: string;
  supportedLocales: readonly string[];
  checkedAt: string;
  error?: string;
};

const protectedTokenPattern = /\{[^{}]+\}|https?:\/\/[^\s"'<>]+|\[\[[A-Z0-9_:-]+\]\]/g;

export const extractProtectedTokens = (value: string): string[] => Array.from(value.matchAll(protectedTokenPattern), (match) => match[0]);

export const hasMatchingProtectedTokens = (source: string, translated: string): boolean => {
  const sourceTokens = extractProtectedTokens(source).sort();
  const translatedTokens = extractProtectedTokens(translated).sort();
  return sourceTokens.length === translatedTokens.length && sourceTokens.every((token, index) => token === translatedTokens[index]);
};

export const validateTranslationBundle = (bundle: TranslationBundle, sourceSegments: readonly TranslationSegment[]): string[] => {
  const errors: string[] = [];
  if (bundle.schemaVersion !== 1) errors.push("unsupported_schema_version");
  if (bundle.sourceLocale !== "pt") errors.push("invalid_source_locale");
  if (bundle.locale !== "en" && bundle.locale !== "es") errors.push("invalid_target_locale");

  const sourceById = new Map(sourceSegments.map((segment) => [segment.id, segment.text]));
  for (const [id, source] of sourceById) {
    const translated = bundle.segments[id];
    if (!translated?.trim()) {
      errors.push(`missing_segment:${id}`);
    } else if (!hasMatchingProtectedTokens(source, translated)) {
      errors.push(`protected_token_mismatch:${id}`);
    }
  }

  for (const id of Object.keys(bundle.segments)) {
    if (!sourceById.has(id)) errors.push(`unknown_segment:${id}`);
  }

  return errors;
};
