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
          .filter((color) => color !== "rgb(221, 248, 29)")
      );
      expect(invalidBrandColors, "O token visual de destaque deve manter contraste sobre o tema escuro.").toEqual([]);
    });
  }
});

test.describe("mapa de solucoes da Home", () => {
  test("M-02 preserva sua altura mínima nos breakpoints principais", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const card = page.getByRole("link", { name: "Conhecer Branding e Identidade" });
    for (const { width, minHeight } of [
      { width: 390, minHeight: 220 },
      { width: 768, minHeight: 260 },
      { width: 1440, minHeight: 260 }
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(card).toBeVisible();
      const box = await card.boundingBox();
      if (!box) throw new Error(`M-02 precisa ter dimensões renderizadas em ${width}px.`);
      expect(box.height).toBeGreaterThanOrEqual(minHeight);
    }
  });

  test("M-07 fecha alinhado à base do M-04 no desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const m04 = page.getByRole("link", { name: "Conhecer Desenvolvimento Web Estratégico" });
    const m07 = page.getByRole("button", { name: "Iniciar diagnóstico" });
    const [m04Box, m07Box] = await Promise.all([m04.boundingBox(), m07.boundingBox()]);

    if (!m04Box || !m07Box) throw new Error("M-04 e M-07 precisam estar visíveis para validar o alinhamento.");
    expect(Math.abs(m04Box.y + m04Box.height - (m07Box.y + m07Box.height))).toBeLessThan(2);
  });

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

test.describe("avaliacoes da Home", () => {
  test("mantem a avaliacao selecionada ate uma acao da pessoa", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route("**/api/official-content?*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          status: "live",
          sources: { youtube: "fallback", googleBusiness: "live" },
          youtubeVideos: [],
          gmbReviews: [
            {
              name: "Reviewer One",
              role: "Cliente",
              avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
              time: "há 1 semana",
              tagline: "Primeira avaliação de teste",
              text: "Conteúdo de teste para verificar a estabilidade da leitura.",
              category: "TESTE",
              source: "live"
            },
            {
              name: "Reviewer Two",
              role: "Cliente",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
              time: "há 2 semanas",
              tagline: "Segunda avaliação de teste",
              text: "Segundo conteúdo para verificar a seleção manual.",
              category: "TESTE",
              source: "live"
            }
          ]
        })
      })
    );

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const reviews = page.locator("#avaliacoes-gmb");
    await expect(reviews).toBeVisible();
    await expect(reviews.getByRole("heading", { name: "Primeira avaliação de teste" })).toBeVisible();

    await page.waitForTimeout(9_000);
    await expect(reviews.getByRole("heading", { name: "Primeira avaliação de teste" })).toBeVisible();

    const secondReview = reviews.getByRole("button", { name: "Ver avaliação de Reviewer Two" });
    await expect(secondReview).toHaveAttribute("type", "button");
    await secondReview.focus();
    await page.keyboard.press("Enter");
    await expect(reviews.getByRole("heading", { name: "Segunda avaliação de teste" })).toBeVisible();
  });
});

test.describe("canais de contato da Home", () => {
  test("links identificados como WhatsApp abrem os canais oficiais", async ({ page }) => {
    await page.goto("/#prova", { waitUntil: "domcontentloaded" });

    const contactLinks = page.locator("#prova a");
    await expect(contactLinks).toHaveCount(2);
    for (const link of await contactLinks.all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

test.describe("palco editorial da Hero", () => {
  test("apresenta as categorias como atalhos secundarios para Solucoes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const shortcuts = page.getByRole("navigation", { name: "Atalhos para as soluções da TAG08" });
    const links = shortcuts.getByRole("link");
    await expect(links).toHaveCount(6);
    await expect(links.first()).toHaveAttribute("href", "#servicos-principais");
    await links.first().click();
    await expect(page.locator("#servicos-principais")).toBeInViewport();
  });

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

    const option = page.getByLabel("Falta clareza", { exact: true });
    await option.scrollIntoViewIfNeeded();
    await expect(option).not.toBeChecked();
    await page.waitForTimeout(7_000);
    await expect(option).not.toBeChecked();
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
