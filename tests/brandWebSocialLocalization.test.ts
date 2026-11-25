import assert from "node:assert/strict";
import test from "node:test";
import { getBrandingCopy } from "../src/features/site/pages/Branding";

test("Branding preserves Portuguese source copy and provides explicit English and Spanish copy", () => {
  const source = "Identidade visual com direção";

  assert.equal(getBrandingCopy(source, "pt"), source);
  assert.equal(getBrandingCopy(source, "en"), "Visual identity with direction");
  assert.equal(getBrandingCopy(source, "es"), "Identidad visual con dirección");
});

test("Branding localization fails explicitly when an EN/ES source string has no translation", () => {
  assert.throws(() => getBrandingCopy("UNMAPPED BRANDING COPY", "en"), /Missing Branding en translation/);
  assert.throws(() => getBrandingCopy("UNMAPPED BRANDING COPY", "es"), /Missing Branding es translation/);
});

test("Branding FAQ has locale-specific questions and answers", () => {
  assert.equal(getBrandingCopy("O que sustenta uma identidade mais consistente.", "en"), "What supports a more consistent identity.");
  assert.equal(getBrandingCopy("O que sustenta uma identidade mais consistente.", "es"), "Qué sostiene una identidad más consistente.");
});

test("Branding process, guides, and comparison copy have explicit EN/ES equivalents", () => {
  assert.equal(getBrandingCopy("Entendimento", "en"), "Discovery");
  assert.equal(getBrandingCopy("Entendimento", "es"), "Análisis inicial");
  assert.equal(getBrandingCopy("Sistema de identidade", "en"), "Identity system");
  assert.equal(getBrandingCopy("Sistema de identidade", "es"), "Sistema de identidad");
  assert.equal(getBrandingCopy("Guia de identidade", "en"), "Identity guide");
  assert.equal(getBrandingCopy("Guia de identidade", "es"), "Guía de identidad");
  assert.equal(getBrandingCopy("O logotipo identifica", "en"), "The logo identifies");
  assert.equal(getBrandingCopy("O logotipo identifica", "es"), "El logotipo identifica");
});
