import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { TAG08_YOUTUBE_SHORTS } from "../src/content/youtubeShorts";

test("official YouTube shorts use unique IDs and canonical YouTube assets", () => {
  const ids = TAG08_YOUTUBE_SHORTS.map((short) => short.id);
  assert.equal(new Set(ids).size, ids.length);

  TAG08_YOUTUBE_SHORTS.forEach((short) => {
    assert.match(short.href, new RegExp(`^https://www\\.youtube\\.com/shorts/${short.id}$`));
    assert.match(short.thumbnail, new RegExp(`^https://i\\.ytimg\\.com/vi/${short.id}/hqdefault\\.jpg$`));
  });
});

test("audiovisual and social pages consume the shared official shorts source", () => {
  const audiovisualPage = readFileSync("src/features/site/pages/ProducaoAudiovisual.tsx", "utf8");
  const socialPage = readFileSync("src/features/site/pages/GestaoRedesSociais.tsx", "utf8");

  assert.ok(audiovisualPage.includes('from "../../../content/youtubeShorts"'));
  assert.match(audiovisualPage, /TAG08_YOUTUBE_SHORTS\.map/);
  assert.doesNotMatch(audiovisualPage, /const TAG08_CHANNEL_SHORTS/);
  assert.ok(socialPage.includes('from "../../../content/youtubeShorts"'));
});
