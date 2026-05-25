import assert from "node:assert/strict";
import test from "node:test";
import { unbundling } from "../../src/rules/unbundling.js";
import { claim } from "../helpers.js";

test("unbundling flags all components of a known bundle billed separately", () => {
  const flags = unbundling(claim({ procedure_codes: ["PROC-EKG", "PROC-ECHO", "PROC-STRESS"] }));
  assert.equal(flags.length, 1);
  assert.match(flags[0].evidence, /BNDL-CARDIAC/);
});

test("unbundling ignores partial bundle components", () => {
  const flags = unbundling(claim({ procedure_codes: ["PROC-EKG", "PROC-ECHO"] }));
  assert.equal(flags.length, 0);
});
