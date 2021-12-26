import { NpmConfig } from "./interfaces/npm.interface";
import { RuleWithAppliedOptions } from "./interfaces/rule.interface";

export class DeprecierState {
  public rules: RuleWithAppliedOptions[] = [];
  public npmConfig: NpmConfig | undefined;
}
