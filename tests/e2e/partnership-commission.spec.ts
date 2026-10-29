import { expect, test } from "@playwright/test";

test("Programa de Parceria gates and separates each approved commission scenario", async ({ page }) => {
  await page.goto("/programa-afiliados", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Simule um cenário de comissão" })).toBeVisible();
  await expect(page.getByText(/10% a cada mês|até o limite contratual de 12 meses/i)).toHaveCount(0);

  await page.getByLabel(/Valor da primeira mensalidade recorrente elegível/).fill("1000");
  await expect(page.getByTestId("affiliate-first-payment-commission")).toContainText("300,00");
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toHaveCount(0);

  await page.getByRole("radio", { name: /Parceiro Comercial Ativo/ }).check();
  await page.getByLabel(/Dias desde o pagamento da primeira mensalidade/).fill("89");
  await page.getByLabel(/Receita recorrente elegível efetivamente recebida/).fill("2000");
  await page.getByLabel(/O cliente permanece ativo/).check();
  await page.getByLabel(/O parceiro permanece ativo no Programa/).check();
  await page.getByLabel(/O parceiro mantém a atuação comercial/).check();
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("0,00");

  await page.getByLabel(/Dias desde o pagamento da primeira mensalidade/).fill("90");
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("100,00");

  await page.getByLabel(/O cliente permanece ativo/).uncheck();
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("0,00");
  await page.getByLabel(/O cliente permanece ativo/).check();
  await page.getByLabel(/O parceiro permanece ativo no Programa/).uncheck();
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("0,00");
  await page.getByLabel(/O parceiro permanece ativo no Programa/).check();
  await page.getByLabel(/O parceiro mantém a atuação comercial/).uncheck();
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("0,00");
  await page.getByLabel(/O parceiro mantém a atuação comercial/).check();
  await expect(page.getByTestId("affiliate-active-recurring-commission")).toContainText("100,00");

  await page.getByLabel(/Base líquida da primeira parcela recebida em serviço pontual Sebrae/).fill("800");
  await page.getByLabel(/Base líquida da primeira parcela recebida em outros serviços pontuais/).fill("800");
  await expect(page.getByTestId("affiliate-sebrae-one-time-commission")).toContainText("40,00");
  await expect(page.getByTestId("affiliate-other-one-time-commission")).toContainText("80,00");
  await expect(page.getByText(/Para serviços pontuais, a base exclui impostos e retenções, descontos, mídia, custos de terceiros, hospedagem, ferramentas, despesas repassadas, reembolsos e valores que não representem receita própria da TAG08/i)).toBeVisible();
});
