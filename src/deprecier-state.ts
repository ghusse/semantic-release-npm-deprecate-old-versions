import { PackageInfo } from "./interfaces/package-info.interface";
import { RuleWithAppliedOptions } from "./interfaces/rule.interface";

export class DeprecierState {
  public rules: RuleWithAppliedOptions[] = [];
  public packageInfo: PackageInfo | undefined = undefined;
  public npmConfig: NpmConfig | undefined;
}
