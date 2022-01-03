import { Config, Context } from "semantic-release";
import { NpmConfig } from "./interfaces/npm.interface";
import {
  PackageBasicInfo,
  PackageInfo,
} from "./interfaces/package-info.interface";
import { Npm } from "./npm";
import { NpmApi } from "./npm-api";
import { NpmError } from "./npm-error";

export class PackageInfoRetriever {
  constructor(private readonly npmApi: NpmApi, private readonly npm: Npm) {}

  async getInfo(
    npmConfig: NpmConfig,
    context: Context & Config
  ): Promise<PackageInfo | undefined> {
    const basicInfo = await this.getBasicInfo(context);

    if (!basicInfo) {
      return undefined;
    }

    const completeInfo = await this.npmApi.getInfo(
      basicInfo.name,
      npmConfig,
      context
    );

    if (completeInfo && !completeInfo.versions[basicInfo.version]) {
      return {
        ...completeInfo,
        versions: {
          ...completeInfo.versions,
          [basicInfo.version]: {
            name: basicInfo.name,
            version: basicInfo.version,
          },
        },
      };
    }

    return completeInfo;
  }

  private async getBasicInfo(
    context: Context
  ): Promise<PackageBasicInfo | undefined> {
    try {
      return await this.npm.getBasicInfo(context);
    } catch (e) {
      const npmError = e as NpmError;
      if (npmError.code === "E404") {
        context.logger.log("This package has not been published yet");
        return undefined;
      }

      throw e;
    }
  }
}
