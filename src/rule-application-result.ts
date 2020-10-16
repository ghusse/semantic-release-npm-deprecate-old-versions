import { SemVer } from "semver";
import { Action } from "./rule";

export interface DepreciationResult {
  version: SemVer;
  action: Action.deprecate;
  reason: string;
}

export type RuleApplicationResult =
  | {
      version: SemVer;
      action: Action.continue | Action.keep;
    }
  | DepreciationResult;
