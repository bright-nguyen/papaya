# AI Challenge 10: Fraud Detection Scoring Engine

This submission is a TypeScript CLI-only implementation of the AI Challenge 10 fraud scoring engine. It generates a deterministic synthetic insurance claims dataset, injects known fraud patterns, runs eight rule-based detection rules, assigns normalized risk scores, and writes machine-readable plus reviewer-friendly reports.

No UI, deployment, LLM calls, or external APIs are used.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Run

```bash
npm run generate
npm run score
```

Or run the full pipeline:

```bash
npm run all
```

Expected outputs are written to `generated/`:

- `generated/claims.json`
- `generated/scored_claims.json`
- `generated/metrics_report.json`
- `generated/summary.md`

## Test

```bash
npm test
npm run typecheck
```

The test suite contains 23 tests covering individual rules, edge cases, scoring, metrics, generated fraud distribution, determinism, and challenge-level rule coverage.

## Dataset

The generator creates exactly 2,000 synthetic claims with these fields:

- `claim_id`
- `member_id`
- `provider_id`
- `provider_name`
- `claim_date`
- `claim_type`
- `diagnosis_code`
- `procedure_codes`
- `submitted_amount`
- `is_weekend`
- `is_fraud`
- `fraud_labels`

Ground truth is stored directly on each generated claim through `is_fraud` and `fraud_labels`.

Injected fraud distribution:

| Pattern | Count |
| --- | ---: |
| Duplicate claims | 30 |
| Rapid re-submissions | 30 |
| Upcoded claims | 30 |
| Unbundled claims | 25 |
| Phantom billing claims | 25 |
| Weekend surgical anomalies | 20 |
| Diagnosis-procedure mismatches | 20 |
| Amount clustering claims | 20 |
| Total | 200 |

## Rules

1. **Duplicate claim**: flags claims sharing member, provider, date, and diagnosis with another claim.
2. **Rapid re-submission**: flags same member and same diagnosis submitted within seven days.
3. **Upcoding**: flags claims where the submitted amount is more than two standard deviations above the mean for a procedure code.
4. **Unbundling**: flags component procedures that match one of five known bundle mappings but were billed separately.
5. **Phantom billing**: flags providers submitting more than 30 claims on one day.
6. **Weekend anomaly**: flags weekend surgical procedures from providers with less than 5% historical weekend volume.
7. **Diagnosis-procedure mismatch**: flags procedures not present in a 10-diagnosis clinical compatibility mapping.
8. **Amount clustering**: flags submitted amounts from 47,500 through 49,999, just below the 50,000 auto-approval threshold.

Each rule returns itemized evidence, for example:

```json
{
  "rule": "phantom_billing",
  "severity": 5,
  "evidence": "Provider PRV-050 submitted 31 claims on 2024-09-17, exceeding the 30-claim daily threshold"
}
```

## Scoring

Rule severity weights are configured in `src/engine/config.ts` on a 1 to 5 scale:

| Rule | Severity | Rationale |
| --- | ---: | --- |
| Duplicate claim | 5 | Strong evidence because the identifying claim fields are identical. |
| Upcoding | 5 | Direct financial impact and statistically unusual amount. |
| Phantom billing | 5 | High-volume provider-day behavior is a serious operational anomaly. |
| Unbundling | 4 | Strong billing-pattern evidence, but may need policy review. |
| Diagnosis-procedure mismatch | 4 | Clinically suspicious and useful for audit prioritization. |
| Rapid re-submission | 3 | Suspicious timing, but legitimate follow-up claims can exist. |
| Weekend anomaly | 3 | Contextual provider behavior, useful but not always fraud. |
| Amount clustering | 2 | Weak standalone signal that is stronger when combined with other rules. |

Composite score is the sum of triggered severities normalized to a 0-100 scale:

```text
risk_score = round(triggered_severity_sum / maximum_possible_severity_sum * 100)
```

The generated `scored_claims.json` file is ranked by descending `risk_score`.

## Latest Run Metrics

From `npm run all`:

| Metric | Value |
| --- | ---: |
| Total claims | 2,000 |
| Fraud claims | 200 |
| Flagged claims | 239 |
| Precision | 83.68% |
| Recall | 100.00% |
| False positive rate | 2.17% |
| Processing time | 115 ms |

This meets the challenge targets of recall at least 70%, false positive rate at most 20%, and processing under 30 seconds.

## Sample Ranked Output

```json
{
  "claim_id": "CLM-01879",
  "risk_score": 26,
  "flags": [
    {
      "rule": "rapid_resubmission",
      "severity": 3,
      "evidence": "Same member and diagnosis appeared within 7 days on CLM-00701 (2024-06-17)"
    },
    {
      "rule": "upcoding",
      "severity": 5,
      "evidence": "Submitted amount 85,000 for procedure PROC-CHEST-XRAY is 5.1 standard deviations above the mean of 3,874"
    }
  ]
}
```

## Design Decisions and Tradeoffs

- The dataset is deterministic so reviewers can reproduce the same claims, metrics, and reports.
- Rules are pure functions where possible. Shared context such as procedure statistics and provider daily counts is built once by the engine.
- The generator avoids overly suspicious normal claims, but it still allows some false positives from group-based behavior. This better reflects real fraud screening, where a rule flags risk rather than proving intent.
- The scoring model is intentionally simple. A weighted rules engine is easier to audit than a black-box model and matches the challenge goal.
- Metrics use any non-zero risk score as a fraud prediction because this project is focused on rule coverage. In a production workflow, the threshold would be tuned against investigation capacity and loss tolerance.
- The upcoding rule compares single-procedure claims against peer claims for the same procedure excluding itself, so an outlier does not dilute its own z-score and bundled totals are not misread as per-procedure outliers.
- The weekend anomaly rule uses provider history before the claim date, which better matches the challenge's historical-volume requirement.

## Timeline

This implementation took approximately 4 hours, including problem breakdown, data modeling, rule implementation, scoring, tests, report generation, and documentation.

## Project Structure

```text
submission/
  README.md
  package.json
  tsconfig.json
  src/
    cli.ts
    data/
      generateDataset.ts
      seedData.ts
    engine/
      config.ts
      metrics.ts
      scoreClaims.ts
      types.ts
    rules/
      duplicateClaim.ts
      rapidResubmission.ts
      upcoding.ts
      unbundling.ts
      phantomBilling.ts
      weekendAnomaly.ts
      diagnosisProcedureMismatch.ts
      amountClustering.ts
    output/
      writeReports.ts
  tests/
    rules/
    engine/
  generated/
```
