import assert from "node:assert/strict";
import test from "node:test";
import { calculateProcessIntelligenceWaste } from "../src/lib/simulators/processIntelligence";

test("process intelligence preserves the approved waste calculation", () => {
  assert.deepEqual(
    calculateProcessIntelligenceWaste({ collaborators: 5, hoursPerDay: 2.5, monthlySalary: 4500 }),
    { annualWasteHours: 3300, annualWasteCost: 84375, recoverableHours: 2640 }
  );
});

test("process intelligence rejects non-finite and non-positive inputs", () => {
  const invalidInputs = [
    { collaborators: 0, hoursPerDay: 2.5, monthlySalary: 4500 },
    { collaborators: -1, hoursPerDay: 2.5, monthlySalary: 4500 },
    { collaborators: 5, hoursPerDay: Number.NaN, monthlySalary: 4500 },
    { collaborators: 5, hoursPerDay: Number.POSITIVE_INFINITY, monthlySalary: 4500 },
    { collaborators: 5, hoursPerDay: 2.5, monthlySalary: 0 }
  ];

  for (const input of invalidInputs) {
    assert.throws(() => calculateProcessIntelligenceWaste(input), RangeError);
  }
});

test("process intelligence calculates financial cost from unrounded hours", () => {
  assert.deepEqual(
    calculateProcessIntelligenceWaste({ collaborators: 1, hoursPerDay: 0.51, monthlySalary: 4500 }),
    { annualWasteHours: 135, annualWasteCost: 3443, recoverableHours: 108 }
  );
});

test("process intelligence grows monotonically with collaborators", () => {
  const smallerTeam = calculateProcessIntelligenceWaste({ collaborators: 2, hoursPerDay: 2, monthlySalary: 4500 });
  const largerTeam = calculateProcessIntelligenceWaste({ collaborators: 4, hoursPerDay: 2, monthlySalary: 4500 });

  assert.ok(largerTeam.annualWasteHours > smallerTeam.annualWasteHours);
  assert.ok(largerTeam.annualWasteCost > smallerTeam.annualWasteCost);
  assert.ok(largerTeam.recoverableHours > smallerTeam.recoverableHours);
});
