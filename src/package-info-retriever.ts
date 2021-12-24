import { Execa } from "./interfaces/execa.interface";
import { Fetch } from "./interfaces/fetch.interface";
import { Logger } from "./interfaces/logger.interface";
import {
  PackageBasicInfo,
  PackageInfo,
} from "./interfaces/package-info.interface";

interface NpmError {
  error: {
    code: string;
    summary: string;
    detail: string;
  };
}

interface NpmConfig {
  registry: string;
}

interface Context {
  cwd: string | undefined;
  logger: Logger;
  env: Record<string, string>;
}

export class PackageInfoRetriever {
  constructor(private readonly fetch: Fetch, private readonly execa: Execa) {}

  async getInfo({
    cwd,
    env,
    logger,
  }: Context): Promise<PackageInfo | undefined> {
    const basicInfo = await this.getBasicInfo({
      cwd,
      env,
      logger,
    });

    if (!basicInfo) {
      return undefined;
    }

    const npmConfig = await this.getNpmConfig({
      cwd,
      env,
      logger,
    });

    return this.getInfoFromApi(basicInfo.name, npmConfig, { logger });
  }

  private async getBasicInfo({
    cwd,
    env,
    logger,
  }: Context): Promise<PackageBasicInfo | undefined> {
    try {
      const result = await this.execa("npm", ["view", "--json"], {
        cwd,
        env,
      });

      const parsedResponse: PackageBasicInfo = JSON.parse(
        result.stdout as string
      );

      return parsedResponse;
    } catch (e) {
      try {
        const parsed: NpmError = JSON.parse(e.stdout);
        if (parsed.error.code === "E404") {
          logger.log("This package has not been published yet");
          return undefined;
        }

        throw e;
      } catch (parsingError) {
        throw e;
      }
    }
  }

  private async getNpmConfig({
    cwd,
    env,
    logger,
  }: Context): Promise<NpmConfig> {
    try {
      const result = await this.execa("npm", ["config", "list", "--json"], {
        cwd,
        env,
      });

      const parsedResponse: NpmConfig = JSON.parse(result.stdout as string);

      logger.log(`Registry used:`, parsedResponse.registry);
      return parsedResponse;
    } catch (e) {
      logger.error("Unable to retrieve the config for npm");
      throw e;
    }
  }

  private async getInfoFromApi(
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
          response.text
      );
    } catch (e) {
      console.log("THE ERROR", e);
      logger.error("Unable to retrieve info from the registry", e);
      throw e;
    }
  }
}
