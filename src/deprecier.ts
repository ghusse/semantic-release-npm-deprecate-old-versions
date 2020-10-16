import execa from "execa";
import { SemVer } from "semver";
import { Logger } from "./logger";
import { PackageInfo } from "./package-info";

export class Deprecier {
  constructor(private readonly npmrc: string) {}

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
      [
        "deprecate",
        "--userconfig",
        this.npmrc,
        `${packageInfo.name}@${version.format()}`,
        realReason,
      ],
      {
        cwd,
        env,
      }
    );

    logger.log("Deprecated version", version.format());
  }
}
