import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const pagePath = "src/features/site/pages/Sebraetec.tsx";
const source = readFileSync(pagePath, "utf8");
const sourceFile = ts.createSourceFile(pagePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function getCopyEntries() {
  let entries;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === "SEBRAETEC_COPY") {
      entries = node.initializer;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  assert.ok(entries, "Sebraetec EN/ES copy catalog exists");
  return entries.properties.filter(ts.isPropertyAssignment);
}

function run(name, check) {
  check();
  console.log(`PASS ${name}`);
}

run("complete English and Spanish copy catalog", () => {
  const entries = getCopyEntries();
  assert.ok(entries.length >= 50, "catalog covers the complete visible page, FAQs, CTAs, and accessible labels");
  for (const entry of entries) {
    const key = ts.isStringLiteral(entry.name) ? entry.name.text : entry.name.getText(sourceFile);
    assert.ok(ts.isObjectLiteralExpression(entry.initializer), `translations exist for ${key}`);
    const translations = new Map(
      entry.initializer.properties
        .filter(ts.isPropertyAssignment)
        .map((property) => [property.name.getText(sourceFile), property.initializer]),
    );
    for (const locale of ["en", "es"]) {
      const translation = translations.get(locale);
      assert.ok(translation && ts.isStringLiteral(translation) && translation.text.trim(), `${locale} copy exists for ${key}`);
    }
  }
});

run("visible text, image labels, and outbound labels use locale resolver", () => {
  const missingText = [];
  const missingAttributes = [];
  const visit = (node) => {
    if (ts.isJsxText(node) && node.getText(sourceFile).trim()) missingText.push(node.getText(sourceFile).trim());
    if (ts.isJsxAttribute(node) && ["alt", "fallbackLabel", "label"].includes(node.name.getText(sourceFile))) {
      const value = node.initializer;
      if (!value || !ts.isJsxExpression(value) || !value.expression || !ts.isCallExpression(value.expression) || value.expression.expression.getText(sourceFile) !== "t") {
        missingAttributes.push(node.getText(sourceFile));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  assert.deepEqual(missingText, [], "no Portuguese-only JSX text remains in the page");
  assert.deepEqual(missingAttributes, [], "accessible image and outbound-link labels are localized");
  assert.match(source, /q: t\(/, "FAQ questions are localized");
  assert.match(source, /a: t\(/, "FAQ answers are localized");
  assert.match(source, /buildBrazilWhatsAppUrl\(t\(/, "WhatsApp prefilled messages follow the selected locale");
});

run("regional eligibility and illustrative-value caveats stay explicit", () => {
  const serialized = getCopyEntries().map((entry) => entry.initializer.getText(sourceFile)).join("\n");
  assert.match(serialized, /may subsidize part/i);
  assert.match(serialized, /subject to the rules, availability, and approval/i);
  assert.match(serialized, /puede subsidiar parte/i);
  assert.match(serialized, /disponibilidad y aprobaci[oó]n/i);
  assert.match(serialized, /R\$ 10,000\.00/);
  assert.match(serialized, /R\$ 10\.000,00/);
});
