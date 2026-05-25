import { RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleContext, RuleFlag } from "../engine/types.js";

export function duplicateClaim(claim: Claim, context: RuleContext): RuleFlag[] {
  const matches = context.claims.filter((candidate) =>
    candidate.claim_id !== claim.claim_id &&
    candidate.member_id === claim.member_id &&
    candidate.provider_id === claim.provider_id &&
    candidate.claim_date === claim.claim_date &&
    candidate.diagnosis_code === claim.diagnosis_code
  );

  if (matches.length === 0) {
    return [];
  }

  return [{
    rule: "duplicate_claim",
    severity: RULE_SEVERITY.duplicate_claim,
    evidence: `Same member, provider, date, and diagnosis as ${matches.length} other claim(s): ${matches.map((item) => item.claim_id).join(", ")}`
  }];
}
