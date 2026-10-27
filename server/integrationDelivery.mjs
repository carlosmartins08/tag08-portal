export const MAX_AUTOMATIC_DELIVERY_ATTEMPTS = 8;
export const TERMINAL_RETRY_AT = new Date("9999-12-31T23:59:59.999Z");
export const CONTACT_STAGING_CLICKUP_LIST_ID = "901327894264";
export const CONTACT_STAGING_CLICKUP_INITIAL_STATUS = "em aberto \u{1F9E0}";

export class IntegrationDeliveryError extends Error {
  constructor(code, retryable = false) {
    super(code);
    this.name = "IntegrationDeliveryError";
    this.code = code;
    this.retryable = retryable;
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
  const variableByAggregate = {
    contact_lead: "CLICKUP_PRE_SALES_LIST_ID",
    talent_application: "CLICKUP_TALENT_LIST_ID",
    onboarding_submission: "CLICKUP_ONBOARDING_LIST_ID"
  };
  const variable = variableByAggregate[aggregateType];
  if (!variable) throw new IntegrationDeliveryError("clickup_aggregate_not_supported");
  const listId = env[variable]?.trim();
  if (!listId || !/^\d+$/.test(listId)) throw new IntegrationDeliveryError("clickup_list_not_configured");
  return listId;
};

export const isCommercialContactRequest = (requestType) => requestType === "new_project";

const plain = (value) => typeof value === "string" && value.trim() ? value.trim() : "—";

export const buildContactClickUpTask = (delivery, payload) => {
  const serviceInterests = Array.isArray(payload.serviceInterests) ? payload.serviceInterests : [];
  const utm = payload.utm && typeof payload.utm === "object" ? payload.utm : {};
  const createdAt = delivery.created_at instanceof Date ? delivery.created_at.toISOString() : plain(delivery.created_at);
  const lines = [
    `Nome: ${plain(payload.name)}`,
    `Empresa: ${plain(payload.company)}`,
    `Telefone: ${plain(payload.whatsapp)}`,
    `E-mail: ${plain(payload.email)}`,
    `Intenção: ${plain(payload.requestType)}`,
    `Frentes: ${serviceInterests.length ? serviceInterests.join(", ") : plain(payload.service)}`,
    `Precisa de orientação: ${payload.needsServiceGuidance ? "Sim" : "Não"}`,
    `Mensagem: ${plain(payload.message)}`,
    `Origem: ${plain(payload.source)}`,
    `UTM: ${[utm.source, utm.medium, utm.campaign, utm.content, utm.term].filter(Boolean).join(" / ") || "—"}`,
    `Data: ${createdAt}`,
    `Record ID: ${plain(delivery.aggregate_id)}`,
    `Delivery ID: ${plain(delivery.id)}`
  ];
  return {
    name: `TAG08 Contact ${delivery.aggregate_id}`,
    description: lines.join("\n"),
    tags: ["tag08", "contact_lead"]
  };
};

export const findSheetRowReference = (range, values, deliveryId) => {
  const index = Array.isArray(values) ? values.findIndex((row) => row?.[0] === deliveryId) : -1;
  const startRow = typeof range === "string" ? Number(range.match(/![A-Z]+(\d+)/i)?.[1] || 1) : 1;
  return index >= 0 ? `Leads!A${startRow + index}:D${startRow + index}` : null;
};
