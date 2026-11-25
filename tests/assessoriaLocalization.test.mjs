import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx", "utf8");
const testimonials = readFileSync("src/components/TrustTestimonialsSection.tsx", "utf8");
const catalogStart = source.indexOf("const ASSESSORIA_COPY = {");
const englishStart = source.indexOf("  en: {", catalogStart);
const spanishStart = source.indexOf("  es: {", englishStart);
const catalogEnd = source.indexOf("} satisfies Record<Exclude<RouteLocale", spanishStart);
const english = source.slice(englishStart, spanishStart);
const spanish = source.slice(spanishStart, catalogEnd);

test("Assessoria EN/ES catalogs cover all content groups and connect them to rendering", () => {
  assert.ok(catalogStart >= 0 && englishStart > catalogStart && spanishStart > englishStart && catalogEnd > spanishStart);

  const fields = [
    "heroEyebrow", "heroTitle", "heroHighlight", "contact", "contactAria", "initialReading", "intro",
    "imageAlt", "imageFallback", "imageCaption", "fitTitle", "fitIntro", "fitLabel", "nonFitLabel",
    "fitSignals", "nonFitSignals", "decisionTitle", "decisionIntro", "methodSteps", "organizeTitle",
    "organizeIntro", "capabilities", "diagnosticEyebrow", "diagnosticTitle", "diagnosticIntro",
    "maturityReading", "questionOf", "progressAria", "questionAria", "backQuestion", "answerCanChange",
    "assessmentComplete", "currentReading", "assessmentDisclaimer", "whatsappBrazil", "whatsappInternational",
    "whatsappReadingAria", "whatsappInternationalAria", "repeatAssessment", "faqTitle", "faqIntro",
    "finalTitle", "finalDescription", "otherSolutions", "consultationMessage", "diagnosticMessage",
    "diagnosticResults", "questions", "faq"
  ];

  for (const field of fields) {
    assert.match(english, new RegExp(`\\b${field}:`), `English catalog lacks ${field}`);
    assert.match(spanish, new RegExp(`\\b${field}:`), `Spanish catalog lacks ${field}`);
  }

  for (const renderedField of [
    "heroEyebrow", "heroTitle", "heroHighlight", "contact", "contactAria", "initialReading", "intro",
    "imageAlt", "imageFallback", "imageCaption", "fitTitle", "fitIntro", "fitLabel", "nonFitLabel",
    "decisionTitle", "decisionIntro", "organizeTitle", "organizeIntro", "diagnosticEyebrow",
    "diagnosticTitle", "diagnosticIntro", "maturityReading", "questionOf", "progressAria", "questionAria",
    "backQuestion", "answerCanChange", "assessmentComplete", "currentReading", "assessmentDisclaimer",
    "whatsappBrazil", "whatsappInternational", "whatsappReadingAria", "whatsappInternationalAria",
    "repeatAssessment", "faqTitle", "faqIntro", "finalTitle", "finalDescription", "otherSolutions"
  ]) {
    assert.ok(source.includes(`copy?.${renderedField}`), `JSX does not consume localized field ${renderedField}`);
  }

  for (const sourcePhrase of [
    "Strategic Business Advisory", "When advisory makes sense.", "How TAG08 structures decisions.",
    "How are marketing priorities set today?", "What is TAG08 Strategic Business Advisory?",
    "Asesoría Estratégica de Negocios", "Cuándo tiene sentido la asesoría.", "Cómo TAG08 organiza las decisiones.",
    "¿Cómo se definen hoy las prioridades de marketing?", "¿Qué es la Asesoría Estratégica de Negocios de TAG08?"
  ]) assert.ok(source.includes(sourcePhrase), `Localized copy is missing: ${sourcePhrase}`);
});

test("Assessoria defaults to Portuguese and selects a complete EN/ES catalog when requested", () => {
  assert.match(source, /export default function AssessoriaMarketingDigitalEstrategico\(\{ onNavigate, locale = "pt" \}/);
  assert.match(source, /const copy = locale === "pt" \? null : ASSESSORIA_COPY\[locale\]/);
  assert.match(source, /satisfies Record<Exclude<RouteLocale, "pt">/);
  assert.match(source, /ServiceInsightsBridge[^\n]*locale=\{locale\}/);
});

test("Assessment translation preserves scoring values and question sequence", () => {
  assert.equal((source.match(/value: (10|16|23|30), text:/g) ?? []).length, 16);
  assert.match(source, /const questions = copy\s*\?\s*AUDIT_QUESTIONS\.map/);
  assert.match(source, /optionIndex\) => \(\{ \.\.\.option, text: copy\.questions\[questionIndex\]\.options\[optionIndex\] \}\)/);
  assert.match(source, /const diagnosticIndex = totalScore <= 59 \? 0 : totalScore <= 79 \? 1 : totalScore <= 100 \? 2 : 3/);
});

test("Assessoria testimonials use localized UI and translated approved internal evidence", () => {
  for (const key of ["roberta-chaves", "marcus-azevedo", "juliana-reis", "beatriz-nogueira"]) {
    assert.ok(testimonials.includes(`internal-testimonial/${key}`), `Missing translated evidence for ${key}`);
  }
  assert.match(testimonials, /Translated from the original Portuguese testimonial/);
  assert.match(testimonials, /Traducción del testimonio original en portugués/);
  assert.match(testimonials, /locale === "pt" && googleBusinessSource === "live"/);
  assert.match(source, /<TrustTestimonialsSection locale=\{locale\}/);
  assert.match(testimonials, /getLocalizedPath\("\/contato", locale\)/);
});
