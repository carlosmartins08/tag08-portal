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
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Começar Onboarding" })).toBeVisible();

    await page.getByRole("button", { name: "Começar Onboarding" }).click();
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
    const payload = {
      clientData: { companyName: "TAG08 TESTE SINTÉTICO P1.2E.2", preferredLanguage: "pt" },
      projectContacts: { responsibleName: "QA Sintético", email: "p12e2@example.invalid", whatsapp: "+15005550006" },
      selectedServices: ["Process Intelligence"],
      businessMoment: {},
      generalBriefing: {},
      serviceSpecificBriefing: {},
      filesAndLinks: {},
      consent: { truthChecked: true, useChecked: true, noPasswordsChecked: true },
      submittedAt: new Date().toISOString(),
      source: "synthetic-p1.2e.2"
    };
    const idempotencyKey = `synthetic-p1-2e-2-${crypto.randomUUID()}`;
    const first = await page.evaluate(async (submission) => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submission.idempotencyKey },
        body: JSON.stringify(submission)
      });
      return { status: response.status, body: await response.json() };
    }, { ...payload, idempotencyKey });
    expect(first.status).toBe(202);
    const replay = await page.evaluate(async (submission) => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submission.idempotencyKey },
        body: JSON.stringify(submission)
      });
      return { status: response.status, body: await response.json() };
    }, { ...payload, idempotencyKey });
    expect(replay.status).toBe(202);
    expect(replay.body.submissionId).toBe(first.body.submissionId);
    expect(await prisma.onboardingSubmission.count({ where: { journeyId: created.journeyId } })).toBe(1);
    expect(await prisma.integrationDelivery.count({ where: { aggregateId: first.body.submissionId } })).toBe(2);

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
