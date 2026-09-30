import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("assessoria diagnostic WhatsApp links carry the calculated context", () => {
  const source = readFileSync("src/features/site/pages/AssessoriaMarketingDigitalEstrategico.tsx", "utf8");

  assert.match(source, /const brazilDiagnosticWhatsappUrl = buildBrazilWhatsAppUrl\(`[^`]*\$\{diagnostic\.level\}/);
  assert.match(source, /brazilDiagnosticWhatsappUrl = buildBrazilWhatsAppUrl\(`[^`]*\$\{totalScore\}\/120/);
  assert.match(source, /brazilDiagnosticWhatsappUrl = buildBrazilWhatsAppUrl\(`[^`]*\$\{diagnostic\.focus\}/);
  assert.match(source, /internationalDiagnosticWhatsappUrl = buildInternationalWhatsAppUrl\(`[^`]*\$\{diagnostic\.recommendation\}/);
});

test("other simulator routes preserve calculated context in outbound messages", () => {
  const readRoute = (file: string) => readFileSync(`src/features/site/pages/${file}`, "utf8");
  const social = readRoute("GestaoRedesSociais.tsx");
  const audiovisual = readRoute("ProducaoAudiovisual.tsx");
  const intelligence = readRoute("ProcessIntelligence.tsx");
  const activation = readRoute("ProcessActivation.tsx");

  assert.match(social, /diagnosticMessage[\s\S]*challengeLabel/);
  assert.match(social, /diagnosticMessage[\s\S]*selectedPlan/);
  assert.match(audiovisual, /getWhatsAppLink[\s\S]*currentFormatDetails\.name/);
  assert.match(audiovisual, /getWhatsAppLink[\s\S]*currentSelectedTools/);
  assert.match(intelligence, /processIntelligenceBrazilUrl[\s\S]*waste\.annualWasteHours/);
  assert.match(intelligence, /processIntelligenceBrazilUrl[\s\S]*collaborators/);
  assert.match(intelligence, /processIntelligenceInternationalUrl[\s\S]*waste\.recoverableHours/);
  assert.match(activation, /processActivationBrazilUrl[\s\S]*activeLevel/);
  assert.match(activation, /processActivationBrazilUrl[\s\S]*roadmap\.duration/);
  assert.match(activation, /processActivationInternationalUrl[\s\S]*roadmap\.phases\.length/);
});
