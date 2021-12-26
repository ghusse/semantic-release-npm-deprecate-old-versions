import { Fetch } from "./interfaces/fetch.interface";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageInfo } from "./interfaces/package-info.interface";

export class NpmApi {
  constructor(private readonly fetch: Fetch) {}

  public async getInfo(
    packageName: string,
    npmConfig: NpmConfig,
    { logger }: { logger: Logger }
  ): Promise<PackageInfo | undefined> {
    try {
      const response = await this.fetch(
        `${npmConfig.registry}${encodeURIComponent(packageName)}`
      );

      if (response.status === 404) {
        logger.log("Package not found on the registry");
        return undefined;
      }

      if (response.status >= 200 && response.status < 300) {
        return response.json() as Promise<PackageInfo>;
      }

      throw new Error(
        "Error received from the registry " +
          response.status +
          " " +
          (await response.text())
      );
    } catch (e) {
      logger.error("Unable to retrieve info from the registry", e);
      throw e;
    }
  }
}
