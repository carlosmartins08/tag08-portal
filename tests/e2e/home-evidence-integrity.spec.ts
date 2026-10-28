import { expect, test } from "@playwright/test";

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

  test("cases em investigação não recebem selo de aprovação", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("VERIFICADO // CO-PILOTO TAG08", { exact: true })).toHaveCount(0);

    const reviewCases = page.locator('[data-evidence-key^="home-case/"]');
    if (await reviewCases.count()) {
      await expect(reviewCases.first().getByText(/Em investigação.*não publicado/)).toBeVisible();
    }
  });
});
