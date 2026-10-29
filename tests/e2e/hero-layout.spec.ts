import { expect, test } from "@playwright/test";

test("hero preserves a safe reading area before the portrait", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const layout = await page.locator("#hero").evaluate((hero) => {
    const heading = hero.querySelector("h1");
    const stage = hero.querySelector('[data-testid="hero-editorial-stage"]');
    if (!heading || !stage) return null;

    const headingBox = heading.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    return {
      headingRight: headingBox.right,
      stageMidpoint: stageBox.left + stageBox.width * 0.48
    };
  });

  expect(layout).not.toBeNull();
  expect(layout!.headingRight).toBeLessThan(layout!.stageMidpoint);
});

test("Home hero preloads its LCP image with high priority and the local brand font", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const heroImage = page.locator('[data-testid="hero-editorial-stage"] img');
  await expect(heroImage).toHaveAttribute("fetchpriority", "high");
  await expect(page.locator('link[rel="preload"][as="image"][fetchpriority="high"]')).not.toHaveCount(0);
  await expect(page.locator('link[rel="preload"][as="font"][type="font/woff2"]')).not.toHaveCount(0);
});
