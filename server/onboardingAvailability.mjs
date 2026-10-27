/**
 * Production defaults to fail closed so the database-backed Onboarding flow
 * cannot become public until its runtime has been homologated.
 * Non-production keeps the existing local behavior unless explicitly disabled.
 */
export const isOnboardingEnabled = (env = process.env) => {
  const configured = env.ONBOARDING_ENABLED?.trim().toLowerCase();
  if (configured === "true") return true;
  if (configured === "false") return false;
  return env.NODE_ENV !== "production";
};
