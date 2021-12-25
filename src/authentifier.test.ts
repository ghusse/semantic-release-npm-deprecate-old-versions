import { Config, Context } from "semantic-release";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Authentifier } from "./authentifier";
import { Logger } from "./interfaces/logger.interface";
import { NpmConfig } from "./interfaces/npm.interface";
import { Npm } from "./npm";

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
});
