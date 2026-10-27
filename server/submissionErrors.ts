export const isPersistenceUnavailable = (error: unknown) =>
  error instanceof Error && error.message === "persistence_unavailable";

export const getPersistenceErrorCode = (error: unknown) => {
  if (isPersistenceUnavailable(error)) return "database_configuration_unavailable";
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string" && /^P\d{4}$/.test(error.code)) return error.code;
  if (error instanceof Error && ["onboarding_session_invalid", "onboarding_already_completed", "idempotency_key_conflict"].includes(error.message)) return error.message;
  if (error instanceof Error) return error.name || "database_operation_failed";
  return "database_operation_failed";
};
