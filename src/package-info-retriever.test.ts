import { Config, Context } from "semantic-release";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageInfo } from "./interfaces/package-info.interface";
import { Npm } from "./npm";
import { NpmApi } from "./npm-api";
import { NpmError } from "./npm-error";
import { PackageInfoRetriever } from "./package-info-retriever";

describe("PackageInfoRetriever", () => {
  function setup() {
    const npmApi = mock<NpmApi>();
    const npm = mock<Npm>();

    const packageInfoRetriever = new PackageInfoRetriever(
      instance(npmApi),
      instance(npm)
    );

    return { packageInfoRetriever, npmApi, npm };
  }

  describe("getInfo", () => {
    it("should return undefined if no basic info can be found", async () => {
      const { packageInfoRetriever, npmApi, npm } = setup();
      const npmConfig = mock<NpmConfig>();
      const context = mock<Context & Config>();
      const logger = mock<Logger>();

      when(context.logger).thenReturn(instance(logger));

      const error = new NpmError("E404", "Not found", new Error());
      when(npm.getBasicInfo(instance(context))).thenReject(error);

      when(logger.log("This package has not been published yet")).thenReturn();

      const info = await packageInfoRetriever.getInfo(
        npmConfig,
        instance(context)
      );

      expect(info).toBeUndefined();

      verifyAll();
    });

    it("should rethrow errors that don't have a code", async () => {
      const { packageInfoRetriever, npm } = setup();
      const npmConfig = mock<NpmConfig>();
      const context = mock<Context & Config>();

      const error = new Error("Something went wrong");
      when(npm.getBasicInfo(instance(context))).thenReject(error);

      await expect(
        packageInfoRetriever.getInfo(npmConfig, instance(context))
      ).rejects.toThrow(error);

      verifyAll();
    });

    it("should rethrow errors that are not 404s", async () => {
      const { packageInfoRetriever, npm } = setup();
      const npmConfig = mock<NpmConfig>();
      const context = mock<Context & Config>();

      const error = new NpmError("E500", "Something went wrong", new Error());
      when(npm.getBasicInfo(instance(context))).thenReject(error);

      await expect(
        packageInfoRetriever.getInfo(npmConfig, instance(context))
      ).rejects.toThrow(error);

      verifyAll();
    });

    describe("when some basic info could have been retrieved", () => {
      it("should return the detailed info from the registry", async () => {
        const { packageInfoRetriever, npmApi, npm } = setup();
        const npmConfig = mock<NpmConfig>();
        const context = mock<Context & Config>();

        const basicInfo = {
          name: "my-package",
          version: "1.0.0",
        };
        when(npm.getBasicInfo(instance(context))).thenResolve(basicInfo as any);

        const packageInfo: PackageInfo = {
          name: "my-package",
          versions: {
            "1.0.0": {
              name: "my-package",
              version: "1.0.0",
            },
          },
        };
        when(
          npmApi.getInfo(basicInfo.name, instance(npmConfig), instance(context))
        ).thenResolve(packageInfo);

        const info = await packageInfoRetriever.getInfo(
          instance(npmConfig),
          instance(context)
        );

        expect(info).toEqual(packageInfo);

        verifyAll();
      });

      it("should add the version from basic info when the api did not return it", async () => {
        const { packageInfoRetriever, npmApi, npm } = setup();
        const npmConfig = mock<NpmConfig>();
        const context = mock<Context & Config>();

        const basicInfo = {
          name: "my-package",
          version: "1.1.0",
        };
        when(npm.getBasicInfo(instance(context))).thenResolve(basicInfo as any);

        const packageInfo: PackageInfo = {
          name: "my-package",
          versions: {
            "1.0.0": {
              name: "my-package",
              version: "1.0.0",
            },
          },
        };
        when(
          npmApi.getInfo(basicInfo.name, instance(npmConfig), instance(context))
        ).thenResolve(packageInfo);

        const info = await packageInfoRetriever.getInfo(
          instance(npmConfig),
          instance(context)
        );

        expect(info).toEqual({
          name: "my-package",
          versions: {
            "1.0.0": {
              name: "my-package",
              version: "1.0.0",
            },
            "1.1.0": {
              name: "my-package",
              version: "1.1.0",
            },
          },
        });

        verifyAll();
      });
    });
  });
});
