import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { flattenCatalog, inflateCatalog, type LocalizedCatalog } from "../src/i18n/catalog";
import { validateTranslationBundle, type TranslationBundle, type TranslationTargetLocale } from "../src/i18n/translationContract";
import { getTranslationHealth, isTranslationServiceConfigured, sourceFingerprint, translateSegments } from "../server/translationService";

const sourceDirectory = join(process.cwd(), "src", "i18n", "catalogs");
const outputDirectory = join(process.cwd(), "src", "i18n", "generated");
const checkOnly = process.argv.includes("--check");
const force = process.argv.includes("--force");
const targets: TranslationTargetLocale[] = ["en", "es"];

const readJson = async <T>(path: string) => JSON.parse(await readFile(path, "utf8")) as T;
const hashFileContents = (value: string) => createHash("sha256").update(value).digest("hex");

const syncCatalog = async (sourceFile: string) => {
  const route = basename(sourceFile, ".pt.json");
  const source = await readJson<LocalizedCatalog>(join(sourceDirectory, sourceFile));
  const segments = flattenCatalog(source);
  const sourceHash = sourceFingerprint(segments);

  for (const locale of targets) {
    const outputFile = join(outputDirectory, `${route}.${locale}.json`);
    let existing: TranslationBundle | null = null;
    try {
      existing = await readJson<TranslationBundle>(outputFile);
    } catch {
      // The first translation has no artifact yet.
    }

    const current = existing?.sourceHash === sourceHash && validateTranslationBundle(existing, segments).length === 0;
    if (current && !force) {
      console.log(JSON.stringify({ event: "i18n_catalog_unchanged", route, locale, sourceHash }));
      continue;
    }
    if (checkOnly) throw new Error(`stale_translation:${route}:${locale}`);

    const translated = await translateSegments(segments, locale);
    const bundle: TranslationBundle = {
      schemaVersion: 1,
      route,
      locale,
      sourceLocale: "pt",
      sourceHash,
      engineVersion: process.env.TRANSLATION_ENGINE_VERSION || "libretranslate",
      generatedAt: new Date().toISOString(),
      segments: translated
    };
    const errors = validateTranslationBundle(bundle, segments);
    if (errors.length) throw new Error(`invalid_translation_bundle:${route}:${locale}:${errors.join(",")}`);

    await writeFile(outputFile, `${JSON.stringify({ ...bundle, catalog: inflateCatalog(translated), artifactHash: hashFileContents(JSON.stringify(bundle)) }, null, 2)}\n`);
    console.log(JSON.stringify({ event: "i18n_catalog_generated", route, locale, sourceHash, segments: segments.length }));
  }
};

const main = async () => {
  const sourceFiles = (await readdir(sourceDirectory)).filter((file) => file.endsWith(".pt.json")).sort();
  if (!sourceFiles.length) throw new Error("no_portuguese_catalogs_found");
  await mkdir(outputDirectory, { recursive: true });

  if (!checkOnly) {
    if (!isTranslationServiceConfigured()) throw new Error("translation_service_not_configured");
    const health = await getTranslationHealth();
    if (!health.ok || !["pt", "en", "es"].every((locale) => health.supportedLocales.includes(locale))) {
      throw new Error(`translation_service_unhealthy:${health.error || health.supportedLocales.join(",")}`);
    }
  }

  for (const sourceFile of sourceFiles) await syncCatalog(sourceFile);
};

main().catch((error) => {
  console.error(JSON.stringify({ event: "i18n_sync_failed", error: error instanceof Error ? error.message : String(error) }));
  process.exit(1);
});
