import { SemVer } from "semver";
import { Action } from "./rule";

export interface DepreciationResultWithOptionalReason {
  version: SemVer;
  action: Action.deprecate;
  reason?: string;
}

export interface DepreciationResult
  extends DepreciationResultWithOptionalReason {
  reason: string;
}

export type RuleApplicationResultWithOptionalReason =
  | {
      version: SemVer;
      action: Action.continue | Action.support;
    }
  | DepreciationResultWithOptionalReason;

export type RuleApplicationResult =
  | {
      version: SemVer;
      action: Action.continue | Action.support;
    }
  | DepreciationResult;
