import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { label: "mobile", width: 390, height: 844 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 900 }
] as const;

async function openSobre(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
}

for (const viewport of viewports) {
  test(`Sobre preserva leitura e toque em ${viewport.label}`, async ({ page }) => {
    await openSobre(page, viewport.width, viewport.height);

    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(hasHorizontalOverflow).toBeFalsy();

    const heroCta = page.getByTestId(viewport.label === "mobile" ? "about-hero-cta-mobile" : "about-hero-cta");
    await expect(heroCta).toBeVisible();
    const ctaBox = await heroCta.boundingBox();
    expect(ctaBox?.height).toBeGreaterThanOrEqual(44);

    const headingLevels = await page.locator("main h1, main h2, main h3, main h4, main h5, main h6").evaluateAll((elements) =>
      elements.map((element) => Number(element.tagName.slice(1)))
    );
    expect(headingLevels.filter((level) => level === 1)).toHaveLength(1);
    expect(headingLevels[0]).toBe(1);
    expect(headingLevels.some((level) => level > 3)).toBeFalsy();
  });
}

test("Sobre mantém os perfis autorizados e expõe o accordion corretamente", async ({ page }) => {
  await openSobre(page, 768, 1024);

  const profileCards = page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']");
  await expect(profileCards).toHaveCount(7);
  const primaryCards = page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']").filter({ has: page.locator("h3") });
  await expect(primaryCards.first()).toBeVisible();

  const control = page.getByRole("button", { name: /Ver princípios de Pensamento estratégico/ });
  await expect(control).toHaveAttribute("aria-expanded", "false");
  const panelId = await control.getAttribute("aria-controls");
  expect(panelId).toBeTruthy();

  const persistentControl = page.locator(`[aria-controls="${panelId}"]`);
  await persistentControl.click();
  await expect(persistentControl).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`#${panelId}`)).toBeVisible();
  await expect(persistentControl).toHaveAccessibleName(/Ocultar princípios de Pensamento estratégico/);
});

test("Sobre mantém o CTA inicial visível acima do banner LGPD no mobile", async ({ page }) => {
  await openSobre(page, 390, 844);

  const cta = page.getByTestId("about-hero-cta-mobile");
  const banner = page.getByRole("region", { name: "Privacidade & Cookies (LGPD)" });
  await expect(banner).toBeVisible({ timeout: 3_000 });

  const [ctaBox, bannerBox] = await Promise.all([cta.boundingBox(), banner.boundingBox()]);
  expect(ctaBox).not.toBeNull();
  expect(bannerBox).not.toBeNull();
  expect((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0)).toBeLessThanOrEqual(bannerBox?.y ?? 0);
});

test("Sobre prioriza a imagem hero", async ({ page }) => {
  await openSobre(page, 1440, 900);

  const heroImage = page.locator("main section").first().locator("img").first();
  await expect(heroImage).toHaveAttribute("sizes", /max-width: 768px/);
  await expect(page.locator('link[rel="preload"][as="image"]')).not.toHaveCount(0);
});
