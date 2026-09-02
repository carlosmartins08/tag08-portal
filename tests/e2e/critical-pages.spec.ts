import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publicRoutePaths } from "../../src/config/routeRegistry";

const criticalRoutes = [
  { path: "/", label: "home" },
  { path: "/contato", label: "contato" },
  { path: "/trabalhe-conosco", label: "talentos" },
  { path: "/cliente/onboarding", label: "onboarding" },
  { path: "/servicos/gestao-de-redes-sociais", label: "gestao-redes-sociais" }
] as const;

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 }
] as const;

async function assertPageFrame(page: Page) {
  await expect(page.locator("main")).toBeVisible();
  expect((await page.title()).trim(), "Toda rota deve ter titulo proprio.").not.toBe("");

  const horizontalOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(horizontalOverflow, "A pagina nao pode ter overflow horizontal.").toBeFalsy();

  const waitForVisibleImages = () => page.waitForFunction(() =>
    Array.from(document.images)
      .filter((image) => {
        const rect = image.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
      })
      .every((image) => image.complete),
    undefined,
    { timeout: 15_000 }
  );
  const getBrokenVisibleImages = () => page.locator("img").evaluateAll((images) =>
    (images as HTMLImageElement[])
      .filter((image) => {
        const rect = image.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
      })
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.getAttribute("src") || "sem-src")
  );

  await waitForVisibleImages();
  let brokenVisibleImages = await getBrokenVisibleImages();

  // Remote editorial assets can fail once while the Next optimizer warms up.
  // The retry still fails the test if the page cannot render the image after reload.
  if (brokenVisibleImages.length > 0) {
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForVisibleImages();
    brokenVisibleImages = await getBrokenVisibleImages();
  }
  expect(brokenVisibleImages, "Imagens visiveis devem carregar.").toEqual([]);
}

async function assertNoSeriousAxeViolations(page: Page) {
  // Axe 4.12 does not resolve Tailwind v4 oklab color tokens correctly.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(["color-contrast"])
    .analyze();
  const blockers = results.violations.filter((violation) =>
    violation.impact === "critical" || violation.impact === "serious"
  );

  expect(blockers, JSON.stringify(blockers, null, 2)).toEqual([]);
}

test.describe("rotas indexaveis", () => {
  test.setTimeout(180_000);

  for (const path of publicRoutePaths) {
    test(`renderiza ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await assertPageFrame(page);
      await assertNoSeriousAxeViolations(page);
    });
  }
});

test.describe("rotas indexaveis em mobile", () => {
  test.setTimeout(180_000);

  for (const path of publicRoutePaths) {
    test(`renderiza ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await assertPageFrame(page);
    });
  }
});

