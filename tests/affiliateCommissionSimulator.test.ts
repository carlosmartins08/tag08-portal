import assert from "node:assert/strict";
import test from "node:test";
import { AFFILIATE_COMMISSION_CONFIG, calculateAffiliateCommission } from "../src/lib/simulators/affiliateCommission";

test("affiliate commission preserves the approved ticket and rate baseline", () => {
  assert.equal(AFFILIATE_COMMISSION_CONFIG.version, 1);
  assert.equal(AFFILIATE_COMMISSION_CONFIG.commissionRate, 0.1);
  assert.deepEqual(
    calculateAffiliateCommission({ brandingProjects: 1, websiteProjects: 1, socialMediaContracts: 1 }),
    {
      brandingCommission: 350,
      websitesCommission: 550,
      socialMediaCommission: 220,
      totalOneTime: 900,
      totalRecurring: 220
    }
  );
});
