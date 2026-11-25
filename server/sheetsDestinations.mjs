export const GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID = "1xpl6y5jLIESG3x5AF-yOS5Dh1G-2owPxLsPa8_hh-ms";
export const GOOGLE_SHEETS_STAGING_SPREADSHEET_ID = "1XXXCv0Zn9grrv1BxPR76H2iIfYQAyfiA6rEUSfNVCQE";

export const getOperationalSheetsDestination = (deploymentEnvironment) => {
  if (deploymentEnvironment === "production") return GOOGLE_SHEETS_PRODUCTION_SPREADSHEET_ID;
  if (deploymentEnvironment === "staging") return GOOGLE_SHEETS_STAGING_SPREADSHEET_ID;
  return null;
};
