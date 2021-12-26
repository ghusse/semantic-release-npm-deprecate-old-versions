import { SemVer } from "semver";
import { Action } from "./interfaces/rule.interface";

export interface DepreciationResultWithOptionalReason {
  version: SemVer;
  action: Action.deprecate;
  reason?: string;
}

export interface DepreciationResult
  extends DepreciationResultWithOptionalReason {
  reason: string;
}

export type RuleApplicationWithoutReason = {
  version: SemVer;
  action: Action.continue | Action.support;
};

export type RuleApplicationResultWithOptionalReason =
  | RuleApplicationWithoutReason
  | DepreciationResultWithOptionalReason;

export type RuleApplicationResult =
  | RuleApplicationWithoutReason
  | DepreciationResult;
