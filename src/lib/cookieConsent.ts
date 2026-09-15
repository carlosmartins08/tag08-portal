import { safeStorage } from "../utils/storage";

export type CookiePreferences = {
  version: 2;
  essential: true;
  performance: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_STORAGE_KEY = "tag08_lgpd_consent";
export const COOKIE_CONSENT_EVENT = "tag08-cookie-preferences-change";

const DEFAULT_PREFERENCES: CookiePreferences = {
  version: 2,
  essential: true,
  performance: false,
  marketing: false
};

export const readCookiePreferences = (): CookiePreferences | null => {
  const raw = safeStorage.get(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    // Any pre-v2 consent lacks the category/version contract used by GTM.
    // Asking again is intentional: a prior generic acceptance cannot safely
    // authorize advertising storage under the new policy.
    if (parsed.version !== 2) {
      return null;
    }

    return {
      version: 2,
      essential: true,
      performance: parsed.performance === true,
      marketing: parsed.marketing === true
    };
  } catch {
    return null;
  }
};

export const saveCookiePreferences = (preferences: CookiePreferences) => {
  safeStorage.set(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(preferences));

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<CookiePreferences>(COOKIE_CONSENT_EVENT, {
        detail: preferences
      })
    );
  }
};

export const grantMarketingConsent = () => {
  const current = readCookiePreferences() ?? DEFAULT_PREFERENCES;
  const preferences: CookiePreferences = {
    ...current,
    marketing: true
  };

  saveCookiePreferences(preferences);
  return preferences;
};
