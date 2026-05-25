import { AMOUNT_CLUSTERING_MAX, AMOUNT_CLUSTERING_MIN, AUTO_APPROVAL_THRESHOLD, RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleFlag } from "../engine/types.js";

export function amountClustering(claim: Claim): RuleFlag[] {
  if (claim.submitted_amount < AMOUNT_CLUSTERING_MIN || claim.submitted_amount > AMOUNT_CLUSTERING_MAX) {
    return [];
  }

  const percentage = (claim.submitted_amount / AUTO_APPROVAL_THRESHOLD) * 100;
  return [{
    rule: "amount_clustering",
    severity: RULE_SEVERITY.amount_clustering,
    evidence: `Amount ${claim.submitted_amount.toLocaleString("en-US")} is ${percentage.toFixed(1)}% of the ${AUTO_APPROVAL_THRESHOLD.toLocaleString("en-US")} auto-approval threshold`
  }];
}
