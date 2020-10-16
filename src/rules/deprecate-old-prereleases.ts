import semverPrerelease from "semver/functions/prerelease";
import SemVer from "semver/classes/semver";
import { Action, Rule, RuleResult } from "../rule";

export const deprecateOldPrereleases: Rule = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
): RuleResult => {
  const preReleaseTags = semverPrerelease(version);

  if (!preReleaseTags) {
    return { action: Action.continue };
  }

  for (const oneVersion of allVersionsSortedLatestFirst) {
    if (oneVersion.compare(version) === 0) {
      return { action: Action.continue };
    }

    if (
      oneVersion.major === version.major &&
      oneVersion.minor === version.minor &&
      oneVersion.patch === version.patch
    ) {
      return {
        action: Action.deprecate,
        reason: `Deprecated in favor of ${oneVersion}`,
      };
    }
  }

  return { action: Action.continue };
};
