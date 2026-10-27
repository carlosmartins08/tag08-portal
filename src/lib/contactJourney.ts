import { canonicalizeRoute } from "../config/routeRegistry";

export const CONTACT_JOURNEY_INTENTS = [
  "redes-sociais",
  "producao-audiovisual",
  "branding",
  "assessoria-estrategica",
  "desenvolvimento-web",
  "hospedagem",
  "process-intelligence",
  "process-activation",
  "trafego-performance",
  "orientacao"
] as const;

export type ContactJourneyIntent = typeof CONTACT_JOURNEY_INTENTS[number];

export const CONTACT_JOURNEY_ORIGINS = ["home", "services", "offer", "sebraetec", "partnership-program"] as const;
export type ContactJourneyOrigin = typeof CONTACT_JOURNEY_ORIGINS[number];

export const CONTACT_JOURNEY_REQUEST_TYPES = ["diagnostic", "partnership"] as const;
export type ContactJourneyRequestType = typeof CONTACT_JOURNEY_REQUEST_TYPES[number];

export type ContactJourneyContext = {
  intent?: ContactJourneyIntent;
  origin?: ContactJourneyOrigin;
  requestType?: ContactJourneyRequestType;
};

const offerIntentByPath: Record<string, ContactJourneyIntent> = {
  "/servicos/gestao-de-redes-sociais": "redes-sociais",
  "/servicos/producao-audiovisual": "producao-audiovisual",
  "/servicos/desenvolvimento-web": "desenvolvimento-web",
  "/servicos/branding-identidade": "branding",
  "/servicos/assessoria-marketing-digital-estrategico": "assessoria-estrategica",
  "/servicos/process-intelligence": "process-intelligence",
  "/servicos/process-activation": "process-activation",
  "/hospedagem-manutencao-sites": "hospedagem"
};

const isContactJourneyIntent = (value: string | null): value is ContactJourneyIntent =>
  value !== null && CONTACT_JOURNEY_INTENTS.includes(value as ContactJourneyIntent);

const isContactJourneyOrigin = (value: string | null): value is ContactJourneyOrigin =>
  value !== null && CONTACT_JOURNEY_ORIGINS.includes(value as ContactJourneyOrigin);

const isContactJourneyRequestType = (value: string | null): value is ContactJourneyRequestType =>
  value !== null && CONTACT_JOURNEY_REQUEST_TYPES.includes(value as ContactJourneyRequestType);

export const parseContactJourneyContext = (search: string): ContactJourneyContext => {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const intent = params.get("intent");
  const origin = params.get("origin");
  const requestType = params.get("requestType");

  return {
    ...(isContactJourneyIntent(intent) ? { intent } : {}),
    ...(isContactJourneyOrigin(origin) ? { origin } : {}),
    ...(isContactJourneyRequestType(requestType) ? { requestType } : {})
  };
};

export const getContactJourneyContextForPath = (currentPath: string): ContactJourneyContext => {
  const canonicalPath = canonicalizeRoute(currentPath);

  if (canonicalPath === "/") return { intent: "orientacao", origin: "home" };
  if (canonicalPath === "/servicos") return { intent: "orientacao", origin: "services" };
  if (canonicalPath === "/sebraetec-impulsionando-empreendedores") return { origin: "sebraetec" };
  if (canonicalPath === "/programa-afiliados") return { requestType: "partnership", origin: "partnership-program" };

  const intent = offerIntentByPath[canonicalPath];
  return intent ? { intent, origin: "offer" } : {};
};

const serializeContactJourneyContext = (context: ContactJourneyContext): string => {
  const params = new URLSearchParams();
  if (context.intent) params.set("intent", context.intent);
  if (context.origin) params.set("origin", context.origin);
  if (context.requestType) params.set("requestType", context.requestType);
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const contextualizeContactTarget = (currentPath: string, targetPath: string): string => {
  const [targetWithoutHash] = targetPath.split("#", 1);
  const queryIndex = targetWithoutHash.indexOf("?");
  const requestedPath = queryIndex === -1 ? targetWithoutHash : targetWithoutHash.slice(0, queryIndex);
  const canonicalTarget = canonicalizeRoute(requestedPath);

  if (canonicalTarget !== "/contato") return canonicalTarget;

  const explicitContext = queryIndex === -1
    ? {}
    : parseContactJourneyContext(targetWithoutHash.slice(queryIndex + 1));
  const routeContext = getContactJourneyContextForPath(currentPath);
  const context = {
    ...routeContext,
    ...explicitContext
  };

  return `${canonicalTarget}${serializeContactJourneyContext(context)}`;
};

export const getContactJourneyOriginSource = (origin?: ContactJourneyOrigin): string =>
  origin ? `contact-page:${origin}` : "contact-page";
