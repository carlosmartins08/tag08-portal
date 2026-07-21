import assert from "node:assert/strict";
import test from "node:test";
import { getCountryFromPhoneE164 } from "../src/config/siteNetwork";

test("official WhatsApp numbers resolve their country flags from E.164 prefixes", () => {
  assert.deepEqual(getCountryFromPhoneE164("+5583998868882"), {
    isoCode: "BR",
    name: "Brasil",
    flag: "🇧🇷"
  });
  assert.deepEqual(getCountryFromPhoneE164("+56997937611"), {
    isoCode: "CL",
    name: "Chile",
    flag: "🇨🇱"
  });
});

test("unknown calling codes remain explicitly international", () => {
  assert.deepEqual(getCountryFromPhoneE164("+999123456"), {
    isoCode: null,
    name: "Internacional",
    flag: "🌐"
  });
});
