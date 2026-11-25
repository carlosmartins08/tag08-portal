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

  const technologyLink = page.getByRole("link", { name: "CONHECER TECNOLOGIA", exact: true });
  await technologyLink.scrollIntoViewIfNeeded();
  await expect(technologyLink).toBeVisible();
  await expect(technologyLink).toHaveAttribute("href", /\/servicos\/desenvolvimento-web$/);
  await technologyLink.focus();
  await expect(technologyLink).toBeFocused();
  expect(await technologyLink.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/\/servicos$/);
  await technologyLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/servicos\/desenvolvimento-web$/);
  await page.goto("/servicos", { waitUntil: "domcontentloaded" });
  const processActivationLink = page.getByRole("link", { name: "CONHECER PROCESS ACTIVATION", exact: true });
  await processActivationLink.scrollIntoViewIfNeeded();
  await expect(processActivationLink).toBeVisible();
  await expect(processActivationLink).toHaveAttribute("href", /\/servicos\/process-activation$/);
  await processActivationLink.focus();
  await expect(processActivationLink).toBeFocused();
  expect(await processActivationLink.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/\/servicos$/);
  await processActivationLink.focus();
  await page.keyboard.press("Enter");
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

test("seletor de servidor usa grupo de radios nativos e navegação por setas", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/hospedagem-manutencao-sites", { waitUntil: "domcontentloaded" });

  const group = page.getByRole("group", { name: "Selecione o plano de servidor" });
  const radios = group.getByRole("radio");
  await expect(radios).toHaveCount(3);
  await expect(radios.nth(0)).toBeChecked();

  await radios.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(1)).toBeChecked();
  await expect(radios.nth(1)).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(radios.nth(0)).toBeChecked();
});

test("Branding mantém alvos e navegação utilizáveis em mobile, paisagem e zoom de 200%", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await page.goto("/servicos/branding-identidade", { waitUntil: "load" });
  await expect(page.getByRole("heading", { name: "Identidade visual com direção para marcas que precisam comunicar melhor seu valor." })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);

  const viewports = [
    { label: "390 portrait", width: 390, height: 844 },
    { label: "375 portrait", width: 375, height: 812 },
    { label: "844 landscape", width: 844, height: 390 },
    { label: "200% zoom equivalent", width: 195, height: 422 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForFunction(async () => {
      const snapshot = () => [...document.querySelectorAll("main a, main button, main input, main select, main textarea")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
        }).join("|");
      const first = snapshot();
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      const second = snapshot();
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      return first === second && second === snapshot();
    });

    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      undersized: [...document.querySelectorAll("main a, main button, main input, main select, main textarea")]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const visible = style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.1;
          return visible && rect.width > 0 && rect.height > 0 && Math.round(rect.height) < 44;
        })
        .map((element) => ({
          label: (element.getAttribute("aria-label") || element.textContent || element.tagName).trim().slice(0, 70),
          width: Math.round(element.getBoundingClientRect().width),
          height: Math.round(element.getBoundingClientRect().height)
        }))
    }));

    expect(layout.overflow, `${viewport.label}: overflow horizontal`).toBe(false);
    expect(layout.undersized, `${viewport.label}: controles menores que 44px`).toEqual([]);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => ({
    label: (document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent || "").trim(),
    outlineStyle: getComputedStyle(document.activeElement!).outlineStyle,
    outlineWidth: getComputedStyle(document.activeElement!).outlineWidth
  }));
  expect(focused.label).toContain("Pular para o conteúdo");
  expect(focused.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focused.outlineWidth)).toBeGreaterThan(0);

  const healthFilter = page.getByRole("button", { name: "Identidade para saúde", exact: true });
  await healthFilter.scrollIntoViewIfNeeded();
  await healthFilter.tap();
  await expect(healthFilter).toHaveAttribute("aria-pressed", "true");
  await context.close();
});

test("Branding devolve o foco ao controle que abriu os detalhes do card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/servicos/branding-identidade", { waitUntil: "domcontentloaded" });

  const detailsButton = page.getByRole("button", { name: "Ver detalhes da aplicação" }).first();
  await detailsButton.scrollIntoViewIfNeeded();
  await detailsButton.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(detailsButton).toBeFocused();
});
