import { SemVer } from "semver";
import { Action, Rule, RuleResult } from "../rule";

export const keepLatest: Rule = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
): RuleResult => {
  if (version === allVersionsSortedLatestFirst[0]) {
    return { action: Action.keep };
  }

  return { action: Action.continue };
};
