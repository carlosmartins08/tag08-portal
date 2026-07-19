import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVATION_ROADMAPS } from "../src/lib/simulators/processActivation";

test("process activation roadmaps preserve the three approved durations", () => {
  assert.equal(ACTIVATION_ROADMAPS.bronze.duration, "Duração: 4 semanas");
  assert.equal(ACTIVATION_ROADMAPS.prata.duration, "Duração: 6 semanas");
  assert.equal(ACTIVATION_ROADMAPS.ouro.duration, "Duração: 8 semanas");
  assert.equal(ACTIVATION_ROADMAPS.ouro.phases.length, 4);
});
