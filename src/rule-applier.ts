import { RuleApplicationResult } from "./rule-application-result";
import semverRSort from "semver/functions/rsort";
import { Action, Rule } from "./rule";
import { SemVer } from "semver";

export class RuleApplier {
  applyRules(versions: SemVer[], rules: Rule[]): RuleApplicationResult[] {
    const sortedVersions = semverRSort(versions);

    return sortedVersions.map((version) =>
      rules.reduce(
        (
          accumulator: RuleApplicationResult,
          rule: Rule
        ): RuleApplicationResult => {
          if (accumulator.action === Action.continue) {
            return {
              version,
              ...rule(version, sortedVersions),
            };
          }

          return accumulator;
        },
        { action: Action.continue, version }
      )
    );
  }
}
