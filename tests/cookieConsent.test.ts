import assert from "node:assert/strict";
import test from "node:test";

const storage = new Map<string, string>();
const events: Event[] = [];

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value)
    },
    dispatchEvent: (event: Event) => {
      events.push(event);
      return true;
    }
  }
});

class TestCustomEvent<T> extends Event {
  detail: T;

  constructor(type: string, init: CustomEventInit<T>) {
    super(type);
    this.detail = init.detail as T;
  }
}

Object.defineProperty(globalThis, "CustomEvent", {
  configurable: true,
  value: TestCustomEvent
});

const { COOKIE_CONSENT_EVENT, grantMarketingConsent, readCookiePreferences, saveCookiePreferences } = await import("../src/lib/cookieConsent");

test("cookie consent persists categories and only grants marketing explicitly", () => {
  saveCookiePreferences({ essential: true, performance: true, marketing: false });
  assert.deepEqual(readCookiePreferences(), { essential: true, performance: true, marketing: false });
  assert.equal(events.at(-1)?.type, COOKIE_CONSENT_EVENT);

  grantMarketingConsent();
  assert.deepEqual(readCookiePreferences(), { essential: true, performance: true, marketing: true });
});
