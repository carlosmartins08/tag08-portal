import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { auditRoutePageSources, collectRoutePageFiles } from "../tools/audit-ux-matrix.mjs";

const routeContentPath = "src/features/site/RouteContent.tsx";
const routeContent = readFileSync(routeContentPath, "utf8");
const routePages = auditRoutePageSources(routeContent, (file) => readFileSync(file, "utf8"));

const home = routePages.find(({ file }) => file.replaceAll("\\", "/").endsWith("/Home.tsx"));
assert.ok(home, "Home must be registered as a route page");
assert.equal(home.risks.some(({ rule }) => rule === "missing_h1"), false);

const files = collectRoutePageFiles(routeContent).map((file) => file.replaceAll("\\", "/"));
assert.ok(files.some((file) => file.endsWith("/Home.tsx")));
assert.equal(files.some((file) => file.endsWith("/HomeMethodSection.tsx")), false);

const routeFixture = 'const MissingHeadingPage = dynamic(() => import("./pages/MissingHeadingPage"));';
const [missingHeadingPage] = auditRoutePageSources(
  routeFixture,
  () => "export default function MissingHeadingPage() { return <main>Content</main>; }"
);

assert.equal(missingHeadingPage.file.replaceAll("\\", "/"), "src/features/site/pages/MissingHeadingPage.tsx");
assert.deepEqual(missingHeadingPage.risks.filter(({ rule }) => rule === "missing_h1"), [{ severity: "P1", rule: "missing_h1" }]);

console.log("auditUxMatrix regression: 3/3 assertions passed");
