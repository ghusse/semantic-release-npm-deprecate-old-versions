import semverPrerelease from "semver/functions/prerelease";
import { Action, Rule } from "../rule";

export const deprecateOldPrereleases: Rule = (
  version: string,
  allVersionsSortedLatestFirst: string[]
): Action => {
  const preReleaseTags = semverPrerelease(version);

  if (!preReleaseTags) {
    return Action.continue;
  }

  for (const oneVersion of allVersionsSortedLatestFirst) {
    if (oneVersion === version) {
      return Action.continue;
    }

    if (semverPrerelease(oneVersion)) {
      return Action.deprecate;
    }
  }

  return Action.continue;
};
