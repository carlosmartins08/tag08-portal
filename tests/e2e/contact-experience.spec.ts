import { expect, test } from "@playwright/test";

test.describe("experiencia de contato", () => {
  test("prioriza o formulario antes dos canais no mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    const intro = page.locator(".tag08-contact__intro");
    const form = page.locator(".tag08-contact__form-column");
    const directory = page.locator(".tag08-contact__directory");

    await expect(intro).toBeVisible();
    await expect(form).toBeVisible();
    await expect(directory).toBeVisible();
    await expect(page.getByRole("heading", { name: "Conte o que precisa mudar" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Solicitar Análise de Posicionamento/i })).toBeVisible();

    const [introBox, formBox, directoryBox] = await Promise.all([
      intro.boundingBox(),
      form.boundingBox(),
      directory.boundingBox()
    ]);

    expect(introBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(directoryBox).not.toBeNull();
    expect(formBox!.y).toBeGreaterThan(introBox!.y);
    expect(directoryBox!.y).toBeGreaterThan(formBox!.y);
  });
});
