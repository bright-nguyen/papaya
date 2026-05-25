export type ClaimType = "OUTPATIENT" | "INPATIENT" | "DENTAL";

export type Claim = {
  claim_id: string;
  member_id: string;
  provider_id: string;
  provider_name: string;
  claim_date: string;
  claim_type: ClaimType;
  diagnosis_code: string;
  procedure_codes: string[];
  submitted_amount: number;
  is_weekend: boolean;
  is_fraud: boolean;
  fraud_labels: string[];
};

export type RuleFlag = {
  rule: string;
  severity: number;
  evidence: string;
};

export type ScoredClaim = Claim & {
  risk_score: number;
  flags: RuleFlag[];
};

export type ProcedureStats = {
  mean: number;
  stdDev: number;
  count: number;
};

export type ProcedureAmount = {
  claimId: string;
  amount: number;
};

export type ProviderStats = {
  totalClaims: number;
  weekendClaims: number;
  weekendRate: number;
};

export type RuleContext = {
  claims: Claim[];
  procedureStats: Map<string, ProcedureStats>;
  procedureAmounts: Map<string, ProcedureAmount[]>;
  providerDailyCounts: Map<string, number>;
  providerStats: Map<string, ProviderStats>;
};

export type MetricsReport = {
  threshold: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  precision: number;
  recall: number;
  false_positive_rate: number;
  total_claims: number;
  fraud_claims: number;
  flagged_claims: number;
  processing_time_ms: number;
};
