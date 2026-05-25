import { RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleContext, RuleFlag } from "../engine/types.js";

export function upcoding(claim: Claim, context: RuleContext): RuleFlag[] {
  if (claim.procedure_codes.length !== 1) {
    return [];
  }

  const flags: RuleFlag[] = [];

  for (const procedureCode of claim.procedure_codes) {
    const peerAmounts = (context.procedureAmounts.get(procedureCode) ?? [])
      .filter((entry) => entry.claimId !== claim.claim_id)
      .map((entry) => entry.amount);
    const stats = calculateStats(peerAmounts);
    if (!stats || stats.count < 5 || stats.stdDev === 0) {
      continue;
    }

    const zScore = (claim.submitted_amount - stats.mean) / stats.stdDev;
    if (zScore > 2) {
      flags.push({
        rule: "upcoding",
        severity: RULE_SEVERITY.upcoding,
        evidence: `Submitted amount ${claim.submitted_amount.toLocaleString("en-US")} for procedure ${procedureCode} is ${zScore.toFixed(1)} standard deviations above the mean of ${Math.round(stats.mean).toLocaleString("en-US")}`
      });
      break;
    }
  }

  return flags;
}

function calculateStats(amounts: number[]): { mean: number; stdDev: number; count: number } | null {
  if (amounts.length === 0) {
    return null;
  }
  const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  const variance = amounts.reduce((sum, amount) => sum + (amount - mean) ** 2, 0) / amounts.length;
  return {
    mean,
    stdDev: Math.sqrt(variance),
    count: amounts.length
  };
}
