import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getVideoDescriptionPreview } from "../src/lib/officialContent";

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
