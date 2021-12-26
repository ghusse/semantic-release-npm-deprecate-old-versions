import {
  PluginConfig,
  SupportedDefaultRule,
} from "./interfaces/plugin-config.interface";
import { Rule, RuleWithAppliedOptions } from "./interfaces/rule.interface";
import { SupportLatestOptions } from "./rules/support-latest";
import { SupportPreReleaseOptions } from "./rules/support-prerelease-if-not-released";

export default class ConfigurationLoader {
  private readonly deprecateAll: Rule<void>;
  private readonly supportLatest: Rule<SupportLatestOptions>;
  private readonly supportPreReleaseIfNotReleased: Rule<
    SupportPreReleaseOptions
  >;

  constructor({
    deprecateAll,
    supportLatest,
    supportPreReleaseIfNotReleased,
  }: {
    deprecateAll: Rule<void>;
    supportLatest: Rule<SupportLatestOptions>;
    supportPreReleaseIfNotReleased: Rule<SupportPreReleaseOptions>;
  }) {
    this.deprecateAll = deprecateAll;
    this.supportLatest = supportLatest;
    this.supportPreReleaseIfNotReleased = supportPreReleaseIfNotReleased;
  }

  public generateRules(pluginConfig: PluginConfig): RuleWithAppliedOptions[] {
    if (!pluginConfig || !pluginConfig.rules) {
      return this.generateDefaultRules();
    }

    return pluginConfig.rules.map((ruleConfig, index) => {
      if (typeof ruleConfig === "function") {
        return ruleConfig as RuleWithAppliedOptions;
      }

      if (typeof ruleConfig === "string") {
        return this.generateRule(ruleConfig, undefined);
      }

      if (ruleConfig.rule && typeof ruleConfig.rule === "string") {
        return this.generateRule(ruleConfig.rule, ruleConfig.options);
      }

      throw new Error(`Unsupported rule configuration at index ${index}`);
    });
  }

  private generateRule(
    rule: SupportedDefaultRule,
    options: unknown
  ): RuleWithAppliedOptions {
    switch (rule) {
      case SupportedDefaultRule.deprecateAll:
        return this.deprecateAll.bind(undefined, undefined);
      case SupportedDefaultRule.supportLatest:
        return this.supportLatest.bind(
          undefined,
          options as SupportLatestOptions
        );
      case SupportedDefaultRule.supportPreReleaseIfNotReleased:
        return this.supportPreReleaseIfNotReleased.bind(
          undefined,
          options as SupportPreReleaseOptions
        );

      default:
        throw new Error(`Unsupported rule ${rule}`);
    }
  }

  private generateDefaultRules(): RuleWithAppliedOptions[] {
    return [
      this.supportLatest.bind(undefined, undefined),
      this.supportPreReleaseIfNotReleased.bind(undefined, undefined),
      this.deprecateAll.bind(undefined, undefined),
    ];
  }
}
