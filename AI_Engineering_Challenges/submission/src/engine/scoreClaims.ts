import { MAX_SEVERITY_SUM } from "./config.js";
import type { Claim, ProcedureAmount, ProcedureStats, ProviderStats, RuleContext, RuleFlag, ScoredClaim } from "./types.js";
import { amountClustering } from "../rules/amountClustering.js";
import { diagnosisProcedureMismatch } from "../rules/diagnosisProcedureMismatch.js";
import { duplicateClaim } from "../rules/duplicateClaim.js";
import { phantomBilling } from "../rules/phantomBilling.js";
import { rapidResubmission } from "../rules/rapidResubmission.js";
import { unbundling } from "../rules/unbundling.js";
import { upcoding } from "../rules/upcoding.js";
import { weekendAnomaly } from "../rules/weekendAnomaly.js";

export function buildRuleContext(claims: Claim[]): RuleContext {
  const procedureAmounts = buildProcedureAmounts(claims);
  return {
    claims,
    procedureStats: buildProcedureStats(procedureAmounts),
    procedureAmounts,
    providerDailyCounts: buildProviderDailyCounts(claims),
    providerStats: buildProviderStats(claims)
  };
}

function buildProcedureAmounts(claims: Claim[]): Map<string, ProcedureAmount[]> {
  const amountsByProcedure = new Map<string, ProcedureAmount[]>();
  for (const claim of claims) {
    for (const procedure of claim.procedure_codes) {
      const amounts = amountsByProcedure.get(procedure) ?? [];
      amounts.push({ claimId: claim.claim_id, amount: claim.submitted_amount });
      amountsByProcedure.set(procedure, amounts);
    }
  }
  return amountsByProcedure;
}

function buildProcedureStats(amountsByProcedure: Map<string, ProcedureAmount[]>): Map<string, ProcedureStats> {
  const stats = new Map<string, ProcedureStats>();
  for (const [procedure, entries] of amountsByProcedure.entries()) {
    const values = entries.map((entry) => entry.amount);
    const mean = values.reduce((sum, amount) => sum + amount, 0) / values.length;
    const variance = values.reduce((sum, amount) => sum + (amount - mean) ** 2, 0) / values.length;
    stats.set(procedure, {
      mean,
      stdDev: Math.sqrt(variance),
      count: values.length
    });
  }
  return stats;
}

function buildProviderDailyCounts(claims: Claim[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const claim of claims) {
    const key = `${claim.provider_id}|${claim.claim_date}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function buildProviderStats(claims: Claim[]): Map<string, ProviderStats> {
  const stats = new Map<string, ProviderStats>();
  for (const claim of claims) {
    const current = stats.get(claim.provider_id) ?? { totalClaims: 0, weekendClaims: 0, weekendRate: 0 };
    current.totalClaims += 1;
    current.weekendClaims += claim.is_weekend ? 1 : 0;
    current.weekendRate = current.weekendClaims / current.totalClaims;
    stats.set(claim.provider_id, current);
  }
  return stats;
}

export function evaluateClaim(claim: Claim, context: RuleContext): RuleFlag[] {
  return [
    ...duplicateClaim(claim, context),
    ...rapidResubmission(claim, context),
    ...upcoding(claim, context),
    ...unbundling(claim),
    ...phantomBilling(claim, context),
    ...weekendAnomaly(claim, context),
    ...diagnosisProcedureMismatch(claim),
    ...amountClustering(claim)
  ];
}

export function scoreFromFlags(flags: RuleFlag[]): number {
  const severitySum = flags.reduce((sum, flag) => sum + flag.severity, 0);
  return Math.min(100, Math.round((severitySum / MAX_SEVERITY_SUM) * 100));
}

export function scoreClaims(claims: Claim[]): ScoredClaim[] {
  const context = buildRuleContext(claims);
  return claims
    .map((claim) => {
      const flags = evaluateClaim(claim, context);
      return {
        ...claim,
        risk_score: scoreFromFlags(flags),
        flags
      };
    })
    .sort((left, right) => right.risk_score - left.risk_score || left.claim_id.localeCompare(right.claim_id));
}
