import { expect, test } from "@playwright/test";
import { renderableRoutePaths } from "../../src/config/routeRegistry";

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 }
] as const;

for (const viewport of viewports) {
  test.describe(`matriz visual completa em ${viewport.label}`, () => {
    test.setTimeout(180_000);

    for (const path of renderableRoutePaths) {
      test(`${path} preserva moldura e controles acessiveis`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(700);

        await expect(page.locator(".tag08-page")).toBeVisible();
        await expect(page.locator(".tag08-editorial-page")).toBeVisible();
        await expect(page.locator("main")).toBeVisible();

        if (path.startsWith("/servicos/")) {
          await expect(page.locator(".tag08-page--service")).toBeVisible();
        }

        const frame = await page.evaluate(() => ({
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          undersizedControls: Array.from(document.querySelectorAll("main button, main a, main input, main select, main textarea"))
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              const hasVisibleAncestors = Array.from(
                function* ancestors(node: Element | null) {
                  while (node) {
                    yield node;
                    node = node.parentElement;
                  }
                }(element)
              ).every((ancestor) => {
                const ancestorStyle = getComputedStyle(ancestor);
                return ancestorStyle.display !== "none" &&
                  ancestorStyle.visibility !== "hidden" &&
                  Number(ancestorStyle.opacity) > 0.1;
              });
              return rect.width > 0 && rect.height > 0 && rect.height < 44 &&
                style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.1 &&
                hasVisibleAncestors;
            })
            .map((element) => ({
              label: (element.textContent || element.getAttribute("aria-label") || element.tagName).trim().slice(0, 80),
              height: Math.round(element.getBoundingClientRect().height)
            }))
        }));

        expect(frame.horizontalOverflow, "A rota nao pode ter overflow horizontal.").toBeFalsy();
        expect(frame.undersizedControls, "Controles visiveis devem ter alvo minimo de 44px.").toEqual([]);
      });
    }
  });
}
