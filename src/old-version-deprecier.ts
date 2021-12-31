import { Config, Context } from "semantic-release";
import { PluginConfig } from "./interfaces/plugin-config.interface";
import { PackageInfoRetriever } from "./package-info-retriever";
import { Action } from "./interfaces/rule.interface";
import { RuleApplier } from "./rule-applier";
import { SemVer } from "semver";
import { Deprecier } from "./deprecier";
import {
  DepreciationResult,
  RuleApplicationResult,
} from "./rule-application-result";
import { Authentifier } from "./authentifier";
import ConfigurationLoader from "./configuration-loader";
import { PackageInfo } from "./interfaces/package-info.interface";
import { ListActiveVersions } from "./list-active-versions";
import { DeprecierState } from "./deprecier-state";
import { Npm } from "./npm";

export class OldVersionDeprecier {
  constructor(
    private readonly packageInfoRetriever: PackageInfoRetriever,
    private readonly ruleApplier: RuleApplier,
    private readonly deprecier: Deprecier,
    private readonly authentifier: Authentifier,
    private readonly configurationLoader: ConfigurationLoader,
    private readonly listActiveVersions: ListActiveVersions,
    private readonly npm: Npm,
    private readonly deprecierState: DeprecierState
  ) {}

  public async verifyConditions(pluginConfig: PluginConfig): Promise<void> {
    this.deprecierState.rules = this.configurationLoader.generateRules(
      pluginConfig
    );
  }

  public async prepare(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    this.deprecierState.npmConfig = await this.npm.getConfig(context);
  }

  public async publish(
    pluginConfig: PluginConfig,
    context: Context & Config
  ): Promise<void> {
    const { logger } = context;

    if (!this.deprecierState.npmConfig) {
      throw new Error(
        "Unable to deprecate version as the configuration of NPM could not be retrieved"
      );
    }

    const packageInfo = await this.packageInfoRetriever.getInfo(
      this.deprecierState.npmConfig,
      context
    );

    if (!packageInfo) {
      logger.log("This project does not seem to be a npm package");
      return;
    }

    const activeVersions = this.listActiveVersions(packageInfo);

    logger.log(`Active versions: ${activeVersions.join(", ")}`);

    const parsedVersions = activeVersions.map((v) => new SemVer(v));
    const actionsOnVersions = this.ruleApplier.applyRules(
      parsedVersions,
      this.deprecierState.rules
    );

    await this.deprecate(actionsOnVersions, packageInfo, context);
  }

  private async deprecate(
    actionsOnVersions: RuleApplicationResult[],
    packageInfo: PackageInfo,
    context: Context & Config
  ) {
    const depreciations: DepreciationResult[] = actionsOnVersions
      .filter((actionOnVersion) => actionOnVersion.action === Action.deprecate)
      .map((actionsOnVersion) => actionsOnVersion as DepreciationResult);

    if (depreciations?.length) {
      context.logger.log(
        "Versions to deprecate",
        ...depreciations.map((v) => v.version.format())
      );

      await this.authentifier.authenticate(
        this.deprecierState.npmConfig!,
        context
      );

      await this.authentifier.checkAuthentication(context);

      for (const depreciation of depreciations) {
        await this.deprecier.deprecate(packageInfo, depreciation, context);
      }
    } else {
      context.logger.log("No version to deprecate");
    }
  }
}
