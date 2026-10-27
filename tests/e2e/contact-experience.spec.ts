import { expect, test } from "@playwright/test";

test.describe("experiencia de contato", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
        await route.abort();
        return;
      }
      await route.continue();
    });
  });

  test("mantem acesso direto neutro e preseleciona somente contexto valido e editavel", async ({ page }) => {
    await page.goto("/contato", { waitUntil: "domcontentloaded" });
    const newProject = page.getByRole("radio", { name: /Quero iniciar um projeto/ });
    await newProject.focus();
    await expect(newProject).toBeFocused();
    await page.keyboard.press("Space");
    await expect(newProject).toBeChecked();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" })).not.toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Preciso de orienta/ })).not.toBeChecked();

    await page.goto("/contato?intent=branding&origin=offer", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    const branding = page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" });
    await expect(branding).toBeChecked();
    await expect(page.getByRole("status").filter({ hasText: "página de oferta" })).toBeVisible();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    const restoredBranding = page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" });
    await expect(restoredBranding).toBeChecked();
    await restoredBranding.uncheck();
    await page.getByRole("checkbox", { name: /Desenvolver site, e-commerce ou/ }).check();
    await expect(branding).not.toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Desenvolver site, e-commerce ou/ })).toBeChecked();
    expect(new URL(page.url()).search).toBe("?intent=branding&origin=offer");

    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await page.getByRole("radio", { name: /sou cliente/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByText(/identifique o projeto/)).toBeVisible();
  });

  test("ignora contexto invÃ¡lido sem bloquear o router neutro", async ({ page }) => {
    await page.goto("/contato?intent=cliente&origin=crm&campaign=unknown", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" })).not.toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Preciso de orienta/ })).not.toBeChecked();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe("/contato");
    expect(new URL(canonical!).search).toBe("");
  });

  test("trÃ¡fego e performance continuam como capacidade contextual", async ({ page }) => {
    await page.goto("/contato?intent=trafego-performance&origin=offer", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    const capabilityGroup = page.getByRole("group", { name: "Capacidades que podem apoiar uma frente" });
    await expect(capabilityGroup.getByRole("checkbox", { name: /SEO, copywriting ou performance/ })).toBeChecked();
  });

  test("Home, hub e oferta levam somente contexto allowlisted; Sebraetec preserva origem sem virar famÃ­lia", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Ir para contato e solicitar diagn/i }).click();
    await expect(page).toHaveURL(/\/contato\?intent=orientacao&origin=home$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/contato\?intent=orientacao&origin=home$/);

    await page.goto("/servicos", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /QUERO ENTENDER MEU MELHOR CAMINHO/ }).first().click();
    await expect(page).toHaveURL(/\/contato\?intent=orientacao&origin=services$/);

    await page.goto("/servicos/desenvolvimento-web", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /PLANEJAR MEU SITE/i }).click();
    await expect(page).toHaveURL(/\/contato\?intent=desenvolvimento-web&origin=offer$/);

    await page.goto("/sebraetec-impulsionando-empreendedores", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /IR PARA O CONTATO/i }).click();
    await expect(page).toHaveURL(/\/contato\?origin=sebraetec$/);
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Sebraetec" })).toBeVisible();
  });

  test("explica a Unidade Digital e mantém o CTA contextual de Tecnologia", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/servicos/desenvolvimento-web", { waitUntil: "domcontentloaded" });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ]) {
      await page.setViewportSize(viewport);
      const hasNoHorizontalOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth + 1
      );
      expect(hasNoHorizontalOverflow, `Sem overflow horizontal em ${viewport.width}px`).toBeTruthy();
    }

    const ecommerceQuestion = page.getByRole("button", { name: /O que envolve uma Unidade Digital de e-commerce/ });
    await ecommerceQuestion.focus();
    await expect(ecommerceQuestion).toBeFocused();
    await page.keyboard.press("Enter");

    const ecommerceAnswer = page.getByRole("region", { name: /O que envolve uma Unidade Digital de e-commerce/ });
    await expect(ecommerceAnswer).toContainText("A condução passa por diagnóstico, modelagem, validação estratégica, estruturação operacional, desenvolvimento, testes, ativação, treinamento e acompanhamento.");
    await expect(ecommerceAnswer).toContainText("catálogo, estoque, logística, pagamentos, políticas comerciais, atendimento e responsabilidades");

    await page.getByRole("button", { name: /PLANEJAR MEU SITE/i }).click();
    await expect(page).toHaveURL(/\/contato\?intent=desenvolvimento-web&origin=offer$/);
  });

  test("submete a intencao contextual sem PII na URL e preserva a confirmacao aprovada", async ({ page }) => {
    let submittedPayload: Record<string, unknown> | undefined;
    await page.route("**/api/contact", async (route) => {
      submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });

    await page.goto("/contato?intent=desenvolvimento-web&origin=offer", { waitUntil: "domcontentloaded" });
    expect(new URL(page.url()).search).not.toMatch(/name|email|phone|message/i);
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("checkbox", { name: /Desenvolver site, e-commerce ou/ })).toBeChecked();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Frentes:")).toBeVisible();
    await expect(page.getByText(/Desenvolver site, e-commerce ou/)).toBeVisible();
    await page.getByLabel("Qual o seu nome?").fill("Ana Silva");
    await page.getByLabel("Nome da Empresa").fill("TAG08 Cliente");
    await page.locator("#form-whatsapp").fill("83999999999");
    await page.getByLabel("E-mail Corporativo").fill("ana@example.com");
    await page.getByLabel(/Autorizo o uso destes dados/).check();
    await page.getByRole("button", { name: /Enviar solicita/i }).click();

    await expect(page.getByRole("heading", { name: "Mensagem Enviada!" })).toBeVisible();
    await expect(page.getByText(/Suas informações foram enviadas com sucesso/)).toBeVisible();
    await expect(page.getByText(/recebida pela TAG08|6 horas úteis/i)).toHaveCount(0);
    await expect(page.getByText(/onboarding/i)).toHaveCount(0);
    expect(submittedPayload).toMatchObject({
      requestType: "new_project",
      serviceInterests: ["desenvolvimento-web"],
      source: "contact-page:offer",
      message: ""
    });
  });

  test("prioriza o formulario antes dos canais no mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    const intro = page.locator(".tag08-contact__intro");
    const form = page.locator(".tag08-contact__form-column");
    const directory = page.locator(".tag08-contact__directory");

    await expect(intro).toBeVisible();
    await expect(form).toBeVisible();
    await expect(directory).toBeVisible();
    await expect(page.getByRole("heading", { name: "Como podemos ajudar?" })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Quero iniciar um projeto/ })).toBeVisible();

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

  test("guia novo projeto, aceita múltiplas frentes e preserva respostas ao voltar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Vamos entender o contexto" })).toBeVisible();
    await page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" }).check();
    await page.getByRole("checkbox", { name: "Desenvolver site, e-commerce ou solução digital" }).check();
    await page.getByRole("checkbox", { name: "Preciso de orientação ou tenho outra necessidade" }).check();
    await expect(page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" })).not.toBeChecked();
    await page.getByRole("checkbox", { name: "Preciso de orientação ou tenho outra necessidade" }).uncheck();
    await page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" }).check();
    await page.getByRole("checkbox", { name: "Desenvolver site, e-commerce ou solução digital" }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Frentes:")).toBeVisible();
    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await expect(page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "Desenvolver site, e-commerce ou solução digital" })).toBeChecked();
  });

  test("permite cliente atual e parceria sem perguntas de aquisição", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/contato", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: "Já sou cliente" }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText(/identifique o projeto ou serviço/)).toBeVisible();
    await expect(page.getByLabel(/O que você precisa agora/)).toBeVisible();
    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await page.getByRole("radio", { name: "Quero propor uma parceria" }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByLabel(/Qual parceria você propõe/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Vamos entender o contexto" })).toBeVisible();
  });

  test("remove serviços de novo projeto quando o motivo muda antes do envio", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    let submittedPayload: Record<string, unknown> | undefined;
    await page.route("**/api/contact", async (route) => {
      submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });

    await page.goto("/contato", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: /Quero iniciar um projeto/ }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" }).check();
    await page.getByRole("checkbox", { name: "Desenvolver site, e-commerce ou solução digital" }).check();

    await page.getByRole("button", { name: "Voltar", exact: true }).click();
    await page.getByRole("radio", { name: "Já sou cliente" }).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("checkbox", { name: "Organizar marca ou posicionamento" })).toHaveCount(0);
    await page.getByRole("button", { name: "Continuar" }).click();

    await page.getByLabel("Qual o seu nome?").fill("Ana Silva");
    await page.getByLabel("Nome da Empresa").fill("TAG08 Cliente");
    await page.locator("#form-whatsapp").fill("83999999999");
    await page.getByLabel("E-mail Corporativo").fill("ana@example.com");
    await page.getByLabel(/Autorizo o uso destes dados/).check();
    await page.getByRole("button", { name: /Enviar solicitação à TAG08/ }).click();

    await expect(page.getByRole("heading", { name: "Mensagem Enviada!" })).toBeVisible();
    expect(submittedPayload).toMatchObject({
      requestType: "existing_client",
      serviceInterests: [],
      needsServiceGuidance: false,
      service: "not_applicable"
    });
  });

  test("redistribui contatos e mapa conforme a largura disponível", async ({ page }) => {
    const directContacts = page.locator(".tag08-contact__direct-contacts");
    const map = page.locator(".tag08-contact__map-card");
    const channels = page.locator(".tag08-contact__channels");

    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/contato", { waitUntil: "domcontentloaded" });

      const contactsBox = await directContacts.boundingBox();
      const mapBox = await map.boundingBox();
      const channelsBox = await channels.boundingBox();

      expect(contactsBox).not.toBeNull();
      expect(mapBox).not.toBeNull();
      expect(channelsBox).not.toBeNull();
      expect(mapBox!.y).toBeGreaterThan(contactsBox!.y + contactsBox!.height - 1);
      expect(channelsBox!.y).toBeGreaterThan(mapBox!.y + mapBox!.height - 1);
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/contato", { waitUntil: "domcontentloaded" });

    const contactsBox = await directContacts.boundingBox();
    const mapBox = await map.boundingBox();
    const channelsBox = await channels.boundingBox();

    expect(contactsBox).not.toBeNull();
    expect(mapBox).not.toBeNull();
    expect(channelsBox).not.toBeNull();
    expect(mapBox!.x).toBeGreaterThan(contactsBox!.x + contactsBox!.width * 0.7);
    expect(Math.abs(mapBox!.y - contactsBox!.y)).toBeLessThan(2);
    expect(contactsBox!.width).toBeGreaterThan(500);
    expect(mapBox!.width).toBeGreaterThan(500);
    expect(channelsBox!.y).toBeGreaterThan(contactsBox!.y + contactsBox!.height - 1);
  });

  test("mantém o título de entrada equilibrado nos breakpoints principais", async ({ page }) => {
    const heading = page.locator(".tag08-contact__intro h1");

    for (const [width, height] of [[390, 844], [768, 1000], [1440, 1100]]) {
      await page.setViewportSize({ width, height });
      await page.goto("/contato", { waitUntil: "domcontentloaded" });

      const layout = await heading.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const lineTops = new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top)));
        return {
          lineCount: lineTops.size,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth
        };
      });

      expect(layout.lineCount).toBeGreaterThan(0);
      expect(layout.lineCount).toBeLessThanOrEqual(4);
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    }
  });
});
