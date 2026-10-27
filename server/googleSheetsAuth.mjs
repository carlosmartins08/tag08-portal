import { createSign } from "node:crypto";
import { IntegrationDeliveryError, integrationHttpError } from "./integrationDelivery.mjs";

const toBase64Url = (value) => Buffer.from(value).toString("base64url");

export const getGoogleSheetsAccessToken = async ({
  env = process.env,
  fetchImpl = globalThis.fetch
} = {}) => {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  } catch {
    throw new IntegrationDeliveryError("google_service_account_invalid");
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new IntegrationDeliveryError("google_service_account_not_configured");
  }

  const privateKey = String(serviceAccount.private_key).replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = `${toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${toBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const assertion = `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;
  const response = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(15000),
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  if (!response.ok) throw integrationHttpError("google_token_exchange_failed", response.status);
  const tokenResponse = await response.json().catch(() => null);
  if (!tokenResponse || typeof tokenResponse.access_token !== "string" || !tokenResponse.access_token) {
    throw new IntegrationDeliveryError("google_token_response_invalid");
  }
  return tokenResponse.access_token;
};
