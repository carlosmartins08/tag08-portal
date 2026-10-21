import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, async (route) => {
    const { hostname } = new URL(route.request().url());
    if (hostname === "127.0.0.1" || hostname === "localhost") {
      await route.continue();
    } else {
      await route.abort();
    }
  });
});

test("produção não mostra equipe ainda em investigação", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toHaveCount(0);
  await expect(page.getByTestId("team-profiles")).toHaveCount(0);
  await expect(page.getByTestId("connected-capabilities")).toBeVisible();
});

test("produção mostra provas aprovadas somente em Assessoria", async ({ page }) => {
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("mini-cases")).toBeVisible();
  await expect(page.getByTestId("mini-cases").locator("[data-evidence-key^='mini-case/']")).toHaveCount(6);
  await expect(page.getByTestId("internal-testimonials")).toBeVisible();
});

test("produção não publica case em investigação na URL direta", async ({ page }) => {
  const response = await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
  await expect(page.locator("[data-evidence-key='case-study/case-clinica-alphaville']")).toHaveCount(0);
});

test("Unknown URLs and technical /404 use the real HTTP not-found", async ({ page }) => {
  for (const path of ["/p21-route-does-not-exist", "/404"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(404);
    await expect(page.getByText("404", { exact: true })).toBeVisible();
    const robots = await page.locator('meta[name="robots"]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("content"))
    );
    expect(robots.length).toBeGreaterThan(0);
    expect(robots.every((content) => content?.includes("noindex"))).toBe(true);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
});

test("Approved alias keeps its permanent redirect to the canonical route", async ({ page }) => {
  const response = await page.request.get("/process-intelligence", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toBe("/servicos/process-intelligence");
});
