import { Config, Context } from "semantic-release";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Authentifier } from "./authentifier";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { Npm } from "./npm";
import { NpmError } from "./npm-error";

describe("Authentifier", () => {
  function setup() {
    const npm = mock<Npm>();
    const authentifier = new Authentifier(instance(npm));

    return {
      authentifier,
      npm,
    };
  }

  describe("authenticate", () => {
    it("should authenticate", async () => {
      const { authentifier, npm } = setup();

      const npmConfig: NpmConfig = {
        registry: "https://registry.npmjs.org/",
      };

      const context = mock<Config & Context>();
      when(context.env).thenReturn({ NPM_TOKEN: "token" });

      const logger = mock<Logger>();
      when(context.logger).thenReturn(instance(logger));

      when(
        npm.authenticate(
          {
            registry: npmConfig.registry,
            token: "token",
          },
          instance(context)
        )
      ).thenResolve();

      when(logger.log("npm token set")).thenReturn();

      await authentifier.authenticate(npmConfig, instance(context));

      verifyAll();
    });

    it("should throw an error if the token is missing", async () => {
      const { authentifier, npm } = setup();

      const npmConfig: NpmConfig = {
        registry: "https://registry.npmjs.org/",
      };

      const context = mock<Config & Context>();
      when(context.env).thenReturn({});

      const logger = mock<Logger>();
      when(context.logger).thenReturn(instance(logger));

      await expect(
        authentifier.authenticate(npmConfig, instance(context))
      ).rejects.toThrow("NPM TOKEN needs to be set");

      verifyAll();
    });
  });

  describe("checkAuthentication", () => {
    it("should check the authentication", async () => {
      const { authentifier, npm } = setup();

      const context = mock<Config & Context>();

      when(npm.whoAmI(instance(context))).thenResolve();

      await authentifier.checkAuthentication(instance(context));

      verifyAll();
    });

    it("should catch ENEEDAUTH errors and rethrow an error", async () => {
      const { authentifier, npm } = setup();

      const context = mock<Config & Context>();

      when(npm.whoAmI(instance(context))).thenReject(
        new NpmError("ENEEDAUTH", "Authentication is required.", new Error())
      );

      await expect(
        authentifier.checkAuthentication(instance(context))
      ).rejects.toThrow("Authentication is not correct");

      verifyAll();
    });

    it("should rethrow unexpected errors", async () => {
      const { authentifier, npm } = setup();

      const context = mock<Config & Context>();

      const error = new Error();
      when(npm.whoAmI(instance(context))).thenReject(error);

      await expect(
        authentifier.checkAuthentication(instance(context))
      ).rejects.toEqual(error);
    });
  });
});
