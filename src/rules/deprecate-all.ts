import { Action, Rule, RuleResult } from "../interfaces/rule.interface";

export const deprecateAll: Rule<void> = (): RuleResult => {
  return { action: Action.deprecate };
};
