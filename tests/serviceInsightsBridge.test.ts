import assert from "node:assert/strict";
import test from "node:test";
import {
  getServiceInsightsBridgeConfig,
  SERVICE_INSIGHTS_BRIDGE_CONTENT,
} from "../src/content/serviceInsightsBridge";
import { EDITORIAL_SECTION_ROUTES } from "../src/content/editorialContentV1";
import { routeRegistry } from "../src/config/routeRegistry";

const EXPECTED_SECTIONS: Record<string, keyof typeof EDITORIAL_SECTION_ROUTES> = {
  "/servicos/assessoria-marketing-digital-estrategico": "service:strategic-marketing",
  "/servicos/branding-identidade": "service:branding",
  "/servicos/desenvolvimento-web": "service:web-development",
  "/servicos/gestao-de-redes-sociais": "service:social-media",
  "/hospedagem-manutencao-sites": "service:hosting-maintenance",
  "/servicos/process-activation": "service:process-activation",
  "/servicos/process-intelligence": "service:process-intelligence",
  "/servicos/producao-audiovisual": "service:audiovisual",
  "/programa-afiliados": "program:partnership",
};

test("service editorial placements use explicit sections in the shared contract", () => {
  assert.deepEqual(
    Object.keys(SERVICE_INSIGHTS_BRIDGE_CONTENT).sort(),
    Object.keys(EXPECTED_SECTIONS).sort(),
  );

  for (const [servicePath, sectionId] of Object.entries(EXPECTED_SECTIONS)) {
    const bridge = getServiceInsightsBridgeConfig(servicePath);
    assert.ok(bridge, `missing editorial placement for ${servicePath}`);
    assert.equal(bridge.sectionId, sectionId);
    assert.equal(bridge.servicePath, servicePath);
    assert.ok(EDITORIAL_SECTION_ROUTES[bridge.sectionId]);
    assert.ok(routeRegistry.some((route) => route.canonicalPath === servicePath));
  }
});

test("unknown pages do not receive an editorial placement or local fallback", () => {
  assert.equal(getServiceInsightsBridgeConfig("/servicos/not-approved"), null);
});
