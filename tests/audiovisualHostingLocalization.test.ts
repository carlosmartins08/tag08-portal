import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { AUDIOVISUAL_COPY } from "../src/features/site/pages/ProducaoAudiovisual.tsx";

const source = readFileSync(
  new URL("../src/features/site/pages/ProducaoAudiovisual.tsx", import.meta.url),
  "utf8"
);

test("audiovisual EN/ES catalogs cover the main page, planner, live states and FAQ", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = AUDIOVISUAL_COPY[locale];
    for (const key of ["heroTitle", "heroDescription", "plannerTitle", "youtubeLoading", "youtubeUnavailable", "openChannel", "faqEyebrow", "servicesFormats", "pageCta", "frontsTitle", "methodologyTitle", "scopeTitle", "synergyTitle", "finalTitle", "finalDescription"] as const) {
      assert.ok(copy[key].trim().length > 0, `${locale}: ${key} must be translated`);
    }
    assert.equal(copy.problemCards.length, 5);
    assert.equal(copy.audienceCards.length, 5);
    assert.equal(copy.deliverables.length, 6);
    assert.equal(copy.formats.length, 3);
    assert.equal(copy.faqQuestions.length, 5);
    assert.equal(copy.faqAnswers.length, 5);
    assert.equal(copy.faqCategories.length, 5);
    assert.equal(copy.fronts.length, 6);
    assert.equal(copy.fronts.every((item) => item.list.length === 5), true);
    assert.equal(copy.processSteps.length, 3);
    assert.equal(copy.processSteps.every((step) => step.list.length === 5), true);
    assert.equal(copy.included.length, 5);
    assert.equal(copy.addOns.length, 5);
    assert.equal(copy.synergies.length, 4);
  }

  assert.match(AUDIOVISUAL_COPY.en.youtubeUnavailable, /temporarily unavailable/i);
  assert.match(AUDIOVISUAL_COPY.es.youtubeUnavailable, /temporalmente/i);
  assert.match(source, /copy\?\.youtubeUnavailable/);
  assert.match(source, /copy\?\.faqAnswers\[activeFaq\]/);
  assert.match(source, /aria-pressed=\{selectedFormat === f\.id\}/);
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /copy\?\.fronts\[idx\]\?\.title/);
  assert.match(source, /copy\?\.processSteps\[idx\]\?\.list\[idxx\]/);
  assert.match(source, /copy\?\.included\[iIdx\]\?\.desc/);
  assert.match(source, /copy\?\.addOns\[oIdx\]\?\.desc/);
  assert.match(source, /copy\?\.synergies\[idx\]\?\.cta/);
  assert.match(source, /aria-label=\{copy\?\.videoLinkLabel\.replace\("\{title\}", video\.title\)\}/);
  assert.match(source, /alt=\{copy\?\.ctaImageAlt/);
});

test("audiovisual localization preserves official media, routes, analytics and evidence gates", () => {
  assert.match(source, /video_id: video\.embedCode/);
  assert.match(source, /page_path: "\/servicos\/producao-audiovisual"/);
  assert.match(source, /href=\{TAG08_OFFICIAL_YOUTUBE_URL\}/);
  assert.doesNotMatch(source, /MiniCases/);
  assert.match(source, /<ServiceInsightsBridge servicePath="\/servicos\/producao-audiovisual" onNavigate=\{onNavigate\} locale=\{locale\} \/>/);
  assert.match(source, /alt=\{video\.title\}/);
});
