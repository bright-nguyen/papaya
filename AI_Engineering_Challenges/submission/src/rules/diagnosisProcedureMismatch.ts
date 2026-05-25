import { DIAGNOSIS_PROCEDURE_MAP, RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleFlag } from "../engine/types.js";

export function diagnosisProcedureMismatch(claim: Claim): RuleFlag[] {
  const validProcedures = DIAGNOSIS_PROCEDURE_MAP[claim.diagnosis_code];
  if (!validProcedures) {
    return [{
      rule: "diagnosis_procedure_mismatch",
      severity: RULE_SEVERITY.diagnosis_procedure_mismatch,
      evidence: `Diagnosis ${claim.diagnosis_code} is not present in the clinical compatibility mapping`
    }];
  }

  const invalidProcedures = claim.procedure_codes.filter((code) => !validProcedures.includes(code));
  if (invalidProcedures.length === 0) {
    return [];
  }

  return [{
    rule: "diagnosis_procedure_mismatch",
    severity: RULE_SEVERITY.diagnosis_procedure_mismatch,
    evidence: `Procedure(s) ${invalidProcedures.join(", ")} are not clinically associated with diagnosis ${claim.diagnosis_code}`
  }];
}
