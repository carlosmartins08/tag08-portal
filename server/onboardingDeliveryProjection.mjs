const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const AUTH_FIELD = /(?:token|secret|password|credential|cookie|authorization|session|journey|access[_-]?key|api[_-]?key|client[_-]?secret|signature|^auth$|^code$)/i;

const sanitizeUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return value;
  try {
    const url = new URL(value);
    const hasSensitiveQuery = [...url.searchParams.keys()].some((key) => AUTH_FIELD.test(key));
    const hasSensitiveFragment = AUTH_FIELD.test(url.hash);
    if (url.username || url.password || hasSensitiveQuery || hasSensitiveFragment) return "";
  } catch {
    return value;
  }
  return value;
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === "string") return sanitizeUrl(value);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !AUTH_FIELD.test(key))
    .map(([key, nested]) => [key, sanitizeValue(nested)]));
};

const pick = (value, keys) => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(keys
    .filter((key) => Object.hasOwn(value, key))
    .map((key) => [key, sanitizeValue(value[key])]));
};

const sheetsFields = (payload) => ({
  schemaVersion: Number.isSafeInteger(payload.schemaVersion) ? payload.schemaVersion : 1,
  clientData: pick(payload.clientData, [
    "companyName", "cnpjCpf", "cityState", "website", "instagram", "linkedin", "preferredLanguage"
  ]),
  projectContacts: pick(payload.projectContacts, [
    "responsibleName", "role", "email", "whatsapp", "focalPoint", "approver", "financePoint"
  ]),
  selectedServices: Array.isArray(payload.selectedServices)
    ? payload.selectedServices.filter((service) => typeof service === "string").map(sanitizeValue)
    : [],
  businessMoment: pick(payload.businessMoment, ["momentPhrase", "priorityArea", "maturityLevel"]),
  generalBriefing: sanitizeValue(isRecord(payload.generalBriefing) ? payload.generalBriefing : {}),
  serviceSpecificBriefing: sanitizeValue(isRecord(payload.serviceSpecificBriefing) ? payload.serviceSpecificBriefing : {}),
  filesAndLinks: pick(payload.filesAndLinks, ["drive", "instagram", "site", "portfolio", "references", "documents", "commercial"]),
  submittedAt: typeof payload.submittedAt === "string" ? sanitizeValue(payload.submittedAt) : "",
  source: typeof payload.source === "string" ? sanitizeValue(payload.source) : "onboarding-web"
});

/** Build trusted destination data from the validated canonical contract, never from browser projections. */
export const buildOnboardingSheetsDeliveryProjection = (payload) => {
  if (!isRecord(payload)) throw new TypeError("onboarding_sheets_projection_invalid");
  return sheetsFields(payload);
};

/** ClickUp receives operational context, excluding tax identifiers and access/consent metadata. */
export const buildOnboardingClickUpDeliveryProjection = (payload) => {
  if (!isRecord(payload)) throw new TypeError("onboarding_clickup_projection_invalid");
  const projection = sheetsFields(payload);
  const { cnpjCpf: _excludedCnpjCpf, ...clientData } = projection.clientData;
  return { ...projection, clientData };
};
