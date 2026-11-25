import { expect, test } from "@playwright/test";

test("public pages render fully in English and Spanish", async ({ page }) => {
  await page.goto("/en/contato", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/en\/contato$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("form")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Browse in English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("body")).not.toContainText("Fale com a TAG08");

  await page.goto("/es/servicos/process-intelligence", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/es\/servicos\/process-intelligence$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("");
  await expect(page.locator("body")).not.toContainText("Inteligência de Processos");
});

test("visitors can switch languages across public routes and keep the same route", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/servicos/process-intelligence", { waitUntil: "domcontentloaded" });

  const english = page.getByRole("button", { name: "Navegar em English" });
  const spanish = page.getByRole("button", { name: /Navegar em Espa/ });
  await expect(english).toBeVisible();
  await expect(spanish).toBeVisible();
  await english.click();
  await expect(page).toHaveURL(/\/en\/servicos\/process-intelligence$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("button", { name: "Browse in Español" }).click();
  await expect(page).toHaveURL(/\/es\/servicos\/process-intelligence$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
});

test("mobile navigation exposes all released languages and switches the current page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pt/sobre", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Abrir menu de navegação" }).click();

  const english = page.getByRole("button", { name: "Navegar em English" });
  const spanish = page.getByRole("button", { name: /Navegar em Espa/ });
  await expect(english).toBeVisible();
  await expect(spanish).toBeVisible();
  await english.click();
  await expect(page).toHaveURL(/\/en\/sobre$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the translated privacy summary is visitor-accessible but remains noindex", async ({ page }) => {
  const response = await page.goto("/en/privacidade", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "TAG08 Privacy Notice" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Portuguese privacy notice" })).toHaveAttribute("href", "/pt/privacidade");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/es/privacidade", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await expect(page.getByRole("heading", { level: 1, name: "Aviso de privacidad de TAG08" })).toBeVisible();
});

test("disabled private onboarding remains inaccessible in foreign locales", async ({ page }) => {
  const response = await page.goto("/en/cliente/onboarding", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
});
