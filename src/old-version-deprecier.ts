import { Config, Context } from "semantic-release";
import { PluginConfig } from "./plugin-config";
import { PackageInfoRetriever } from "./package-info-retriever";
import { deprecateOldPrereleases } from "./rules/deprecate-old-prereleases";
import { Action, Rule } from "./rule";
import { keepLatest } from "./rules/keep-latest";
import { RuleApplier } from "./rule-applier";
import { SemVer } from "semver";
import { Deprecier } from "./deprecier";
import { DepreciationResult } from "./rule-application-result";

interface Plugin {
  verifyConditions(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void>;
  analyzeCommits(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void>;
  prepare(pluginConfig: PluginConfig, context: Context & Config): Promise<void>;
  publish(pluginConfig: PluginConfig, context: Context & Config): Promise<void>;
}

export function createOldVersionDeprecier({
  packageInfoRetriever,
  ruleApplier,
  deprecier,
}: {
  packageInfoRetriever: PackageInfoRetriever;
  ruleApplier: RuleApplier;
  deprecier: Deprecier;
}): Plugin {
  let rules: Rule[] = [];
  async function verifyConditions(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger } = context;
    logger.log("using default configuration");
    rules = [keepLatest, deprecateOldPrereleases];
  }

  async function analyzeCommits(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger } = context;
    logger.log("analyzeCommits");
  }

  async function prepare(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger } = context;
    logger.log("prepare");
  }

  async function publish(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger, cwd, env } = context;
    const packageInfo = await packageInfoRetriever.getInfo({
      cwd,
      env,
      logger,
    });

    if (!packageInfo) {
      return;
    }

    const parsedVersions = packageInfo.versions.map((v) => new SemVer(v));
    const actionsOnVersions = ruleApplier.applyRules(parsedVersions, rules);

    const depreciations: DepreciationResult[] = actionsOnVersions
      .filter((actionOnVersion) => actionOnVersion.action === Action.deprecate)
      .map((actionsOnVersion) => actionsOnVersion as DepreciationResult);

    if (depreciations) {
      logger.log(
        "Versions to deprecate",
        ...depreciations.map((v) => v.version.format())
      );

      for (const depreciation of depreciations) {
        await deprecier.deprecate(packageInfo, depreciation, {
          cwd,
          env,
          logger,
        });
      }
    } else {
      logger.log("No version to deprecate");
    }
  }

  return {
    verifyConditions,
    analyzeCommits,
    prepare,
    publish,
  };
}
