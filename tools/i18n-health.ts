import { getTranslationHealth } from "../server/translationService";

const health = await getTranslationHealth();
console.log(JSON.stringify({ event: "translation_health", ...health }));
if (!health.ok || !["pt", "en", "es"].every((locale) => health.supportedLocales.includes(locale))) process.exit(1);
