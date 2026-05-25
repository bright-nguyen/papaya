import { RULE_SEVERITY, SURGICAL_PROCEDURES } from "../engine/config.js";
import type { Claim, RuleContext, RuleFlag } from "../engine/types.js";

export function weekendAnomaly(claim: Claim, context: RuleContext): RuleFlag[] {
  const hasSurgicalProcedure = claim.procedure_codes.some((code) => SURGICAL_PROCEDURES.has(code));
  const providerStats = historicalProviderStats(claim, context);

  if (!claim.is_weekend || !hasSurgicalProcedure || !providerStats || providerStats.weekendRate >= 0.05) {
    return [];
  }

  return [{
    rule: "weekend_anomaly",
    severity: RULE_SEVERITY.weekend_anomaly,
    evidence: `Weekend surgical claim from provider ${claim.provider_id}; historical weekend volume is ${(providerStats.weekendRate * 100).toFixed(1)}% (${providerStats.weekendClaims}/${providerStats.totalClaims})`
  }];
}

function historicalProviderStats(claim: Claim, context: RuleContext): { totalClaims: number; weekendClaims: number; weekendRate: number } | null {
  const claimTime = Date.parse(`${claim.claim_date}T00:00:00Z`);
  const previousClaims = context.claims.filter((candidate) =>
    candidate.provider_id === claim.provider_id &&
    candidate.claim_id !== claim.claim_id &&
    Date.parse(`${candidate.claim_date}T00:00:00Z`) < claimTime
  );

  if (previousClaims.length === 0) {
    return null;
  }

  const weekendClaims = previousClaims.filter((candidate) => candidate.is_weekend).length;
  return {
    totalClaims: previousClaims.length,
    weekendClaims,
    weekendRate: weekendClaims / previousClaims.length
  };
}
