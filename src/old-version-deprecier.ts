import { Config, Context } from "semantic-release";
import { PluginConfig } from "./plugin-config";
import { VersionsLister } from "./versions-lister";
import semverRsort from "semver/functions/rsort";
import { deprecateOldPrereleases } from "./rules/deprecate-old-prereleases";
import { Action, Rule } from "./rule";
import { keepLatest } from "./rules/keep-latest";
import { RuleApplier } from "./rule-applier";

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
  versionsLister,
  ruleApplier,
}: {
  versionsLister: VersionsLister;
  ruleApplier: RuleApplier;
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
    const versions = await versionsLister.listVersions({ cwd, env, logger });
    const actionsOnVersions = ruleApplier.applyRules(versions, rules);

    const depreciations = actionsOnVersions
      .filter((actionOnVersion) => actionOnVersion.action === Action.deprecate)
      .map((actionOnVersion) => actionOnVersion.version);

    logger.log("Versions to deprecate", ...depreciations);
  }

  return {
    verifyConditions,
    analyzeCommits,
    prepare,
    publish,
  };
}
