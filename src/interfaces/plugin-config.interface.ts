import { RuleWithAppliedOptions } from "./rule.interface";

export enum SupportedDefaultRule {
  deprecateAll = "deprecateAll",
  supportLatest = "supportLatest",
  supportPreReleaseIfNotReleased = "supportPreReleaseIfNotReleased",
}

export interface RuleConfigWithOptions {
  rule: SupportedDefaultRule;
  options?: any;
}

export type RuleConfig =
  | SupportedDefaultRule
  | RuleConfigWithOptions
  | RuleWithAppliedOptions;

export interface PluginConfig {
  debug?: boolean;
  rules?: RuleConfig[];
}
