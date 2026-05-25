import { RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleContext, RuleFlag } from "../engine/types.js";

export function phantomBilling(claim: Claim, context: RuleContext): RuleFlag[] {
  const key = `${claim.provider_id}|${claim.claim_date}`;
  const count = context.providerDailyCounts.get(key) ?? 0;

  if (count <= 30) {
    return [];
  }

  return [{
    rule: "phantom_billing",
    severity: RULE_SEVERITY.phantom_billing,
    evidence: `Provider ${claim.provider_id} submitted ${count} claims on ${claim.claim_date}, exceeding the 30-claim daily threshold`
  }];
}
