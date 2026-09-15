import { expect, test } from "@playwright/test";

test("produção mostra equipe aprovada sem expor a prévia local", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toHaveCount(0);
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  await expect(page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']")).toHaveCount(7);
});

test("produção mostra provas aprovadas somente em Assessoria", async ({ page }) => {
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("mini-cases")).toBeVisible();
  await expect(page.getByTestId("mini-cases").locator("[data-evidence-key^='mini-case/']")).toHaveCount(6);
  await expect(page.getByTestId("internal-testimonials")).toBeVisible();
});

test("produção não resolve case pendente", async ({ page }) => {
  const response = await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
});
