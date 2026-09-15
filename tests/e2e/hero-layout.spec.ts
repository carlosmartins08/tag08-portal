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
