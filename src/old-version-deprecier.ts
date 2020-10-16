import { Config, Context } from "semantic-release";
import { PluginConfig } from "./plugin-config";

interface Plugin {
  verifyConditions(pluginConfig: PluginConfig, context: Context): void;
  analyzeCommits(pluginConfig: PluginConfig, context: Context): void;
  prepare(pluginConfig: PluginConfig, context: Context): void;
  publish(pluginConfig: PluginConfig, context: Context): void;
}

export function createOldVersionDeprecier(): Plugin {
  function verifyConditions(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): void {
    const { logger } = context;
    logger.log("using default configuration");
    console.log(context);
  }

  function analyzeCommits(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): void {
    const { logger } = context;
    logger.log("analyzeCommits");
  }

  function prepare(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): void {
    const { logger } = context;
    logger.log("prepare");
  }

  function publish(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): void {
    const { logger } = context;
    logger.log("publish");
  }

  return {
    verifyConditions,
    analyzeCommits,
    prepare,
    publish,
  };
}
