import assert from "node:assert/strict";
import test from "node:test";
import { amountClustering } from "../../src/rules/amountClustering.js";
import { claim } from "../helpers.js";

test("amount clustering flags amounts within five percent below approval threshold", () => {
  const flags = amountClustering(claim({ submitted_amount: 49_500 }));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /auto-approval threshold/);
});

test("amount clustering ignores amounts below the clustering band", () => {
  assert.equal(amountClustering(claim({ submitted_amount: 47_000 })).length, 0);
});
