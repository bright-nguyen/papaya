import type { ClaimType } from "../engine/types.js";

export type ProcedureDefinition = {
  code: string;
  baseAmount: number;
};

export const PROVIDERS = Array.from({ length: 50 }, (_, index) => ({
  provider_id: `PRV-${String(index + 1).padStart(3, "0")}`,
  provider_name: `${["North", "East", "West", "South", "Central"][index % 5]} ${["Clinic", "Hospital", "Medical Group", "Care Center", "Health Partners"][index % 5]} ${index + 1}`
}));

export const MEMBERS = Array.from({ length: 500 }, (_, index) => `MBR-${String(index + 1).padStart(4, "0")}`);

export const DIAGNOSIS_CODES = ["I10", "E11", "M17", "K02", "J20", "S52", "O80", "R07", "N39", "Z00"];

export const PROCEDURE_DEFINITIONS: ProcedureDefinition[] = [
  { code: "PROC-BP-CHECK", baseAmount: 180 },
  { code: "PROC-METABOLIC", baseAmount: 420 },
  { code: "PROC-EKG", baseAmount: 650 },
  { code: "PROC-A1C", baseAmount: 140 },
  { code: "PROC-URINE", baseAmount: 110 },
  { code: "PROC-KNEE-EXAM", baseAmount: 550 },
  { code: "PROC-KNEE-XRAY", baseAmount: 900 },
  { code: "PROC-KNEE-INJECTION", baseAmount: 1200 },
  { code: "PROC-KNEE-SURGERY", baseAmount: 21000 },
  { code: "PROC-DENTAL-XRAY", baseAmount: 220 },
  { code: "PROC-CLEANING", baseAmount: 160 },
  { code: "PROC-FILLING", baseAmount: 480 },
  { code: "PROC-CHEST-XRAY", baseAmount: 760 },
  { code: "PROC-RESP-PANEL", baseAmount: 300 },
  { code: "PROC-OFFICE-VISIT", baseAmount: 210 },
  { code: "PROC-ARM-XRAY", baseAmount: 820 },
  { code: "PROC-CAST", baseAmount: 950 },
  { code: "PROC-ORTHO-VISIT", baseAmount: 380 },
  { code: "PROC-ULTRASOUND", baseAmount: 900 },
  { code: "PROC-LAB-PANEL", baseAmount: 360 },
  { code: "PROC-OB-VISIT", baseAmount: 340 },
  { code: "PROC-ECHO", baseAmount: 1500 },
  { code: "PROC-STRESS", baseAmount: 1700 },
  { code: "PROC-CULTURE", baseAmount: 180 },
  { code: "PROC-MRI", baseAmount: 3200 },
  { code: "PROC-APPENDECTOMY", baseAmount: 18500 },
  { code: "PROC-CARDIAC-CATH", baseAmount: 24000 }
];

export const PROCEDURE_BY_CODE = new Map(PROCEDURE_DEFINITIONS.map((item) => [item.code, item]));

export const DIAGNOSIS_TO_PROCEDURES: Record<string, string[]> = {
  I10: ["PROC-BP-CHECK", "PROC-METABOLIC", "PROC-EKG"],
  E11: ["PROC-A1C", "PROC-METABOLIC", "PROC-URINE"],
  M17: ["PROC-KNEE-EXAM", "PROC-KNEE-XRAY", "PROC-KNEE-INJECTION"],
  K02: ["PROC-DENTAL-XRAY", "PROC-CLEANING", "PROC-FILLING"],
  J20: ["PROC-CHEST-XRAY", "PROC-RESP-PANEL", "PROC-OFFICE-VISIT"],
  S52: ["PROC-ARM-XRAY", "PROC-CAST", "PROC-ORTHO-VISIT"],
  O80: ["PROC-ULTRASOUND", "PROC-LAB-PANEL", "PROC-OB-VISIT"],
  R07: ["PROC-EKG", "PROC-ECHO", "PROC-STRESS"],
  N39: ["PROC-URINE", "PROC-CULTURE", "PROC-OFFICE-VISIT"],
  Z00: ["PROC-OFFICE-VISIT", "PROC-LAB-PANEL", "PROC-BP-CHECK"]
};

export const CLAIM_TYPES: ClaimType[] = ["OUTPATIENT", "INPATIENT", "DENTAL"];
