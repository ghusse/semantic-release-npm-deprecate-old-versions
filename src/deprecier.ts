import execa from "execa";
import { SemVer } from "semver";
import { Logger } from "./logger";
import { PackageInfo } from "./package-info";

export class Deprecier {
  public async deprecate(
    packageInfo: PackageInfo,
    { version, reason }: { version: SemVer; reason: string },
    {
      cwd,
      env,
      logger,
    }: {
      cwd?: string;
      env: { [name: string]: string };
      logger: Logger;
    }
  ): Promise<void> {
    const realReason = reason || "Automatically deprecated";

    try {
      await execa(
        "npm",
        [
          "deprecate",
          `${packageInfo.name}@${version.format()}`,
          `${realReason}`,
        ],
        {
          cwd,
          env,
        }
      );
    } catch (error) {
      if (error.stderr?.includes("npm ERR! code E422\n")) {
        logger.log(
          `Version ${version.format()} could not be deprecated, is it already deprecated?`
        );
      }
      if (error.stderr?.includes("npm ERR! code E405\n")) {
        logger.log(
          `Version ${version.format()} could not be deprecated, is it already deprecated?`
        );
      } else {
        throw error;
      }
    }

    logger.log("Deprecated version", version.format());
  }
}
