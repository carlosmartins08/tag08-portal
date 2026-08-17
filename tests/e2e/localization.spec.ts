import { expect, test } from "@playwright/test";

test("an incomplete locale never serves a shortened substitute page", async ({ page }) => {
  await page.goto("/en/contato", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/contato$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("form")).toHaveCount(1);

  await page.goto("/es/servicos/process-intelligence", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/servicos\/process-intelligence$/);
  await expect(page.locator("h2")).toHaveCount(9);
});

test("language selector exposes only locales approved for the current page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/servicos/process-intelligence", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("button", { name: "Navegar em English" })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Navegar em Espa/ })).toBeDisabled();

  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Navegar em English" })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Navegar em Espa/ })).toBeEnabled();

  await page.getByRole("button", { name: "Navegar em English" }).click();
  await expect(page).toHaveURL(/\/en\/cliente\/onboarding$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
