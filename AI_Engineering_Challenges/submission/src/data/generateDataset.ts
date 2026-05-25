import { BUNDLE_MAP } from "../engine/config.js";
import type { Claim, ClaimType } from "../engine/types.js";
import { CLAIM_TYPES, DIAGNOSIS_CODES, DIAGNOSIS_TO_PROCEDURES, MEMBERS, PROCEDURE_BY_CODE, PROVIDERS } from "./seedData.js";

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: T[]): T {
    return items[this.int(0, items.length - 1)];
  }
}

function isWeekend(date: string): boolean {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}

function dateFromDay(dayOfYear: number): string {
  const date = new Date(Date.UTC(2024, 0, dayOfYear));
  return date.toISOString().slice(0, 10);
}

function weekdayDate(dayOfYear: number): string {
  let date = dateFromDay(dayOfYear);
  while (isWeekend(date)) {
    dayOfYear += 1;
    date = dateFromDay(dayOfYear);
  }
  return date;
}

function weekendDate(dayOfYear: number): string {
  let date = dateFromDay(dayOfYear);
  while (!isWeekend(date)) {
    dayOfYear += 1;
    date = dateFromDay(dayOfYear);
  }
  return date;
}

function amountFor(codes: string[], multiplier = 1): number {
  const base = codes.reduce((sum, code) => sum + (PROCEDURE_BY_CODE.get(code)?.baseAmount ?? 500), 0);
  return Math.round(base * multiplier);
}

function makeClaim(input: {
  id: number;
  memberId: string;
  providerIndex: number;
  date: string;
  claimType: ClaimType;
  diagnosis: string;
  procedures: string[];
  amount: number;
  labels?: string[];
}): Claim {
  const provider = PROVIDERS[input.providerIndex % PROVIDERS.length];
  const labels = input.labels ?? [];
  return {
    claim_id: `CLM-${String(input.id).padStart(5, "0")}`,
    member_id: input.memberId,
    provider_id: provider.provider_id,
    provider_name: provider.provider_name,
    claim_date: input.date,
    claim_type: input.claimType,
    diagnosis_code: input.diagnosis,
    procedure_codes: input.procedures,
    submitted_amount: input.amount,
    is_weekend: isWeekend(input.date),
    is_fraud: labels.length > 0,
    fraud_labels: labels
  };
}

function normalClaim(id: number, random: SeededRandom): Claim {
  const diagnosis = random.pick(DIAGNOSIS_CODES);
  const procedures = [random.pick(DIAGNOSIS_TO_PROCEDURES[diagnosis])];
  const multiplier = 0.88 + random.next() * 0.24;
  return makeClaim({
    id,
    memberId: random.pick(MEMBERS),
    providerIndex: random.int(0, 44),
    date: weekdayDate(random.int(1, 350)),
    claimType: diagnosis === "K02" ? "DENTAL" : random.pick(CLAIM_TYPES),
    diagnosis,
    procedures,
    amount: amountFor(procedures, multiplier)
  });
}

