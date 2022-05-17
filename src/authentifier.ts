import { Config, Context } from "semantic-release";
import { NpmConfig } from "./interfaces/npm.interface";
import { Npm } from "./npm";
import { NpmError } from "./npm-error";

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

    await this.npm.authenticate({ registry: npmConfig.registry }, context);

    logger.log("npm token set");
  }

  public async checkAuthentication(context: Config & Context): Promise<void> {
    try {
      await this.npm.whoAmI(context);
    } catch (e) {
      if ((e as NpmError).code === "ENEEDAUTH") {
        throw new Error("Authentication is not correct");
      }

      throw e;
    }
  }
}
