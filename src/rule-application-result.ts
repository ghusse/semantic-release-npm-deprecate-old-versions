import { Action } from "./rule";

export interface RuleApplicationResult {
  version: string;
  action: Action;
}
