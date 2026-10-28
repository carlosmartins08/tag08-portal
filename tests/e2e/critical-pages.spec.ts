import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publicRoutePaths } from "../../src/config/routeRegistry";

const criticalRoutes = [
  { path: "/", label: "home" },
  { path: "/contato", label: "contato" },
  { path: "/trabalhe-conosco", label: "talentos" },
  { path: "/servicos/gestao-de-redes-sociais", label: "gestao-redes-sociais" }
] as const;

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 }
] as const;

function assertHomeContactTarget(url: URL) {
  expect(url.pathname).toBe("/contato");
  expect(url.search).toBe("?intent=orientacao&origin=home");
  expect(Array.from(url.searchParams.entries())).toEqual([
    ["intent", "orientacao"],
    ["origin", "home"]
  ]);
}

async function holdScriptsUntilContactNavigation(page: Page) {
  let releaseScripts!: () => void;
  let notifyScriptRequest!: () => void;
  const scriptsReleased = new Promise<void>((resolve) => { releaseScripts = resolve; });
  const scriptRequested = new Promise<void>((resolve) => { notifyScriptRequest = resolve; });
  let scriptRequestCount = 0;
  let released = false;
  let navigationStartedBeforeRelease = false;

  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();

    if (route.request().resourceType() === "script") {
      scriptRequestCount += 1;
      notifyScriptRequest();
      await scriptsReleased;
      return route.continue();
    }

    if (route.request().isNavigationRequest() && url.pathname === "/contato") {
      navigationStartedBeforeRelease = scriptRequestCount > 0 && !released;
      released = true;
      releaseScripts();
    }

    return route.continue();
  });

  return {
    scriptRequested,
    navigationStartedBeforeRelease: () => navigationStartedBeforeRelease
  };
}

test.describe("CTA principal da Hero", () => {
  test("navega por link nativo enquanto os scripts permanecem pendentes", async ({ page }) => {
    const gate = await holdScriptsUntilContactNavigation(page);
    await page.goto("/", { waitUntil: "commit" });

    const contact = page.getByRole("link", { name: /Ir para contato e solicitar diagn/i });
    await expect(contact).toBeVisible();
    await expect(contact).toBeEnabled();
    await expect(contact).toHaveAttribute("href", "/contato?intent=orientacao&origin=home");
    await gate.scriptRequested;

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const box = await contact.boundingBox();
      expect(box, `O CTA da Hero deve estar renderizado em ${viewport.width}px.`).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    }

    const navigation = page.waitForURL((url) => url.pathname === "/contato");
    await contact.click();
    await navigation;
    expect(gate.navigationStartedBeforeRelease()).toBeTruthy();
    assertHomeContactTarget(new URL(page.url()));
  });

  test("Enter também navega antes da hidratação", async ({ page }) => {
    const gate = await holdScriptsUntilContactNavigation(page);
    await page.goto("/", { waitUntil: "commit" });

    const contact = page.getByRole("link", { name: /Ir para contato e solicitar diagn/i });
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute("href", "/contato?intent=orientacao&origin=home");
    await gate.scriptRequested;

    await contact.focus();
    await expect(contact).toBeFocused();
    const navigation = page.waitForURL((url) => url.pathname === "/contato");
    await page.keyboard.press("Enter");
    await navigation;
    expect(gate.navigationStartedBeforeRelease()).toBeTruthy();
    assertHomeContactTarget(new URL(page.url()));
  });

  test("mantem navegação client-side após hidratação sem duplicar histórico", async ({ page }) => {
    await page.route("**/*", (route) =>
      new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort()
    );
    let documentNavigations = 0;
    page.on("request", (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documentNavigations += 1;
    });

    await page.goto("/", { waitUntil: "networkidle" });
    const initialDocumentNavigations = documentNavigations;
    const contact = page.getByRole("link", { name: /Ir para contato e solicitar diagn/i });
    await expect(contact).toBeVisible();
    await contact.click();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/contato");
    assertHomeContactTarget(new URL(page.url()));
    expect(documentNavigations).toBe(initialDocumentNavigations);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole("link", { name: /Ir para contato e solicitar diagn/i }).focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => new URL(page.url()).pathname).toBe("/contato");
    assertHomeContactTarget(new URL(page.url()));
    expect(documentNavigations).toBe(initialDocumentNavigations);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test("o href continua funcional sem JavaScript", async ({ page }) => {
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      if (url.hostname !== "127.0.0.1") return route.abort();
      if (route.request().resourceType() === "script") return route.abort();
      return route.continue();
    });

    await page.goto("/", { waitUntil: "commit" });
    const contact = page.getByRole("link", { name: /Ir para contato e solicitar diagn/i });
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute("href", "/contato?intent=orientacao&origin=home");

    const response = page.waitForResponse((candidate) =>
      candidate.request().isNavigationRequest() && new URL(candidate.url()).pathname === "/contato"
    );
    await contact.click();
    expect((await response).status()).toBe(200);
    assertHomeContactTarget(new URL(page.url()));
  });
});

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

