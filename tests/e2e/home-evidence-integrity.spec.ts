import { expect, test } from "@playwright/test";

test("editorial font stays opt-in and responsive", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const heading = page.locator("#diagnostico h2");
    await expect(heading).toHaveClass(/tag08-editorial-heading/);
    const homeFonts = await heading.evaluate((element) => {
      const navigationItem = document.querySelector("#main-header nav a, #main-header nav button");
      return {
        editorialFamily: getComputedStyle(element).fontFamily,
        editorialLoaded: document.fonts.check("600 16px darkerGrotesque"),
        navigationFamily: navigationItem ? getComputedStyle(navigationItem).fontFamily : "",
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });
    expect(homeFonts.editorialFamily).toContain("darkerGrotesque");
    expect(homeFonts.editorialLoaded).toBe(true);
    expect(homeFonts.navigationFamily).toContain("manrope");
    expect(homeFonts.hasHorizontalOverflow).toBe(false);

    await page.goto("/pt/servicos/desenvolvimento-web", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const webHeading = page.locator("h2").filter({ hasText: "Quando o site deixa de ajudar a marca a ser entendida" }).first();
    await expect(webHeading).toHaveClass(/tag08-editorial-heading/);
    await expect(webHeading).toBeVisible();
    const webFonts = await webHeading.evaluate((element) => ({
      editorialFamily: getComputedStyle(element).fontFamily,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    }));
    expect(webFonts.editorialFamily).toContain("darkerGrotesque");
    expect(webFonts.hasHorizontalOverflow).toBe(false);
  }
});

test.describe("integridade de evidências na Home", () => {
  test("diagnóstico é qualitativo, interativo e responsivo", async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const diagram = page.getByTestId("diagnostic-diagram");
      const pillars = diagram.getByRole("button");
      await expect(pillars).toHaveCount(3);
      await diagram.evaluate((element) => element.scrollIntoView({ block: "center" }));
      await expect(diagram.getByText(/34\s*%|48\s*%|21\s*%|\u00cdndice m\u00e9dio/i)).toHaveCount(0);
      await expect(diagram.getByTestId("diagnostic-focus")).toContainText(/Posicionamento/);
      await expect(diagram.getByText(/Leitura qualitativa/)).toBeVisible();

      await pillars.nth(1).focus();
      await expect(pillars.nth(1)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(pillars.nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(diagram.getByTestId("diagnostic-focus")).toContainText(/Sincronia de canais/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    }
  });

  test("cases autorizados na Home usam gate próprio e não expõem selo de revisão", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("VERIFICADO // CO-PILOTO TAG08", { exact: true })).toHaveCount(0);

    const homeCases = page.locator('[data-testid="home-case-card"][data-evidence-key^="home-case/"]');
    await expect(homeCases).toHaveCount(14);
    await expect(homeCases.locator("img")).toHaveCount(2);
    await expect(homeCases.getByRole("img", { name: "Alugue por Temporada" })).toBeVisible();
    await expect(homeCases.getByRole("img", { name: "Luciana Gadelha" })).toBeVisible();
    await expect(page.locator('[data-testid="home-case-card"][data-evidence-key^="case-study/"]')).toHaveCount(0);
    await expect(homeCases.getByText(/Em investigação.*não publicado/)).toHaveCount(0);
  });

  test("cases form a keyboard-operable responsive carousel", async ({ page }) => {
    for (const width of [375, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const carousel = page.getByRole("region", { name: "Cases da TAG08" });
      const previous = page.getByRole("button", { name: "Case anterior" });
      const next = page.getByRole("button", { name: "Pr\u00f3ximo case" });
      await expect(carousel).toHaveAttribute("aria-roledescription", "carrossel");
      await expect(carousel.locator("[data-testid='home-case-card']")).toHaveCount(14);
      await expect(previous).toBeDisabled();
      await expect(next).toBeEnabled();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();

      await next.focus();
      await page.keyboard.press("Enter");
      await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      await expect(previous).toBeEnabled();

      await previous.focus();
      await page.keyboard.press("Enter");
      await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBe(0);
      await expect(previous).toBeDisabled();
    }
  });
});
