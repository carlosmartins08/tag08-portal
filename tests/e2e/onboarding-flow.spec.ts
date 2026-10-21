import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  const localOrigin = new URL(baseURL || "http://127.0.0.1:3211").origin;
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === localOrigin) return route.continue();
    return route.abort();
  });
});

test("acesso direto sem sessão mostra estado neutro e não renderiza o formulário privado", async ({ page }) => {
  const response = await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Acesso ao onboarding" })).toBeVisible();
  await expect(page.getByText(/Este acesso é destinado a clientes com projeto confirmado/)).toBeVisible();
  await expect(page.locator("#onboarding-company-name")).toHaveCount(0);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
  expect(response?.headers()["cache-control"]).toContain("no-store");
});

test("API privada rejeita leitura e submissão sem sessão", async ({ page }) => {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  const progress = await page.evaluate(async () => {
    const response = await fetch("/api/onboarding/progress", { cache: "no-store" });
    return { status: response.status, body: await response.json() };
  });
  expect(progress.status).toBe(401);
  expect(progress.body).toMatchObject({ ok: false, error: "access_unavailable" });

  const submission = await page.evaluate(async () => {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientData: { companyName: "SYNTHETIC TEST" } })
    });
    return { status: response.status, body: await response.json() };
  });
  expect(submission.status).toBe(401);
  expect(submission.body).toMatchObject({ ok: false, error: "access_unavailable" });
});

test("abrir e recarregar o link não resgata até ação explícita", async ({ page }) => {
  let redeemRequests = 0;
  await page.route("**/api/onboarding/access/redeem", async (route) => {
    redeemRequests += 1;
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, error: "access_unavailable" }) });
  });
  const token = "C".repeat(43);
  await page.goto(`/cliente/onboarding#access_token=${token}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Continuar para o onboarding" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("");
  expect(redeemRequests).toBe(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(redeemRequests).toBe(0);
});

test("token inválido só é resgatado após confirmação e recebe resposta pública neutra", async ({ page }) => {
  const token = "A".repeat(43);
  let redeemRequests = 0;
  await page.route("**/api/onboarding/access/redeem", async (route) => {
    redeemRequests += 1;
    expect(route.request().postDataJSON()).toEqual({ token });
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, error: "access_unavailable" }) });
  });

  await page.goto(`/cliente/onboarding#access_token=${token}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Acesso ao onboarding" })).toBeVisible();
  const continueButton = page.getByRole("button", { name: "Continuar para o onboarding" });
  await expect(continueButton).toBeVisible();
  await continueButton.focus();
  await expect(continueButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('p[role="alert"]')).toContainText("Não foi possível validar este link");
  expect(redeemRequests).toBe(1);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("");
  expect(page.url()).not.toContain(token);
  await expect(page.locator("#onboarding-company-name")).toHaveCount(0);
});

test("canonical e indexação permanecem neutros e sem token", async ({ page }) => {
  const token = "B".repeat(43);
  await page.goto(`/cliente/onboarding#access_token=${token}`, { waitUntil: "domcontentloaded" });
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).not.toContain(token);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  const sitemapHasOnboarding = await page.evaluate(async () => {
    const response = await fetch("/sitemap.xml", { cache: "no-store" });
    return (await response.text()).includes("/cliente/onboarding");
  });
  expect(sitemapHasOnboarding).toBe(false);
});

test("estado sem autorização permanece legível sem overflow nos breakpoints principais", async ({ page }) => {
  await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("heading", { name: "Acesso ao onboarding" })).toBeVisible();
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows, `horizontal overflow at ${width}px`).toBe(false);
  }
});

