import { Config, Context } from "semantic-release";
import { PluginConfig } from "./plugin-config";
import { VersionsLister } from "./versions-lister";

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
}: {
  versionsLister: VersionsLister;
}): Plugin {
  async function verifyConditions(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger } = context;
    logger.log("using default configuration");
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
    logger.log("publish");
    await versionsLister.listVersions({ cwd, env, logger });
  }

  return {
    verifyConditions,
    analyzeCommits,
    prepare,
    publish,
  };
}
