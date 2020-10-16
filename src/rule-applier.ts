import { RuleApplicationResult } from "./rule-application-result";
import semverRSort from "semver/functions/rsort";
import { Action, Rule } from "./rule";

export class RuleApplier {
  applyRules(versions: string[], rules: Rule[]): RuleApplicationResult[] {
    const sortedVersions = semverRSort(versions);

    return sortedVersions.map((version) =>
      rules.reduce(
        (
          accumulator: RuleApplicationResult,
          rule: Rule
        ): RuleApplicationResult =>
          accumulator.action === Action.continue
            ? { action: rule(version, sortedVersions), version }
            : accumulator,
        { action: Action.continue, version }
      )
    );
  }
}
