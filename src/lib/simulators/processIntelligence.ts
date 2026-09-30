export type ProcessIntelligenceInputs = {
  collaborators: number;
  hoursPerDay: number;
  monthlySalary: number;
};

export type ProcessIntelligenceWasteResult = {
  annualWasteHours: number;
  annualWasteCost: number;
  recoverableHours: number;
};

/**
 * Baseline used by the public simulator. These are estimation assumptions,
 * not measurements of a specific operation:
 * - 22 working days per month;
 * - 176 working hours per person per month;
 * - 80% of identified friction is potentially recoverable.
 */
const WORKING_DAYS_PER_MONTH = 22;
const MONTHS_PER_YEAR = 12;
const WORKING_HOURS_PER_MONTH = 176;
const RECOVERABLE_SHARE = 0.8;

const assertPositiveFinite = (name: keyof ProcessIntelligenceInputs, value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite number greater than zero`);
  }
};

export const calculateProcessIntelligenceWaste = ({
  collaborators,
  hoursPerDay,
  monthlySalary
}: ProcessIntelligenceInputs): ProcessIntelligenceWasteResult => {
  assertPositiveFinite("collaborators", collaborators);
  assertPositiveFinite("hoursPerDay", hoursPerDay);
  assertPositiveFinite("monthlySalary", monthlySalary);

  const rawAnnualWasteHours = WORKING_DAYS_PER_MONTH * MONTHS_PER_YEAR * hoursPerDay * collaborators;
  const hourlyCost = monthlySalary / WORKING_HOURS_PER_MONTH;

  return {
    annualWasteHours: Math.round(rawAnnualWasteHours),
    annualWasteCost: Math.round(rawAnnualWasteHours * hourlyCost),
    recoverableHours: Math.round(rawAnnualWasteHours * RECOVERABLE_SHARE)
  };
};
