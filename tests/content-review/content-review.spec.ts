import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const isLocalRuntime = url.hostname === "127.0.0.1" || url.hostname === "localhost";
    const isApi = url.pathname === "/api" || url.pathname.startsWith("/api/");

    return isLocalRuntime && !isApi ? route.continue() : route.abort("blockedbyclient");
  });
});

test("prévia local distingue os perfis autorizados dos que seguem em investigação", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  await expect(page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']")).toHaveCount(7);
  await expect(page.getByTestId("team-profiles").getByText("Em investigação — não publicado")).toHaveCount(2);
});

test("prévia local abre case em investigação sem adicioná-lo à produção", async ({ page }) => {
  await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.locator("[data-evidence-key='case-study/case-clinica-alphaville']")).toBeVisible();
  await expect(page.getByText("Em investigação — não publicado")).toBeVisible();
});

test("prévia local apresenta leitura inicial e os dois canais de WhatsApp da Assessoria", async ({ page }) => {
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle("Assessoria Estratégica de Negócios | TAG08");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Assessoria Estratégica de Negócios para organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
  );

  const answers = [
    "As prioridades são acordadas, registradas e revisadas com quem decide",
    "Existe uma direção comum para mensagem, canal e material comercial",
    "Papéis, critérios de aprovação e momentos de revisão estão claros",
    "A operação tem donos, rotina de acompanhamento e espaço para ajustes"
  ];

  for (const [index, answer] of answers.entries()) {
    await page.getByRole("button", { name: new RegExp(answer) }).click();
    if (index === 0) {
      const previousQuestion = page.getByRole("button", { name: "Voltar uma pergunta" });
      await expect(previousQuestion).toBeEnabled();
      await previousQuestion.click();

      const selectedAnswer = page.getByRole("button", { name: new RegExp(answer) });
      await expect(selectedAnswer).toHaveAttribute("aria-pressed", "true");
      await selectedAnswer.click();
    }
  }

  await expect(page.getByText("Direção mais consolidada").first()).toBeVisible();
  await expect(page.getByText("LEITURA ORIENTATIVA")).toBeVisible();
  await expect(page.getByText("Esta leitura organiza percepções da própria empresa; não substitui diagnóstico técnico, análise de canais ou recomendação comercial.")).toBeVisible();

  const brazil = page.getByRole("link", { name: "Falar no WhatsApp Brasil sobre esta leitura, abre em nova guia" });
  const international = page.getByRole("link", { name: "Falar no WhatsApp Internacional sobre esta leitura, abre em nova guia" });
  await expect(brazil).toHaveAttribute("href", /https:\/\/wa\.me\/55/);
  await expect(international).toHaveAttribute("href", /https:\/\/wa\.me\/56/);
  await expect(brazil).toHaveAttribute("target", "_blank");
  await expect(international).toHaveAttribute("target", "_blank");

  await page.getByRole("button", { name: "Repetir leitura" }).click();
  await expect(page.getByRole("heading", { name: "Como as prioridades de marketing são definidas hoje?" })).toBeVisible();
});

test("prévia da equipe permanece navegável em mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});

test("prévia da Assessoria mantém o diagnóstico navegável em mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const startReading = page.getByRole("button", { name: "Fazer leitura inicial", exact: true });
  await expect(startReading).toBeVisible();
  await startReading.click();
  await expect(page.locator("#diagnostic-audit")).toBeInViewport();
  const firstOption = page.getByRole("button", { name: /A urgência da semana define/i });
  await firstOption.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(firstOption).toBeFocused();
  await expect(firstOption).toHaveCSS("outline-style", "solid");
  await expect(firstOption).toHaveCSS("outline-width", "2px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});
