import assert from "node:assert/strict";
import test from "node:test";
import { diagnosisProcedureMismatch } from "../../src/rules/diagnosisProcedureMismatch.js";
import { claim } from "../helpers.js";

test("diagnosis procedure mismatch flags incompatible procedure", () => {
  const flags = diagnosisProcedureMismatch(claim({ diagnosis_code: "K02", procedure_codes: ["PROC-CARDIAC-CATH"] }));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /not clinically associated/);
});

test("diagnosis procedure mismatch accepts mapped procedure", () => {
  const flags = diagnosisProcedureMismatch(claim({ diagnosis_code: "K02", procedure_codes: ["PROC-FILLING"] }));
  assert.equal(flags.length, 0);
});
