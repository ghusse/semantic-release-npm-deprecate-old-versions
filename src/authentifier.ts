import { Config, Context } from "semantic-release";
import { NpmConfig } from "./interfaces/npm.interface";
import { Npm } from "./npm";

export class Authentifier {
  constructor(private readonly npm: Npm) {}

  public async authenticate(
    npmConfig: NpmConfig,
    context: Config & Context
  ): Promise<void> {
    const { env, logger } = context;

    if (!env.NPM_TOKEN) {
      throw new Error("NPM TOKEN needs to be set");
    }

    await this.npm.authenticate(
      { registry: npmConfig.registry, token: env.NPM_TOKEN },
      context
    );

    logger.log("npm token set");
  }
}
