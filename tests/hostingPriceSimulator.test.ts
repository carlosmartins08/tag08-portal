import assert from "node:assert/strict";
import test from "node:test";
import { HOSTING_PRICE_CONFIG, calculateHostingPrice } from "../src/lib/simulators/hostingPrice";

test("hosting simulator preserves the approved monthly pricing baseline", () => {
  assert.equal(HOSTING_PRICE_CONFIG.version, 1);
  assert.equal(calculateHostingPrice({ plan: "basico", sites: 1, emails: 10, storageGb: 5, applyUpgrade: false }), 49);
  assert.equal(calculateHostingPrice({ plan: "basico", sites: 2, emails: 16, storageGb: 10, applyUpgrade: true }), 139);
  assert.equal(calculateHostingPrice({ plan: "intermediario", sites: 2, emails: 61, storageGb: 20, applyUpgrade: true }), 214);
  assert.equal(calculateHostingPrice({ plan: "avancado", sites: 3, emails: 100, storageGb: 40, applyUpgrade: true }), 449);
});
