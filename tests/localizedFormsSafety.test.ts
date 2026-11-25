import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const contact = readFileSync("src/features/site/pages/Contato.tsx", "utf8");
const talent = readFileSync("src/features/site/pages/TrabalheConosco.tsx", "utf8");

test("Contact renders the existing EN/ES form catalogs without a page-local placeholder", () => {
  assert.match(contact, /CONTACT_PILOT_COPY\[locale\]/);
  assert.doesNotMatch(contact, /locale-translation-pending/);
  assert.match(contact, /pilotCopy\?\.form\.whatsappSummary/);
});

test("Contact FAQ no longer asks for revenue criteria that its answer does not define", () => {
  assert.match(contact, /What kinds of organizations does TAG08 work with\?/);
  assert.match(contact, /¿Con qué tipo de organizaciones trabaja TAG08\?/);
  assert.match(contact, /Que tipo de organização pode trabalhar com a TAG08\?/);
  assert.doesNotMatch(contact, /revenue levels|niveles de facturaci|perfil de cliente e faturamento/);
});

test("Talent Pool renders the existing EN/ES form catalogs without a page-local placeholder", () => {
  assert.match(talent, /talentPageCopy\[locale\]/);
  assert.doesNotMatch(talent, /locale-translation-pending/);
  assert.match(talent, /copy\?\.stepTitles/);
});

test("localized form routes remain protected by the shared publication gate", () => {
  const readiness = readFileSync("src/i18n/localizationReadiness.ts", "utf8");
  const routePage = readFileSync("src/app/[locale]/[[...segments]]/page.tsx", "utf8");

  assert.match(readiness, /contato: approved/);
  assert.match(readiness, /"trabalhe-conosco": approved/);
  assert.match(routePage, /if \(!isRouteLocalePublished\(route, locale\)\)/);
});

