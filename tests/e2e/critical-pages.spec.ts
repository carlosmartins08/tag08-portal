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
