import { SemVer } from "semver";
import { Action, Rule, RuleResult } from "../rule";

export const supportLatest: Rule = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
): RuleResult => {
  if (version === allVersionsSortedLatestFirst[0]) {
    return { action: Action.support };
  }

  return { action: Action.continue };
};
