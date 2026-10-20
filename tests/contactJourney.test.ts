import assert from "node:assert/strict";
import test from "node:test";
import {
  contextualizeContactTarget,
  getContactJourneyContextForPath,
  getContactJourneyOriginSource,
  parseContactJourneyContext
} from "../src/lib/contactJourney";

test("parses only allowlisted intent and origin values", () => {
  assert.deepEqual(parseContactJourneyContext("?intent=branding&origin=offer&debug=drop-me"), {
    intent: "branding",
    origin: "offer"
  });
  assert.deepEqual(parseContactJourneyContext("?intent=not-real&origin=unknown"), {});
});

test("maps approved family pages and independent Sebraetec origin", () => {
  const offerContexts = [
    ["/servicos/gestao-de-redes-sociais", "redes-sociais"],
    ["/servicos/producao-audiovisual", "producao-audiovisual"],
    ["/servicos/desenvolvimento-web", "desenvolvimento-web"],
    ["/servicos/branding-identidade", "branding"],
    ["/servicos/assessoria-marketing-digital-estrategico", "assessoria-estrategica"],
    ["/servicos/process-intelligence", "process-intelligence"],
    ["/servicos/process-activation", "process-activation"],
    ["/hospedagem-manutencao-sites", "hospedagem"]
  ] as const;

  for (const [path, intent] of offerContexts) {
    assert.deepEqual(getContactJourneyContextForPath(path), { intent, origin: "offer" });
  }
  assert.deepEqual(getContactJourneyContextForPath("/sebraetec-impulsionando-empreendedores"), {
    origin: "sebraetec"
  });
  assert.deepEqual(getContactJourneyContextForPath("/programa-afiliados"), {});
});

test("adds context only to Contact and drops unapproved query fields", () => {
  assert.equal(
    contextualizeContactTarget("/servicos/desenvolvimento-web", "/contato?debug=drop-me"),
    "/contato?intent=desenvolvimento-web&origin=offer"
  );
  assert.equal(
    contextualizeContactTarget("/", "/contato?intent=branding&origin=home"),
    "/contato?intent=branding&origin=home"
  );
  assert.equal(contextualizeContactTarget("/", "/servicos?debug=drop-me"), "/servicos");
});

test("encodes controlled origin in the existing source field", () => {
  assert.equal(getContactJourneyOriginSource("sebraetec"), "contact-page:sebraetec");
  assert.equal(getContactJourneyOriginSource(), "contact-page");
});
