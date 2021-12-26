import { Config, Context } from "semantic-release";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Execa } from "./interfaces/execa.interface";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { PackageBasicInfo } from "./interfaces/package-info.interface";
import { Npm } from "./npm";
import { NpmError } from "./npm-error";

describe("npm", () => {
  function setup() {
    const execa = mock<Execa>();

    const npm = new Npm(instance(execa));

    return {
      execa,
      npm,
    };
  }

  describe("authenticate", () => {
    it("should authenticate", async () => {
      const { execa, npm } = setup();
      const context = mock<Context & Config>();
      const env = {
        NPM_TOKEN: "token",
      };
      when(context.env).thenReturn(env);
      when(context.cwd).thenReturn("cwd");

      when(
        execa(
          "npm",
          [
            "config",
            "set",
            "//registry.npmjs.org/:_authToken",
            "token",
            "--json",
          ],
          {
            cwd: "cwd",
            env,
          }
        )
      ).thenResolve(undefined as any);

      await npm.authenticate(
        { registry: "https://registry.npmjs.org", token: "token" },
        instance(context)
      );

      verifyAll();
    });
  });

  describe("deprecate", () => {
    it("should deprecate the given version", async () => {
      const { execa, npm } = setup();
      const context = mock<Context & Config>();
      const env = {
        NPM_TOKEN: "token",
      };
      when(context.env).thenReturn(env);
      when(context.cwd).thenReturn("cwd");

      when(
        execa("npm", ["deprecate", "name@version", "reason", "--json"], {
          cwd: "cwd",
          env,
        })
      ).thenResolve(undefined as any);

      await npm.deprecate(
        { name: "name", version: "version", reason: "reason" },
        instance(context)
      );

      verifyAll();
    });

    it("should return a NpmError in case of error", async () => {
      const { execa, npm } = setup();
      const context = mock<Context & Config>();
      const env = {
        NPM_TOKEN: "token",
      };
      when(context.env).thenReturn(env);
      when(context.cwd).thenReturn("cwd");

      const error: any = new Error("error");
      error.stdout = JSON.stringify({
        error: {
          code: "E404",
          summary: "Not Found",
        },
      });
      when(
        execa("npm", ["deprecate", "name@version", "reason", "--json"], {
          cwd: "cwd",
          env,
        })
      ).thenReject(error);

      await expect(
        npm.deprecate(
          { name: "name", version: "version", reason: "reason" },
          instance(context)
        )
      ).rejects.toEqual(new NpmError("E404", "Not Found", error));

      verifyAll();
    });
  });

  describe("getBasicInfo", () => {
    it("should retrieve the info from npm and return it", async () => {
      const { execa, npm } = setup();
      const context = mock<Context & Config>();
      const env = {
        NPM_TOKEN: "token",
      };
      when(context.env).thenReturn(env);
      when(context.cwd).thenReturn("cwd");

      const info: PackageBasicInfo = {
        name: "name",
        versions: ["1.0.0"],
      };

      when(
        execa("npm", ["view", "--json"], {
          cwd: "cwd",
          env,
        })
      ).thenResolve({
        stdout: JSON.stringify(info),
      } as any);

      const result = await npm.getBasicInfo(instance(context));

      verifyAll();
      expect(result).toEqual(info);
    });
  });

  describe("getConfig", () => {
    it("should return the npm config", async () => {
      const { execa, npm } = setup();
      const context = mock<Context & Config>();
      const env = {
        NPM_TOKEN: "token",
      };
      const logger = mock<Logger>();
      when(context.env).thenReturn(env);
      when(context.cwd).thenReturn("cwd");
      when(context.logger).thenReturn(instance(logger));

      const config: NpmConfig = {
        registry: "https://registry.npmjs.org",
      };

      when(
        execa("npm", ["config", "list", "--json"], {
          cwd: "cwd",
          env,
        })
      ).thenResolve({
        stdout: JSON.stringify(config),
      } as any);

      when(
        logger.log("Registry used:", "https://registry.npmjs.org")
      ).thenReturn(undefined);

      const result = await npm.getConfig(instance(context));

      verifyAll();
      expect(result).toEqual(config);
    });
  });
});
