import assert from "node:assert/strict";
import test from "node:test";
import { phantomBilling } from "../../src/rules/phantomBilling.js";
import { claim, context } from "../helpers.js";

test("phantom billing flags provider with more than 30 claims in one day", () => {
  const claims = Array.from({ length: 31 }, (_, index) =>
    claim({ claim_id: `CLM-${index}`, member_id: `MBR-${index}`, provider_id: "PRV-X", claim_date: "2024-03-01" })
  );
  const flags = phantomBilling(claims[0], context(claims));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /31 claims/);
});

test("phantom billing does not flag exactly 30 daily claims", () => {
  const claims = Array.from({ length: 30 }, (_, index) =>
    claim({ claim_id: `CLM-${index}`, member_id: `MBR-${index}`, provider_id: "PRV-X", claim_date: "2024-03-01" })
  );
  assert.equal(phantomBilling(claims[0], context(claims)).length, 0);
});
