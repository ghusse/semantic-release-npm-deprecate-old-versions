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
      reason?: string;
    };

export type Rule<TOptions> = (
  ruleOptions: TOptions | undefined,
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
) => RuleResult;

export type RuleWithAppliedOptions = (
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
) => RuleResult;
