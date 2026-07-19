import assert from "node:assert/strict";
import test from "node:test";
import { SIMULATOR_INVENTORY } from "../src/content/simulatorInventory";

test("simulator inventory distinguishes versioned calculations from local diagnostics", () => {
  assert.equal(SIMULATOR_INVENTORY.length, 7);
  assert.equal(new Set(SIMULATOR_INVENTORY.map((item) => item.id)).size, 7);
  assert.ok(SIMULATOR_INVENTORY.every((item) => item.version > 0 && item.pagePath.startsWith("/")));
  assert.deepEqual(
    SIMULATOR_INVENTORY.filter((item) => item.remoteConfigurationReady).map((item) => item.id).sort(),
    ["affiliate_commission", "hosting_price", "process_intelligence_waste"]
  );
});
