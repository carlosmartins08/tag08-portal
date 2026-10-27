import {
  CONTACT_DELIVERY_HEADERS,
  CONTACT_SHEETS_V1_HEADERS,
  TALENT_DELIVERY_HEADERS,
  TALENT_SHEETS_V1_HEADERS
} from "../server/contactSheetsProjection.mjs";
import {
  CONTACT_STAGING_CLICKUP_INITIAL_STATUS,
  CONTACT_STAGING_CLICKUP_LIST_ID
} from "../server/integrationDelivery.mjs";

export const CONTACT_STAGING_SPREADSHEET_ID = "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE";
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
  clickUpContactListId: CONTACT_STAGING_CLICKUP_LIST_ID,
  clickUpTalentListId: CONTACT_STAGING_CLICKUP_LIST_ID,
  clickUpInitialStatus: CONTACT_STAGING_CLICKUP_INITIAL_STATUS,
  contactHeaders: CONTACT_STAGING_HEADERS,
  talentHeaders: TALENT_STAGING_HEADERS
});
