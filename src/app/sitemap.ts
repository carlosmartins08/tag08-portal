import type { MetadataRoute } from "next";
import { INDEXABLE_LOCALES, routeSitemapMeta } from "../config/routeRegistry";
import { getAbsoluteLocalizedUrl, getAlternates } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return routeSitemapMeta.flatMap((entry) =>
    INDEXABLE_LOCALES.map((locale) => ({
      url: getAbsoluteLocalizedUrl(entry.path, locale),
      lastModified: new Date(),
      changeFrequency: entry.changefreq,
      priority: Number(entry.priority),
      alternates: { languages: getAlternates(entry.path) }
    }))
  );
}
