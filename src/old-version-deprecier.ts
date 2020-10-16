import { Context } from "semantic-release";
import { PluginConfig } from "./plugin-config";

interface Plugin {
  verify(pluginConfig: PluginConfig, context: Context): void;
  prepare(pluginConfig: PluginConfig, context: Context): void;
  publish(pluginConfig: PluginConfig, context: Context): void;
  success(pluginConfig: PluginConfig, context: Context): void;
  fail(pluginConfig: PluginConfig, context: Context): void;
}

export function createOldVersionDeprecier(): Plugin {
  function verify(pluginConfig: PluginConfig, context: Context): void {
    console.log("verify", context);
  }

  function prepare(pluginConfig: PluginConfig, context: Context): void {}

  function publish(pluginConfig: PluginConfig, context: Context): void {
    console.log("PUBLISH", context);
  }

  function success(pluginConfig: PluginConfig, context: Context): void {}

  function fail(pluginConfig: PluginConfig, context: Context): void {}

  return {
    verify,
    prepare,
    publish,
    success,
    fail,
  };
}
