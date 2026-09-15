import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { flattenCatalog, type LocalizedCatalog } from "../src/i18n/catalog";
import { validateTranslationBundle, type TranslationBundle } from "../src/i18n/translationContract";
import { sourceFingerprint } from "../server/translationService";
import { routeRegistry } from "../src/config/routeRegistry";

const enabled = process.env.TRANSLATIONS_AUTOPUBLISH === "true";
if (!enabled) {
  console.log(JSON.stringify({ event: "i18n_check_skipped", reason: "translations_autopublish_disabled" }));
  process.exit(0);
}

const sourceDirectory = join(process.cwd(), "src", "i18n", "catalogs");
const outputDirectory = join(process.cwd(), "src", "i18n", "generated");
const readJson = async <T>(path: string) => JSON.parse(await readFile(path, "utf8")) as T;

const files = (await readdir(sourceDirectory)).filter((file) => file.endsWith(".pt.json"));
const failures: string[] = [];
const sourceFiles = new Set(files);

for (const route of routeRegistry) {
  if (route.key === "cliente-onboarding") continue;
  const expected = `${route.key}.pt.json`;
  if (!sourceFiles.has(expected)) failures.push(`missing_route_catalog:${route.key}`);
}

for (const file of files) {
  const route = file.replace(/\.pt\.json$/, "");
  const source = await readJson<LocalizedCatalog>(join(sourceDirectory, file));
  const segments = flattenCatalog(source);
  const sourceHash = sourceFingerprint(segments);
  for (const locale of ["en", "es"] as const) {
    try {
      const bundle = await readJson<TranslationBundle>(join(outputDirectory, `${route}.${locale}.json`));
      if (bundle.sourceHash !== sourceHash) failures.push(`stale_translation:${route}:${locale}`);
      failures.push(...validateTranslationBundle(bundle, segments).map((error) => `${route}:${locale}:${error}`));
    } catch {
      failures.push(`missing_translation:${route}:${locale}`);
    }
  }
}

if (failures.length) {
  console.error(JSON.stringify({ event: "i18n_check_failed", failures }));
  process.exit(1);
}
console.log(JSON.stringify({ event: "i18n_check_passed", catalogs: files.length }));
