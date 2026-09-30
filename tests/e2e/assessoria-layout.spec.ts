import { expect, test, type Page } from "@playwright/test";

test.setTimeout(15_000);

const route = "/servicos/assessoria-marketing-digital-estrategico";
const viewports = [
  { label: "mobile", width: 390, height: 844 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 900 }
] as const;

async function openPage(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
}

async function acceptCookiesForInteraction(page: Page) {
  const acceptButton = page.getByRole("button", { name: "Aceitar todos os cookies" });
  if (await acceptButton.isVisible()) await acceptButton.click({ force: true });
}

for (const viewport of viewports) {
  test(`Assessoria preserva conversão e leitura em ${viewport.label}`, async ({ page }) => {
    await openPage(page, viewport.width, viewport.height);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBeFalsy();

    const heroCta = page.getByTestId("assessoria-hero-contact");
    await expect(heroCta).toBeVisible();
    const box = await heroCta.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);

    const headings = await page.locator("main h1, main h2, main h3").evaluateAll((elements) =>
      elements.map((element) => Number(element.tagName.slice(1)))
    );
    expect(headings.filter((level) => level === 1)).toHaveLength(1);
    expect(headings[0]).toBe(1);
  });
}

test("Assessoria mantém CTA inicial acima do banner LGPD no mobile", async ({ page }) => {
  await openPage(page, 390, 844);
  const cta = page.getByTestId("assessoria-hero-contact");
  const banner = page.getByRole("region", { name: "Privacidade & Cookies (LGPD)" });
  await expect(banner).toBeVisible({ timeout: 3_000 });

  const [ctaBox, bannerBox] = await Promise.all([cta.boundingBox(), banner.boundingBox()]);
  expect(ctaBox).not.toBeNull();
  expect(bannerBox).not.toBeNull();
  expect((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0)).toBeLessThanOrEqual(bannerBox?.y ?? 0);
});

test("Assessoria usa accordion sem tabs e preserva foco no quiz", async ({ page }) => {
  await openPage(page, 768, 1024);
  await acceptCookiesForInteraction(page);
  await expect(page.getByRole("tablist")).toHaveCount(0);

  const faqButton = page.getByRole("button", { name: "O que é a Assessoria de Marketing Estratégico da TAG08?" });
  await expect(faqButton).toHaveAttribute("aria-expanded", "true");
  const panelId = await faqButton.getAttribute("aria-controls");
  expect(panelId).toBeTruthy();
  await faqButton.click({ force: true });
  await expect(faqButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(`#${panelId}`)).toHaveCount(0);

  await faqButton.click({ force: true });
  await expect(faqButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`#${panelId}`)).toBeVisible();

  await page.getByRole("button", { name: /A urgência da semana define/ }).click({ force: true });
  await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe("H3");
  await expect(page.locator("#diagnostic-audit h3[tabindex='-1']")).toBeFocused();
});

test("Assessoria pré-carrega a imagem hero e reduz a transição do quiz", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPage(page, 1440, 900);
  await acceptCookiesForInteraction(page);

  const heroImage = page.locator("main section").first().locator("img").first();
  await expect(heroImage).toHaveAttribute("sizes", /max-width: 768px/);
  await expect(page.locator('link[rel="preload"][as="image"]')).not.toHaveCount(0);

  await page.getByRole("button", { name: /A urgência da semana define/ }).click({ force: true });
  const question = page.getByRole("heading", { name: "A mensagem da marca se mantém coerente entre os canais?" });
  await expect(page.locator("#diagnostic-audit h3[tabindex='-1']")).toBeFocused();
  const transform = await question.locator("xpath=..").evaluate((element) => getComputedStyle(element).transform);
  expect(transform === "none" || transform.includes("0, 0")).toBeTruthy();
});