test("localized form work preserves the existing submission contracts", () => {
  assert.match(contact, /fetch\("\/api\/contact"/);
  assert.match(contact, /"Idempotency-Key": idempotencyKey/);
  assert.match(contact, /JSON\.stringify\(payload\)/);
  for (const field of ["requestType", "partnershipModality", "name", "company", "whatsapp", "email", "message"]) {
    assert.match(contact, new RegExp(`name="${field}"`));
  }

  assert.match(talent, /fetch\("\/api\/talent-applications"/);
  assert.match(talent, /"Idempotency-Key": idempotencyKey/);
  assert.match(talent, /JSON\.stringify\(payload\)/);
  for (const field of ["interestAreas", "name", "email", "phone", "linkedin", "resumeUrl", "portfolio", "consent"]) {
    assert.match(talent, new RegExp(`name="${field}"`));
  }
});

test("EN/ES catalogs contain validation, review, failure and success copy", () => {
  for (const catalog of ["en:", "es:"]) {
    assert.ok(contact.includes(catalog), `Contact catalog is missing ${catalog}`);
    assert.ok(talent.includes(catalog), `Talent catalog is missing ${catalog}`);
  }
  for (const phrase of ["reviewDescription", "successPartnership", "successDiagnostic", "successDefault", "automatic retry"]) {
    assert.ok(contact.includes(phrase), `Contact copy is missing ${phrase}`);
  }
  for (const phrase of ["validation", "reviewPresentation", "successTitle", "queued", "failed"]) {
    assert.ok(talent.includes(phrase), `Talent copy is missing ${phrase}`);
  }
  for (const phrase of ["localizedOrigin", "pilotCopy?.form.suggestion", "pilotCopy?.form.yourChoice", "yourChoice: \"your choice\"", "yourChoice: \"su elección\"", "pilotCopy?.form.serviceLegend", "pilotCopy?.form.submitPartnership", "pilotCopy?.form.successPartnership", "pilotCopy?.steps", "pilotCopy?.faq"]) {
    assert.ok(contact.includes(phrase), `Contact rendering is missing localized copy for ${phrase}`);
  }
  for (const phrase of ["copy?.stepTitles", "copy?.ariaStep", "copy?.editPersonal", "copy?.successMessage", "copy?.privacySummary", "copy?.futureText"]) {
    assert.ok(talent.includes(phrase), `Talent rendering is missing localized copy for ${phrase}`);
  }
});

test("localized contact copy reflects approved language and free-analysis claims without unsupported guarantees", () => {
  for (const phrase of [
    "All analyses offered by TAG08 are free of charge.",
    "TAG08 serves clients in Portuguese, English and Spanish.",
    "Do not assume that an NDA is in place unless both parties have agreed to it.",
    "Todos los análisis ofrecidos por TAG08 son gratuitos.",
    "TAG08 atiende a clientes en portugués, inglés y español.",
    "No dé por hecho que existe un acuerdo de confidencialidad sin el consentimiento de ambas partes."
  ]) assert.ok(contact.includes(phrase), `Contact catalog is missing safe localized copy: ${phrase}`);

  assert.doesNotMatch(contact, /can sign a corporate NDA|puede firmar un NDA corporativo|fully bilingual|bilÃ­ngue completo/);
  assert.match(contact, /This page offers a translated summary/);
  assert.match(contact, /Privacy notice: translated summary available/);
  assert.match(contact, /Esta p\\u00e1gina ofrece un resumen traducido/);
  assert.match(contact, /Aviso de privacidad: hay un resumen traducido/);
  assert.match(contact, /href="\/pt\/privacidade" lang="pt-BR"/);
});

test("Talent Pool EN/ES forms link to the Portuguese source of the provisional translated summary", () => {
  assert.match(talent, /This page offers a translated summary/);
  assert.match(talent, /Esta p\\u00e1gina ofrece un resumen traducido/);
  assert.match(talent, /href="\/pt\/privacidade" lang="pt-BR"/);
  assert.match(talent, /TALENT POOL SUBMISSION/);
  assert.match(talent, /ENVÍO AL BANCO DE TALENTOS/);
  assert.match(talent, /localizedSupplement\?\.protectedSubmission/);
  assert.match(talent, /localizedSupplement\?\.cultureDescription/);
});

test("unknown Contact errors do not fall back to Portuguese in EN/ES", () => {
  assert.match(contact, /if \(!pilotCopy\) return message;/);
  assert.match(contact, /We could not process this request\. Please review the form and try again\./);
  assert.match(contact, /No pudimos procesar la solicitud\. Revise el formulario e inténtelo de nuevo\./);
  assert.match(contact, /pilotCopy\.errors\[message as keyof typeof CONTACT_PILOT_COPY\.en\.errors\]/);
});

test("team profile descriptions render from translated EN/ES copy without changing the Portuguese fallback", () => {
  for (const description of [
    "Leads partner brands' positioning through consistent design methodologies and refined aesthetics.",
    "Creates aesthetic guidelines and graphic identity manuals for brands that require strong visual consistency.",
    "Responsible for technical integrity, lean build output, and website SEO.",
    "Specializes in scripts, storytelling, and voice guides for executives.",
    "Analyzes CPA and LTV and rigorously optimizes campaigns on Meta and Google Ads.",
    "Dirige el posicionamiento de las marcas asociadas mediante metodologías de diseño coherentes y una estética refinada.",
    "Crea directrices estéticas y manuales gráficos para marcas que requieren una alta coherencia visual.",
    "Responsable de la integridad técnica, la optimización del código y el SEO de los sitios web.",
    "Se especializa en guiones, storytelling y manuales de voz para ejecutivos.",
    "Analiza CPA y LTV y optimiza campañas en Meta y Google Ads con rigor."
  ]) {
    assert.ok(talent.includes(description), `Talent profile translation is missing: ${description}`);
  }

  for (const index of [0, 1, 2, 3, 4]) {
    assert.ok(talent.includes(`copy?.profileDescriptions[${index}]`), `Profile ${index} does not render localized copy`);
  }
  assert.match(talent, /copy\?\.profileDescriptions\[0\] \?\? "Conduz o posicionamento/);
  assert.match(talent, /copy\?\.profileDescriptions\[4\] \?\? "Análise fria de CPA/);
});
