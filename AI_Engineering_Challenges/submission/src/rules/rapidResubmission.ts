import { RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleContext, RuleFlag } from "../engine/types.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export function rapidResubmission(claim: Claim, context: RuleContext): RuleFlag[] {
  const claimTime = Date.parse(`${claim.claim_date}T00:00:00Z`);
  const matches = context.claims.filter((candidate) => {
    if (candidate.claim_id === claim.claim_id) return false;
    if (candidate.member_id !== claim.member_id || candidate.diagnosis_code !== claim.diagnosis_code) return false;
    const days = Math.abs(Date.parse(`${candidate.claim_date}T00:00:00Z`) - claimTime) / DAY_MS;
    return days > 0 && days <= 7;
  });

  if (matches.length === 0) {
    return [];
  }

  return [{
    rule: "rapid_resubmission",
    severity: RULE_SEVERITY.rapid_resubmission,
    evidence: `Same member and diagnosis appeared within 7 days on ${matches.map((item) => `${item.claim_id} (${item.claim_date})`).join(", ")}`
  }];
}
