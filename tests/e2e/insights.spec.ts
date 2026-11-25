import { expect, test } from "@playwright/test";

test.describe("leitura editorial de insights", () => {
  test("exposes article links from the hub as crawlable routes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/insights", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideias que ajudam");
    await expect(page.getByRole("link", { name: /Ler insight em destaque:/ })).toHaveAttribute(
      "href",
      /^\/insights\/[a-z0-9-]+$/
    );
    await expect(page.getByRole("link", { name: /Ler insight:/ }).first()).toHaveAttribute(
      "href",
      /^\/insights\/[a-z0-9-]+$/
    );
  });

  test("renders an individual article with canonical metadata and contextual next step", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/insights/conteudo-estrategico-apoia-decisoes", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Conteúdo estratégico: como transformar comunicação em apoio à decisão"
    );
    const outline = page.getByRole("complementary", { name: "Navegação desta leitura" });
    await expect(outline).toBeVisible();
    await expect(outline.getByText("Nesta leitura", { exact: true })).toBeVisible();
    await expect(page.locator("article.prose h2").first()).toBeVisible();
    await expect(page.locator("article.prose ul, article.prose ol").first()).toBeVisible();
    await expect(page.getByText("Próximo passo recomendado", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Entender esta solução/ })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://tag08.com.br/insights/conteudo-estrategico-apoia-decisoes"
    );
    await expect.poll(() => page.locator("#schema-article").evaluate((element) => element.textContent ?? ""))
      .toContain('"@type":"Article"');
  });
});
