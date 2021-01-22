import { RuleWithAppliedOptions } from "./rule";

export enum SupportedDefaultRule {
  deprecateAll = "deprecateAll",
  supportLatest = "supportLatest",
  supportPreReleaseIfNotReleased = "supportPrereleaseIfNotReleased",
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
