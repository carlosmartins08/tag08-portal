import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getProcessActivationCopy } from "../src/features/site/pages/ProcessActivation";

const source = readFileSync("src/features/site/pages/ProcessActivation.tsx", "utf8");
const renderedSourceStrings = [...source.matchAll(/\btx\("([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*locale\)/g)]
  .map((match) => match[1]);

test("Process Activation has explicit EN/ES copy for every literal rendered string", () => {
  assert.ok(renderedSourceStrings.length > 0, "expected to find literal localized copy calls");

  for (const text of renderedSourceStrings) {
    for (const locale of ["en", "es"] as const) {
      assert.doesNotThrow(() => getProcessActivationCopy(text, locale), `${locale} is missing: ${text}`);
      assert.ok(getProcessActivationCopy(text, locale).trim().length > 0, `${locale} resolved to empty copy: ${text}`);
    }
  }
});

test("Process Activation rejects missing foreign-language copy instead of rendering Portuguese", () => {
  assert.throws(() => getProcessActivationCopy("UNMAPPED ACTIVATION COPY", "en"), /Missing en Process Activation copy/);
  assert.throws(() => getProcessActivationCopy("UNMAPPED ACTIVATION COPY", "es"), /Missing es Process Activation copy/);
});

test("roadmap phase labels use the localized phase catalog", () => {
  assert.match(source, /\{tx\(phase\.step, locale\)\}/);
  for (const phase of ["FASE 1", "FASE 2", "FASE 3", "FASE 4"]) {
    assert.ok(getProcessActivationCopy(phase, "en").startsWith("PHASE "));
    assert.ok(getProcessActivationCopy(phase, "es").startsWith("FASE "));
  }
});
