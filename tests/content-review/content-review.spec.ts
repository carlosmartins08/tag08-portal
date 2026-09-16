import { expect, test } from "@playwright/test";

test("prévia local identifica a equipe pendente sem publicá-la", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  await expect(page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']")).toHaveCount(7);
  await expect(page.getByTestId("team-profiles").getByText("Pendente — não publicado")).toHaveCount(7);
});

test("prévia local abre case pendente sem adicioná-lo à produção", async ({ page }) => {
  await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.locator("[data-evidence-key='case-study/case-clinica-alphaville']")).toBeVisible();
  await expect(page.getByText("Pendente — não publicado").first()).toBeVisible();
});

test("prévia da equipe permanece navegável em mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});
