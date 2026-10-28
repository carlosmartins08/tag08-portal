export const MAX_AUTOMATIC_DELIVERY_ATTEMPTS = 8;
export const TERMINAL_RETRY_AT = new Date("9999-12-31T23:59:59.999Z");

export class IntegrationDeliveryError extends Error {
  constructor(code, retryable = false, outcomeUnknown = false) {
    super(code);
    this.name = "IntegrationDeliveryError";
    this.code = code;
    this.retryable = retryable;
    this.outcomeUnknown = outcomeUnknown;
  }
}

export const integrationHttpError = (operation, status) => {
  const retryable = status === 408 || status === 429 || status >= 500;
  return new IntegrationDeliveryError(`${operation}_${status}`, retryable);
};

export const getDeliveryFailure = (error, attempts) => {
  const code = error instanceof IntegrationDeliveryError
    ? error.code
    : error instanceof Error && /^[a-z0-9_]+$/i.test(error.message)
      ? error.message
      : "integration_delivery_failed";
  const retryable = error instanceof IntegrationDeliveryError || typeof error?.retryable === "boolean"
    ? error.retryable
    : error instanceof Error && /^[a-z0-9_]+$/i.test(error.message)
      ? false
      : true;
  const retry = retryable && attempts < MAX_AUTOMATIC_DELIVERY_ATTEMPTS;
  const retrySeconds = Math.min(2 ** Math.min(Number(attempts), 12), 3600);
  return { code, retry, retryAt: retry ? new Date(Date.now() + retrySeconds * 1000) : TERMINAL_RETRY_AT };
};

export const unwrapDeliveryPayload = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new IntegrationDeliveryError("integration_payload_invalid");
  }
  if (!Object.hasOwn(value, "version")) return value; // Backward-compatible outbox rows.
  if (value.version !== 1 || !value.data || typeof value.data !== "object" || Array.isArray(value.data)) {
    throw new IntegrationDeliveryError("integration_payload_version_unsupported");
  }
  return value.data;
};

export const resolveClickUpListId = (aggregateType, env) => {
  if (aggregateType !== "onboarding_submission") throw new IntegrationDeliveryError("clickup_aggregate_not_supported");
  const listId = env.CLICKUP_ONBOARDING_LIST_ID?.trim();
  if (!listId || !/^\d+$/.test(listId)) throw new IntegrationDeliveryError("clickup_list_not_configured");
  return listId;
};

export const buildContactDeliveryPayload = (payload) => ({
  name: payload.name,
  company: payload.company,
  whatsapp: payload.whatsapp,
  email: payload.email,
  service: payload.service,
  stage: payload.stage,
  requestType: payload.requestType,
  ...(payload.partnershipApplication ? { partnershipApplication: payload.partnershipApplication } : {}),
  serviceInterests: payload.serviceInterests,
  needsServiceGuidance: payload.needsServiceGuidance,
  message: payload.message,
  consentVersion: payload.consentVersion,
  locale: payload.locale,
  source: payload.source,
  utm: payload.utm
});

export const findSheetRowReference = (range, values, deliveryId) => {
  const index = Array.isArray(values) ? values.findIndex((row) => row?.[0] === deliveryId) : -1;
  const startRow = typeof range === "string" ? Number(range.match(/![A-Z]+(\d+)/i)?.[1] || 1) : 1;
  return index >= 0 ? `Leads!A${startRow + index}:D${startRow + index}` : null;
};
