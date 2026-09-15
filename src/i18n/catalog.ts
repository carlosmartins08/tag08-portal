import type { TranslationSegment } from "./translationContract";

export type LocalizedCatalogValue = string | LocalizedCatalog | readonly string[];

export interface LocalizedCatalog {
  [key: string]: LocalizedCatalogValue;
}

export const flattenCatalog = (catalog: LocalizedCatalog, prefix = ""): TranslationSegment[] =>
  Object.entries(catalog).flatMap(([key, value]) => {
    const id = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") return [{ id, text: value }];
    if (Array.isArray(value as unknown[])) return (value as readonly string[]).map((text, index) => ({ id: `${id}.${index}`, text }));
    return flattenCatalog(value as LocalizedCatalog, id);
  });

export const inflateCatalog = (segments: Record<string, string>): LocalizedCatalog => {
  const root: LocalizedCatalog = {};
  for (const [id, text] of Object.entries(segments)) {
    const keys = id.split(".");
    let current: Record<string, LocalizedCatalogValue> | string[] = root;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = text;
      } else {
        const existing = current[key];
        if (!existing || typeof existing === "string") current[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
        current = current[key] as Record<string, LocalizedCatalogValue> | string[];
      }
    });
  }
  return root;
};
