import assert from "node:assert/strict";
import test from "node:test";
import { rapidResubmission } from "../../src/rules/rapidResubmission.js";
import { claim, context } from "../helpers.js";

test("rapid resubmission flags same member and diagnosis within seven days", () => {
  const claims = [
    claim({ claim_id: "CLM-1", claim_date: "2024-02-01" }),
    claim({ claim_id: "CLM-2", claim_date: "2024-02-07" })
  ];
  const flags = rapidResubmission(claims[0], context(claims));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /within 7 days/);
});

test("rapid resubmission ignores claims beyond seven days", () => {
  const claims = [
    claim({ claim_id: "CLM-1", claim_date: "2024-02-01" }),
    claim({ claim_id: "CLM-2", claim_date: "2024-02-10" })
  ];
  assert.equal(rapidResubmission(claims[0], context(claims)).length, 0);
});
