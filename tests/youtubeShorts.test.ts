import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { FALLBACK_YOUTUBE_VIDEOS, getVideoDescriptionPreview, selectLiveYouTubeVideos, type OfficialYouTubeVideo } from "../src/lib/officialContent";

test("only videos explicitly returned by the live channel source are selectable", () => {
  const video: OfficialYouTubeVideo = {
    id: "official-video-1",
    title: "Vídeo oficial",
    description: "Descrição oficial",
    duration: "01:20",
    date: "06 nov. 2026",
    category: "YOUTUBE OFICIAL",
    thumbnail: "https://i.ytimg.com/vi/official-video-1/hqdefault.jpg",
    embedCode: "official-video-1",
    videoUrl: "https://www.youtube.com/watch?v=official-video-1",
    views: "1 visualização",
    tagline: "VÍDEO OFICIAL",
    source: "live"
  };

  assert.deepEqual(FALLBACK_YOUTUBE_VIDEOS, []);
  assert.deepEqual(selectLiveYouTubeVideos({ sources: { youtube: "fallback", googleBusiness: "fallback" }, youtubeVideos: [video] }), []);
  assert.deepEqual(selectLiveYouTubeVideos({ sources: { youtube: "live", googleBusiness: "fallback" }, youtubeVideos: [video] }), [video]);
  assert.deepEqual(selectLiveYouTubeVideos({ sources: { youtube: "error", googleBusiness: "fallback" }, youtubeVideos: [video] }), []);
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
