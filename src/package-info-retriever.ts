import execa from "execa";
import { Logger } from "./logger";
import { PackageInfo } from "./package-info";

interface NpmError {
  error: {
    code: string;
    summary: string;
    detail: string;
  };
}

export class PackageInfoRetriever {
  async getInfo({
    cwd,
    env,
    logger,
  }: {
    cwd: string | undefined;
    env: { [name: string]: string };
    logger: Logger;
  }): Promise<PackageInfo | undefined> {
    try {
      const result = await execa("npm", ["view", "--json"], {
        cwd,
        env,
      });

      const parsedResponse: PackageInfo = JSON.parse(result.stdout as string);

      logger.log(`Versions detected:`, ...parsedResponse.versions);
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
}
