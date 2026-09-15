import { expect, test } from "@playwright/test";

test("produção não mostra prévia nem equipe pendente", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toHaveCount(0);
  await expect(page.getByTestId("team-profiles")).toHaveCount(0);
});

test("produção não resolve case pendente", async ({ page }) => {
  const response = await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
});
