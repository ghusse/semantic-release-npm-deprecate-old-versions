import { Response } from "node-fetch";
import { instance, mock, verifyAll, when } from "strong-mock";
import { Execa } from "./interfaces/execa.interface";
import { Fetch } from "./interfaces/fetch.interface";
import { Logger } from "./interfaces/logger.interface";
import { PackageInfoRetriever } from "./package-info-retriever";

describe("PackageInfoRetriever", () => {
  function setup() {
    const fetch = mock<Fetch>();
    const execa = mock<Execa>();

    const packageInfoRetriever = new PackageInfoRetriever(
      instance(fetch),
      instance(execa)
    );

    return { packageInfoRetriever, fetch, execa };
  }

  describe("getInfo", () => {
    it("should return undefined if no basic info can be found", async () => {
      const { execa, packageInfoRetriever } = setup();

      const logger = mock<Logger>();
      const context = {
        cwd: "here",
        env: {},
        logger: instance(logger),
      };

      const error = new Error("Not found");
      (error as any).stdout = JSON.stringify({
        error: {
          code: "E404",
        },
      });

      when(
        execa("npm", ["view", "--json"], {
          cwd: context.cwd,
          env: context.env,
        })
      ).thenReject(error);

      when(logger.log("This package has not been published yet")).thenReturn();

      const result = await packageInfoRetriever.getInfo(context);

      verifyAll();
      expect(result).toBe(undefined);
    });

    it("should rethrow errors that could not be parsed", async () => {
      const { execa, packageInfoRetriever } = setup();

      const logger = mock<Logger>();
      const context = {
        cwd: "here",
        env: {},
        logger: instance(logger),
      };

      const error = new Error("Not found");
      (error as any).stdout = "not json";

      when(
        execa("npm", ["view", "--json"], {
          cwd: context.cwd,
          env: context.env,
        })
      ).thenReject(error);

      await expect(packageInfoRetriever.getInfo(context)).rejects.toBe(error);

      verifyAll();
    });

    it("should rethrow errors that are not 404s", async () => {
      const { execa, packageInfoRetriever } = setup();

      const logger = mock<Logger>();
      const context = {
        cwd: "here",
        env: {},
        logger: instance(logger),
      };

      const error = new Error("Not found");
      (error as any).stdout = JSON.stringify({
        error: {
          code: "E500",
        },
      });

      when(
        execa("npm", ["view", "--json"], {
          cwd: context.cwd,
          env: context.env,
        })
      ).thenReject(error);

      await expect(packageInfoRetriever.getInfo(context)).rejects.toBe(error);

      verifyAll();
    });

    describe("when some basic info could have been retrieved", () => {
      it("should return undefined if npm config could not be found", async () => {
        const { execa, packageInfoRetriever, fetch } = setup();

        const logger = mock<Logger>();
        const context = {
          cwd: "here",
          env: {},
          logger: instance(logger),
        };

        const basicInfo = {
          name: "some-package",
          version: "1.0.0",
        };

        when(
          execa("npm", ["view", "--json"], {
            cwd: context.cwd,
            env: context.env,
          })
        ).thenResolve({
          stdout: JSON.stringify(basicInfo),
        });

        const result = {
          stdout: JSON.stringify({
            registry: "https://registry.npmjs.org/",
          }),
        };
        when(
          execa("npm", ["config", "list", "--json"], {
            env: context.env,
            cwd: context.cwd,
          })
        ).thenResolve(result);

        when(
          logger.log("Registry used:", "https://registry.npmjs.org/")
        ).thenReturn();

        type Json = () => Promise<any>;
        const json = mock<Json>();

        const response: any = {
          status: 200,
          json: instance(json),
        };

        when(
          fetch(
            `https://registry.npmjs.org/${encodeURIComponent("some-package")}`
          )
        ).thenResolve(response);

        const detailedInfo = {
          name: "some-package",
          version: "1.0.0",
          versions: {
            "1.0.0": {
              name: "some-package",
              version: "1.0.0",
            },
            "2.0.0": {
              name: "some-package",
              version: "2.0.0",
            },
          },
        };

        when(json()).thenResolve(detailedInfo);

        const packageInfo = await packageInfoRetriever.getInfo(context);

        verifyAll();
        expect(packageInfo).toBe(detailedInfo);
      });

      it("should return the detailed info from the registry", async () => {
        const { execa, packageInfoRetriever, fetch } = setup();

        const logger = mock<Logger>();
        const context = {
          cwd: "here",
          env: {},
          logger: instance(logger),
        };

        const basicInfo = {
          name: "some-package",
          version: "1.0.0",
        };

        when(
          execa("npm", ["view", "--json"], {
            cwd: context.cwd,
            env: context.env,
          })
        ).thenResolve({
          stdout: JSON.stringify(basicInfo),
        });

        const result = {
          stdout: JSON.stringify({
            registry: "https://registry.npmjs.org/",
          }),
        };
        when(
          execa("npm", ["config", "list", "--json"], {
            env: context.env,
            cwd: context.cwd,
          })
        ).thenResolve(result);

        when(
          logger.log("Registry used:", "https://registry.npmjs.org/")
        ).thenReturn();

        type Json = () => Promise<any>;
        const json = mock<Json>();

        const response: any = {
          status: 200,
          json: instance(json),
        };

        when(
          fetch(
            `https://registry.npmjs.org/${encodeURIComponent("some-package")}`
          )
        ).thenResolve(response);

        const detailedInfo = {
          name: "some-package",
          version: "1.0.0",
          versions: {
            "1.0.0": {
              name: "some-package",
              version: "1.0.0",
            },
            "2.0.0": {
              name: "some-package",
              version: "2.0.0",
            },
          },
        };

        when(json()).thenResolve(detailedInfo);

        const packageInfo = await packageInfoRetriever.getInfo(context);

        verifyAll();
        expect(packageInfo).toBe(detailedInfo);
      });
    });
  });
});
