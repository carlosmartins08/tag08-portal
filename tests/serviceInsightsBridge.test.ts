import assert from "node:assert/strict";
import test from "node:test";
import {
  SERVICE_INSIGHTS_BRIDGE_CONTENT,
  resolveServiceInsightsBridgeItems,
} from "../src/content/serviceInsightsBridge";
import { routeRegistry } from "../src/config/routeRegistry";

const SERVICE_PATHS = [
  "/servicos/assessoria-marketing-digital-estrategico",
  "/servicos/branding-identidade",
  "/servicos/desenvolvimento-web",
  "/servicos/gestao-de-redes-sociais",
  "/hospedagem-manutencao-sites",
  "/servicos/process-activation",
  "/servicos/process-intelligence",
  "/servicos/producao-audiovisual",
];

test("every service page has a specific, resolvable insights bridge", () => {
  assert.deepEqual(Object.keys(SERVICE_INSIGHTS_BRIDGE_CONTENT).sort(), [...SERVICE_PATHS].sort());

  for (const servicePath of SERVICE_PATHS) {
    const bridge = SERVICE_INSIGHTS_BRIDGE_CONTENT[servicePath];
    assert.ok(bridge, `missing bridge for ${servicePath}`);
    assert.ok(
      routeRegistry.some((route) => route.canonicalPath === servicePath && route.routeCategory === "service"),
      `bridge path is not a canonical service route: ${servicePath}`,
    );
    assert.ok(resolveServiceInsightsBridgeItems(bridge).length >= 3, `invalid bridge for ${servicePath}`);
  }
});
