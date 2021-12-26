import { instance, mock, verifyAll, when } from "strong-mock";
import { Fetch } from "./interfaces/fetch.interface";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageInfo } from "./interfaces/package-info.interface";
import { NpmApi } from "./npm-api";

describe("NpmApi", () => {
  function setup() {
    const fetch = mock<Fetch>();
    const npmApi = new NpmApi(instance(fetch));

    return {
      fetch,
      npmApi,
    };
  }

  describe("getInfo", () => {
    it("should get info from the npm api and return it", async () => {
      const { npmApi, fetch } = setup();

      const packageName = "packageName";
      const npmConfig: NpmConfig = {
        registry: "registry",
      };
      const logger = mock<Logger>();

      const packageInfo: PackageInfo = {
        name: "name",
        versions: {
          "1.0.0": {
            version: "1.0.0",
            name: "name",
          },
        },
      };

      when(
        fetch(`${npmConfig.registry}${encodeURIComponent(packageName)}`)
      ).thenResolve({
        status: 200,
        json: () => Promise.resolve(packageInfo),
      } as any);

      const result = await npmApi.getInfo(packageName, npmConfig, {
        logger: instance(logger),
      });

      expect(result).toEqual(packageInfo);

      verifyAll();
    });

    it("should return undefined if the api returns a 404", async () => {
      const { npmApi, fetch } = setup();

      const packageName = "packageName";
      const npmConfig: NpmConfig = {
        registry: "registry",
      };
      const logger = mock<Logger>();

      when(
        fetch(`${npmConfig.registry}${encodeURIComponent(packageName)}`)
      ).thenResolve({
        status: 404,
      } as any);

      when(logger.log("Package not found on the registry")).thenReturn(
        undefined
      );

      const result = await npmApi.getInfo(packageName, npmConfig, {
        logger: instance(logger),
      });

      expect(result).toBeUndefined();

      verifyAll();
    });

    it("should throw an error if the api returns a 500", async () => {
      const { npmApi, fetch } = setup();

      const packageName = "packageName";
      const npmConfig: NpmConfig = {
        registry: "registry",
      };
      const logger = mock<Logger>();

      when(
        fetch(`${npmConfig.registry}${encodeURIComponent(packageName)}`)
      ).thenResolve({
        status: 500,
        text: () => Promise.resolve("Error"),
      } as any);

      when(
        logger.error(
          "Unable to retrieve info from the registry",
          new Error("Error received from the registry 500 Error")
        )
      ).thenReturn(undefined);

      await expect(
        npmApi.getInfo(packageName, npmConfig, {
          logger: instance(logger),
        })
      ).rejects.toThrowError("Error received from the registry 500 Error");

      verifyAll();
    });
  });
});
