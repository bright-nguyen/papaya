import assert from "node:assert/strict";
import test from "node:test";
import { duplicateClaim } from "../../src/rules/duplicateClaim.js";
import { claim, context } from "../helpers.js";

test("duplicate claim flags same member provider date and diagnosis", () => {
  const claims = [
    claim({ claim_id: "CLM-1" }),
    claim({ claim_id: "CLM-2" })
  ];
  const flags = duplicateClaim(claims[0], context(claims));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /CLM-2/);
});

test("duplicate claim ignores same member on a different date", () => {
  const claims = [
    claim({ claim_id: "CLM-1" }),
    claim({ claim_id: "CLM-2", claim_date: "2024-01-04" })
  ];
  assert.equal(duplicateClaim(claims[0], context(claims)).length, 0);
});
