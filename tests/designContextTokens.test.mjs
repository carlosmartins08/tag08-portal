import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("src/index.css", "utf8");
const home = readFileSync("src/features/site/pages/Home.tsx", "utf8");

function contextBlock(selector) {
  const selectorIndex = css.indexOf(selector);
  assert.notEqual(selectorIndex, -1, `Expected CSS context ${selector}`);
  const openBrace = css.indexOf("{", selectorIndex);
  const closeBrace = css.indexOf("}", openBrace);
  assert.ok(openBrace > selectorIndex && closeBrace > openBrace, `Expected declarations for ${selector}`);
  return css.slice(openBrace + 1, closeBrace);
}

const lightContext = contextBlock(".context-default");
assert.match(lightContext, /--color-surface-canvas:\s*#F2F2F2/i);
assert.match(lightContext, /--color-content-primary:\s*#0D0D0D/i);
assert.match(lightContext, /--color-focus-ring:\s*var\(--color-accent-readable\)/);

const darkContext = contextBlock(".context-inverse,");
assert.match(darkContext, /--color-border-default:\s*var\(--color-border-subtle\)/);

assert.match(css, /\.tag08-diagnostic-signal:focus-visible\s*\{\s*outline-color:\s*var\(--color-focus-ring\);\s*\}/);
assert.match(home, /tag08-diagnostic-signal[^`]*context-default bg-\[color:var\(--color-surface-canvas\)\]/s);
assert.doesNotMatch(home, /context-default bg-\[#F2F2F2\]/);

console.log("design context tokens regression: 7 assertions passed");
