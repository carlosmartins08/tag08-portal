import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const filePath = "src/features/site/pages/ProgramaAfiliados.tsx";
const source = readFileSync(filePath, "utf8");
const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function getCopyEntries() {
  let declaration;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === "AFFILIATE_COPY") declaration = node.initializer;
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  assert.ok(declaration, "affiliate EN/ES copy catalog exists");
  return declaration.properties.filter(ts.isPropertyAssignment);
}

function run(name, check) {
  check();
  console.log(`PASS ${name}`);
}

run("English and Spanish catalogs cover the complete affiliate page", () => {
  const entries = getCopyEntries();
  assert.ok(entries.length >= 120, "catalog includes page copy, simulator, validation, result states, FAQs, and labels");
  for (const entry of entries) {
    const key = ts.isStringLiteral(entry.name) ? entry.name.text : entry.name.getText(sourceFile);
    assert.ok(ts.isObjectLiteralExpression(entry.initializer), `translations exist for ${key}`);
    const values = new Map(entry.initializer.properties.filter(ts.isPropertyAssignment).map((p) => [p.name.getText(sourceFile), p.initializer]));
    for (const locale of ["en", "es"]) {
      const value = values.get(locale);
      assert.ok(value && ts.isStringLiteral(value) && value.text.trim(), `${locale} translation exists for ${key}`);
    }
  }
});

run("all rendered copy and user-facing labels are localized", () => {
  const untranslatedText = [];
  const untranslatedAttributes = [];
  const visit = (node) => {
    if (ts.isJsxText(node) && node.getText(sourceFile).trim() && !["/", "):", "):"].includes(node.getText(sourceFile).trim())) {
      untranslatedText.push(node.getText(sourceFile).trim());
    }
    if (ts.isJsxAttribute(node) && ["alt", "fallbackLabel", "label", "aria-label", "placeholder"].includes(node.name.getText(sourceFile))) {
      const value = node.initializer;
      if (!value || !ts.isJsxExpression(value) || !value.expression || !ts.isCallExpression(value.expression) || value.expression.expression.getText(sourceFile) !== "t") {
        untranslatedAttributes.push(node.getText(sourceFile));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  assert.deepEqual(untranslatedText, [], "no untranslated visible JSX copy remains");
  assert.deepEqual(untranslatedAttributes, [], "accessible and outbound labels use the locale resolver");
  assert.match(source, /q: t\(/, "FAQ questions use localized copy");
  assert.match(source, /q: t\(/, "FAQ answers or dynamic FAQ composition are localized");
  assert.match(source, /const t = \(source: string\) => localizeAffiliate\(source, locale\)/);
  assert.match(source, /locale\?: RouteLocale/);
  assert.match(source, /locale = "pt"/);
  const keys = new Set(getCopyEntries().map((entry) => entry.name.text));
  const missing = [];
  const visitCalls = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "t" && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0]) && !keys.has(node.arguments[0].text)) missing.push(node.arguments[0].text);
    ts.forEachChild(node, visitCalls);
  };
  visitCalls(sourceFile);
  assert.deepEqual(missing, [], "every literal passed to the locale resolver has EN and ES catalog entries");
});

run("commission conditions and calculations remain tied to the approved model", () => {
  assert.match(source, /calculateAffiliateCommission\(/);
  assert.match(source, /isActiveRecurringCommissionEligible\(/);
  assert.match(source, /AFFILIATE_COMMISSION_RATES\.recurringFirstPayment/);
  assert.match(source, /AFFILIATE_COMMISSION_RATES\.activePartnerRecurring/);
  assert.match(source, /AFFILIATE_COMMISSION_RATES\.sebraeOneTime/);
  assert.match(source, /AFFILIATE_COMMISSION_RATES\.otherOneTime/);
  assert.match(source, /AFFILIATE_COMMISSION_RATES\.recurringStartAfterDays/);
  assert.match(source, /recurringFirstPaymentRate\}\$\{t\(" of the first monthly payment actually paid by the client and received by TAG08\./);
  assert.match(source, /activeRecurringRate\}\$\{t\(" on eligible recurring revenue actually received starting "\)\}/);
  assert.match(source, /sebraeOneTimeRate\}\$\{t\(" for services linked to Sebrae, a subsidy, or a program, and "\)\}/);
  assert.match(source, /otherOneTimeRate\}\$\{t\(" in other cases, on the first eligible installment received\."\)\}/);
  assert.match(source, /The recurring commission of /);
  assert.match(source, /não é vitalícia nem passiva/);
});

run("Portuguese remains the default and locale does not change simulator data inputs", () => {
  assert.match(source, /locale = "pt"/);
  assert.match(source, /const \[modality, setModality\] = useState<PartnershipModality>\("referral"\)/);
  assert.match(source, /const formatPercent = \(rate: number\) => `\$\{Math\.round\(rate \* 100\)\}%`/);
  assert.match(source, /currency: "BRL"/);
});
