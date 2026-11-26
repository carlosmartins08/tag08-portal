import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { formatViewCount, getVideoDescriptionPreview, localizeViewCountLabel, selectLiveOfficialYouTubeVideos } from "../src/lib/officialContent";

test("view counts use localized singular, plural, zero and safe invalid values", () => {
  assert.equal(formatViewCount(0, "pt"), "0 visualizações");
  assert.equal(formatViewCount(1, "pt"), "1 visualização");
  assert.equal(formatViewCount(2, "pt"), "2 visualizações");
  assert.equal(formatViewCount(1, "en"), "1 view");
  assert.equal(formatViewCount(2, "en"), "2 views");
  assert.equal(formatViewCount(1, "es"), "1 visualización");
  assert.equal(formatViewCount(2, "es"), "2 visualizaciones");
  assert.equal(formatViewCount("invalid", "pt"), "0 visualizações");
  assert.equal(formatViewCount(-1, "pt"), "0 visualizações");
  assert.equal(localizeViewCountLabel("1 visualizações", "pt"), "1 visualização");
  assert.equal(localizeViewCountLabel("1.234 visualizações", "en"), "1,234 views");
  assert.equal(localizeViewCountLabel("2 visualizações", "es"), "2 visualizaciones");
  assert.equal(localizeViewCountLabel("PORTFÓLIO 01", "en"), "PORTFÓLIO 01");
});

test("localized view-count labels accept formatter output in Portuguese, English and Spanish", () => {
  for (const sourceLocale of ["pt", "en", "es"] as const) {
    for (const targetLocale of ["pt", "en", "es"] as const) {
      for (const count of [0, 1, 2, 1234, 12345]) {
        assert.equal(
          localizeViewCountLabel(formatViewCount(count, sourceLocale), targetLocale),
          formatViewCount(count, targetLocale),
          `${sourceLocale} count ${count} should localize to ${targetLocale}`
        );
      }
    }
  }

  assert.equal(localizeViewCountLabel("1 visualização", "en"), "1 view");
  assert.equal(localizeViewCountLabel("2 visualizações", "es"), "2 visualizaciones");
  assert.equal(localizeViewCountLabel("1.234 visualizações", "en"), "1,234 views");
  assert.equal(localizeViewCountLabel("1,234 views", "pt"), "1.234 visualizações");
  assert.equal(localizeViewCountLabel("1 234 visualizaciones", "pt"), "1.234 visualizações");
  assert.equal(localizeViewCountLabel("PORTFÓLIO 01", "en"), "PORTFÓLIO 01");
  assert.equal(localizeViewCountLabel("1.2 views", "pt"), "1.2 views");
});

test("a Home só seleciona vídeos recebidos de uma origem oficial ao vivo", () => {
  const videos = [{
    id: "official-video",
    title: "Vídeo oficial",
    description: "Descrição",
    duration: "01:00",
    date: "2026-11-09",
    category: "Institucional",
    thumbnail: "/video.jpg",
    embedCode: "official123",
    videoUrl: "https://www.youtube.com/watch?v=official123",
    views: "10 visualizações",
    tagline: "Oficial"
  }];

  assert.deepEqual(selectLiveOfficialYouTubeVideos("fallback", videos), []);
  assert.deepEqual(selectLiveOfficialYouTubeVideos("error", videos), []);
  assert.deepEqual(selectLiveOfficialYouTubeVideos("disabled", videos), []);
  assert.equal(selectLiveOfficialYouTubeVideos("live", videos), videos);
  assert.deepEqual(selectLiveOfficialYouTubeVideos("live", []), []);
});

test("video previews remove raw links and preserve a bounded word-safe summary", () => {
  const preview = getVideoDescriptionPreview(
    "Primeira frase com contexto editorial. • Segunda frase para completar a descrição. https://tag08.com.br/ " +
      "Terceira frase que não deve transformar o card em uma parede de texto.",
    65
  );

  assert.doesNotMatch(preview, /https?:\/\//);
  assert.ok(preview.length <= 66);
  assert.match(preview, /para…$/);
});

test("audiovisual and social pages consume the shared live YouTube source", () => {
  const audiovisualPage = readFileSync("src/features/site/pages/ProducaoAudiovisual.tsx", "utf8");
  const socialPage = readFileSync("src/features/site/pages/GestaoRedesSociais.tsx", "utf8");
  const hook = readFileSync("src/lib/useOfficialYouTubeVideos.ts", "utf8");

  assert.ok(audiovisualPage.includes('from "../../../lib/useOfficialYouTubeVideos"'));
  assert.ok(socialPage.includes('from "../../../lib/useOfficialYouTubeVideos"'));
  assert.match(audiovisualPage, /useOfficialYouTubeVideos\(4\)/);
  assert.match(socialPage, /useOfficialYouTubeVideos\(3\)/);
  assert.match(hook, /fetch\("\/api\/official-content"/);
  assert.match(hook, /selectLiveOfficialYouTubeVideos/);
  assert.doesNotMatch(hook, /FALLBACK_YOUTUBE_VIDEOS/);
  assert.match(audiovisualPage, /youtubeSource === "live" && youtubeVideos\.length > 0/);
  assert.doesNotMatch(audiovisualPage, /youtubeShorts/);
  assert.doesNotMatch(socialPage, /youtubeShorts/);
});

test("assessoria only promotes Google Business reviews when the official source is live", () => {
  const testimonials = readFileSync("src/components/TrustTestimonialsSection.tsx", "utf8");
  const hook = readFileSync("src/lib/useOfficialGoogleBusinessReviews.ts", "utf8");

  assert.ok(testimonials.includes('from "../lib/useOfficialGoogleBusinessReviews"'));
  assert.match(testimonials, /googleBusinessSource === "live"/);
  assert.match(hook, /payload\.sources\.googleBusiness === "live"/);
  assert.match(hook, /reviews: \[\]/);
});
