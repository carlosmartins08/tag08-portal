import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getVideoDescriptionPreview, selectLiveOfficialYouTubeVideos } from "../src/lib/officialContent";

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
