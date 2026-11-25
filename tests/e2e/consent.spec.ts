import { expect, test } from "@playwright/test";

const clearConsent = () => {
  window.localStorage.removeItem("tag08_lgpd_consent");
};

const blockExternalRequests = async (page: import("@playwright/test").Page) => {
  const baseUrl = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${process.env.E2E_PORT ?? "3211"}`;
  const localOrigin = new URL(baseUrl).origin;
  const tagManagerRequests: string[] = [];
  await page.route(/^https?:\/\//, async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === localOrigin) {
      await route.continue();
      return;
    }
    if (url.hostname.toLowerCase() === "www.googletagmanager.com") tagManagerRequests.push(url.href);
    await route.abort();
  });
  return { tagManagerRequests };
};

test.describe("consentimento para terceiros", () => {
test("ambiente local sem destino explicito nao carrega o GTM apos consentimento", async ({ page }) => {
    const { tagManagerRequests } = await blockExternalRequests(page);

    await page.addInitScript(clearConsent);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_400);
    expect(tagManagerRequests).toEqual([]);

    await page.getByRole("button", { name: "Aceitar todos os cookies" }).click();
    await page.waitForTimeout(250);
    expect(tagManagerRequests).toEqual([]);

    await page.getByRole("button", { name: "Sobre", exact: true }).click();
    await expect(page).toHaveURL(/\/sobre$/);
    expect(tagManagerRequests).toEqual([]);
  });

  test("mapa externo so cria iframe apos consentimento de marketing", async ({ page }) => {
    const { tagManagerRequests } = await blockExternalRequests(page);
    await page.addInitScript(clearConsent);
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    const mapFrame = page.locator('iframe[title="Mapa da TAG08"]');
    await expect(mapFrame).toHaveCount(0);

    await page.getByRole("button", { name: "Abrir personalização de cookies" }).click();
    await page.getByRole("button", { name: "Ativar Marketing & Redes Sociais" }).click();
    await page.getByRole("button", { name: "Salvar ajustes de cookies" }).click();
    await expect(mapFrame).toBeVisible();
    expect(tagManagerRequests).toEqual([]);
  });
});
