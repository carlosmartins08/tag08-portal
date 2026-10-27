export type OnboardingEnvironment = {
  NODE_ENV?: string;
  ONBOARDING_ENABLED?: string;
};

export function isOnboardingEnabled(env?: OnboardingEnvironment): boolean;
