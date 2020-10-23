import { Action, Rule, RuleResult } from "../rule";

export const deprecateAll: Rule<void> = (): RuleResult => {
  return { action: Action.deprecate };
};
