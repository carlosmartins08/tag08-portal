/**
 * Contact v1 projection for the Leads sheet.
 *
 * This pure mapper intentionally does not perform I/O. The existing A:D
 * envelope remains byte-compatible at the cell-value level; E+ is a fixed,
 * versioned allowlist of fields already present in the Contact delivery
 * payload. Its adapter is wired for Contact only, but the existing integration
 * enable flags remain required. D stays full legacy JSON until a separately
 * versioned minimization contract is approved for existing consumers.
 */

export const CONTACT_SHEETS_V1_HEADERS = Object.freeze([
  "projection_version",
  "name",
  "company",
  "whatsapp",
  "email",
  "request_type",
  "service",
  "service_interests_json",
  "needs_service_guidance",
  "message",
  "source",
  "utm_json"
]);

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const cell = (value) => value === null || value === undefined ? "" : value;
const jsonCell = (value) => value === null || value === undefined ? "" : JSON.stringify(value);

/**
 * Return a Sheets row that preserves the established A:D envelope and adds
 * the Contact v1 projection in E:P. The caller must pass the already-unwrapped
 * delivery payload, matching the current worker's existing behavior.
 */
export const buildContactSheetsV1Row = (delivery, payload) => {
  if (!isRecord(delivery) || delivery.aggregate_type !== "contact_lead") {
    throw new TypeError("contact_sheet_delivery_invalid");
  }
  if (typeof delivery.id !== "string" || delivery.id.length === 0 ||
      typeof delivery.aggregate_id !== "string" || delivery.aggregate_id.length === 0) {
    throw new TypeError("contact_sheet_identity_invalid");
  }
  if (!isRecord(payload)) throw new TypeError("contact_sheet_payload_invalid");

  const projection = [
    1,
    cell(payload.name),
    cell(payload.company),
    cell(payload.whatsapp),
    cell(payload.email),
    cell(payload.requestType),
    cell(payload.service),
    jsonCell(payload.serviceInterests),
    cell(payload.needsServiceGuidance),
    cell(payload.message),
    cell(payload.source),
    jsonCell(payload.utm)
  ];

  return [
    delivery.id,
    delivery.aggregate_id,
    delivery.created_at,
    JSON.stringify(payload),
    ...projection
  ];
};
