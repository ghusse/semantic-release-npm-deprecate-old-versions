import { Authentifier } from "./authentifier";
import ConfigurationLoader from "./configuration-loader";
import { Deprecier } from "./deprecier";
import { ListActiveVersions } from "./list-active-versions";
import { OldVersionDeprecier } from "./old-version-deprecier";
import { PackageInfoRetriever } from "./package-info-retriever";
import { RuleApplier } from "./rule-applier";
import { mock, instance, when, verify, verifyAll } from "strong-mock";
import { Action, RuleWithAppliedOptions } from "./interfaces/rule.interface";
import { PluginConfig } from "./interfaces/plugin-config.interface";
import { Logger } from "./interfaces/logger.interface";
import { PackageInfo } from "./interfaces/package-info.interface";
import { Config, Context } from "semantic-release";
import { DeprecierState } from "./deprecier-state";
import { SemVer } from "semver";
import {
  DepreciationResult,
  RuleApplicationResult,
} from "./rule-application-result";
import { Npm } from "./npm";

describe("OldVersionDeprecier", () => {
  function setup() {
    const packageInfoRetriever = mock<PackageInfoRetriever>();
    const ruleApplier = mock<RuleApplier>();
    const deprecier = mock<Deprecier>();
    const authentifier = mock<Authentifier>();
    const configurationLoader = mock<ConfigurationLoader>();
    const listActiveVersions = mock<ListActiveVersions>();
    const deprecierState = new DeprecierState();
    const npm = mock<Npm>();

    const oldVersionDeprecier = new OldVersionDeprecier(
      instance(packageInfoRetriever),
      instance(ruleApplier),
      instance(deprecier),
      instance(authentifier),
      instance(configurationLoader),
      instance(listActiveVersions),
      instance(npm),
      deprecierState
    );

    return {
      oldVersionDeprecier,
      packageInfoRetriever,
      ruleApplier,
      deprecier,
      authentifier,
      configurationLoader,
      listActiveVersions,
      npm,
      deprecierState,
    };
  }

  describe("verifyConditions", () => {
    it("should generate rules", async () => {
      const {
        configurationLoader,
        oldVersionDeprecier,
        deprecierState,
      } = setup();

      const rule = mock<RuleWithAppliedOptions>();
      const rules: RuleWithAppliedOptions[] = [instance(rule)];

      const config: PluginConfig = {
        debug: true,
      };

      when(configurationLoader.generateRules(config)).thenReturn(rules);

      await oldVersionDeprecier.verifyConditions(config);

      verify(configurationLoader);
      expect(deprecierState.rules).toBe(rules);
    });
  });

  describe("prepare", () => {
    it("should retrieve package info", async () => {
      const {
        oldVersionDeprecier,
        packageInfoRetriever,
        deprecierState,
        npm,
      } = setup();

      const config: PluginConfig = { debug: true };
      const logger = mock<Logger>();
      const context: Context & Config = {
        logger: instance(logger),
        cwd: "here",
        env: {},
      };

      const npmConfig = {
        registry: "registry",
      };

      when(npm.getConfig(context)).thenResolve(npmConfig);

      const packageInfo: PackageInfo = {
        name: "foo",
        versions: {
          "1.0.0": {
            name: "foo",
            version: "1.0.0",
          },
        },
      };

      when(packageInfoRetriever.getInfo(npmConfig, context)).thenResolve(
        packageInfo
      );

      await oldVersionDeprecier.prepare(config, context);

      verify(packageInfoRetriever);
      expect(deprecierState.packageInfo).toBe(packageInfo);
      expect(deprecierState.npmConfig).toBe(npmConfig);
    });
  });

  describe("publish", () => {
    it("should not do anything if there is no package info", async () => {
      const { oldVersionDeprecier, listActiveVersions } = setup();

      const logger = mock<Logger>();
      const context: Config & Context = {
        logger: instance(logger),
        env: {},
      };

      when(
        logger.log("This project does not seem to be a npm package")
      ).thenReturn();

      await oldVersionDeprecier.publish({}, context);

      verify(logger);
      verify(listActiveVersions);
    });

    it("should apply the rules on active versions and deprecate the selected versions", async () => {
      const {
        deprecierState,
        oldVersionDeprecier,
        listActiveVersions,
        ruleApplier,
        authentifier,
        deprecier,
      } = setup();

      deprecierState.packageInfo = {
        name: "foo",
        versions: {
          "1.0.0": {
            name: "foo",
            version: "1.0.0",
          },
          "2.0.0": {
            name: "foo",
            version: "2.0.0",
          },
        },
      };

      const rule = mock<RuleWithAppliedOptions>();

      deprecierState.rules = [instance(rule)];

      deprecierState.npmConfig = {
        registry: "registry",
      };

      when(listActiveVersions(deprecierState.packageInfo)).thenReturn([
        "1.0.0",
        "2.0.0",
      ]);

      const logger = mock<Logger>();

      when(logger.log("Active versions: 1.0.0, 2.0.0")).thenReturn();

      const actions: RuleApplicationResult[] = [
        {
          version: new SemVer("1.0.0"),
          action: Action.deprecate,
          reason: "because",
        },
        {
          version: new SemVer("2.0.0"),
          action: Action.support,
        },
      ];

      when(
        ruleApplier.applyRules(
          [new SemVer("1.0.0"), new SemVer("2.0.0")],
          deprecierState.rules
        )
      ).thenReturn(actions);

      when(logger.log("Versions to deprecate", "1.0.0")).thenReturn();

      const context: Config & Context = {
        logger: instance(logger),
        env: {},
      };

      when(
        authentifier.authenticate(deprecierState.npmConfig, context)
      ).thenResolve();
      when(
        deprecier.deprecate(
          deprecierState.packageInfo,
          actions[0] as DepreciationResult,
          context
        )
      ).thenResolve();

      await oldVersionDeprecier.publish({}, context);

      verifyAll();
    });

    it("should log that nothing will be deprecated if this is the case", async () => {
      const {
        deprecierState,
        oldVersionDeprecier,
        listActiveVersions,
        ruleApplier,
      } = setup();

      deprecierState.packageInfo = {
        name: "foo",
        versions: {
          "1.0.0": {
            name: "foo",
            version: "1.0.0",
          },
          "2.0.0": {
            name: "foo",
            version: "2.0.0",
          },
        },
      };

      const rule = mock<RuleWithAppliedOptions>();

      deprecierState.rules = [instance(rule)];

      when(listActiveVersions(deprecierState.packageInfo)).thenReturn([
        "1.0.0",
        "2.0.0",
      ]);

      const logger = mock<Logger>();

      when(logger.log("Active versions: 1.0.0, 2.0.0")).thenReturn();

      const actions: RuleApplicationResult[] = [
        {
          version: new SemVer("1.0.0"),
          action: Action.support,
        },
        {
          version: new SemVer("2.0.0"),
          action: Action.support,
        },
      ];

      when(
        ruleApplier.applyRules(
          [new SemVer("1.0.0"), new SemVer("2.0.0")],
          deprecierState.rules
        )
      ).thenReturn(actions);

      when(logger.log("No version to deprecate")).thenReturn();

      const context: Config & Context = {
        logger: instance(logger),
        env: {},
      };

      await oldVersionDeprecier.publish({}, context);

      verifyAll();
    });
  });
});
