import assert from "node:assert/strict";
import test from "node:test";
import { isValidElement, type ReactNode } from "react";
import Privacidade from "../src/features/site/pages/Privacidade";

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node)) return textContent(node.props.children);
  return "";
}

function elements(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  return [node, ...elements(node.props.children)];
}

function renderText(locale?: "pt" | "en" | "es") {
  const page = Privacidade({ onNavigate: () => undefined, locale });
  return { page, text: textContent(page) };
}

function contactDestination(locale?: "pt" | "en" | "es") {
  let destination = "";
  const page = Privacidade({ onNavigate: (path) => { destination = path; }, locale });
  const button = elements(page).find((element) => isValidElement(element) && element.type === "button");
  assert.ok(button && isValidElement<{ onClick?: () => void }>(button));
  button.props.onClick?.();
  return destination;
}

test("privacy page defaults to Portuguese and preserves the existing contact destination", () => {
  const { page, text } = renderText();

  assert.match(text, /Aviso de Privacidade da TAG08/);
  assert.match(text, /Informa/);
  assert.match(text, /ClickUp/);
  assert.match(text, /Falar com a TAG08/);

  assert.equal(contactDestination(), "/contato");
});

test("privacy page selects the complete English copy", () => {
  const { text } = renderText("en");

  for (const phrase of [
    "Transparency and personal data",
    "TAG08 Privacy Notice",
    "This is a provisional translation of the Portuguese source.",
    "Information submitted by visitors",
    "The site's forms may receive contact details and professional information.",
    "Purpose and recording of requests",
    "Contact information is used to understand and respond to the request received.",
    "Cookie and measurement preferences",
    "The site stores consent preferences in the browser.",
    "Requests about personal data",
    "To ask a question or request assistance concerning information submitted to TAG08,",
    "Complete retention rules and sharing details",
    "Contact TAG08"
  ]) assert.ok(text.includes(phrase), `English copy missing: ${phrase}`);
  assert.doesNotMatch(text, /Aviso de Privacidade da TAG08|Falar com a TAG08/);
  const { page } = renderText("en");
  const sourceLink = elements(page).find((element) => isValidElement(element) && element.type === "a");
  assert.ok(sourceLink && isValidElement<{ href?: string }>(sourceLink));
  assert.equal(sourceLink.props.href, "/pt/privacidade");
  assert.equal(contactDestination("en"), "/contato");
});

test("privacy page selects the complete Spanish copy", () => {
  const { text } = renderText("es");

  for (const phrase of [
    "Transparencia y datos personales",
    "Aviso de privacidad de TAG08",
    "traducci",
    "Informaci",
    "Los formularios del sitio pueden recibir datos de contacto e informaci",
    "Finalidad y registro de las solicitudes",
    "La informaci",
    "Preferencias de cookies y medici",
    "El sitio conserva las preferencias de consentimiento en el navegador.",
    "Solicitudes sobre datos personales",
    "Para hacer una pregunta o solicitar atenci",
    "Las reglas completas de conservaci",
    "Hablar con TAG08"
  ]) assert.ok(text.includes(phrase), `Spanish copy missing: ${phrase}`);
  assert.doesNotMatch(text, /Aviso de Privacidade da TAG08|Falar com a TAG08/);
  assert.equal(contactDestination("es"), "/contato");
});
