import { SemVer } from "semver";

export enum Action {
  deprecate = "deprecate",
  keep = "keep",
  continue = "continue",
}

export type RuleResult =
  | { action: Action.continue }
  | { action: Action.keep }
  | {
      action: Action.deprecate;
      reason: string;
    };

export type Rule = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
) => RuleResult;
