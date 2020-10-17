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
      cwd: string | undefined;
      env: { [name: string]: string };
      logger: Logger;
    }
  ): Promise<void> {
    const realReason = reason || "Automatically deprecated";

    await execa(
      "npm",
      ["deprecate", `${packageInfo.name}@${version.format()}`, `${realReason}`],
      {
        cwd,
        env,
      }
    );

    logger.log("Deprecated version", version.format());
  }
}
