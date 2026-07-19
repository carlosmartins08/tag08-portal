export type ProcessIntelligenceInputs = {
  collaborators: number;
  hoursPerDay: number;
  monthlySalary: number;
};

const WORKING_DAYS_PER_MONTH = 22;
const MONTHS_PER_YEAR = 12;
const WORKING_HOURS_PER_MONTH = 176;
const RECOVERABLE_SHARE = 0.8;

export const calculateProcessIntelligenceWaste = ({
  collaborators,
  hoursPerDay,
  monthlySalary
}: ProcessIntelligenceInputs) => {
  const annualWasteHours = Math.round(WORKING_DAYS_PER_MONTH * MONTHS_PER_YEAR * hoursPerDay * collaborators);
  const annualWasteCost = Math.round(annualWasteHours * (monthlySalary / WORKING_HOURS_PER_MONTH));
  const recoverableHours = Math.round(annualWasteHours * RECOVERABLE_SHARE);

  return { annualWasteHours, annualWasteCost, recoverableHours };
};
