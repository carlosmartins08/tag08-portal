import assert from "node:assert/strict";
import test from "node:test";
import { calculateProcessIntelligenceWaste } from "../src/lib/simulators/processIntelligence";

test("process intelligence preserves the approved waste calculation", () => {
  assert.deepEqual(
    calculateProcessIntelligenceWaste({ collaborators: 5, hoursPerDay: 2.5, monthlySalary: 4500 }),
    { annualWasteHours: 3300, annualWasteCost: 84375, recoverableHours: 2640 }
  );
});
