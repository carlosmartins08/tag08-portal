export const AFFILIATE_COMMISSION_RATES = Object.freeze({
  version: 3,
  recurringFirstPayment: 0.3,
  activePartnerRecurring: 0.05,
  sebraeOneTime: 0.05,
  otherOneTime: 0.1,
  recurringStartAfterDays: 90
});

export type PartnershipModality = "referral" | "active_commercial";

export type AffiliateCommissionInputs = {
  modality: PartnershipModality;
  recurringFirstPaymentReceived: number;
  activeRecurringRevenueReceived: number;
  daysSinceFirstPayment: number;
  clientIsActive: boolean;
  partnerIsActive: boolean;
  partnerCommercialActivityMaintained: boolean;
  sebraeFirstInstallmentsReceived: number;
  otherFirstInstallmentsReceived: number;
};

const eligibleAmount = (amount: number) => Number.isFinite(amount) ? Math.max(0, amount) : 0;
const roundCurrency = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export const isActiveRecurringCommissionEligible = (inputs: AffiliateCommissionInputs) =>
  inputs.modality === "active_commercial" &&
  Number.isInteger(inputs.daysSinceFirstPayment) &&
  inputs.daysSinceFirstPayment >= AFFILIATE_COMMISSION_RATES.recurringStartAfterDays &&
  inputs.clientIsActive &&
  inputs.partnerIsActive &&
  inputs.partnerCommercialActivityMaintained;

export const calculateAffiliateCommission = (inputs: AffiliateCommissionInputs) => {
  const hasValidModality = inputs.modality === "referral" || inputs.modality === "active_commercial";
  const recurringFirstPaymentReceived = hasValidModality ? eligibleAmount(inputs.recurringFirstPaymentReceived) : 0;
  const activeRecurringRevenueReceived = eligibleAmount(inputs.activeRecurringRevenueReceived);
  const sebraeFirstInstallmentsReceived = eligibleAmount(inputs.sebraeFirstInstallmentsReceived);
  const otherFirstInstallmentsReceived = eligibleAmount(inputs.otherFirstInstallmentsReceived);
  const isActivePartner = inputs.modality === "active_commercial";

  const recurringFirstPaymentCommission = roundCurrency(
    recurringFirstPaymentReceived * AFFILIATE_COMMISSION_RATES.recurringFirstPayment
  );
  const activeRecurringCommission = isActiveRecurringCommissionEligible(inputs)
    ? roundCurrency(activeRecurringRevenueReceived * AFFILIATE_COMMISSION_RATES.activePartnerRecurring)
    : 0;
  const sebraeOneTimeCommission = hasValidModality && isActivePartner
    ? roundCurrency(sebraeFirstInstallmentsReceived * AFFILIATE_COMMISSION_RATES.sebraeOneTime)
    : 0;
  const otherOneTimeCommission = hasValidModality && isActivePartner
    ? roundCurrency(otherFirstInstallmentsReceived * AFFILIATE_COMMISSION_RATES.otherOneTime)
    : 0;

  return {
    recurringFirstPaymentCommission,
    activeRecurringCommission,
    sebraeOneTimeCommission,
    otherOneTimeCommission,
    firstPaymentsTotal: roundCurrency(
      recurringFirstPaymentCommission + sebraeOneTimeCommission + otherOneTimeCommission
    )
  };
};
