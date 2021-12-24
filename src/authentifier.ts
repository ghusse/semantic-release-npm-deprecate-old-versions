import { execa } from "execa";
import { Logger } from "./interfaces/logger.interface";

export class Authentifier {
  public async authenticate({
    cwd,
    env,
    logger,
  }: {
    cwd?: string;
    env: { [name: string]: string };
    logger: Logger;
  }): Promise<void> {
    if (!env.NPM_TOKEN) {
      throw new Error("NPM TOKEN needs to be set");
    }
    await execa(
      "npm",
      ["config", "set", "//registry.npmjs.org/:_authToken", env.NPM_TOKEN],
      { cwd, env }
    );

    logger.log("npm token set");
  }
}
