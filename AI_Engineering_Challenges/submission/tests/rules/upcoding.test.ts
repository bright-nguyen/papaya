import assert from "node:assert/strict";
import test from "node:test";
import { upcoding } from "../../src/rules/upcoding.js";
import { claim, context } from "../helpers.js";

test("upcoding flags amount more than two standard deviations over procedure mean", () => {
  const normalClaims = Array.from({ length: 8 }, (_, index) =>
    claim({ claim_id: `CLM-N-${index}`, member_id: `MBR-N-${index}`, procedure_codes: ["PROC-MRI"], submitted_amount: 3000 + index * 20 })
  );
  const outlier = claim({ claim_id: "CLM-HIGH", procedure_codes: ["PROC-MRI"], submitted_amount: 12000 });
  const flags = upcoding(outlier, context([...normalClaims, outlier]));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /standard deviations/);
});

test("upcoding does not flag when there is too little procedure history", () => {
  const claims = [
    claim({ claim_id: "CLM-1", procedure_codes: ["PROC-MRI"], submitted_amount: 3000 }),
    claim({ claim_id: "CLM-2", procedure_codes: ["PROC-MRI"], submitted_amount: 12000 })
  ];
  assert.equal(upcoding(claims[1], context(claims)).length, 0);
});

test("upcoding does not compare a multi-procedure total to individual procedure history", () => {
  const normalClaims = Array.from({ length: 8 }, (_, index) =>
    claim({ claim_id: `CLM-N-${index}`, member_id: `MBR-N-${index}`, procedure_codes: ["PROC-EKG"], submitted_amount: 650 + index * 10 })
  );
  const bundledClaim = claim({
    claim_id: "CLM-BUNDLE",
    procedure_codes: ["PROC-EKG", "PROC-ECHO", "PROC-STRESS"],
    submitted_amount: 4200
  });

  assert.equal(upcoding(bundledClaim, context([...normalClaims, bundledClaim])).length, 0);
});
