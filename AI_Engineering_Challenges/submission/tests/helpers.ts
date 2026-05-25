import type { Claim, RuleContext } from "../src/engine/types.js";
import { buildRuleContext } from "../src/engine/scoreClaims.js";

export function claim(overrides: Partial<Claim> = {}): Claim {
  const base: Claim = {
    claim_id: "CLM-TEST",
    member_id: "MBR-0001",
    provider_id: "PRV-001",
    provider_name: "Test Clinic",
    claim_date: "2024-01-03",
    claim_type: "OUTPATIENT",
    diagnosis_code: "I10",
    procedure_codes: ["PROC-BP-CHECK"],
    submitted_amount: 180,
    is_weekend: false,
    is_fraud: false,
    fraud_labels: []
  };
  return { ...base, ...overrides };
}

export function context(claims: Claim[]): RuleContext {
  return buildRuleContext(claims);
}
