import { createHash } from "node:crypto";

/**
 * Contact v1 projection for the Leads sheet.
 *
 * This pure mapper intentionally does not perform I/O. The existing A:D
 * envelope remains byte-compatible at the cell-value level; E+ is a fixed,
 * versioned allowlist of fields already present in the Contact delivery
 * payload. Its adapter is wired for Contact only, but the existing integration
 * enable flags remain required. Newly accepted operational rows use a
 * versioned hash envelope in D; legacy rows remain readable for replay.
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

export const CONTACT_DELIVERY_HEADERS = Object.freeze([
  "sheets_row_reference",
  "clickup_status",
  "clickup_task_id",
  "clickup_attempts",
  "clickup_last_error_code",
  "sheets_status",
  "updated_at"
]);

export const TALENT_SHEETS_V1_HEADERS = Object.freeze([
  "projection_version",
  "name",
  "email",
  "phone",
  "interest_areas_json",
  "other_specialty",
  "experience_summary",
  "availability",
  "motivation",
  "relevant_projects",
  "relevant_experience",
  "source",
  "locale"
]);

export const TALENT_DELIVERY_HEADERS = Object.freeze([
  "sheets_row_reference",
  "clickup_status",
  "clickup_task_id",
  "clickup_attempts",
  "clickup_last_error_code",
  "sheets_status",
  "updated_at"
]);

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const cell = (value) => value === null || value === undefined ? "" : value;
const jsonCell = (value) => value === null || value === undefined ? "" : JSON.stringify(value);
const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isRecord(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
};

export const buildMinimalSheetsPayloadEnvelope = (payload) => JSON.stringify({
  envelopeVersion: 2,
  payloadSha256: createHash("sha256").update(JSON.stringify(canonicalize(payload))).digest("hex")
});

/**
 * Return a Sheets row with the established A:D shape and Contact v1 projection
 * in E:P. Legacy callers keep raw D; the operational writer opts into a
 * versioned hash envelope. The payload is already unwrapped by the caller.
 */
export const buildContactSheetsV1Row = (delivery, payload, { minimalEnvelope = false } = {}) => {
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
    minimalEnvelope ? buildMinimalSheetsPayloadEnvelope(payload) : JSON.stringify(payload),
    ...projection
  ];
};

/** Versioned, structured Talentos projection. The legacy A:D envelope is assembled by the adapter. */
export const buildTalentSheetsV1Projection = (payload) => {
  if (!isRecord(payload)) throw new TypeError("talent_sheet_payload_invalid");
  const isV2 = payload.contractVersion === 2;
  const areas = isV2 && Array.isArray(payload.interestAreas) ? payload.interestAreas : [];
  return [
    1,
    cell(payload.name),
    cell(payload.email),
    cell(payload.phone),
    jsonCell(areas),
    cell(payload.otherSpecialty),
    cell(payload.experienceSummary),
    cell(payload.availability),
    cell(payload.motivation),
    cell(payload.relevantProjects),
    cell(payload.relevantExperience),
    cell(payload.source),
    cell(payload.locale)
  ];
};
