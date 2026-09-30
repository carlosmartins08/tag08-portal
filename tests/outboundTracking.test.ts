import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const trackedPages = [
  "src/features/site/pages/DesenvolvimentoWeb.tsx",
  "src/features/site/pages/GestaoRedesSociais.tsx",
  "src/features/site/pages/HospedagemManutencaoSites.tsx",
  "src/features/site/pages/ProcessActivation.tsx",
  "src/features/site/pages/ProcessIntelligence.tsx",
  "src/features/site/pages/ProducaoAudiovisual.tsx",
  "src/features/site/pages/Sebraetec.tsx",
  "src/features/site/pages/Servicos.tsx",
  "src/features/site/pages/NotFound.tsx"
];

test("service WhatsApp CTAs use the tracked outbound-link contract", () => {
  for (const pageFile of trackedPages) {
    const source = readFileSync(pageFile, "utf8");
    assert.match(source, /import TrackedOutboundLink from/);
    assert.doesNotMatch(
      source,
      /<a\s+href=\{(?:build(?:Brazil|International)WhatsAppUrl|getWhatsAppLink)/,
      pageFile + " contains a direct WhatsApp anchor outside the tracking contract."
    );
  }
});
