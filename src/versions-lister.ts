import execa from "execa";
import { Logger } from "./logger";

interface NpmError {
  error: {
    code: string;
    summary: string;
    detail: string;
  };
}

export class VersionsLister {
  async listVersions({
    cwd,
    env,
    logger,
  }: {
    cwd: string | undefined;
    env: { [name: string]: string };
    logger: Logger;
  }): Promise<string[]> {
    try {
      const result = await execa("npm", ["view", ".", "versions", "--json"], {
        cwd,
        env,
      });

      const parsedResponse: string[] = JSON.parse(result.stdout as string);

      logger.log(`Versions detected:`, ...parsedResponse);
      return parsedResponse;
    } catch (e) {
      try {
        const parsed: NpmError = JSON.parse(e.stdout);
        if (parsed.error.code === "E404") {
          logger.log("This package has not been published yet");
          return [];
        }

        throw e;
      } catch (parsingError) {
        throw e;
      }
    }
  }
}
