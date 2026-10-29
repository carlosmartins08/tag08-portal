import assert from "node:assert/strict";
import test from "node:test";
import { AFFILIATE_COMMISSION_RATES, calculateAffiliateCommission, isActiveRecurringCommissionEligible, type AffiliateCommissionInputs } from "../src/lib/simulators/affiliateCommission";

const baseInputs = (overrides: Partial<AffiliateCommissionInputs> = {}): AffiliateCommissionInputs => ({
  modality: "active_commercial",
  recurringFirstPaymentReceived: 1_000,
  activeRecurringRevenueReceived: 2_000,
  daysSinceFirstPayment: 90,
  clientIsActive: true,
  partnerIsActive: true,
  partnerCommercialActivityMaintained: true,
  sebraeFirstInstallmentsReceived: 3_000,
  otherFirstInstallmentsReceived: 4_000,
  ...overrides
});

test("approved rates are centralized, versioned, and reflect the active BRM", () => {
  assert.deepEqual(AFFILIATE_COMMISSION_RATES, {
    version: 3,
    recurringFirstPayment: 0.3,
    activePartnerRecurring: 0.05,
    sebraeOneTime: 0.05,
    otherOneTime: 0.1,
    recurringStartAfterDays: 90
  });
});

test("referral receives 30% of the recurring first payment and no active or one-time commissions", () => {
  assert.deepEqual(calculateAffiliateCommission(baseInputs({ modality: "referral" })), {
    recurringFirstPaymentCommission: 300,
    activeRecurringCommission: 0,
    sebraeOneTimeCommission: 0,
    otherOneTimeCommission: 0,
    firstPaymentsTotal: 300
  });
});

test("active partner receives the first-payment rate and eligible ongoing and punctual commissions", () => {
  assert.deepEqual(calculateAffiliateCommission(baseInputs()), {
    recurringFirstPaymentCommission: 300,
    activeRecurringCommission: 100,
    sebraeOneTimeCommission: 150,
    otherOneTimeCommission: 400,
    firstPaymentsTotal: 850
  });
});

test("5% recurring commission is not eligible before day 90", () => {
  const inputs = baseInputs({ daysSinceFirstPayment: AFFILIATE_COMMISSION_RATES.recurringStartAfterDays - 1 });
  assert.equal(isActiveRecurringCommissionEligible(inputs), false);
  assert.equal(calculateAffiliateCommission(inputs).activeRecurringCommission, 0);
});

test("5% recurring commission becomes eligible on day 90", () => {
  const inputs = baseInputs({ daysSinceFirstPayment: AFFILIATE_COMMISSION_RATES.recurringStartAfterDays });
  assert.equal(isActiveRecurringCommissionEligible(inputs), true);
  assert.equal(calculateAffiliateCommission(inputs).activeRecurringCommission, 100);
});

test("inactive client or no eligible received recurring revenue yields no recurrence", () => {
  const inactiveClient = baseInputs({ clientIsActive: false });
  const noRevenue = baseInputs({ activeRecurringRevenueReceived: 0 });
  assert.equal(calculateAffiliateCommission(inactiveClient).activeRecurringCommission, 0);
  assert.equal(calculateAffiliateCommission(noRevenue).activeRecurringCommission, 0);
});

test("inactive partner or missing commercial and post-sale activity yields no recurrence", () => {
  assert.equal(calculateAffiliateCommission(baseInputs({ partnerIsActive: false })).activeRecurringCommission, 0);
  assert.equal(calculateAffiliateCommission(baseInputs({ partnerCommercialActivityMaintained: false })).activeRecurringCommission, 0);
});

test("punctual services apply distinct rates to the first eligible net installment received", () => {
  const result = calculateAffiliateCommission(baseInputs({
    recurringFirstPaymentReceived: 0,
    activeRecurringRevenueReceived: 0,
    sebraeFirstInstallmentsReceived: 800,
    otherFirstInstallmentsReceived: 800
  }));
  assert.equal(result.sebraeOneTimeCommission, 40);
  assert.equal(result.otherOneTimeCommission, 80);
});

test("punctual commission uses the eligible base after exclusions, not the gross project value", () => {
  const grossPayment = 1_000;
  const excludedCostsAndDeductions = 200;
  const eligibleNetPayment = grossPayment - excludedCostsAndDeductions;
  assert.equal(calculateAffiliateCommission(baseInputs({
    recurringFirstPaymentReceived: 0,
    activeRecurringRevenueReceived: 0,
    sebraeFirstInstallmentsReceived: 0,
    otherFirstInstallmentsReceived: eligibleNetPayment
  })).otherOneTimeCommission, 80);
});

test("zero amounts produce zero commission", () => {
  const result = calculateAffiliateCommission(baseInputs({
    recurringFirstPaymentReceived: 0,
    activeRecurringRevenueReceived: 0,
    sebraeFirstInstallmentsReceived: 0,
    otherFirstInstallmentsReceived: 0
  }));
  assert.deepEqual(result, {
    recurringFirstPaymentCommission: 0,
    activeRecurringCommission: 0,
    sebraeOneTimeCommission: 0,
    otherOneTimeCommission: 0,
    firstPaymentsTotal: 0
  });
});

test("negative, non-finite amounts and invalid day counts cannot create commissions", () => {
  const result = calculateAffiliateCommission(baseInputs({
    recurringFirstPaymentReceived: -50,
    activeRecurringRevenueReceived: Number.NaN,
    daysSinceFirstPayment: Number.NaN,
    sebraeFirstInstallmentsReceived: Number.POSITIVE_INFINITY,
    otherFirstInstallmentsReceived: -0.1
  }));
  assert.deepEqual(result, {
    recurringFirstPaymentCommission: 0,
    activeRecurringCommission: 0,
    sebraeOneTimeCommission: 0,
    otherOneTimeCommission: 0,
    firstPaymentsTotal: 0
  });
});

test("unknown runtime modalities fail closed", () => {
  const result = calculateAffiliateCommission(baseInputs({ modality: "unknown" as AffiliateCommissionInputs["modality"] }));
  assert.deepEqual(result, {
    recurringFirstPaymentCommission: 0,
    activeRecurringCommission: 0,
    sebraeOneTimeCommission: 0,
    otherOneTimeCommission: 0,
    firstPaymentsTotal: 0
  });
});

test("currency results are rounded to cents", () => {
  assert.equal(calculateAffiliateCommission(baseInputs({
    recurringFirstPaymentReceived: 0,
    activeRecurringRevenueReceived: 10.1,
    sebraeFirstInstallmentsReceived: 0,
    otherFirstInstallmentsReceived: 0
  })).activeRecurringCommission, 0.51);
});
