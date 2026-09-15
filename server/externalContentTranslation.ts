import { createHash } from "node:crypto";
import type { RouteLocale } from "../src/config/routeRegistry";
import type { OfficialGoogleReview, OfficialYouTubeVideo } from "../src/lib/officialContent";
import { isTranslationServiceConfigured, translateText } from "./translationService";

type TranslationSource = "youtube" | "googleBusiness";

const cache = new Map<string, string>();

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const cacheKey = (source: TranslationSource, entityId: string, field: string, value: string, locale: Exclude<RouteLocale, "pt">) =>
  `${source}:${entityId}:${field}:${locale}:${hash(value)}`;

const localizeField = async (
  source: TranslationSource,
  entityId: string,
  field: string,
  value: string,
  locale: RouteLocale
): Promise<{ value: string; original?: string; machineTranslated?: boolean }> => {
  if (locale === "pt" || !value.trim()) return { value };
  const key = cacheKey(source, entityId, field, value, locale);
  const cached = cache.get(key);
  if (cached) return { value: cached, original: value, machineTranslated: true };
  if (!isTranslationServiceConfigured()) return { value };

  try {
    const translated = await translateText(value, locale);
    cache.set(key, translated);
    return { value: translated, original: value, machineTranslated: true };
  } catch {
    // Live official content remains available if the private service is being
    // restarted. The response explicitly omits machineTranslated in that case.
    return { value };
  }
};

export const localizeOfficialVideos = async (videos: OfficialYouTubeVideo[], locale: RouteLocale): Promise<OfficialYouTubeVideo[]> =>
  Promise.all(videos.map(async (video) => {
    const [title, description, category, tagline] = await Promise.all([
      localizeField("youtube", video.id, "title", video.title, locale),
      localizeField("youtube", video.id, "description", video.description, locale),
      localizeField("youtube", video.id, "category", video.category, locale),
      localizeField("youtube", video.id, "tagline", video.tagline, locale)
    ]);
    return {
      ...video,
      title: title.value,
      description: description.value,
      category: category.value,
      tagline: tagline.value,
      original: title.original || description.original || category.original || tagline.original
        ? { title: title.original ?? video.title, description: description.original ?? video.description, category: category.original ?? video.category, tagline: tagline.original ?? video.tagline }
        : undefined,
      machineTranslated: Boolean(title.machineTranslated || description.machineTranslated || category.machineTranslated || tagline.machineTranslated)
    };
  }));

export const localizeOfficialReviews = async (reviews: OfficialGoogleReview[], locale: RouteLocale): Promise<OfficialGoogleReview[]> =>
  Promise.all(reviews.map(async (review, index) => {
    const entityId = `${review.name}:${index}`;
    const [role, time, tagline, text, category] = await Promise.all([
      localizeField("googleBusiness", entityId, "role", review.role, locale),
      localizeField("googleBusiness", entityId, "time", review.time, locale),
      localizeField("googleBusiness", entityId, "tagline", review.tagline, locale),
      localizeField("googleBusiness", entityId, "text", review.text, locale),
      localizeField("googleBusiness", entityId, "category", review.category, locale)
    ]);
    return {
      ...review,
      role: role.value,
      time: time.value,
      tagline: tagline.value,
      text: text.value,
      category: category.value,
      original: role.original || time.original || tagline.original || text.original || category.original
        ? { role: role.original ?? review.role, time: time.original ?? review.time, tagline: tagline.original ?? review.tagline, text: text.original ?? review.text, category: category.original ?? review.category }
        : undefined,
      machineTranslated: Boolean(role.machineTranslated || time.machineTranslated || tagline.machineTranslated || text.machineTranslated || category.machineTranslated)
    };
  }));
