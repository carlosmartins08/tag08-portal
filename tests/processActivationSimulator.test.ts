import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVATION_LEVELS, ACTIVATION_ROADMAPS } from "../src/lib/simulators/processActivation";

test("process activation roadmaps preserve the three approved durations", () => {
  assert.equal(ACTIVATION_ROADMAPS.bronze.duration, "Duração: 4 semanas");
  assert.equal(ACTIVATION_ROADMAPS.prata.duration, "Duração: 6 semanas");
  assert.equal(ACTIVATION_ROADMAPS.ouro.duration, "Duração: 8 semanas");
  assert.equal(ACTIVATION_ROADMAPS.ouro.phases.length, 4);
});

test("process activation catalog has complete, usable roadmaps", () => {
  assert.equal(ACTIVATION_LEVELS.length, 3);

  for (const level of ACTIVATION_LEVELS) {
    const roadmap = ACTIVATION_ROADMAPS[level.id];
    assert.ok(roadmap.duration.length > 0);
    assert.equal(roadmap.phases.length, 4);

    for (const phase of roadmap.phases) {
      assert.ok(phase.step.length > 0);
      assert.ok(phase.title.length > 0);
      assert.ok(phase.description.length > 0);
      assert.ok(phase.badge.length > 0);
    }
  }
});
