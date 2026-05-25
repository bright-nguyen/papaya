import assert from "node:assert/strict";
import test from "node:test";
import { MAX_SEVERITY_SUM, RULE_SEVERITY } from "../../src/engine/config.js";
import { calculateMetrics } from "../../src/engine/metrics.js";
import { scoreFromFlags } from "../../src/engine/scoreClaims.js";
import type { ScoredClaim } from "../../src/engine/types.js";
import { claim } from "../helpers.js";

test("scoreFromFlags normalizes severity sum to 0-100", () => {
  const score = scoreFromFlags([{ rule: "duplicate_claim", severity: RULE_SEVERITY.duplicate_claim, evidence: "x" }]);
  assert.equal(score, Math.round((RULE_SEVERITY.duplicate_claim / MAX_SEVERITY_SUM) * 100));
});

test("scoreFromFlags returns zero for no flags", () => {
  assert.equal(scoreFromFlags([]), 0);
});

test("calculateMetrics handles precision recall and false positive rate", () => {
  const scored = [
    { ...claim({ claim_id: "TP", is_fraud: true }), risk_score: 10, flags: [{ rule: "x", severity: 1, evidence: "x" }] },
    { ...claim({ claim_id: "FN", is_fraud: true }), risk_score: 0, flags: [] },
    { ...claim({ claim_id: "FP", is_fraud: false }), risk_score: 10, flags: [{ rule: "x", severity: 1, evidence: "x" }] },
    { ...claim({ claim_id: "TN", is_fraud: false }), risk_score: 0, flags: [] }
  ] satisfies ScoredClaim[];

  const metrics = calculateMetrics(scored, 12);
  assert.equal(metrics.precision, 0.5);
  assert.equal(metrics.recall, 0.5);
  assert.equal(metrics.false_positive_rate, 0.5);
});
