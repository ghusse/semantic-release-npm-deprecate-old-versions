import { Config, Context } from "semantic-release";
import { SemVer } from "semver";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Deprecier } from "./deprecier";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageInfo } from "./interfaces/package-info.interface";
import { Npm } from "./npm";
import { NpmError } from "./npm-error";

describe("Deprecier", () => {
  function setup() {
    const npm = mock<Npm>();
    const deprecier = new Deprecier(instance(npm));

    return {
      deprecier,
      npm,
    };
  }

  describe("deprecate", () => {
    it("should deprecate", async () => {
      const { deprecier, npm } = setup();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      const context = mock<Context & Config>();

      const logger = mock<Logger>();
      when(logger.log("Deprecated version", "1.0.0")).thenReturn(undefined);

      when(context.logger).thenReturn(instance(logger));

      const reason = "reason";

      when(
        npm.deprecate(
          { name: "name", version: "1.0.0", reason },
          instance(context)
        )
      ).thenResolve();

      await deprecier.deprecate(
        packageInfo,
        { version: new SemVer("1.0.0"), reason },
        instance(context)
      );

      verifyAll();
    });

    it("should log a message when an error 422 is thrown", async () => {
      const { deprecier, npm } = setup();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      const context = mock<Context & Config>();

      const logger = mock<Logger>();
      when(
        logger.log(
          "Version 1.0.0 could not be deprecated, is it already deprecated?"
        )
      ).thenReturn(undefined);

      when(context.logger).thenReturn(instance(logger));

      const reason = "reason";

      when(
        npm.deprecate(
          { name: "name", version: "1.0.0", reason },
          instance(context)
        )
      ).thenReject(new NpmError("E422", "", new Error()));

      await deprecier.deprecate(
        packageInfo,
        { version: new SemVer("1.0.0"), reason },
        instance(context)
      );

      verifyAll();
    });

    it("should log a message when an error 405 is thrown", async () => {
      const { deprecier, npm } = setup();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      const context = mock<Context & Config>();

      const logger = mock<Logger>();
      when(
        logger.log(
          "Version 1.0.0 could not be deprecated, is it already deprecated?"
        )
      ).thenReturn(undefined);

      when(context.logger).thenReturn(instance(logger));

      const reason = "reason";

      when(
        npm.deprecate(
          { name: "name", version: "1.0.0", reason },
          instance(context)
        )
      ).thenReject(new NpmError("E405", "", new Error()));

      await deprecier.deprecate(
        packageInfo,
        { version: new SemVer("1.0.0"), reason },
        instance(context)
      );

      verifyAll();
    });

    it("should log a message when a 404 is thrown", async () => {
      const { deprecier, npm } = setup();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      const context = mock<Context & Config>();

      const logger = mock<Logger>();
      when(
        logger.log(
          "Version 1.0.0 could not be deprecated, it has not been found. It could be a bug of the registry."
        )
      ).thenReturn(undefined);

      when(context.logger).thenReturn(instance(logger));

      const reason = "reason";

      when(
        npm.deprecate(
          { name: "name", version: "1.0.0", reason },
          instance(context)
        )
      ).thenReject(new NpmError("E404", "", new Error()));

      await deprecier.deprecate(
        packageInfo,
        { version: new SemVer("1.0.0"), reason },
        instance(context)
      );

      verifyAll();
    });

    it("should log and rethrow unexpected errors", async () => {
      const { deprecier, npm } = setup();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      const context = mock<Context & Config>();

      const logger = mock<Logger>();
      const error = new Error();
      when(logger.error("Unexpected error", error)).thenReturn(undefined);

      when(context.logger).thenReturn(instance(logger));

      const reason = "reason";

      when(
        npm.deprecate(
          { name: "name", version: "1.0.0", reason },
          instance(context)
        )
      ).thenReject(error);

      await expect(
        deprecier.deprecate(
          packageInfo,
          { version: new SemVer("1.0.0"), reason },
          instance(context)
        )
      ).rejects.toThrow();

      verifyAll();
    });
  });
});
