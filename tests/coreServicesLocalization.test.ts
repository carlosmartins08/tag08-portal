import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Servicos from "../src/features/site/pages/Servicos";
import ProcessIntelligence from "../src/features/site/pages/ProcessIntelligence";
import { getProcessActivationCopy } from "../src/features/site/pages/ProcessActivation";

const renderServices = (locale: "pt" | "en" | "es") =>
  renderToStaticMarkup(createElement(Servicos, { locale, onNavigate: () => undefined }));
const renderProcessIntelligence = (locale: "pt" | "en" | "es") =>
  renderToStaticMarkup(createElement(ProcessIntelligence, { locale, onNavigate: () => undefined }));

test("Services page renders English copy, service data, FAQ and localized internal links", () => {
  const html = renderServices("en");

  assert.match(html, /TAG08 Services/);
  assert.match(html, /Solutions to organize your presence, positioning, and growth with direction/);
  assert.match(html, /Social Media Management \/ Digital Presence/);
  assert.match(html, /Strategic Web Development/);
  assert.match(html, /EXPLORE PROCESS ACTIVATION/);
  assert.match(html, /Do I need to know which service to hire before speaking with TAG08\?/);
  assert.match(html, /href="\/en\/servicos\/gestao-de-redes-sociais"/);
  assert.match(html, /href="\/en\/servicos\/process-activation"/);
  assert.doesNotMatch(html, /Gestão de Redes Sociais|Preciso saber qual serviço contratar/);
  assert.match(html, /aria-expanded="true"/);
});

test("Services page renders Spanish copy and FAQ without Portuguese fallback", () => {
  const html = renderServices("es");

  assert.match(html, /Servicios TAG08/);
  assert.match(html, /Soluciones para organizar presencia, posicionamiento y crecimiento con dirección/);
  assert.match(html, /Gestión de Redes Sociales \/ Presencia Digital/);
  assert.match(html, /Desarrollo Web Estratégico/);
  assert.match(html, /¿Necesito saber qué servicio contratar antes de hablar con TAG08\?/);
  assert.match(html, /href="\/es\/servicos\/gestao-de-redes-sociais"/);
  assert.doesNotMatch(html, /Gestão de Redes Sociais|Preciso saber qual serviço contratar/);
});

test("Portuguese Services copy remains the default and tracking contract stays stable", () => {
  const html = renderServices("pt");

  assert.match(html, /Serviços TAG08/);
  assert.match(html, /Soluções para organizar presença, posicionamento e crescimento com direção/);
  assert.match(html, /href="\/servicos\/gestao-de-redes-sociais"/);
  const source = readFileSync(new URL("../src/features/site/pages/Servicos.tsx", import.meta.url), "utf8");
  assert.match(source, /label="Falar com a TAG08" surface="servicos-final-cta"/);
  assert.match(source, /Olá, gostaria de entender o melhor caminho para minha marca!/);
});

test("Process Intelligence localizes clear English UI labels and preserves displayed business values", () => {
  const html = renderProcessIntelligence("en");

  assert.match(html, /BOOK AN AUDIT/);
  assert.match(html, /TANGIBLE ASSETS DELIVERED/);
  assert.match(html, /Team Members Affected:/);
  assert.match(html, /Average Monthly Salary \(BRL\):/);
  assert.match(html, /Recoverable Hours \(Annual\)/);
  assert.match(html, /-50%/);
  assert.match(html, />3x</);
  assert.match(html, /href="https:\/\/wa\.me\//);
  const source = readFileSync(new URL("../src/features/site/pages/ProcessIntelligence.tsx", import.meta.url), "utf8");
  assert.match(source, /label="Solicitar diagnóstico de Process Intelligence" surface="process-intelligence-contact-card-br"/);
  assert.match(source, /label="Request Process Intelligence consulting" surface="process-intelligence-contact-card-int"/);
});

test("Process Intelligence localizes clear Spanish UI labels and keeps slider labels accessible", () => {
  const html = renderProcessIntelligence("es");

  assert.match(html, /RESERVAR UNA AUDITORÍA/);
  assert.match(html, /Personas del equipo afectadas:/);
  assert.match(html, /Salario mensual promedio \(BRL\):/);
  assert.match(html, /Horas recuperables \(anuales\)/);
  assert.match(html, /for="process-intelligence-collaborators"/);
  assert.match(html, /3x/);
});

test("Process Intelligence Portuguese remains the page default", () => {
  const html = renderProcessIntelligence("pt");

  assert.match(html, /RESERVAR AUDITORIA/);
  assert.match(html, /Colaboradores Afetados:/);
  assert.match(html, /Salário Médio Mensal \(R\$\):/);
  assert.match(html, /href="https:\/\/wa\.me\//);
});

test("Process Activation keeps Portuguese source and fails closed on missing EN/ES copy", () => {
  const source = "Diagnóstico antes da execução";
  assert.equal(getProcessActivationCopy(source, "pt"), source);
  assert.throws(() => getProcessActivationCopy("UNMAPPED ACTIVATION COPY", "en"), /Missing en Process Activation copy/);
  assert.throws(() => getProcessActivationCopy("UNMAPPED ACTIVATION COPY", "es"), /Missing es Process Activation copy/);
});

