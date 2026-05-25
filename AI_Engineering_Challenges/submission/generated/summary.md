# Fraud Scoring Summary

## Metrics

| Metric | Value |
| --- | ---: |
| Total claims | 2000 |
| Fraud claims | 200 |
| Flagged claims | 239 |
| Precision | 83.68% |
| Recall | 100.00% |
| False positive rate | 2.17% |
| Processing time | 115 ms |

## Ground Truth Distribution

| Label | Count |
| --- | ---: |
| upcoding | 30 |
| phantom_billing | 25 |
| unbundling | 25 |
| diagnosis_procedure_mismatch | 20 |
| duplicate_claim | 30 |
| rapid_resubmission | 30 |
| weekend_anomaly | 20 |
| amount_clustering | 20 |

## Rule Flag Counts

| Rule | Flagged claims |
| --- | ---: |
| rapid_resubmission | 67 |
| upcoding | 33 |
| phantom_billing | 31 |
| unbundling | 25 |
| diagnosis_procedure_mismatch | 20 |
| duplicate_claim | 30 |
| weekend_anomaly | 20 |
| amount_clustering | 20 |

## Top Risk Claims

| Rank | Claim | Score | Rules | Ground truth fraud |
| ---: | --- | ---: | --- | --- |
| 1 | CLM-01879 | 26 | rapid_resubmission, upcoding | yes |
| 2 | CLM-01913 | 26 | rapid_resubmission, phantom_billing | yes |
| 3 | CLM-01915 | 26 | rapid_resubmission, phantom_billing | yes |
| 4 | CLM-01916 | 26 | rapid_resubmission, phantom_billing | yes |
| 5 | CLM-01917 | 26 | rapid_resubmission, phantom_billing | yes |
| 6 | CLM-01890 | 23 | rapid_resubmission, unbundling | yes |
| 7 | CLM-01977 | 23 | rapid_resubmission, diagnosis_procedure_mismatch | yes |
| 8 | CLM-00416 | 16 | upcoding | no |
| 9 | CLM-00632 | 16 | upcoding | no |
| 10 | CLM-01056 | 16 | upcoding | no |