test.describe("apresentacao do metodo da Home", () => {
  test("preserva a secao institucional e seu proximo passo de contato", async ({ page }) => {
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.hostname !== "127.0.0.1") return route.abort();
      if (url.pathname === "/api/official-content") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true, status: "fallback", sources: { youtube: "fallback", googleBusiness: "fallback" }, youtubeVideos: [], gmbReviews: [] })
        });
      }
      if (url.pathname === "/_next/image" && url.searchParams.get("url")?.startsWith("http")) return route.abort();
      return route.continue();
    });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/#solucao", { waitUntil: "domcontentloaded" });

      const section = page.locator("#solucao");
      await expect(section.getByRole("heading", { level: 2, name: "Por que marcas em evolução escolhem a TAG08." })).toBeVisible();
      await expect(section.getByText("Porque a TAG08 não entra apenas para executar demandas soltas.", { exact: false })).toBeVisible();
      await expect(section.getByText("Estratégia, conteúdo, tecnologia e processos", { exact: true })).toBeVisible();
      await expect(section).toHaveAttribute("id", "solucao");
      await expect(section.locator("[id]")).toHaveCount(0);
      await expect(section.getByRole("heading", { level: 2 })).toHaveCount(1);
      await expect(section.getByRole("link")).toHaveCount(0);
      const layout = await section.evaluate((element) => {
        const content = element.querySelector(".max-w-7xl");
        if (!content) throw new Error("O container da seção #solucao não foi renderizado.");
        const bounds = content.getBoundingClientRect();
        const sectionStyles = getComputedStyle(element);
        return {
          sectionWidth: element.clientWidth,
          contentWidth: bounds.width,
          display: sectionStyles.display,
          backgroundColor: sectionStyles.backgroundColor
        };
      });
      expect(layout.contentWidth, `O conteúdo deve caber na seção em ${viewport.width}px.`).toBeLessThanOrEqual(layout.sectionWidth + 1);
      expect(layout.display).toBe("block");
      expect(layout.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(hasPageOverflow, `A Home não deve ter overflow em ${viewport.width}px.`).toBeFalsy();
    }

    const section = page.locator("#solucao");
    const contact = section.getByRole("button", { name: "FALAR COM A TAG08" });
    await expect(contact).toBeVisible();
    await contact.focus();
    await expect(contact).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/contato\?intent=orientacao&origin=home$/);
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
  test("Banco de Talentos apresenta candidatura espontânea sem sugerir vaga ativa", async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/trabalhe-conosco", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Compartilhe seu perfil profissional.");
      await expect(page.getByRole("heading", { name: "Banco de Talentos", exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: "Conhecer o Banco de Talentos" })).toBeVisible();
      await expect(page.getByText(/Vagas em Aberto|POSIÇÕES DISPONÍVEIS|R\$ 6k|R\$ 7k|Retornaremos em breve/i)).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/trabalhe-conosco$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
      const applyLink = page.getByRole("link", { name: "Enviar meu perfil", exact: true }).first();
      await applyLink.focus();
      await expect(applyLink).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#aplicacao-direta-anchor$/);
    }
  });

  test("Talent v2 submits multiple areas and preserves adaptive answers", async ({ page }) => {
    let submittedPayload: Record<string, unknown> | undefined;
    await page.route("**/api/talent-applications", async (route) => {
      submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, applicationId: "synthetic-application", status: "accepted" }) });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/trabalhe-conosco", { waitUntil: "domcontentloaded" });
    await page.locator("#talent-name").waitFor();
    await page.getByRole("link", { name: "Enviar meu perfil", exact: true }).first().click();

    await page.getByRole("button", { name: /Continuar/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: /Selecione pelo menos uma/ })).toBeVisible();
    await page.locator("#talent-area-design").check();
    await page.locator("#talent-area-technology_development").check();
    await page.locator("#talent-area-sales_sdr").check();
    await page.locator("#talent-area-other_specialties").check();
    await page.getByLabel("Qual especialidade?").fill("Pesquisa de usuarios");
    await page.getByLabel("Nome Completo *").fill("Pessoa Sintetica QA");
    await page.getByLabel("E-mail de Contato *").fill("qa@example.test");
    await page.getByLabel("WhatsApp de Contato *").fill("+5500000000000");
    await page.getByRole("button", { name: /Continuar/ }).click();

    await expect(page.getByLabel(/Perfil do LinkedIn/)).toBeVisible();
    await page.getByRole("button", { name: /Continuar/ }).click();
    await page.getByLabel(/Experi.ncia profissional/).fill("Experiencia sintetica em projetos.");
    await page.getByLabel("Disponibilidade (opcional)").fill("A combinar");
    await page.getByLabel(/O que motiva seu interesse/).fill("Interesse em colaborar em oportunidades futuras.");
    await page.getByLabel(/Trabalhos ou projetos relevantes/).fill("Projeto sintetico de design.");
    await page.getByLabel(/Conte brevemente uma experi.ncia relacionada/).fill("Experiencia sintetica em vendas.");
    await expect(page.getByLabel(/Trabalhos ou projetos relevantes/)).toBeVisible();
    await expect(page.getByLabel(/Conte brevemente uma experi.ncia relacionada/)).toBeVisible();
    await page.getByRole("checkbox", { name: /Autorizo o uso destes dados/ }).check();
    await page.getByRole("button", { name: "Revisar candidatura" }).click();

    const review = page.getByTestId("talent-application-review");
    await expect(review).toBeVisible();
    await expect(review).toContainText("Design, Tecnologia e Desenvolvimento, Comercial e SDR, Outras Especialidades");
    await expect(review).toContainText("Projeto sintetico de design.");
    await expect(review).toContainText("Experiencia sintetica em vendas.");
    expect(submittedPayload).toBeUndefined();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    }

    await page.getByRole("button", { name: "Editar dados pessoais" }).click();
    await expect(page.locator("#talent-area-design")).toBeChecked();
    await expect(page.locator("#talent-area-technology_development")).toBeChecked();
    await expect(page.getByLabel("Qual especialidade?")).toHaveValue("Pesquisa de usuarios");
    await expect(page.getByLabel("Nome Completo *")).toHaveValue("Pessoa Sintetica QA");
    await page.getByRole("button", { name: /Continuar/ }).click();
    await page.getByRole("button", { name: /Continuar/ }).click();
    await expect(page.getByLabel(/Trabalhos ou projetos relevantes/)).toHaveValue("Projeto sintetico de design.");
    await page.getByLabel(/O que motiva seu interesse/).fill("Motivacao revisada.");
    await page.getByRole("button", { name: "Revisar candidatura" }).click();
    await expect(review).toContainText("Motivacao revisada.");
    await page.getByRole("button", { name: "Enviar candidatura" }).click();

    const success = page.getByTestId("talent-application-success");
    await expect(success).toContainText("Candidatura enviada!");
    await expect(success).not.toContainText(/triagem concluida|contratacao garantida/i);
    expect(submittedPayload).toMatchObject({
      contractVersion: 2,
      interestAreas: ["design", "technology_development", "sales_sdr", "other_specialties"],
      otherSpecialty: "Pesquisa de usuarios",
      experienceSummary: "Experiencia sintetica em projetos.",
      availability: "A combinar",
      motivation: "Motivacao revisada.",
      relevantProjects: "Projeto sintetico de design.",
      relevantExperience: "Experiencia sintetica em vendas.",
      consent: true,
      consentVersion: "talent-v2",
      source: "talent-page"
    });
    expect(submittedPayload).not.toHaveProperty("vacancyId");
    expect(submittedPayload).not.toHaveProperty("vacancyTitle");
    expect(submittedPayload).not.toHaveProperty("resumeFileName");
    await expect(page.getByText(/Retornaremos em breve|triagem.*consolidada/i)).toHaveCount(0);
  });

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
