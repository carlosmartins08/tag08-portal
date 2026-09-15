import type { RouteLocale } from "../config/routeRegistry";
import portugueseCatalog from "./catalogs/not-found.pt.json";
import englishBundle from "./generated/not-found.en.json";
import spanishBundle from "./generated/not-found.es.json";

type NotFoundCopy = typeof portugueseCatalog;
type GeneratedCatalog = { catalog: NotFoundCopy };

/**
 * Automated output remains the default source for EN/ES. These corrections
 * protect high-visibility interface copy from known errors in the local model.
 */
const editorialOverrides: Partial<Record<Exclude<RouteLocale, "pt">, Partial<NotFoundCopy>>> = {
  en: {
    systemStatus: "SYSTEM MISALIGNED",
    eyebrow: "DIRECTION AND ASSET GOVERNANCE",
    technicalDescription: "The requested address is not part of TAG08's technical route map.",
    badge: "ROUTE INTERRUPTED",
    title: "Oops, it looks like we are off route.",
    description: "Just as in digital marketing, misaligned routes drain energy and resources. Let’s reconnect your journey to our main operational reference points.",
    homeTitle: "Back to home",
    homeDescription: "Return to the home page and explore our corporate presentation.",
    servicesTitle: "Our solutions",
    servicesDescription: "Discover our branding, web development and process ecosystems.",
    supportEyebrow: "SUPPORT AND FEASIBILITY",
    supportQuestion: "Would you prefer to report this error to our technology director?",
    supportAction: "Contact support",
    supportMessage: "Hello, I found a 404 route on the TAG08 website."
  },
  es: {
    systemStatus: "SISTEMA DESALINEADO",
    eyebrow: "DIRECCIÓN Y GOBERNANZA DE ACTIVOS",
    technicalDescription: "La dirección solicitada no forma parte del mapa técnico de rutas de TAG08.",
    badge: "RUTA INTERRUMPIDA",
    title: "Ups, parece que salimos de la ruta.",
    description: "Al igual que en el marketing digital, las rutas desalineadas consumen energía y recursos. Reconectemos su experiencia con nuestros principales puntos de referencia operativa.",
    homeTitle: "Volver al inicio",
    homeDescription: "Vuelva a la página principal y conozca nuestra presentación corporativa.",
    servicesTitle: "Nuestras soluciones",
    servicesDescription: "Conozca nuestros ecosistemas de marca, desarrollo web y procesos.",
    supportEyebrow: "SOPORTE Y VIABILIDAD",
    supportQuestion: "¿Prefiere informar este error a nuestro director de tecnología?",
    supportAction: "Contactar soporte",
    supportMessage: "Hola, encontré una ruta 404 en el sitio web de TAG08."
  }
};

const generatedCatalogs: Record<Exclude<RouteLocale, "pt">, NotFoundCopy> = {
  en: (englishBundle as GeneratedCatalog).catalog,
  es: (spanishBundle as GeneratedCatalog).catalog
};

export const getNotFoundCopy = (locale: RouteLocale): NotFoundCopy =>
  locale === "pt"
    ? portugueseCatalog
    : { ...generatedCatalogs[locale], ...editorialOverrides[locale] };
