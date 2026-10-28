import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
] as const;

const families = [
  "Gestão de Redes Sociais / Presença Digital",
  "Produção Audiovisual",
  "Tecnologia",
  "Assessoria Estratégica / Negócios",
  "Branding / Posicionamento",
  "Processos / Operação"
] as const;

test("Home apresenta seis caminhos de família em todos os breakpoints", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const map = page.locator("#servicos-principais");
    await expect(map).toBeVisible();
    await expect(map.getByTestId("solution-map-card")).toHaveCount(6);
    const orientationLink = page.getByRole("link", { name: /Conte o momento do seu neg/i });
    await expect(orientationLink).toBeVisible();
    expect((await orientationLink.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    for (const family of families) {
      await expect(map.getByRole("heading", { name: family, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }

  await page.setViewportSize(viewports[2]);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const technologyLink = page.getByRole("link", { name: "Conhecer soluções de Tecnologia" });
  await technologyLink.scrollIntoViewIfNeeded();
  expect((await technologyLink.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await technologyLink.click();
  await expect(page).toHaveURL(/\/servicos\/desenvolvimento-web$/);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /Conte o momento do seu neg/i })).toHaveAttribute("href", /\/contato\?intent=orientacao&origin=home/);
  const accessibility = await new AxeBuilder({ page }).include("#servicos-principais").analyze();
  expect(accessibility.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
});
test("Serviços explicita as seis famílias e mantém capacidades subordinadas", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/servicos", { waitUntil: "domcontentloaded" });

    const domains = page.locator(".tag08-service-domain");
    await expect(domains).toHaveCount(6);
    for (const family of families) {
      await expect(domains.getByRole("heading", { name: family, exact: true })).toBeVisible();
    }
    await expect(page.getByText("SEIS FAMÍLIAS", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }

  await page.setViewportSize(viewports[2]);
  await page.goto("/servicos", { waitUntil: "domcontentloaded" });
  const accessibility = await new AxeBuilder({ page }).include("#servicos-principais").analyze();
  expect(accessibility.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);

  await page.getByRole("button", { name: "CONHECER TECNOLOGIA" }).click();
  await expect(page).toHaveURL(/\/servicos\/desenvolvimento-web$/);
  await page.goto("/servicos", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "CONHECER PROCESS ACTIVATION" }).click();
  await expect(page).toHaveURL(/\/servicos\/process-activation$/);
});

test("Contato encaminha por intenção e trata capacidades como contexto", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/contato", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();

    const intentOptions = [
      "Melhorar presença digital e redes sociais",
      "Produzir conteúdo audiovisual",
      "Organizar marca ou posicionamento",
      "Obter direção estratégica para o negócio",
      "Desenvolver site, e-commerce ou solução digital",
      "Dar continuidade à hospedagem ou manutenção do projeto digital",
      "Entender e organizar processos",
      "Ativar melhorias na operação"
    ];
    for (const option of intentOptions) {
      await expect(page.getByRole("checkbox", { name: option, exact: true })).toBeVisible();
    }
    const capabilityGroup = page.getByRole("group", { name: "Capacidades que podem apoiar uma frente" });
    await expect(capabilityGroup.getByRole("checkbox", { name: "Tráfego, SEO, copywriting ou performance" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Preciso de orientação ou tenho outra necessidade" })).toBeVisible();
    await expect(page.getByText(/Tráfego, SEO, copywriting e performance são capacidades de apoio/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }

  await page.setViewportSize(viewports[2]);
  await page.goto("/contato", { waitUntil: "domcontentloaded" });
  await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
  await page.getByRole("button", { name: "Continuar" }).click();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
});

test("onboarding permanece fora da navegação pública genérica", async ({ page }) => {
  for (const path of ["/", "/servicos", "/contato"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator('header a[href*="/cliente/onboarding"], footer a[href*="/cliente/onboarding"]')).toHaveCount(0);
  }
});
