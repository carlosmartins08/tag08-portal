import { getPublishedLocales, routeRegistry } from "../src/config/routeRegistry";
import { localizationReadiness } from "../src/i18n/localizationReadiness";

const routes = routeRegistry.map((route) => {
  const readiness = localizationReadiness[route.key];

  return {
    key: route.key,
    path: route.canonicalPath,
    source: readiness.sourceFile,
    publishedLocales: getPublishedLocales(route),
    translations: readiness.locales
  };
});

const approvedTranslations = routes.reduce(
  (count, route) => count + Object.values(route.translations).filter((translation) => translation.state === "approved").length,
  0
);

console.log(JSON.stringify({
  routes: routes.length,
  approvedTranslations,
  pendingTranslations: routes.length * 2 - approvedTranslations,
  routeStatus: routes
}, null, 2));
