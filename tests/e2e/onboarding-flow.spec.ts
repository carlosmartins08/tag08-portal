import { expect, test, type Page } from "@playwright/test";

async function advance(page: Page) {
  await page.getByRole("button", { name: /Avan|Next|Siguiente/ }).click();
}

async function reachConsent(page: Page) {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/respostas n.{0,3}o enviadas/i)).toBeVisible();
  await page.getByRole("button", { name: /equipe TAG08/ }).click();
  await page.getByRole("button", { name: /Onboarding/ }).click();

  await page.locator("#onboarding-company-name").fill("Empresa de teste TAG08");
  await advance(page);
  await page.locator("#onboarding-city").fill("João Pessoa - PB");
  await advance(page);
  await advance(page);
  await advance(page);

  await page.locator("#onboarding-operator-name").fill("Ana TAG08");
  await advance(page);
  await page.locator("#onboarding-responsible-name").fill("Contato do cliente");
  await advance(page);
  await page.locator("#onboarding-responsible-email").fill("contato@example.com");
  await page.locator("#onboarding-responsible-whatsapp").fill("+55 11 99999-9999");
  await advance(page);
  await advance(page);

  await page.locator('[role="radiogroup"]').nth(0).getByRole("radio").first().click();
  await advance(page);
  await page.locator('[role="radiogroup"]').nth(1).getByRole("radio").first().click();
  await advance(page);
  await advance(page);

  await page.getByRole("checkbox", { name: /Gest.o de Redes Sociais/ }).click();
  await page.getByRole("checkbox", { name: /Tr.fego Pago/ }).click();
  await advance(page);

  const trafficGoal = page.getByPlaceholder(/Se houver algo relevante que ficou de fora/);
  await expect(trafficGoal).toBeVisible();
  await trafficGoal.fill("Aumentar pedidos qualificados");
  await advance(page);
  await advance(page);
  await advance(page);

  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "94");
  await page.locator("#onboarding-good-result").fill("Aumentar pedidos qualificados nos primeiros 90 dias");
  await advance(page);

  await expect(page.getByRole("checkbox")).toHaveCount(3);
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("checkbox").nth(2).check();
}

test("abre o onboarding acima do header e do footer globais", async ({ page }) => {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Onboarding$/ }).click();

  const flowLayer = page.locator('[data-onboarding-unsent="true"]');
  await expect(flowLayer).toHaveCSS("position", "fixed");
  expect(await flowLayer.evaluate((element) => element.parentElement === document.body)).toBe(true);
});

test("registra preenchimento da equipe e preserva briefing ao combinar servicos", async ({ page }) => {
  let submittedPayload: Record<string, unknown> | undefined;
  await page.route("**/api/onboarding", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, submissionId: "onboarding-test", status: "accepted", receivedAt: "2026-10-06T12:00:00.000Z" })
    });
  });

  await reachConsent(page);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await page.getByRole("button", { name: /Enviar Onboarding Completo/ }).click();

  await expect(page.getByText("ONBOARDING ENVIADO COM SUCESSO")).toBeVisible();
  expect(submittedPayload?.submissionContext).toEqual({
    submittedBy: "tag08_team",
    operatorName: "Ana TAG08",
    clientAuthorizationConfirmed: true
  });
  expect(submittedPayload?.consent).toMatchObject({ authorizationConfirmedByOperator: true });
  expect(submittedPayload?.serviceSpecificBriefing).toMatchObject({
    geral: { generalBriefingText: "Aumentar pedidos qualificados" }
  });
});

test("bloqueia avancar sem identificar o operador", async ({ page }) => {
  let onboardingRequests = 0;
  await page.route("**/api/onboarding", async (route) => {
    onboardingRequests += 1;
    await route.abort("failed");
  });

  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /equipe TAG08/ }).click();
  await page.getByRole("button", { name: /Onboarding/ }).click();
  await page.locator("#onboarding-company-name").fill("Empresa de teste TAG08");
  await advance(page);
  await advance(page);
  await advance(page);
  await advance(page);
  await advance(page);
  await expect(page.getByRole("alert").filter({ hasText: /Informe seu nome para identificar o preenchimento pela equipe TAG08/ })).toBeVisible();
  expect(onboardingRequests).toBe(0);
});

test("identifica quando o envio permanece na fila local", async ({ page }) => {
  await page.route("**/api/onboarding", (route) => route.abort("failed"));
  await reachConsent(page);
  await page.getByRole("button", { name: /Enviar Onboarding Completo/ }).click();

  await expect(page.getByText(/AGUARDANDO/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Envio ainda n/ })).toBeVisible();
  await expect(page.getByText("ONBOARDING ENVIADO COM SUCESSO")).toHaveCount(0);
});

test("idioma de atendimento nao altera idioma da assistente", async ({ page }) => {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Onboarding$/ }).click();
  await page.locator("#onboarding-company-name").fill("Empresa TAG08 Teste");
  await advance(page);
  await advance(page);
  await advance(page);

  const supportLanguage = page.getByRole("group", {
    name: "Em qual idioma o cliente prefere receber o atendimento?"
  });
  const english = supportLanguage.getByRole("button", { name: /English/ });

  await english.click();
  await expect(english).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("h2[aria-live='polite']").filter({ hasText: /Em qual idioma o cliente prefere receber/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Navegar em Portugu/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Navegar em English" })).toHaveCount(0);
  await expect(supportLanguage).toBeVisible();
});

test("avisa antes de descartar respostas ao sair do fluxo", async ({ page }) => {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Onboarding$/ }).click();
  await page.locator("#onboarding-company-name").fill("Resposta que deve ser protegida");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Sair do preenchimento" }).click();
  await expect(page.locator("#onboarding-company-name")).toHaveValue("Resposta que deve ser protegida");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Sair do preenchimento" }).click();
  await expect(page).toHaveURL(/\/$/);
});
