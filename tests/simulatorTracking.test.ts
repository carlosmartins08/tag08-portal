import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { SIMULATOR_INVENTORY } from "../src/content/simulatorInventory";

const pageFiles = [
  "src/features/site/pages/GestaoRedesSociais.tsx",
  "src/features/site/pages/HospedagemManutencaoSites.tsx",
  "src/features/site/pages/ProgramaAfiliados.tsx",
  "src/features/site/pages/ProcessIntelligence.tsx",
  "src/features/site/pages/ProcessActivation.tsx",
  "src/features/site/pages/ProducaoAudiovisual.tsx",
  "src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx"
];

test("every inventoried simulator is instrumented without sending input values", () => {
  const source = pageFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  for (const simulator of SIMULATOR_INVENTORY) {
    assert.match(source, new RegExp(`(?:useSimulatorTracking|trackSimulatorEvent)\\(\\"${simulator.id}\\"|simulator_id:\\s*"${simulator.id}"`));
  }
  assert.equal(/trackSimulatorEvent\([^)]*(email|whatsapp|message|name)/.test(source), false);
});