test("PostgreSQL isolado: resgate explícito, progresso retomável, submissão idempotente e revogação", async ({ page }) => {
  const databaseUrl = process.env.ONBOARDING_TEST_DATABASE_URL;
  test.skip(!databaseUrl, "requires the explicitly provisioned disposable PostgreSQL 16 database");
  const parsedUrl = new URL(databaseUrl!);
  expect(["127.0.0.1", "localhost"]).toContain(parsedUrl.hostname);
  expect(parsedUrl.pathname).toBe("/tag08_p1_2e2_qa");
  expect(decodeURIComponent(parsedUrl.username)).toBe("tag08_qa");
  expect(!process.env.DATABASE_URL || process.env.DATABASE_URL === databaseUrl).toBe(true);
  process.env.DATABASE_URL = databaseUrl!;

  const [{ getPrisma }, access] = await Promise.all([
    import("../../src/lib/server/prisma"),
    import("../../server/onboardingAccess")
  ]);
  const prisma = getPrisma();
  const commercialReference = `SYNTHETIC-BROWSER-${crypto.randomUUID()}`;
  const created = await access.createOnboardingJourneyWithLink(prisma, {
    operator: "P1.2E.2 synthetic browser QA",
    commercialReference,
    reason: "Explicit redeem browser regression",
    now: new Date()
  });
  const tokenHash = access.hashOpaqueSecret(created.token);

  try {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`/cliente/onboarding#access_token=${created.token}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Continuar para o onboarding" })).toBeVisible();
    expect((await prisma.onboardingMagicLink.findUniqueOrThrow({ where: { tokenHash } })).usedAt).toBeNull();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    expect(new URL(page.url()).hash).toBe("");
    await page.getByRole("button", { name: "Continuar para o onboarding" }).focus();
    await expect(page.getByRole("button", { name: "Continuar para o onboarding" })).toBeFocused();
    const progressResponsePromise = page.waitForResponse((response) => response.url().endsWith("/api/onboarding/progress"));
    await page.keyboard.press("Enter");
    const progressResponse = await progressResponsePromise;
    expect(progressResponse.status()).toBe(200);
    await expect(page.getByRole("button", { name: "Começar Onboarding" })).toBeVisible();

    await page.getByRole("button", { name: "Começar Onboarding" }).click();
    await expect(page.getByRole("button", { name: "Sou da equipe TAG08" })).toHaveCount(0);
    await expect(page.locator("#onboarding-operator-name")).toHaveCount(0);
    const companyField = page.locator("#onboarding-company-name");
    await expect(companyField).toBeVisible();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    }
    await companyField.fill("TAG08 TESTE SINTÉTICO P1.2E.2");
    await expect.poll(async () => {
      const journey = await prisma.onboardingJourney.findUniqueOrThrow({ where: { id: created.journeyId } });
      return (journey.draft as { values?: { companyName?: string } } | null)?.values?.companyName;
    }).toBe("TAG08 TESTE SINTÉTICO P1.2E.2");

    const otherJourney = await access.createOnboardingJourneyWithLink(prisma, {
      operator: "P1.2E.2 synthetic browser QA",
      commercialReference: `SYNTHETIC-BROWSER-OTHER-${crypto.randomUUID()}`,
      reason: "Cross-journey access regression",
      now: new Date()
    });
    const savedDraft = (await prisma.onboardingJourney.findUniqueOrThrow({ where: { id: created.journeyId } })).draft;
    const crossJourneyAttempt = await page.evaluate(async ({ journeyId, draft }) => {
      const response = await fetch("/api/onboarding/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyId, draft })
      });
      return response.status;
    }, { journeyId: otherJourney.journeyId, draft: savedDraft });
    expect(crossJourneyAttempt).toBe(200);
    expect((await prisma.onboardingJourney.findUniqueOrThrow({ where: { id: otherJourney.journeyId } })).draft).toBeNull();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("#onboarding-company-name")).toHaveValue("TAG08 TESTE SINTÉTICO P1.2E.2");
    const next = page.getByRole("button", { name: "Avançar" });
    await page.getByRole("button", { name: "Voltar" }).click();
    await page.getByRole("button", { name: "Começar Onboarding" }).click();
    await companyField.fill("");
    await next.click();
    await expect(page.locator('div[role="alert"]:visible').filter({ hasText: "O nome da sua empresa é essencial" })).toBeVisible();
    await companyField.fill("TAG08 TESTE SINTÉTICO P1.2F.1");
    await next.click();
    await page.locator("#onboarding-city").fill("Cidade sintética");
    await next.click();
    await page.locator("#onboarding-website").fill("https://example.invalid");
    await next.click();
    await page.getByRole("button", { name: "Português" }).click();
    await next.click();

    await expect(page.getByRole("button", { name: "Sou da equipe TAG08" })).toHaveCount(0);
    await expect(page.locator("#onboarding-operator-name")).toHaveCount(0);
    await page.locator("#onboarding-responsible-name").fill("QA Sintético P1.2F.1");
    await next.click();
    await page.locator("#onboarding-responsible-email").fill("email-inválido");
    await page.locator("#onboarding-responsible-whatsapp").fill("+15005550006");
    await next.click();
    await expect(page.locator('div[role="alert"]:visible').filter({ hasText: "Insira um endereço de e-mail corporativo válido" })).toBeVisible();
    await page.locator("#onboarding-responsible-email").fill("p12f1@example.invalid");
    await next.click();
    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.locator("#onboarding-responsible-email")).toHaveValue("p12f1@example.invalid");
    await next.click();
    await next.click();

    await page.getByRole("radio").first().click();
    await next.click();
    await page.getByRole("radio").first().click();
    await next.click();
    await next.click();
    await page.getByRole("checkbox", { name: "Gestão de Redes Sociais" }).click();
    await next.click();
    await next.click();
    await next.click();
    await page.locator("#onboarding-good-result").fill("Resultado sintético para teste de onboarding.");
    await next.click();
    const consents = page.getByRole("checkbox");
    await expect(consents).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) await consents.nth(index).check();

    const submissionResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/onboarding") && response.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Enviar Onboarding Completo" }).click();
    const submissionResponse = await submissionResponsePromise;
    const first = { status: submissionResponse.status(), body: await submissionResponse.json() };
    expect(first.status).toBe(202);
    await expect(page.locator("h2").filter({ hasText: "Informações registradas com sucesso" }).last()).toBeVisible();
    await expect(page.getByText("Envio recebido e registrado")).toBeVisible();
    await expect(page.getByText("Notificação enviada à TAG08")).toHaveCount(0);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("h2").filter({ hasText: "Informações registradas com sucesso" }).last()).toBeVisible();
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflowing: Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .map((element) => ({ element, rect: element.getBoundingClientRect() }))
          .filter(({ rect }) => rect.right > window.innerWidth + 1 || rect.left < -1)
          .map(({ element, rect }) => `${element.tagName.toLowerCase()}.${String(element.className).replace(/\s+/g, ".").slice(0, 80)}:${Math.round(rect.left)}..${Math.round(rect.right)}`)
          .slice(0, 6)
      }));
      expect(layout.scrollWidth > layout.innerWidth, `horizontal overflow at ${width}px: ${JSON.stringify(layout)}`).toBe(false);
    }

    const idempotencyKey = submissionResponse.request().headers()["idempotency-key"];
    const submittedPayload = submissionResponse.request().postData();
    expect(idempotencyKey).toBeTruthy();
    expect(submittedPayload).toBeTruthy();
    const replay = await page.evaluate(async ({ idempotencyKey, payload }) => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: payload
      });
      return { status: response.status, body: await response.json() };
    }, { idempotencyKey, payload: submittedPayload! });
    expect(replay.status).toBe(202);
    expect(replay.body.submissionId).toBe(first.body.submissionId);
    await expect(page.getByRole("button", { name: "Enviar Onboarding Completo" })).toHaveCount(0);
    expect(await prisma.onboardingSubmission.count({ where: { journeyId: created.journeyId } })).toBe(1);
    expect(await prisma.integrationDelivery.count({ where: { aggregateId: first.body.submissionId } })).toBe(2);
    const deliveries = await prisma.integrationDelivery.findMany({
      where: { aggregateId: first.body.submissionId },
      select: { target: true, status: true, attempts: true, externalReference: true }
    });
    expect(deliveries.map(({ target }) => target).sort()).toEqual(["CLICKUP", "GOOGLE_SHEETS"]);
    expect(deliveries.every(({ status, attempts, externalReference }) => status === "PENDING" && attempts === 0 && externalReference === null)).toBe(true);
    const persistedSubmission = await prisma.onboardingSubmission.findUniqueOrThrow({ where: { id: first.body.submissionId } });
    expect((persistedSubmission.payload as { submissionContext?: { submittedBy?: string } }).submissionContext).toEqual({ submittedBy: "client" });

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("h2").filter({ hasText: "Informações registradas com sucesso" }).last()).toBeVisible();
    await expect(page.getByText("Envio recebido e registrado")).toBeVisible();
    await expect(page.getByText("Notificação enviada à TAG08")).toHaveCount(0);

    await access.revokeOnboardingAccess(prisma, {
      journeyId: created.journeyId,
      operator: "P1.2E.2 synthetic browser QA",
      commercialReference,
      reason: "Revoke browser regression",
      now: new Date()
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Acesso ao onboarding" })).toBeVisible();
    await expect(page.locator("#onboarding-company-name")).toHaveCount(0);
  } finally {
    await prisma.$disconnect();
  }
});
