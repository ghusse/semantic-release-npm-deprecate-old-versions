import { SemVer } from "semver";

export enum Action {
  deprecate = "deprecate",
  support = "support",
  continue = "continue",
}

export type RuleResult =
  | { action: Action.continue }
  | { action: Action.support }
  | {
      action: Action.deprecate;
      reason: string;
    };

export type Rule = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
) => RuleResult;