test.describe("rotas indexaveis em tablet", () => {
  test.setTimeout(180_000);

  for (const path of publicRoutePaths) {
    test(`renderiza ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await assertPageFrame(page);
    });
  }
});

for (const viewport of viewports) {
  test.describe(`jornadas criticas em ${viewport.label}`, () => {
    for (const route of criticalRoutes) {
      test(`${route.label} sem quebra visual`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await assertPageFrame(page);

        await page.keyboard.press("Tab");
        const focusableElement = await page.evaluate(() => document.activeElement?.tagName ?? "");
        expect(focusableElement, "A navegacao por teclado deve receber foco.").not.toBe("BODY");

        await page.screenshot({
          path: testInfo.outputPath(`${route.label}-${viewport.label}.png`),
          fullPage: false
        });
      });
    }
  });
}

test.describe("acessibilidade das jornadas criticas", () => {
  for (const route of criticalRoutes) {
    test(`${route.label} sem violacoes graves`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible();

      await assertNoSeriousAxeViolations(page);

      const invalidBrandColors = await page.locator(".text-brand").evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
          })
          .map((element) => getComputedStyle(element).color)
          .filter((color) => color !== "rgb(212, 255, 0)")
      );
      expect(invalidBrandColors, "O token visual de destaque deve manter contraste sobre o tema escuro.").toEqual([]);
    });
  }
});

test.describe("mapa de solucoes da Home", () => {
  const getCardBoxes = async (page: Page) => {
    await page.goto("/#servicos-principais", { waitUntil: "domcontentloaded" });
    const cards = page.getByTestId("solution-map-card");
    await expect(cards).toHaveCount(6);
    const boxes = await cards.evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      })
    );

    expect(boxes.every((box) => box.width > 0 && box.height > 0)).toBeTruthy();
    return boxes;
  };

  test("fecha linhas proporcionais no desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const cards = await getCardBoxes(page);

    // Three equal pairs keep content density and visual weight consistent.
    expect(Math.abs(cards[0].y - cards[1].y)).toBeLessThan(2);
    expect(Math.abs(cards[2].y - cards[3].y)).toBeLessThan(2);
    expect(Math.abs(cards[4].y - cards[5].y)).toBeLessThan(2);
    expect(Math.abs(cards[0].width - cards[1].width)).toBeLessThan(2);
    expect(Math.abs(cards[2].width - cards[3].width)).toBeLessThan(2);
    expect(Math.abs(cards[4].width - cards[5].width)).toBeLessThan(2);
  });

  test("mantem pares equilibrados no tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const cards = await getCardBoxes(page);

    for (const [left, right] of [[0, 1], [2, 3], [4, 5]]) {
      expect(Math.abs(cards[left].y - cards[right].y)).toBeLessThan(2);
      expect(Math.abs(cards[left].height - cards[right].height)).toBeLessThan(2);
    }
  });

  test("empilha os seis momentos sem deslocamento no mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const cards = await getCardBoxes(page);

    for (let index = 1; index < cards.length; index += 1) {
      expect(cards[index].y).toBeGreaterThan(cards[index - 1].y);
      expect(Math.abs(cards[index].x - cards[0].x)).toBeLessThan(2);
      expect(Math.abs(cards[index].width - cards[0].width)).toBeLessThan(2);
    }
  });
});

test.describe("palco editorial da Hero", () => {
  test("reage a luz no desktop sem deslocar a composicao", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(750);

    const visual = page.getByTestId("hero-editorial-stage");
    await expect(visual).toBeVisible();
    const stageBox = await visual.boundingBox();
    if (!stageBox) throw new Error("O palco editorial precisa ter dimensoes renderizadas.");
    expect(stageBox.width).toBeGreaterThan(900);
    expect(stageBox.height).toBeGreaterThan(400);

    await page.mouse.move(stageBox.x + 20, stageBox.y + 20);
    await expect.poll(() => visual.evaluate((element) =>
      element.style.getPropertyValue("--hero-stage-light-x")
    )).not.toBe("72%");
  });

  test("respeita preferencia de reducao de movimento", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const visual = page.getByTestId("hero-editorial-stage");
    await expect(visual).toBeVisible();
    await expect(visual.locator(".hero-editorial-stage__drift")).toHaveCSS("animation-name", "none");
  });
});

test.describe("navegação, sobreposições e controles acessíveis", () => {
  test("abre Soluções por teclado e devolve o foco ao gatilho", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trigger = page.locator("#desktop-nav").getByRole("button", { name: "Soluções", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#desktop-services-panel")).toBeVisible();
    await expect(page.locator("#desktop-services-panel").getByRole("button").first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.locator("#desktop-services-panel")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("menu mobile é um diálogo fechado por Escape com retorno de foco", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(750);

    const trigger = page.locator("#btn-toggle-mobile-menu");
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navegação principal" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Início" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("modal legal tem semântica, foco contido e campos nomeados", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(750);

    const trigger = page.getByRole("button", { name: "Abrir política de privacidade" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: /Política de Privacidade/ });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("button", { name: "Fechar modal", exact: true })).toBeFocused();

    const focusable = dialog.locator("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])");
    await page.keyboard.press("Shift+Tab");
    await expect(focusable.last()).toBeFocused();

    await dialog.getByRole("button", { name: /Abrir Pedido de Direitos/ }).click();
    await expect(dialog.getByLabel("Seu Nome Completo *")).toBeVisible();
    await expect(dialog.getByLabel("Seu E-mail Cadastrado *")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("preferências de cookies expõem estado pressionado", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("region", { name: "Privacidade & Cookies (LGPD)" })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /Abrir personalização de cookies/ }).click();
    const performance = page.getByRole("button", { name: "Ativar cookies de desempenho" });
    await expect(performance).toHaveAttribute("aria-pressed", "false");
    await performance.click();
    await expect(page.getByRole("button", { name: "Desativar cookies de desempenho" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("regressões de responsividade e movimento", () => {
  test("cards da equipe sofrem reflow em 320 px sem corte horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/trabalhe-conosco", { waitUntil: "domcontentloaded" });

    const roleChip = page.getByText("UI/UX & Brand Director");
    await roleChip.scrollIntoViewIfNeeded();
    const box = await roleChip.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  });

  test("diagnóstico não altera seleção sem interação explícita", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/servicos/gestao-de-redes-sociais", { waitUntil: "domcontentloaded" });

    const option = page.getByRole("button", { name: "Falta clareza", exact: true });
    await option.scrollIntoViewIfNeeded();
    await expect(option).toHaveAttribute("aria-pressed", "false");
    await page.waitForTimeout(7_000);
    await expect(option).toHaveAttribute("aria-pressed", "false");
  });

  test("diagrama inicializa o traço sem aviso de valor indefinido", async ({ page }) => {
    const warnings: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_500);
    expect(warnings.filter((warning) => warning.includes("strokeDashoffset"))).toEqual([]);
  });
});
