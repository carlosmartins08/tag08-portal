import type { MetadataRoute } from "next";
import { getPublishedLocales, getRouteByPath, routeSitemapMeta } from "../config/routeRegistry";
import { getAbsoluteLocalizedUrl, getAlternates } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return routeSitemapMeta.flatMap((entry) => {
    const route = getRouteByPath(entry.path);
    if (!route) return [];

    return getPublishedLocales(route).map((locale) => ({
      url: getAbsoluteLocalizedUrl(entry.path, locale),
      lastModified: new Date(),
      changeFrequency: entry.changefreq,
      priority: Number(entry.priority),
      alternates: { languages: getAlternates(entry.path) }
    }));
  });
}
