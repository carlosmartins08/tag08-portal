import { z } from "zod";

const boundedText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const phone = z.string().trim().min(8).max(30).transform((value) => value.replace(/[^0-9+]/g, ""));
const locale = z.enum(["pt", "en", "es"]).default("pt");
const consentVersion = z.string().trim().min(1).max(64).default("site-v1");
const source = z.string().trim().min(1).max(120).default("site");
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
  message: optionalText(4000),
  consent: z.literal(true),
  consentVersion,
  locale,
  source,
  utm
});

export const talentApplicationSchema = z.object({
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

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
export type TalentApplicationInput = z.infer<typeof talentApplicationSchema>;
