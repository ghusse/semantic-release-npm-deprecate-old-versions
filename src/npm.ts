import { ExecaReturnValue } from "execa";
import { Config, Context } from "semantic-release";
import { Execa } from "./interfaces/execa.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageBasicInfo } from "./interfaces/package-info.interface";
import { NpmError } from "./npm-error";

interface ParsedNpmError {
  error: {
    code: string;
    summary: string;
    detail: string;
  };
}

export class Npm {
  constructor(private readonly execa: Execa) {}

  public async authenticate(
    { registry, token }: { registry: string; token: string },
    context: Context & Config
  ): Promise<void> {
    const registryUrl = registry.replace(/^https?:/, "");
    await this.runJsonNpm(
      ["config", "set", `${registryUrl}/:_authToken`, token],
      context
    );
  }

  public async deprecate(
    {
      name,
      version,
      reason,
    }: { name: string; version: string; reason: string },
    context: Context & Config
  ): Promise<void> {
    await this.runJsonNpm(
      ["deprecate", `${name}@${version}`, `${reason}`],
      context
    );
  }

  public async getBasicInfo(
    context: Context & Config
  ): Promise<PackageBasicInfo> {
    const result = await this.runJsonNpm(["view"], context);

    const parsedResponse: PackageBasicInfo = JSON.parse(
      result.stdout as string
    );

    return parsedResponse;
  }

  public async getConfig(context: Context & Config): Promise<NpmConfig> {
    try {
      const result = await this.runJsonNpm(["config", "list"], context);

      const parsedResponse: NpmConfig = JSON.parse(result.stdout as string);

      context.logger.log(`Registry used:`, parsedResponse.registry);
      return parsedResponse;
    } catch (e) {
      console.error(e);
      context.logger.error("Unable to retrieve the config for npm");
      throw e;
    }
  }

  private async runJsonNpm(
    args: string[],
    { cwd, env }: Context & Config
  ): Promise<ExecaReturnValue<string>> {
    try {
      return await this.execa("npm", [...args, "--json"], { cwd, env });
    } catch (e) {
      if (e.stdout) {
        const parsed: ParsedNpmError = JSON.parse(e.stdout);
        throw new NpmError(parsed.error.code, parsed.error.summary, e);
      }
      throw e;
    }
  }
}
