import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const web = readFileSync("src/features/site/pages/DesenvolvimentoWeb.tsx", "utf8");
const social = readFileSync("src/features/site/pages/GestaoRedesSociais.tsx", "utf8");

test("web development page accepts EN/ES drafts and localizes its main contact actions", () => {
  assert.match(web, /locale\?: RouteLocale/);
  assert.match(web, /Websites and digital structures/);
  assert.match(web, /Sitios web y estructuras digitales/);
  assert.match(web, /locale=\{locale\}/);
  assert.match(web, /copy\?\.finalCta/);
  assert.match(web, /encodeURIComponent\(copy\?\.waMessage/);
});

test("social media page localizes the diagnostic inputs, summaries, and WhatsApp prefill", () => {
  assert.match(social, /locale\?: RouteLocale/);
  assert.match(social, /Which channels do you use today\?/);
  assert.match(social, /¿Qué canales utilizan hoy\?/);
  assert.match(social, /diagnosticMessage = locale === "en"/);
  assert.match(social, /locale === "en" \? "View summary"/);
  assert.match(social, /locale=\{locale\}/);
});

test("social media draft does not present source-owned YouTube titles in another language", () => {
  assert.match(social, /locale === "pt" && youtubeSource === "live"/);
});

test("social media EN/ES copy covers static sections without Portuguese render fallbacks", () => {
  for (const key of [
    "signals", "deliverables", "plans", "included", "excluded", "cycle", "learning", "faq",
    "videoTitle", "noVideos", "faqTitle", "howWeWorkTitle", "nextStepTitle", "finalTitle", "finalCta"
  ]) {
    assert.match(social, new RegExp(`${key}:`), `missing locale copy field: ${key}`);
    assert.match(social, new RegExp(`copy\\?\\.${key}`), `field is not wired to rendered copy: ${key}`);
  }
  assert.match(social, /const signals = copy\?\.signals \?\? \[/);
  assert.match(social, /const plans = copy\?\.plans \?\? \[/);
  assert.match(social, /const faqItems = copy\?\.faq \?\? \[/);
  assert.match(social, /copy\?\.noVideos \?\?/);
  assert.match(social, /copy\?\.finalDescription \?\?/);
});
