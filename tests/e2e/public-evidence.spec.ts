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

test("produção apresenta os cinco perfis autorizados sem expor os demais em investigação", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toHaveCount(0);
  await expect(page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']")).toHaveCount(5);
  await expect(page.getByTestId("team-profiles").locator("img[src*='images.unsplash.com']")).toHaveCount(0);
  await expect(page.getByTestId("team-profiles").getByRole("link", { name: /LinkedIn em nova guia/ })).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Profissionais que podem integrar os projetos." })).toBeVisible();
  await expect(page.getByText("Como a TAG08 atua.", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId("connected-capabilities")).toHaveCount(0);

  const approvedProfiles = [
    ["Carlos Henrique Martins", "/team/carlos-henrique-martins.jpg", "https://www.linkedin.com/in/carlosmartins08/"],
    ["Ignacio Quiroz", "/team/ignacio-quiroz.jpg", "https://www.linkedin.com/in/ignacio-quiroz-b1568a52/"],
    ["Pedro Félix", "/team/pedro-felix.jpg", "https://www.linkedin.com/in/pedrovsfelix/"],
    ["Andréia Braga", "/team/andreia-braga.jpg", "https://www.linkedin.com/in/andr%C3%A9ia-braga-3b064a221/"],
    ["Daniel Lopes", "/team/daniel-lopes.jpg", "https://www.linkedin.com/in/daniellopesjp/"]
  ] as const;

  for (const [name, photo, linkedin] of approvedProfiles) {
    const profile = page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']").filter({ hasText: name });
    await expect(profile.getByRole("img", { name: `Retrato de ${name}` })).toHaveAttribute("src", photo);
    await expect(profile.getByRole("link", { name: `Abrir perfil de ${name} no LinkedIn em nova guia` })).toHaveAttribute("href", linkedin);
  }
});

test("produção mostra provas aprovadas somente em Assessoria", async ({ page }) => {
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("mini-cases")).toBeVisible();
  await expect(page.getByTestId("mini-cases").locator("[data-evidence-key^='mini-case/']")).toHaveCount(6);
  await expect(page.getByTestId("internal-testimonials")).toBeVisible();
  await expect(page.getByTestId("internal-testimonials").locator("img[src*='images.unsplash.com']")).toHaveCount(0);
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

test("Unknown URLs negotiate Markdown for agent clients without changing HTTP 404", async ({ page }) => {
  const markdown = await page.request.get("/pt/p21-markdown-not-found", {
    headers: { Accept: "text/markdown" }
  });

  expect(markdown.status()).toBe(404);
  expect(new URL(markdown.url()).pathname).toBe("/p21-markdown-not-found");
  expect(markdown.headers()["content-type"]).toMatch(/^text\/markdown;\s*charset=utf-8/i);
  expect(markdown.headers()["vary"]).toMatch(/(?:^|,\s*)Accept(?:,|$)/i);
  expect(markdown.headers()["cache-control"]).toBe("no-store");
  expect(markdown.headers()["x-robots-tag"]).toMatch(/noindex/i);
  const markdownBody = await markdown.text();
  expect(markdownBody.length).toBeGreaterThanOrEqual(20);
  expect(markdownBody).toMatch(/não corresponde a uma página disponível/i);
  expect(markdownBody).toContain("(/llms.txt)");

  const html = await page.request.get("/p21-markdown-not-found", {
    headers: { Accept: "text/html" }
  });
  expect(html.status()).toBe(404);
  expect(html.headers()["content-type"]).toMatch(/^text\/html/i);
  expect(html.headers()["cache-control"]).toBe("no-store");
  expect(await html.text()).toContain("<html");
});

test("Approved alias keeps its permanent redirect to the canonical route", async ({ page }) => {
  const response = await page.request.get("/process-intelligence", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toBe("/servicos/process-intelligence");
});
