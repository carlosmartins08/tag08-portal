import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS
} from "../server/contactSheetsProjection.mjs";
import { GOOGLE_SHEETS_STAGING_SPREADSHEET_ID } from "../server/sheetsDestinations.mjs";

export const CONTACT_STAGING_SPREADSHEET_ID = GOOGLE_SHEETS_STAGING_SPREADSHEET_ID;
export const CONTACT_TALENT_STAGING_CONFIRMATION = "TAG08_CONTACT_TALENT_STAGING";
export const CONTACT_TALENT_STAGING_SYNTHETIC_MARKER = "TAG08 STAGING SYNTHETIC";

export const CONTACT_STAGING_HEADERS = Object.freeze([
  "Delivery ID", "Record ID", "Created At", "Payload JSON",
  ...CONTACT_SHEETS_V1_HEADERS,
  ...CONTACT_DELIVERY_HEADERS
]);

export const TALENT_STAGING_HEADERS = Object.freeze([
  "Delivery ID", "Record ID", "Created At", "Payload JSON",
  ...TALENT_SHEETS_V1_HEADERS,
  ...TALENT_DELIVERY_HEADERS
]);

export const getContactTalentStagingExpected = () => Object.freeze({
  spreadsheetId: CONTACT_STAGING_SPREADSHEET_ID,
  contactHeaders: CONTACT_STAGING_HEADERS,
  talentHeaders: TALENT_STAGING_HEADERS
});
