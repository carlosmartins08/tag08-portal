import { expect, test } from "@playwright/test";

const clearConsent = () => {
  window.localStorage.removeItem("tag08_lgpd_consent");
};

test.describe("consentimento para terceiros", () => {
test("GTM so carrega com consentimento e page_view nao e retroativo", async ({ page }) => {
    const analyticsRequests: string[] = [];

    await page.addInitScript(clearConsent);
    await page.route("https://www.googletagmanager.com/**", async (route) => {
      analyticsRequests.push(route.request().url());
      await route.abort();
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_400);
    expect(analyticsRequests).toEqual([]);

    await page.getByRole("button", { name: "Aceitar todos os cookies" }).click();
    await expect.poll(() => analyticsRequests.length).toBe(1);
    const pageViewCount = () => page.evaluate(() =>
      ((window as Window & { dataLayer?: unknown[] }).dataLayer ?? []).filter((entry) =>
        typeof entry === "object" && entry !== null && "event" in entry && entry.event === "page_view"
      ).length
    );
    expect(await pageViewCount()).toBe(0);

    await page.getByRole("button", { name: "Sobre", exact: true }).click();
    await expect(page).toHaveURL(/\/sobre$/);
    await expect.poll(pageViewCount).toBe(1);
  });

  test("mapa externo so cria iframe apos consentimento de marketing", async ({ page }) => {
    await page.addInitScript(clearConsent);
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    const mapFrame = page.locator('iframe[title="Mapa da TAG08"]');
    await expect(mapFrame).toHaveCount(0);

    await page.getByRole("button", { name: "Abrir personalização de cookies" }).click();
    await page.getByRole("button", { name: "Ativar Marketing & Redes Sociais" }).click();
    await page.getByRole("button", { name: "Salvar ajustes de cookies" }).click();
    await expect(mapFrame).toBeVisible();
  });
});
