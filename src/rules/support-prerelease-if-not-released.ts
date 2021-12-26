import { SemVer } from "semver";
import { Action, Rule, RuleResult } from "../interfaces/rule.interface";

const DEFAULT_OPTIONS: SupportPreReleaseOptions = {
  numberOfPreReleases: 1,
};
export interface SupportPreReleaseOptions {
  numberOfPreReleases?: number | "all";
}

export const supportPreReleaseIfNotReleased: Rule<SupportPreReleaseOptions> = (
  options: SupportPreReleaseOptions | undefined,
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
): RuleResult => {
  const realOptions = {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  };

  if (!version.prerelease.length) {
    return { action: Action.continue };
  }

  let supportedPreReleases = 0;

  for (const currentVersion of allVersionsSortedLatestFirst) {
    if (
      currentVersion.major === version.major &&
      currentVersion.minor === version.minor &&
      currentVersion.patch === version.patch
    ) {
      if (currentVersion.prerelease.length) {
        supportedPreReleases += 1;
      } else {
        return { action: Action.continue };
      }
    }

    if (
      realOptions.numberOfPreReleases !== "all" &&
      supportedPreReleases > (realOptions.numberOfPreReleases || 1)
    ) {
      return { action: Action.continue };
    }

    if (currentVersion.compare(version) === 0) {
      break;
    }
  }

  return { action: Action.support };
};
