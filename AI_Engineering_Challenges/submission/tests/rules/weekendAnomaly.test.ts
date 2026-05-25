import assert from "node:assert/strict";
import test from "node:test";
import { weekendAnomaly } from "../../src/rules/weekendAnomaly.js";
import { claim, context } from "../helpers.js";

test("weekend anomaly flags weekend surgery from low-weekend provider", () => {
  const history = Array.from({ length: 60 }, (_, index) =>
    claim({ claim_id: `CLM-H-${index}`, member_id: `MBR-H-${index}`, provider_id: "PRV-S", claim_date: "2024-04-01", is_weekend: false })
  );
  const surgery = claim({
    claim_id: "CLM-S",
    provider_id: "PRV-S",
    claim_date: "2024-04-06",
    is_weekend: true,
    procedure_codes: ["PROC-KNEE-SURGERY"]
  });
  assert.equal(weekendAnomaly(surgery, context([...history, surgery])).length, 1);
});

test("weekend anomaly ignores non-surgical weekend claims", () => {
  const weekendClaim = claim({ claim_id: "CLM-W", is_weekend: true, claim_date: "2024-04-06" });
  assert.equal(weekendAnomaly(weekendClaim, context([weekendClaim])).length, 0);
});
