import { expect, test } from "@playwright/test";

test("custom cards keep a visible border in high-contrast mode", async ({ page }) => {
  await page.goto("/pt");

  const borders = await page.evaluate(() => {
    const cards = ["tag08-card", "tag08-surface-card border"].map((className) => {
      const card = document.createElement("article");
      card.className = className;
      document.body.append(card);
      return card;
    });
    document.documentElement.classList.add("high-contrast");
    const result = cards.map((card) => {
      const style = getComputedStyle(card);
      return { color: style.borderTopColor, style: style.borderTopStyle };
    });
    document.documentElement.classList.remove("high-contrast");
    cards.forEach((card) => card.remove());
    return result;
  });

  expect(borders).toEqual([
    { color: "rgb(255, 255, 255)", style: "solid" },
    { color: "rgb(255, 255, 255)", style: "solid" }
  ]);
});

test("header and footer icon transitions stop for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/pt");

  const desktopHeaderIcon = page.locator('button[aria-controls="desktop-services-panel"] svg');
  const desktopHeaderTrigger = page.locator('button[aria-controls="desktop-services-panel"]');

  await expect(desktopHeaderIcon).toBeAttached();
  await expect.poll(() => desktopHeaderIcon.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");

  const headerTargetBefore = await desktopHeaderTrigger.boundingBox();
  await desktopHeaderTrigger.click();
  await expect(desktopHeaderTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#desktop-services-panel").getByRole("button").first()).toBeFocused();
  expect(await desktopHeaderTrigger.boundingBox()).toEqual(headerTargetBefore);

  await page.keyboard.press("Escape");
  await expect(desktopHeaderTrigger).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pt");
  await page.locator("#btn-toggle-mobile-menu").click();
  const mobileDialog = page.getByRole("dialog", { name: "Navegação principal" });
  await expect(mobileDialog).toBeVisible();
  const mobileHeaderIcon = mobileDialog.locator('button[aria-controls="mobile-services-list"] > svg:last-child');
  const mobileHeaderTrigger = mobileDialog.locator('button[aria-controls="mobile-services-list"]');
  const footerDetails = page.locator("footer details").first();
  const footerTrigger = footerDetails.locator("summary");
  const footerIcon = footerTrigger.locator("svg");
  await expect(mobileHeaderIcon).toBeAttached();
  await expect.poll(() => mobileHeaderIcon.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");
  await expect.poll(() => footerIcon.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");

  await mobileHeaderTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(mobileHeaderTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(mobileHeaderTrigger).toBeFocused();

  await footerTrigger.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => footerDetails.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(true);
  await expect(footerTrigger).toBeFocused();
});
