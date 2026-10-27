import { z } from "zod";
import { PARTNERSHIP_MODALITY_VALUES } from "../src/types";
import {
  TALENT_COMMERCIAL_OPERATIONAL_AREAS,
  TALENT_CREATIVE_TECHNICAL_AREAS,
  TALENT_INTEREST_AREA_VALUES
} from "../src/types/talent";

const boundedText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const phone = z.string().trim().min(8).max(30).transform((value) => value.replace(/[^0-9+]/g, ""));
const locale = z.enum(["pt", "en", "es"]).default("pt");
const consentVersion = z.string().trim().min(1).max(64).default("site-v1");
const source = z.string().trim().min(1).max(120).default("site");
export const contactIdempotencyKeySchema = z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9._:-]+$/);
const utm = z
  .object({
    source: optionalText(120),
    medium: optionalText(120),
    campaign: optionalText(180),
    content: optionalText(180),
    term: optionalText(180)
  })
  .optional()
  .default({ source: "", medium: "", campaign: "", content: "", term: "" });

export const contactLeadSchema = z.object({
  name: boundedText(160),
  company: boundedText(180),
  whatsapp: phone,
  email,
  service: boundedText(120),
  stage: boundedText(120),
  // Additive fields: older queued submissions remain valid and receive neutral defaults.
  requestType: z.enum(["new_project", "diagnostic", "existing_client", "partnership", "unspecified"]).optional().default("unspecified"),
  partnershipApplication: z.object({
    version: z.literal(1),
    modality: z.enum(PARTNERSHIP_MODALITY_VALUES)
  }).strict().optional(),
  serviceInterests: z.array(boundedText(120)).max(9).refine((values) => new Set(values).size === values.length, "Service interests must be unique").optional().default([]),
  needsServiceGuidance: z.boolean().optional().default(false),
  message: optionalText(4000),
  consent: z.literal(true),
  consentVersion,
  locale,
  source,
  utm
}).superRefine((payload, context) => {
  if (payload.partnershipApplication && payload.requestType !== "partnership") {
    context.addIssue({
      code: "custom",
      path: ["partnershipApplication"],
      message: "Partnership modality requires a partnership Contact request."
    });
  }
});

const talentApplicationV1Schema = z.object({
  vacancyId: boundedText(120),
  vacancyTitle: boundedText(220),
  name: boundedText(160),
  email,
  phone,
  linkedin: z.string().trim().url().max(500),
  portfolio: z.string().trim().url().max(500).optional().or(z.literal("")),
  coverLetter: boundedText(4000),
  resumeFileName: optionalText(255),
  consent: z.literal(true),
  consentVersion,
  locale,
  source,
  utm
});

const optionalHttpsUrl = z.string().trim().refine((value) => {
  if (!value) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "URL must use HTTPS").optional().default("");

const optionalLinkedInUrl = optionalHttpsUrl.refine((value) => {
  if (!value) return true;
  try {
    return ["linkedin.com", "www.linkedin.com"].includes(new URL(value).hostname);
  } catch {
    return false;
  }
}, "LinkedIn URL must use linkedin.com");

const talentApplicationV2Schema = z.object({
  contractVersion: z.literal(2),
  interestAreas: z.array(z.enum(TALENT_INTEREST_AREA_VALUES))
    .min(1)
    .max(TALENT_INTEREST_AREA_VALUES.length)
    .refine((values) => new Set(values).size === values.length, "Interest areas must be unique")
    .transform((values) => [...values].sort((left, right) => TALENT_INTEREST_AREA_VALUES.indexOf(left) - TALENT_INTEREST_AREA_VALUES.indexOf(right))),
  otherSpecialty: optionalText(120),
  name: boundedText(160),
  email,
  phone,
  linkedin: optionalLinkedInUrl,
  resumeUrl: optionalHttpsUrl,
  portfolio: optionalHttpsUrl,
  experienceSummary: optionalText(1000),
  availability: optionalText(240),
  motivation: optionalText(1000),
  relevantProjects: optionalText(2000),
  relevantExperience: optionalText(1200),
  consent: z.literal(true),
  consentVersion,
  locale,
  source,
  utm
}).strict().superRefine((payload, context) => {
  const areas = new Set(payload.interestAreas);
  if (areas.has("other_specialties") && !payload.otherSpecialty) {
    context.addIssue({ code: "custom", path: ["otherSpecialty"], message: "Describe the selected specialty." });
  }
  if (!areas.has("other_specialties") && payload.otherSpecialty) {
    context.addIssue({ code: "custom", path: ["otherSpecialty"], message: "A specialty description requires the other-specialties area." });
  }
  if (!payload.interestAreas.some((area) => TALENT_CREATIVE_TECHNICAL_AREAS.includes(area)) && payload.relevantProjects) {
    context.addIssue({ code: "custom", path: ["relevantProjects"], message: "Project details require a creative or technical interest area." });
  }
  if (!payload.interestAreas.some((area) => TALENT_COMMERCIAL_OPERATIONAL_AREAS.includes(area)) && payload.relevantExperience) {
    context.addIssue({ code: "custom", path: ["relevantExperience"], message: "Experience details require a commercial or operational interest area." });
  }
});

export const talentApplicationSchema = z.union([talentApplicationV1Schema, talentApplicationV2Schema]);

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
export type TalentApplicationInput = z.infer<typeof talentApplicationSchema>;
