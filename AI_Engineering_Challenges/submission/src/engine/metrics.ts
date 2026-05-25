import { SCORE_THRESHOLD } from "./config.js";
import type { MetricsReport, ScoredClaim } from "./types.js";

function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Number((numerator / denominator).toFixed(4));
}

export function calculateMetrics(scoredClaims: ScoredClaim[], processingTimeMs: number, threshold = SCORE_THRESHOLD): MetricsReport {
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;

  for (const claim of scoredClaims) {
    const predictedFraud = claim.risk_score >= threshold;
    if (predictedFraud && claim.is_fraud) truePositives += 1;
    if (predictedFraud && !claim.is_fraud) falsePositives += 1;
    if (!predictedFraud && !claim.is_fraud) trueNegatives += 1;
    if (!predictedFraud && claim.is_fraud) falseNegatives += 1;
  }

  return {
    threshold,
    true_positives: truePositives,
    false_positives: falsePositives,
    true_negatives: trueNegatives,
    false_negatives: falseNegatives,
    precision: safeDivide(truePositives, truePositives + falsePositives),
    recall: safeDivide(truePositives, truePositives + falseNegatives),
    false_positive_rate: safeDivide(falsePositives, falsePositives + trueNegatives),
    total_claims: scoredClaims.length,
    fraud_claims: scoredClaims.filter((claim) => claim.is_fraud).length,
    flagged_claims: scoredClaims.filter((claim) => claim.risk_score >= threshold).length,
    processing_time_ms: processingTimeMs
  };
}
