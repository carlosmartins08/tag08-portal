export const AFFILIATE_COMMISSION_CONFIG = {
  version: 1,
  commissionRate: 0.1,
  tickets: {
    branding: 3500,
    websites: 5500,
    socialMediaMonthly: 2200
  }
} as const;

export type AffiliateCommissionInputs = {
  brandingProjects: number;
  websiteProjects: number;
  socialMediaContracts: number;
};

export const calculateAffiliateCommission = ({
  brandingProjects,
  websiteProjects,
  socialMediaContracts
}: AffiliateCommissionInputs) => {
  const { commissionRate, tickets } = AFFILIATE_COMMISSION_CONFIG;
  const brandingCommission = tickets.branding * commissionRate * brandingProjects;
  const websitesCommission = tickets.websites * commissionRate * websiteProjects;
  const socialMediaCommission = tickets.socialMediaMonthly * commissionRate * socialMediaContracts;

  return {
    brandingCommission,
    websitesCommission,
    socialMediaCommission,
    totalOneTime: brandingCommission + websitesCommission,
    totalRecurring: socialMediaCommission
  };
};
