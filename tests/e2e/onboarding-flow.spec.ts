import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  const localOrigin = new URL(baseURL || "http://127.0.0.1:3211").origin;
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === localOrigin) return route.continue();
    return route.abort();
  });
});

test("disabled Onboarding route returns 404 without exposing its form", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.locator("#onboarding-company-name")).toHaveCount(0);
    await expect(page.locator("#onboarding-operator-name")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
});

test("disabled Onboarding APIs fail closed before session or database access", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const responses = await page.evaluate(async () => {
    const requests = [
      { path: "/api/onboarding/progress", method: "GET" },
      { path: "/api/onboarding/session", method: "GET" },
      { path: "/api/onboarding/health", method: "GET" },
      { path: "/api/onboarding/metrics", method: "GET" },
      { path: "/api/onboarding", method: "POST", body: JSON.stringify({ clientData: { companyName: "SYNTHETIC" } }) },
      { path: "/api/onboarding/access/redeem", method: "POST", body: JSON.stringify({ token: "A".repeat(43) }) }
    ];
    const results = [];
    for (const request of requests) {
      const response = await fetch(request.path, {
        method: request.method,
        headers: request.body ? { "Content-Type": "application/json" } : undefined,
        body: request.body,
        cache: "no-store"
      });
      const payload = await response.json();
      results.push({ status: response.status, error: payload.error });
    }
    return results;
  });

  expect(responses.map(({ status }) => status)).toEqual([404, 404, 404, 404, 404, 404]);
  expect(responses.map(({ error }) => error)).toEqual([
    "access_unavailable",
    "access_unavailable",
    "unavailable",
    "unavailable",
    "unavailable",
    "access_unavailable"
  ]);
});

test("disabled Onboarding route never redeems a link token automatically", async ({ page }) => {
  let redeemRequests = 0;
  await page.route("**/api/onboarding/access/redeem", async (route) => {
    redeemRequests += 1;
    await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ ok: false, error: "access_unavailable" }) });
  });

  const token = "C".repeat(43);
  const response = await page.goto(`/cliente/onboarding#access_token=${token}`, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
  expect(redeemRequests).toBe(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(redeemRequests).toBe(0);
  await expect(page.locator("#onboarding-company-name")).toHaveCount(0);
});

test("disabled Onboarding route is not listed in the sitemap", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const sitemap = await page.evaluate(async () => {
    const response = await fetch("/sitemap.xml", { cache: "no-store" });
    return { status: response.status, body: await response.text() };
  });
  expect(sitemap.status).toBe(200);
  expect(sitemap.body).not.toContain("/cliente/onboarding");

  const routeResponse = await page.goto("/cliente/onboarding", { waitUntil: "domcontentloaded" });
  expect(routeResponse?.status()).toBe(404);
});
test("PostgreSQL isolado: resgate explícito, progresso retomável, submissão idempotente e revogação", async ({ page }) => {
  const databaseUrl = process.env.ONBOARDING_TEST_DATABASE_URL;
  test.skip(!databaseUrl || Boolean(process.env.E2E_BASE_URL), "requires the explicitly provisioned disposable PostgreSQL 16 database and the isolated local web server");
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
    await expect(page.getByRole("button", { name: "Confirmar e enviar" })).toHaveCount(0);

    await page.getByRole("button", { name: "Revisar onboarding" }).click();
    await expect(page.getByRole("heading", { name: "Revise todas as informações antes de enviar" })).toBeVisible();
    await expect(page.locator("#onboarding-question-title")).toBeFocused();
    await expect(page.getByText("TAG08 TESTE SINTÉTICO P1.2F.1", { exact: true })).toBeVisible();
    await expect(page.getByText("QA Sintético P1.2F.1", { exact: true })).toBeVisible();
    await expect(page.getByText("Resultado sintético para teste de onboarding.", { exact: true })).toBeVisible();
    await expect(page.getByText("Gestão de Redes Sociais", { exact: true })).toBeVisible();
    for (const section of ["Empresa e projeto", "Responsáveis", "Contexto e expectativas", "Serviços contratados", "Briefing por serviço", "Materiais e referências", "Consentimentos"]) {
      await expect(page.locator(`section[aria-label="${section}"]`)).toBeVisible();
    }
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const reviewLayout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      }));
      expect(reviewLayout.scrollWidth > reviewLayout.innerWidth, `review overflow at ${width}px`).toBe(false);
    }
    await page.getByRole("button", { name: "Editar responsáveis" }).click();
    await expect(page.locator("#onboarding-responsible-name")).toHaveValue("QA Sintético P1.2F.1");
    await page.locator("#onboarding-responsible-email").fill("revisado-p12f1@example.invalid");
    for (const steps of [3, 3, 1, 1, 1, 1, 1]) {
      for (let index = 0; index < steps; index += 1) await next.click();
    }
    await page.getByRole("button", { name: "Revisar onboarding" }).click();
    await expect(page.getByText("revisado-p12f1@example.invalid", { exact: true })).toBeVisible();

    const submissionResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/onboarding") && response.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Confirmar e enviar" }).click();
    const submissionResponse = await submissionResponsePromise;
    const first = { status: submissionResponse.status(), body: await submissionResponse.json() };
    expect(first.status).toBe(202);
    await expect(page.locator("h2").filter({ hasText: "Informações enviadas com sucesso" }).last()).toBeVisible();
    await expect(page.getByText("Envio registrado na TAG08")).toBeVisible();
    await expect(page.getByText("Notificação enviada à TAG08")).toHaveCount(0);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("h2").filter({ hasText: "Informações enviadas com sucesso" }).last()).toBeVisible();
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
    expect(JSON.parse(submittedPayload!).projectContacts.email).toBe("revisado-p12f1@example.invalid");
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
    await expect(page.getByRole("button", { name: "Confirmar e enviar" })).toHaveCount(0);
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
    await expect(page.locator("h2").filter({ hasText: "Informações enviadas com sucesso" }).last()).toBeVisible();
    await expect(page.getByText("Envio registrado na TAG08")).toBeVisible();
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
