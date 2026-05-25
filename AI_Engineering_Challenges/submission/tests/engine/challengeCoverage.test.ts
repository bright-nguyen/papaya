import assert from "node:assert/strict";
import test from "node:test";
import { generateDataset } from "../../src/data/generateDataset.js";
import { calculateMetrics } from "../../src/engine/metrics.js";
import { scoreClaims } from "../../src/engine/scoreClaims.js";

const expectedDistribution: Record<string, number> = {
  duplicate_claim: 30,
  rapid_resubmission: 30,
  upcoding: 30,
  unbundling: 25,
  phantom_billing: 25,
  weekend_anomaly: 20,
  diagnosis_procedure_mismatch: 20,
  amount_clustering: 20
};

test("generated dataset matches the challenge fraud distribution", () => {
  const claims = generateDataset();
  const labelCounts: Record<string, number> = {};

  for (const claim of claims) {
    for (const label of claim.fraud_labels) {
      labelCounts[label] = (labelCounts[label] ?? 0) + 1;
    }
  }

  assert.equal(claims.length, 2000);
  assert.equal(claims.filter((claim) => claim.is_fraud).length, 200);
  assert.deepEqual(labelCounts, expectedDistribution);
});

test("generated dataset is deterministic for repeated calls in one process", () => {
  assert.deepEqual(generateDataset(), generateDataset());
});

test("scoring detects every injected fraud pattern with its matching rule", () => {
  const scoredClaims = scoreClaims(generateDataset());
  const metrics = calculateMetrics(scoredClaims, 0);
  const coverage: Record<string, { total: number; ruleHit: number }> = {};

  for (const claim of scoredClaims) {
    for (const label of claim.fraud_labels) {
      const current = coverage[label] ?? { total: 0, ruleHit: 0 };
      current.total += 1;
      current.ruleHit += claim.flags.some((flag) => flag.rule === label) ? 1 : 0;
      coverage[label] = current;
    }
  }

  assert.equal(metrics.recall, 1);
  assert.ok(metrics.false_positive_rate <= 0.2);
  for (const [label, expectedCount] of Object.entries(expectedDistribution)) {
    assert.equal(coverage[label]?.total, expectedCount);
    assert.equal(coverage[label]?.ruleHit, expectedCount);
  }
});
