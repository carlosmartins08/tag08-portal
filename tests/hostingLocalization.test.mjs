import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const source = readFileSync(
  new URL("../src/features/site/pages/HospedagemManutencaoSites.tsx", import.meta.url),
  "utf8"
);

test("hosting page has explicit locale selection and translated service data", () => {
  assert.match(source, /locale\?: RouteLocale/);
  assert.match(source, /locale === "en" \? en : locale === "es" \? es : pt/);
  assert.match(source, /title: "Shared Hosting"/);
  assert.match(source, /title: "Alojamiento compartido"/);
  assert.match(source, /name: "Basic plan"/);
  assert.match(source, /name: "Plan básico"/);
  assert.match(source, /The fortress and its giants/);
  assert.match(source, /La fortaleza y sus gigantes/);
  assert.doesNotMatch(source, /locale === "en" \? en : locale === "es" \? es : pt \|\| pt/);
});

test("page has no raw JSX text nodes that can fall back to Portuguese", () => {
  const page = ts.createSourceFile(
    "HospedagemManutencaoSites.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const visibleLiterals = [];
  const collectJsxText = (node) => {
    if (ts.isJsxText(node)) {
      const value = node.getText(page).replace(/\s+/g, " ").trim();
      if (value && /[A-Za-z]/.test(value)) visibleLiterals.push(value);
    }
    ts.forEachChild(node, collectJsxText);
  };
  collectJsxText(page);

  const unexplained = visibleLiterals.filter((value) =>
    !["&gt;&gt;", "GB", "GB SSD", "TAG08.v3", "BR", "INT"].includes(value) &&
    !/^(?:\+\s*)?R\$(?:\s*\d[\d.,]*)?$/.test(value)
  );
  assert.deepEqual(unexplained, []);
});

test("English and Spanish interface, FAQ, and accessible labels have explicit copy", () => {
  for (const copy of [
    ["CONTINUIDADE TECNOLÓGICA", "TECHNOLOGY CONTINUITY", "CONTINUIDAD TECNOLÓGICA"],
    ["Selecionar ${host.title}", "Select ${host.title}", "Seleccionar ${host.title}"],
    ["Can I migrate my existing website to TAG08 hosting?", "¿Puedo migrar mi sitio web actual al alojamiento de TAG08?"],
    ["Selected plan SSD storage", "Almacenamiento SSD del plan seleccionado"],
    ["Decrease number of websites", "Reducir el número de sitios"],
    ["Request a hosting setup", "Solicitar configuración de alojamiento"]
  ]) {
    for (const value of copy) assert.ok(source.includes(value), `missing localized copy: ${value}`);
  }

  assert.match(source, /copy\("MIGRAÇÃO DE SITES", "WEBSITE MIGRATION", "MIGRACIÓN DE SITIOS WEB"\)/);
  assert.match(source, /copy\("DÚVIDAS &", "QUESTIONS &", "PREGUNTAS Y"\)/);
  assert.match(source, /copy\("Posso migrar meu site ja existente para a hospedagem da TAG08\?"/);
});

test("simulator and outbound WhatsApp messages are selected by locale", () => {
  assert.match(source, /const simulatorMessage = copy\(/);
  assert.match(source, /SELECTED SERVER ENGINE:/);
  assert.match(source, /MOTOR DE SERVIDOR ELEGIDO:/);
  assert.match(source, /href=\{buildBrazilWhatsAppUrl\(simulatorMessage\)\}/);
  assert.match(source, /locale === "pt"\s*\? `Olá TAG08!/);
  assert.match(source, /Hello TAG08! I would like to discuss purchasing/);
  assert.match(source, /Hola TAG08\. Me gustaría conversar sobre la contratación/);
});
