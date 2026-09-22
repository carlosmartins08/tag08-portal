import { expect, test } from "@playwright/test";

test("prévia local identifica a equipe pendente sem publicá-la", async ({ page }) => {
  await page.goto("/sobre", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.getByTestId("team-profiles")).toBeVisible();
  await expect(page.getByTestId("team-profiles").locator("[data-evidence-key^='team/']")).toHaveCount(7);
  await expect(page.getByTestId("team-profiles").getByText("Pendente — não publicado")).toHaveCount(7);
});

test("prévia local abre case pendente sem adicioná-lo à produção", async ({ page }) => {
  await page.goto("/casos/case-clinica-alphaville", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("content-review-banner")).toBeVisible();
  await expect(page.locator("[data-evidence-key='case-study/case-clinica-alphaville']")).toBeVisible();
  await expect(page.getByText("Pendente — não publicado").first()).toBeVisible();
});

test("prévia local apresenta leitura inicial e os dois canais de WhatsApp da Assessoria", async ({ page }) => {
  await page.goto("/servicos/assessoria-marketing-digital-estrategico", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Assessoria de Marketing Estratégico | TAG08");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Assessoria de marketing estratégico para empresas que precisam organizar posicionamento, prioridades, comunicação, canais e planejamento antes de ampliar a execução."
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
      await expect(page.getByText("Resposta anterior registrada. Você pode voltar para alterá-la antes da leitura final.")).toBeVisible();
    }
  }

  await expect(page.getByText("Direção mais consolidada").first()).toBeVisible();
  await expect(page.getByText("LEITURA ORIENTATIVA")).toBeVisible();
  await expect(page.getByText("Esta leitura organiza as percepções da própria empresa; não substitui um diagnóstico técnico, uma análise de canais ou uma recomendação comercial.")).toBeVisible();

  const brazil = page.getByRole("link", { name: "Falar no WhatsApp Brasil sobre esta leitura, abre em nova guia" });
  const international = page.getByRole("link", { name: "Falar no WhatsApp Internacional sobre esta leitura, abre em nova guia" });
  await expect(brazil).toHaveAttribute("href", /https:\/\/wa\.me\/55/);
  await expect(international).toHaveAttribute("href", /https:\/\/wa\.me\/56/);
  await expect(brazil).toHaveAttribute("target", "_blank");
  await expect(international).toHaveAttribute("target", "_blank");

  await page.getByRole("button", { name: "REPETIR DIAGNÓSTICO" }).click();
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
  await expect(page.getByRole("button", { name: /Iniciar diagnóstico estratégico/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /A urgência da semana define/i })).toHaveClass(/focus-visible:outline-brand/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});
