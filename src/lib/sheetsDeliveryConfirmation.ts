type SubmissionKind = "contact" | "talent";

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const confirmsSheetsSubmission = (status: number, body: unknown, kind: SubmissionKind) => {
  if (status !== 202 || !isObject(body) || body.ok !== true || body.status !== "accepted") return false;

  const recordId = kind === "contact" ? body.leadId : body.applicationId;
  if (typeof recordId !== "string" || recordId.trim().length === 0) return false;

  const deliveryStatus = body.deliveryStatus;
  if (!isObject(deliveryStatus) || deliveryStatus.sheets !== "delivered") return false;

  const rowReference = deliveryStatus.sheetsRowReference;
  const sheet = kind === "contact" ? "Leads" : "Talentos";
  const lastColumn = kind === "contact" ? "W" : "X";
  return typeof rowReference === "string" && new RegExp(`^${sheet}!A((?:[2-9]|[1-9]\\d+)):${lastColumn}\\1$`).test(rowReference);
};
