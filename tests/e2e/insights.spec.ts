import { expect, test } from "@playwright/test";

test.describe("leitura editorial de insights", () => {
  test("organiza a matéria em destaque com sumário e seções reais", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/insights", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideias que ajudam");
    await page.getByRole("button", { name: /Ler insight em destaque:/ }).click();

    await expect(page.getByText("Nesta leitura", { exact: true })).toBeVisible();
    await expect(page.locator("article.prose h2").first()).toBeVisible();
    await expect(page.locator("article.prose ul, article.prose ol").first()).toBeVisible();
    await expect(page.getByText("Direção Estratégica", { exact: true })).toBeVisible();
  });
});
