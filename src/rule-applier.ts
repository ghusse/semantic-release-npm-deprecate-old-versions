import {
  RuleApplicationResult,
  RuleApplicationResultWithOptionalReason,
} from "./rule-application-result";
import semverRSort from "semver/functions/rsort";
import {
  Action,
  RuleResult,
  RuleWithAppliedOptions,
} from "./interfaces/rule.interface";
import { SemVer } from "semver";
import VersionForMessageFinder from "./version-for-message-finder";

export class RuleApplier {
  constructor(
    private readonly versionForMessageFinder: VersionForMessageFinder
  ) {}

  applyRules(
    versions: SemVer[],
    rules: RuleWithAppliedOptions[]
  ): RuleApplicationResult[] {
    const sortedVersions = semverRSort(versions);

    const results: RuleApplicationResultWithOptionalReason[] = sortedVersions.map(
      (version) =>
        rules.reduce(
          (
            accumulator: RuleApplicationResultWithOptionalReason,
            rule: RuleWithAppliedOptions
          ): RuleApplicationResultWithOptionalReason => {
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

    return results.map((result) =>
      this.enforceAReason(results, result)
    ) as RuleApplicationResult[];
  }

  private enforceAReason(
    results: RuleApplicationResultWithOptionalReason[],
    result: RuleApplicationResultWithOptionalReason
  ): RuleResult {
    if (result.action !== Action.deprecate || result.reason) {
      return result;
    }

    const bestVersion = this.versionForMessageFinder.findBest(
      results,
      result.version
    );

    if (bestVersion) {
      return {
        ...result,
        reason: `Deprecated in favor of ${bestVersion.format()}`,
      };
    }

    return {
      ...result,
      reason: `Deprecated, with no replacement version`,
    };
  }
}
