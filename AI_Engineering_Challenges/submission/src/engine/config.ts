export const RULE_SEVERITY = {
  duplicate_claim: 5,
  rapid_resubmission: 3,
  upcoding: 5,
  unbundling: 4,
  phantom_billing: 5,
  weekend_anomaly: 3,
  diagnosis_procedure_mismatch: 4,
  amount_clustering: 2
} as const;

export const AUTO_APPROVAL_THRESHOLD = 50_000;
export const AMOUNT_CLUSTERING_MIN = 47_500;
export const AMOUNT_CLUSTERING_MAX = 49_999;
export const SCORE_THRESHOLD = 1;

export const BUNDLE_MAP: Record<string, string[]> = {
  "BNDL-KNEE": ["PROC-KNEE-EXAM", "PROC-KNEE-XRAY", "PROC-KNEE-INJECTION"],
  "BNDL-CARDIAC": ["PROC-EKG", "PROC-ECHO", "PROC-STRESS"],
  "BNDL-DENTAL": ["PROC-DENTAL-XRAY", "PROC-CLEANING", "PROC-FILLING"],
  "BNDL-MATERNITY": ["PROC-ULTRASOUND", "PROC-LAB-PANEL", "PROC-OB-VISIT"],
  "BNDL-DIABETES": ["PROC-A1C", "PROC-METABOLIC", "PROC-URINE"]
};

export const DIAGNOSIS_PROCEDURE_MAP: Record<string, string[]> = {
  "I10": ["PROC-BP-CHECK", "PROC-METABOLIC", "PROC-EKG"],
  "E11": ["PROC-A1C", "PROC-METABOLIC", "PROC-URINE"],
  "M17": ["PROC-KNEE-EXAM", "PROC-KNEE-XRAY", "PROC-KNEE-INJECTION", "PROC-KNEE-SURGERY"],
  "K02": ["PROC-DENTAL-XRAY", "PROC-CLEANING", "PROC-FILLING"],
  "J20": ["PROC-CHEST-XRAY", "PROC-RESP-PANEL", "PROC-OFFICE-VISIT"],
  "S52": ["PROC-ARM-XRAY", "PROC-CAST", "PROC-ORTHO-VISIT"],
  "O80": ["PROC-ULTRASOUND", "PROC-LAB-PANEL", "PROC-OB-VISIT"],
  "R07": ["PROC-EKG", "PROC-ECHO", "PROC-STRESS"],
  "N39": ["PROC-URINE", "PROC-CULTURE", "PROC-OFFICE-VISIT"],
  "Z00": ["PROC-OFFICE-VISIT", "PROC-LAB-PANEL", "PROC-BP-CHECK"]
};

export const SURGICAL_PROCEDURES = new Set([
  "PROC-KNEE-SURGERY",
  "PROC-APPENDECTOMY",
  "PROC-CARDIAC-CATH"
]);

export const MAX_SEVERITY_SUM = Object.values(RULE_SEVERITY).reduce((sum, value) => sum + value, 0);
