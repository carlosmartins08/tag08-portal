export const ONBOARDING_DRAFT_VERSION = 1;

export const onboardingDraftFields = [
  "currentQuestion", "submissionMode", "operatorName", "companyName", "cnpjCpf", "cityState", "companyWebsite", "companyInstagram", "companyLinkedin", "serviceLanguage",
  "responsibleName", "responsibleRole", "responsibleEmail", "responsibleWhatsapp", "focalPointText", "approverText", "financePointText",
  "businessMoment", "priorityMap", "maturityScore", "selectedServices", "customServiceText",
  "smChannels", "smTargetAudience", "smPriorityProducts", "smCompetitors", "smHasBrandIdentity", "smHasMediaBank", "smRecordsVideos", "smApprovesContent", "smForbiddenTopics",
  "brBrandExists", "brReasonForChange", "brDesiredAttributes", "brReferencesLink", "brAvoidBrands", "brBrandNeverBeLike", "brHasNameSelected", "brHasSloganText", "brRequiredApplications",
  "webHasDomain", "webHasHosting", "webCurrentSite", "webMainGoal", "webRequiredPages", "webHasBrandIdentity", "webHasTextsReady", "webHasFilesReady", "webIntegrateWhatsApp", "webIntegrateForm", "webIntegrateCRM", "webNeedsBlog", "webReferenceUrls",
  "piTeamSize", "piDepartments", "piDisorganizedAreas", "piPersonDependent", "piReworkTasks", "piCurrentTools", "piHasDocumentation", "piHasOrgChart", "piHasMeetings", "piMainBottleneck",
  "paHasPiDiagnose", "paDocumentedProcesses", "paUnappliedProcesses", "paTeamsToTrain", "paResponsibleLeader", "paBiggestDifficulty", "paHasTimeForTraining",
  "generalBriefingText", "linkDrive", "linkPortfolio", "linkReferences", "linkDocuments", "linkCommercial",
  "whySeekTag08", "whatTriedBefore", "whatDidNotWork", "goodResult90Days", "biggestUrgency", "notToMakeMistakes", "importantDeadlines",
  "consentTruth", "consentUsage", "consentNoPasswords"
] as const;

export type OnboardingDraftValues = Record<(typeof onboardingDraftFields)[number], string | number | boolean | string[]>;
export type OnboardingDraft = { version: 1; currentStep: number; values: Partial<OnboardingDraftValues> };

export const parseOnboardingDraft = (value: unknown): OnboardingDraft | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 64 * 1024) return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== ONBOARDING_DRAFT_VERSION || !Number.isInteger(candidate.currentStep) || Number(candidate.currentStep) < 0 || Number(candidate.currentStep) > 8) return null;
  if (!candidate.values || typeof candidate.values !== "object" || Array.isArray(candidate.values)) return null;
  const values = candidate.values as Record<string, unknown>;
  const allowed = new Set<string>(onboardingDraftFields);
  const entries = Object.entries(values);
  if (entries.length > onboardingDraftFields.length) return null;
  const safeValues: Partial<OnboardingDraftValues> = {};
  for (const [key, fieldValue] of entries) {
    if (!allowed.has(key)) return null;
    if (typeof fieldValue === "string" && fieldValue.length <= 5_000) {
      safeValues[key as keyof OnboardingDraftValues] = fieldValue;
    } else if (typeof fieldValue === "boolean" || (typeof fieldValue === "number" && Number.isFinite(fieldValue))) {
      safeValues[key as keyof OnboardingDraftValues] = fieldValue;
    } else if (Array.isArray(fieldValue) && fieldValue.length <= 40 && fieldValue.every((item) => typeof item === "string" && item.length <= 180)) {
      safeValues[key as keyof OnboardingDraftValues] = fieldValue;
    } else {
      return null;
    }
  }
  return { version: 1, currentStep: Number(candidate.currentStep), values: safeValues };
};
