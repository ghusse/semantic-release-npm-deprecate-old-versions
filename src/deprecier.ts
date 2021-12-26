import { Config, Context } from "semantic-release";
import { SemVer } from "semver";
import { PackageInfo } from "./interfaces/package-info.interface";
import { Npm } from "./npm";
import { NpmError } from "./npm-error";

export class Deprecier {
  constructor(private readonly npm: Npm) {}

  public async deprecate(
    packageInfo: PackageInfo,
    { version, reason }: { version: SemVer; reason: string },
    context: Context & Config
  ): Promise<void> {
    const realReason = reason || "Automatically deprecated";

    try {
      await this.npm.deprecate(
        {
          name: packageInfo.name,
          version: version.format(),
          reason: realReason,
        },
        context
      );

      context.logger.log("Deprecated version", version.format());
    } catch (error) {
      const npmError = error as NpmError;

      if (npmError.code === "E422" || npmError.code === "E405") {
        context.logger.log(
          `Version ${version.format()} could not be deprecated, is it already deprecated?`
        );
      } else if (npmError.code === "E404") {
        context.logger.log(
          `Version ${version.format()} could not be deprecated, it has not been found. It could be a bug of the registry.`
        );
      } else {
        context.logger.error("Unexpected error", error);
        throw error;
      }
    }
  }
}
