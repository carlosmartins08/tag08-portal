import { expect, test } from "@playwright/test";

test("a homepage aplica Content Security Policy", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response, "A homepage precisa responder ao navegador.").not.toBeNull();
  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy-report-only"]).toBeUndefined();
  expect(headers["content-security-policy"]).not.toContain("'unsafe-eval'");
});
