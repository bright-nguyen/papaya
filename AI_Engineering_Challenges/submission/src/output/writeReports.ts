import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Claim, MetricsReport, ScoredClaim } from "../engine/types.js";

const GENERATED_DIR = path.resolve("generated");

export async function writeClaims(claims: Claim[]): Promise<void> {
  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(path.join(GENERATED_DIR, "claims.json"), `${JSON.stringify(claims, null, 2)}\n`);
}

export async function writeScoreReports(scoredClaims: ScoredClaim[], metrics: MetricsReport): Promise<void> {
  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(path.join(GENERATED_DIR, "scored_claims.json"), `${JSON.stringify(scoredClaims, null, 2)}\n`);
  await writeFile(path.join(GENERATED_DIR, "metrics_report.json"), `${JSON.stringify(metrics, null, 2)}\n`);
  await writeFile(path.join(GENERATED_DIR, "summary.md"), buildSummary(scoredClaims, metrics));
}

function buildSummary(scoredClaims: ScoredClaim[], metrics: MetricsReport): string {
  const topClaims = scoredClaims.slice(0, 10).map((claim, index) =>
    `| ${index + 1} | ${claim.claim_id} | ${claim.risk_score} | ${claim.flags.map((flag) => flag.rule).join(", ")} | ${claim.is_fraud ? "yes" : "no"} |`
  );
  const fraudDistribution = countFraudLabels(scoredClaims);
  const ruleFlagCounts = countRuleFlags(scoredClaims);

  return `# Fraud Scoring Summary

## Metrics

| Metric | Value |
| --- | ---: |
| Total claims | ${metrics.total_claims} |
| Fraud claims | ${metrics.fraud_claims} |
| Flagged claims | ${metrics.flagged_claims} |
| Precision | ${(metrics.precision * 100).toFixed(2)}% |
| Recall | ${(metrics.recall * 100).toFixed(2)}% |
| False positive rate | ${(metrics.false_positive_rate * 100).toFixed(2)}% |
| Processing time | ${metrics.processing_time_ms} ms |

## Ground Truth Distribution

| Label | Count |
| --- | ---: |
${Object.entries(fraudDistribution).map(([label, count]) => `| ${label} | ${count} |`).join("\n")}

## Rule Flag Counts

| Rule | Flagged claims |
| --- | ---: |
${Object.entries(ruleFlagCounts).map(([rule, count]) => `| ${rule} | ${count} |`).join("\n")}

## Top Risk Claims

| Rank | Claim | Score | Rules | Ground truth fraud |
| ---: | --- | ---: | --- | --- |
${topClaims.join("\n")}
`;
}

function countFraudLabels(scoredClaims: ScoredClaim[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const claim of scoredClaims) {
    for (const label of claim.fraud_labels) {
      counts[label] = (counts[label] ?? 0) + 1;
    }
  }
  return counts;
}

function countRuleFlags(scoredClaims: ScoredClaim[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const claim of scoredClaims) {
    for (const flag of claim.flags) {
      counts[flag.rule] = (counts[flag.rule] ?? 0) + 1;
    }
  }
  return counts;
}
