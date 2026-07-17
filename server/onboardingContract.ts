export const ONBOARDING_PAYLOAD_VERSION = 1;
export const ONBOARDING_QUEUE_MAX_RETRIES = 5;
export const ONBOARDING_QUEUE_MAX_AGE_DAYS = 30;
export const ONBOARDING_QUEUE_SYNC_WINDOW_SECONDS = 60;
export const ONBOARDING_SCHEMA_VERSIONS = [ONBOARDING_PAYLOAD_VERSION];

export type OnboardingDeliveryStatus = "received" | "accepted" | "queued" | "failed";

export interface OnboardingPayload {
  clientData: {
    companyName?: string;
    cnpjCpf?: string;
    cityState?: string;
    website?: string;
    instagram?: string;
    linkedin?: string;
    preferredLanguage?: string;
    [key: string]: unknown;
  };
  projectContacts: {
    responsibleName?: string;
    role?: string;
    email?: string;
    whatsapp?: string;
    focalPoint?: string;
    approver?: string;
    financePoint?: string;
    [key: string]: unknown;
  };
  selectedServices: string[];
  businessMoment: {
    momentPhrase?: string;
    priorityArea?: string;
    maturityLevel?: number | string;
    [key: string]: unknown;
  };
  generalBriefing: Record<string, unknown>;
  serviceSpecificBriefing: Record<string, unknown>;
  filesAndLinks: {
    drive?: string;
    instagram?: string;
    site?: string;
    portfolio?: string;
    references?: string;
    documents?: string;
    commercial?: string;
    [key: string]: unknown;
  };
  consent: {
    truthChecked?: boolean;
    useChecked?: boolean;
    noPasswordsChecked?: boolean;
    [key: string]: unknown;
  };
  submittedAt: string;
  source: string;
  status: OnboardingDeliveryStatus;
  schemaVersion?: number;
  sheetPayload?: Record<string, unknown>;
  clickupPayload?: Record<string, unknown>;
  meta?: {
    replayedFromQueue?: boolean;
    queueEntryId?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface OnboardingSubmissionResult {
  ok: boolean;
  submissionId: string;
  status: OnboardingDeliveryStatus;
  receivedAt: string;
  schemaVersion: number;
  metrics?: {
    processingMs: number;
  };
  error?: string;
}

const requiredText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const normalizePhone = (raw: unknown): string => {
  if (!requiredText(raw)) return "";
  return raw
    .trim()
    .replace(/[^0-9+]/g, "")
    .slice(0, 30);
};

const normalizeEmail = (raw: unknown): string => {
  if (!requiredText(raw)) return "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
};

const normalizeText = (raw: unknown): string => {
  if (!requiredText(raw)) return "";
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 500);
};

const getBaseSubmission = (payload: unknown): OnboardingPayload | null => {
  if (!payload || typeof payload !== "object") return null;
  return payload as OnboardingPayload;
};

export const parseAndValidatePayload = (
  payload: unknown
): { payload: OnboardingPayload; errors: string[] } => {
  const parsed = getBaseSubmission(payload);
  const errors: string[] = [];

  if (!parsed) {
    return {
      payload: parsed as OnboardingPayload,
      errors: ["Payload invalido."]
    };
  }

  const normalized: OnboardingPayload = {
    ...parsed,
    clientData: {
      ...parsed.clientData
    },
    projectContacts: {
      ...parsed.projectContacts
    },
    filesAndLinks: {
      ...parsed.filesAndLinks
    },
    consent: {
      ...parsed.consent
    },
    businessMoment: {
      ...parsed.businessMoment
    },
    generalBriefing: typeof parsed.generalBriefing === "object" && parsed.generalBriefing !== null ? parsed.generalBriefing : {},
    serviceSpecificBriefing:
      typeof parsed.serviceSpecificBriefing === "object" && parsed.serviceSpecificBriefing !== null
        ? parsed.serviceSpecificBriefing
        : {}
  };

  const incomingSchemaVersion = Number(parsed.schemaVersion);
  if (parsed.schemaVersion === undefined) {
    normalized.schemaVersion = ONBOARDING_PAYLOAD_VERSION;
  } else if (Number.isFinite(incomingSchemaVersion) && Number.isInteger(incomingSchemaVersion)) {
    normalized.schemaVersion = incomingSchemaVersion;
    if (!ONBOARDING_SCHEMA_VERSIONS.includes(incomingSchemaVersion)) {
      errors.push(`schemaVersion '${incomingSchemaVersion}' incompatível com o contrato atual.`);
    }
  } else {
    errors.push("schemaVersion invalido.");
    normalized.schemaVersion = ONBOARDING_PAYLOAD_VERSION;
  }
  normalized.status = "received";
  normalized.source = normalizeText(parsed.source) || "onboarding-web";
  normalized.submittedAt =
    typeof parsed.submittedAt === "string" && parsed.submittedAt.trim().length > 0
      ? parsed.submittedAt
      : new Date().toISOString();

  normalized.meta = {
    ...parsed.meta,
    replayedFromQueue: parsed.meta?.replayedFromQueue === true
  };

  normalized.clientData.companyName = normalizeText(normalized.clientData.companyName);
  normalized.clientData.cnpjCpf = normalizeText(normalized.clientData.cnpjCpf);
  normalized.clientData.cityState = normalizeText(normalized.clientData.cityState);
  normalized.clientData.website = normalizeText(normalized.clientData.website);
  normalized.clientData.instagram = normalizeText(normalized.clientData.instagram);
  normalized.clientData.linkedin = normalizeText(normalized.clientData.linkedin);
  normalized.clientData.preferredLanguage = normalizeText(normalized.clientData.preferredLanguage);

  normalized.projectContacts.responsibleName = normalizeText(normalized.projectContacts.responsibleName);
  normalized.projectContacts.role = normalizeText(normalized.projectContacts.role);
  normalized.projectContacts.focalPoint = normalizeText(normalized.projectContacts.focalPoint);
  normalized.projectContacts.approver = normalizeText(normalized.projectContacts.approver);
  normalized.projectContacts.financePoint = normalizeText(normalized.projectContacts.financePoint);

  normalized.businessMoment.momentPhrase = normalizeText(normalized.businessMoment.momentPhrase);
  normalized.businessMoment.priorityArea = normalizeText(normalized.businessMoment.priorityArea);

  normalized.filesAndLinks.drive = normalizeText(normalized.filesAndLinks.drive);
  normalized.filesAndLinks.instagram = normalizeText(normalized.filesAndLinks.instagram);
  normalized.filesAndLinks.site = normalizeText(normalized.filesAndLinks.site);
  normalized.filesAndLinks.portfolio = normalizeText(normalized.filesAndLinks.portfolio);
  normalized.filesAndLinks.references = normalizeText(normalized.filesAndLinks.references);
  normalized.filesAndLinks.documents = normalizeText(normalized.filesAndLinks.documents);
  normalized.filesAndLinks.commercial = normalizeText(normalized.filesAndLinks.commercial);

  const selectedServices = Array.isArray(normalized.selectedServices)
    ? Array.from(
        new Set(
          normalized.selectedServices
            .filter((service) => typeof service === "string")
            .map((service) => normalizeText(service).slice(0, 180))
            .filter(Boolean)
        )
      )
    : [];
  normalized.selectedServices = selectedServices;

  normalized.consent = {
    ...normalized.consent
  };
  normalized.projectContacts.email = normalizeEmail(normalized.projectContacts.email);
  normalized.projectContacts.whatsapp = normalizePhone(normalized.projectContacts.whatsapp);

  if (!requiredText(normalized.clientData?.companyName)) {
    errors.push("Nome da empresa e campo obrigatorio.");
  }

  if (!requiredText(normalized.projectContacts?.responsibleName)) {
    errors.push("Responsavel principal e campo obrigatorio.");
  }

  if (!requiredText(normalized.projectContacts?.email) || !normalized.projectContacts.email.includes("@")) {
    errors.push("Email valido e obrigatorio.");
  }

  if (!requiredText(normalized.projectContacts?.whatsapp)) {
    errors.push("WhatsApp do responsavel e obrigatorio.");
  }

  if (!Array.isArray(normalized.selectedServices) || normalized.selectedServices.length === 0) {
    errors.push("Pelo menos um servico deve ser informado.");
  }

  if (
    !normalized.consent ||
    normalized.consent.truthChecked !== true ||
    normalized.consent.useChecked !== true ||
    normalized.consent.noPasswordsChecked !== true
  ) {
    errors.push("Termos de consentimento nao confirmados.");
  }

  return { payload: normalized, errors };
};
