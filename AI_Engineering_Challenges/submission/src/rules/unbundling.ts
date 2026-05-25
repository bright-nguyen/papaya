import { BUNDLE_MAP, RULE_SEVERITY } from "../engine/config.js";
import type { Claim, RuleFlag } from "../engine/types.js";

export function unbundling(claim: Claim): RuleFlag[] {
  const procedureSet = new Set(claim.procedure_codes);

  for (const [bundleCode, componentCodes] of Object.entries(BUNDLE_MAP)) {
    const matchedComponents = componentCodes.filter((code) => procedureSet.has(code));
    if (matchedComponents.length === componentCodes.length && !procedureSet.has(bundleCode)) {
      return [{
        rule: "unbundling",
        severity: RULE_SEVERITY.unbundling,
        evidence: `Procedures ${matchedComponents.join(", ")} match bundled service ${bundleCode} but were billed separately`
      }];
    }
  }

  return [];
}
