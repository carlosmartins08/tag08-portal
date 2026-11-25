import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const detail = readFileSync("src/features/site/pages/CaseStudyDetail.tsx", "utf8");
const routeContent = readFileSync("src/features/site/RouteContent.tsx", "utf8");
const evidence = readFileSync("src/content/publicEvidence.ts", "utf8");

test("case detail empty state has localized generic copy for PT, EN, and ES", () => {
  const copyBlock = detail.match(/const CASE_STUDY_DETAIL_EMPTY_STATE_COPY = \{([\s\S]*?)\} satisfies/);
  assert.ok(copyBlock, "empty-state copy map exists");

  for (const locale of ["pt", "en", "es"]) {
    assert.match(copyBlock[1], new RegExp(`${locale}:\\s*\\{`), `${locale} copy exists`);
    assert.match(detail, /emptyStateCopy\.title/);
    assert.match(detail, /emptyStateCopy\.description/);
    assert.match(detail, /emptyStateCopy\.backHome/);
  }

  assert.match(detail, /locale = "pt"/, "Portuguese remains the default locale");
  assert.match(routeContent, /<CaseStudyDetail[^>]+locale=\{locale\}/, "route passes the selected locale to the page");
  assert.match(copyBlock[1], /title: "Caso de Sucesso não encontrado"/);
  assert.match(copyBlock[1], /description: "O caso estratégico solicitado não pôde ser localizado em nossa base operacional\."/);
  assert.match(copyBlock[1], /backHome: "Voltar ao Início"/);
});

test("case data remains behind the existing per-route evidence gate", () => {
  assert.match(detail, /getVisibleEvidence\(CASE_STUDIES,[\s\S]*?`case-study\/\$\{caseStudy\.id\}`,[\s\S]*?`\/casos\/\$\{caseId\}`\)/);
  assert.match(evidence, /evidence\.status === "approved" && evidence\.allowedRoutes\.includes\(route\)/);
  assert.match(detail, /if \(!selectedCase\) \{/);
  assert.doesNotMatch(detail, /CASE_STUDIES\.find\(/, "case data must not bypass the evidence-filtered list");
});
