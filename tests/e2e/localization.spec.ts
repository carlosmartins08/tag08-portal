import { expect, test } from "@playwright/test";

test("English and Spanish routes render localized editorial content", async ({ page }) => {
  await page.goto("/en/servicos", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The right structure");
  await expect(page.getByText("Nuestros servicios conectan")).toHaveCount(0);

  await page.goto("/es/servicos", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("La estructura adecuada");
  await expect(page.getByText("Our services connect")).toHaveCount(0);
});

test("localized contact keeps direct multichannel conversion paths", async ({ page }) => {
  await page.goto("/en/contato", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "Open WhatsApp" })).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("link", { name: "Send an email" })).toHaveAttribute("href", /^mailto:/);
});

test("language selector preserves the current route across all published locales", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/servicos/process-intelligence", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Navegar em English" }).click();
  await expect(page).toHaveURL(/\/en\/servicos\/process-intelligence$/);
  await expect(page.getByRole("button", { name: "Navegar em Español" })).toBeEnabled();

  await page.getByRole("button", { name: "Navegar em Español" }).click();
  await expect(page).toHaveURL(/\/es\/servicos\/process-intelligence$/);

  await page.getByRole("button", { name: "Navegar em Português" }).click();
  await expect(page).toHaveURL(/\/servicos\/process-intelligence$/);
});
