import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const canonicalOrigin = "https://tag08.com.br";
const mojibake = /\u00c3[\u0080-\u00bf]|\ufffd/;

const get = async (path) => {
  const response = await fetch(new URL(path, baseUrl));
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response;
};

const getAttribute = (html, tagPattern, attribute) => {
  const tag = html.match(tagPattern)?.[0];
  if (!tag) return null;
  return tag.match(new RegExp(`\\b${attribute}="([^"]+)"`, "i"))?.[1] ?? null;
};

const normalizeUrl = (value) => new URL(value).toString();
const toLocalizedUrl = (path, locale) => {
  if (locale === "pt-BR" || locale === "x-default") return `${canonicalOrigin}${path === "/" ? "" : path}`;
  const prefix = locale === "en" ? "/en" : "/es";
  return `${canonicalOrigin}${prefix}${path === "/" ? "" : path}`;
};

const robots = await (await get("/robots.txt")).text();
assert.match(robots, /Sitemap:\s*https:\/\/tag08\.com\.br\/sitemap\.xml/i);

const sitemap = await (await get("/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>(https:\/\/tag08\.com\.br[^<]*)<\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length > 0, "Sitemap has no canonical URLs");
assert.equal(new Set(urls).size, urls.length, "Sitemap contains duplicate URLs");
assert.ok(urls.some((url) => /^\/en(?:\/|$)/.test(new URL(url).pathname)), "English routes must appear in sitemap");
assert.ok(urls.some((url) => /^\/es(?:\/|$)/.test(new URL(url).pathname)), "Spanish routes must appear in sitemap");

for (const canonicalUrl of urls) {
  const canonical = new URL(canonicalUrl);
  const response = await get(canonical.pathname);
  const html = await response.text();
  const localizedPath = canonical.pathname.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
  const expectedAlternates = {
    "pt-BR": toLocalizedUrl(localizedPath, "pt-BR"),
    en: toLocalizedUrl(localizedPath, "en"),
    "es-ES": toLocalizedUrl(localizedPath, "es-ES"),
    "x-default": toLocalizedUrl(localizedPath, "x-default")
  };

  const expectedLang = canonical.pathname === "/en" || canonical.pathname.startsWith("/en/") ? "en" : canonical.pathname === "/es" || canonical.pathname.startsWith("/es/") ? "es-ES" : "pt-BR";
  assert.match(html, new RegExp(`<html lang="${expectedLang}">`, "i"), `${canonical.pathname} is missing ${expectedLang} lang`);
  assert.match(html, /<title>[^<]+<\/title>/i, `${canonical.pathname} is missing title`);
  assert.match(html, /<meta name="description" content="[^"]+"/i, `${canonical.pathname} is missing description`);
  assert.match(html, /<meta property="og:title" content="[^"]+"/i, `${canonical.pathname} is missing Open Graph title`);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/i, `${canonical.pathname} is missing Twitter card`);
  assert.match(html, /application\/ld\+json/i, `${canonical.pathname} is missing JSON-LD`);
  assert.match(html, /<main\b/i, `${canonical.pathname} is missing prerendered main content`);
  assert.doesNotMatch(html, mojibake, `${canonical.pathname} contains mojibake`);

  const canonicalHref = getAttribute(html, /<link\s+[^>]*rel="canonical"[^>]*>/i, "href");
  assert.ok(canonicalHref, `${canonical.pathname} is missing canonical`);
  assert.equal(normalizeUrl(canonicalHref), normalizeUrl(canonicalUrl), `${canonical.pathname} canonical differs from sitemap`);

  for (const [hreflang, expectedUrl] of Object.entries(expectedAlternates)) {
    const alternateHref = getAttribute(html, new RegExp(`<link\\s+[^>]*rel="alternate"[^>]*hrefLang="${hreflang}"[^>]*>`, "i"), "href");
    assert.ok(alternateHref, `${canonical.pathname} is missing ${hreflang} alternate`);
    assert.equal(normalizeUrl(alternateHref), normalizeUrl(expectedUrl), `${canonical.pathname} has an invalid ${hreflang} alternate`);
  }
}

console.log(JSON.stringify({ event: "seo_verification_passed", routes: urls.length }));