export function generateDataset(): Claim[] {
  const random = new SeededRandom(202410);
  const claims: Claim[] = [];
  let id = 1;

  while (claims.length < 1394) {
    claims.push(normalClaim(id++, random));
  }

  for (let index = 0; index < 400; index += 1) {
    const diagnosis = random.pick(["I10", "E11", "Z00"]);
    const procedures = [random.pick(DIAGNOSIS_TO_PROCEDURES[diagnosis])];
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[index % MEMBERS.length],
      providerIndex: 47,
      date: weekdayDate(1 + (index % 340)),
      claimType: "OUTPATIENT",
      diagnosis,
      procedures,
      amount: amountFor(procedures, 0.95 + random.next() * 0.1)
    }));
  }

  for (let group = 0; group < 15; group += 1) {
    const date = weekdayDate(20 + group * 3);
    const memberId = MEMBERS[100 + group];
    for (let copy = 0; copy < 2; copy += 1) {
      claims.push(makeClaim({
        id: id++,
        memberId,
        providerIndex: 45,
        date,
        claimType: "OUTPATIENT",
        diagnosis: "E11",
        procedures: ["PROC-A1C"],
        amount: 140,
        labels: ["duplicate_claim"]
      }));
    }
  }

  for (let group = 0; group < 15; group += 1) {
    const memberId = MEMBERS[140 + group];
    const firstDay = 90 + group * 5;
    for (let copy = 0; copy < 2; copy += 1) {
      claims.push(makeClaim({
        id: id++,
        memberId,
        providerIndex: 10 + (group % 5),
        date: weekdayDate(firstDay + copy * 3),
        claimType: "OUTPATIENT",
        diagnosis: "I10",
        procedures: ["PROC-BP-CHECK"],
        amount: 190,
        labels: ["rapid_resubmission"]
      }));
    }
  }

  const upcodingPairs = [
    { diagnosis: "I10", procedure: "PROC-EKG" },
    { diagnosis: "E11", procedure: "PROC-A1C" },
    { diagnosis: "M17", procedure: "PROC-KNEE-XRAY" },
    { diagnosis: "K02", procedure: "PROC-FILLING" },
    { diagnosis: "J20", procedure: "PROC-CHEST-XRAY" },
    { diagnosis: "S52", procedure: "PROC-ARM-XRAY" },
    { diagnosis: "O80", procedure: "PROC-ULTRASOUND" },
    { diagnosis: "R07", procedure: "PROC-ECHO" },
    { diagnosis: "N39", procedure: "PROC-CULTURE" },
    { diagnosis: "Z00", procedure: "PROC-LAB-PANEL" }
  ];
  for (let index = 0; index < 30; index += 1) {
    const pair = upcodingPairs[index % upcodingPairs.length];
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[180 + index],
      providerIndex: 20 + (index % 5),
      date: weekdayDate(150 + index),
      claimType: "OUTPATIENT",
      diagnosis: pair.diagnosis,
      procedures: [pair.procedure],
      amount: 85_000,
      labels: ["upcoding"]
    }));
  }

  const bundleEntries = Object.values(BUNDLE_MAP);
  for (let index = 0; index < 25; index += 1) {
    const procedures = bundleEntries[index % bundleEntries.length];
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[220 + index],
      providerIndex: 25 + (index % 5),
      date: weekdayDate(210 + index),
      claimType: procedures.includes("PROC-DENTAL-XRAY") ? "DENTAL" : "OUTPATIENT",
      diagnosis: ["M17", "R07", "K02", "O80", "E11"][index % 5],
      procedures,
      amount: amountFor(procedures, 1.05),
      labels: ["unbundling"]
    }));
  }

  const phantomDate = "2024-09-17";
  for (let index = 0; index < 31; index += 1) {
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[260 + index],
      providerIndex: 49,
      date: phantomDate,
      claimType: "OUTPATIENT",
      diagnosis: "Z00",
      procedures: ["PROC-OFFICE-VISIT"],
      amount: 210,
      labels: index < 25 ? ["phantom_billing"] : []
    }));
  }

  for (let index = 0; index < 20; index += 1) {
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[310 + index],
      providerIndex: 47,
      date: weekendDate(250 + index),
      claimType: "INPATIENT",
      diagnosis: "M17",
      procedures: ["PROC-KNEE-SURGERY"],
      amount: 22_000,
      labels: ["weekend_anomaly"]
    }));
  }

  for (let index = 0; index < 20; index += 1) {
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[340 + index],
      providerIndex: 30 + (index % 5),
      date: weekdayDate(280 + index),
      claimType: "OUTPATIENT",
      diagnosis: "K02",
      procedures: ["PROC-CARDIAC-CATH"],
      amount: 24_000,
      labels: ["diagnosis_procedure_mismatch"]
    }));
  }

  for (let index = 0; index < 20; index += 1) {
    claims.push(makeClaim({
      id: id++,
      memberId: MEMBERS[370 + index],
      providerIndex: 35 + (index % 5),
      date: weekdayDate(310 + index),
      claimType: "INPATIENT",
      diagnosis: "R07",
      procedures: ["PROC-ECHO"],
      amount: 48_500 + (index % 10) * 100,
      labels: ["amount_clustering"]
    }));
  }

  return claims;
}
