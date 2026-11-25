import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const footerSource = readFileSync(new URL("../src/components/Footer.tsx", import.meta.url), "utf8");
const whatsappSource = readFileSync(new URL("../src/components/WhatsAppButton.tsx", import.meta.url), "utf8");

test("cookie banner controls have EN/ES copy and use the localized catalog", () => {
  for (const copy of [
    "Set your cookie preferences below:",
    "Configura tus preferencias de cookies:",
    "REQUIRED",
    "OBLIGATORIAS",
    "Reject all cookies",
    "Rechazar todas las cookies",
  ]) {
    assert.ok(footerSource.includes(copy), `missing localized cookie copy: ${copy}`);
  }

  assert.match(footerSource, /\{copy\.cookieTitle\}/);
  assert.match(footerSource, /\{copy\.cookieDescription\}/);
  assert.match(footerSource, /\{source\.consentPerformanceLabel\}/);
  assert.match(footerSource, /\{source\.consentAnalyticsLabel\}/);
  assert.match(footerSource, /\{source\.consentMarketingLabel\}/);
  assert.match(footerSource, /copy\.cookieAcceptLabel\}/);
  assert.match(footerSource, /\{copy\.cookieRejectLabel\}/);
});

test("footer legal and insight labels follow the selected language", () => {
  assert.match(footerSource, /label: "Strategic Insights", path: "\/insights"/);
  assert.match(footerSource, /label: "Insights estratégicos", path: "\/insights"/);
  assert.match(footerSource, /legalLabelTerms: "Terms of Use"/);
  assert.match(footerSource, /legalLabelTerms: "Términos de Uso"/);
});

test("EN/ES legal modals show a localized notice and link to the Portuguese source", () => {
  assert.match(footerSource, /\{language !== "pt" \?/);
  assert.match(footerSource, /This legal content is currently available only in Portuguese/);
  assert.match(footerSource, /Este contenido legal solo está disponible en portugués/);
  assert.ok(footerSource.includes('href={activeModal === "privacy" ? "/privacidade" : "/?legal=terms"}'));
  assert.match(footerSource, /url\.searchParams\.get\("legal"\) !== "terms"/);
  assert.match(footerSource, /setActiveModal\("terms"\)/);
  assert.match(footerSource, /lang="pt-BR"/);
});

test("WhatsApp channel labels follow the selected language without changing tracking labels", () => {
  assert.match(whatsappSource, /import \{ i18n, type UiLanguage \} from "\.\.\/i18n\/siteI18n"/);
  assert.match(whatsappSource, /contact\.key === "brazil"\) return whatsappCopy\.channelPt/);
  assert.match(whatsappSource, /selectedLanguage === "es" \? whatsappCopy\.channelEs : whatsappCopy\.channelEn/);
  assert.match(whatsappSource, /handleLaunchWhatsApp\(contact\.href, contact\.label/);
  assert.match(whatsappSource, /\{channelLabel\(contact\)\}/);
});
