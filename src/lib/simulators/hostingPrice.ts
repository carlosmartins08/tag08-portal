export const HOSTING_PRICE_CONFIG = {
  version: 1,
  extraSiteMonthlyCost: 50,
  plans: {
    basico: {
      baseMonthlyPrice: 49,
      includedStorageGb: 5,
      extraStoragePerGb: 3,
      includedEmails: 10,
      emailPackSize: 5,
      emailPackMonthlyCost: 5,
      upgradeMonthlyCost: 15
    },
    intermediario: {
      baseMonthlyPrice: 99,
      includedStorageGb: 15,
      extraStoragePerGb: 5,
      includedEmails: 50,
      emailPackSize: 10,
      emailPackMonthlyCost: 10,
      upgradeMonthlyCost: 20
    },
    avancado: {
      baseMonthlyPrice: 199,
      includedStorageGb: 30,
      extraStoragePerGb: 10,
      includedEmails: null,
      emailPackSize: null,
      emailPackMonthlyCost: 0,
      upgradeMonthlyCost: 50
    }
  }
} as const;

export type HostingPlan = keyof typeof HOSTING_PRICE_CONFIG.plans;

export type HostingPriceInputs = {
  plan: HostingPlan;
  sites: number;
  emails: number;
  storageGb: number;
  applyUpgrade: boolean;
};

export const calculateHostingPrice = ({ plan, sites, emails, storageGb, applyUpgrade }: HostingPriceInputs) => {
  const selectedPlan = HOSTING_PRICE_CONFIG.plans[plan];
  const extraSitesCost = Math.max(0, sites - 1) * HOSTING_PRICE_CONFIG.extraSiteMonthlyCost;
  const extraStorageCost = Math.max(0, storageGb - selectedPlan.includedStorageGb) * selectedPlan.extraStoragePerGb;
  const extraEmailCost = selectedPlan.includedEmails === null || selectedPlan.emailPackSize === null
    ? 0
    : Math.ceil(Math.max(0, emails - selectedPlan.includedEmails) / selectedPlan.emailPackSize) * selectedPlan.emailPackMonthlyCost;
  const upgradeCost = applyUpgrade ? selectedPlan.upgradeMonthlyCost : 0;

  return selectedPlan.baseMonthlyPrice + extraSitesCost + extraStorageCost + extraEmailCost + upgradeCost;
};
