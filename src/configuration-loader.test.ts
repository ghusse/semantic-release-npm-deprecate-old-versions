import { SemVer } from "semver";
import ConfigurationLoader from "./configuration-loader";
import { SupportedDefaultRule } from "./interfaces/plugin-config.interface";

describe("ConfigurationLoader", () => {
  function setup() {
    const injections = {
      deprecateAll: jest.fn().mockReturnValue("deprecate"),
      supportLatest: jest.fn().mockReturnValue("latest"),
      supportPreReleaseIfNotReleased: jest.fn().mockReturnValue("prerelease"),
    };
    const loader = new ConfigurationLoader(injections);
    return { injections, loader };
  }

  describe("when no configuration is provided", () => {
    it("should return the default configuration", () => {
      const { loader, injections } = setup();

      const config = loader.generateRules({});

      expect(config).toHaveLength(3);

      const run1Result = config[0](new SemVer("1.0.0"), []);
      expect(run1Result).toBe("latest");
      expect(injections.supportLatest).toHaveBeenCalledWith(
        undefined,
        new SemVer("1.0.0"),
        []
      );

      const run2Result = config[1](new SemVer("1.0.0"), []);
      expect(run2Result).toBe("prerelease");
      expect(injections.supportPreReleaseIfNotReleased).toHaveBeenCalledWith(
        undefined,
        new SemVer("1.0.0"),
        []
      );

      const run3Result = config[2](new SemVer("1.0.0"), []);
      expect(run3Result).toBe("deprecate");
      expect(injections.deprecateAll).toHaveBeenCalledWith(
        undefined,
        new SemVer("1.0.0"),
        []
      );
    });
  });

  describe("when the configuration contains a function", () => {
    it("should return the function itself", () => {
      const { loader } = setup();
      const rule = jest.fn();

      const config = loader.generateRules({ rules: [rule] });

      expect(config).toHaveLength(1);
      expect(config[0]).toBe(rule);
    });
  });

  describe("when the configuration contains strings", () => {
    it("should return the deprecateAll rule", () => {
      const { loader } = setup();

      const config = loader.generateRules({
        rules: [SupportedDefaultRule.deprecateAll],
      });

      expect(config).toHaveLength(1);
      const runResult = config[0](new SemVer("1.0.0"), []);
      expect(runResult).toBe("deprecate");
    });

    it("should return the supportLatest rule", () => {
      const { loader } = setup();

      const config = loader.generateRules({
        rules: [SupportedDefaultRule.supportLatest],
      });

      expect(config).toHaveLength(1);
      const runResult = config[0](new SemVer("1.0.0"), []);
      expect(runResult).toBe("latest");
    });

    it("should return the supportPreReleaseIfNotReleased rule", () => {
      const { loader } = setup();

      const config = loader.generateRules({
        rules: [SupportedDefaultRule.supportPreReleaseIfNotReleased],
      });

      expect(config).toHaveLength(1);
      const runResult = config[0](new SemVer("1.0.0"), []);
      expect(runResult).toBe("prerelease");
    });

    it("should throw an error if the string is not supported", () => {
      const { loader } = setup();

      expect(() => {
        loader.generateRules({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rules: ["garbage" as any],
        });
      }).toThrowError("Unsupported rule garbage");
    });
  });

  describe("when the configuration contains configuration objects", () => {
    it("should pass options to the supportLatest rule", () => {
      const { loader, injections } = setup();

      const config = loader.generateRules({
        rules: [
          {
            rule: SupportedDefaultRule.supportLatest,
            options: { numberOfMajorReleases: 2 },
          },
        ],
      });

      expect(config).toHaveLength(1);
      config[0](new SemVer("1.0.0"), []);
      expect(injections.supportLatest).toHaveBeenCalledWith(
        { numberOfMajorReleases: 2 },
        new SemVer("1.0.0"),
        []
      );
    });

    it("should pass options to the supportPreReleaseIfNotReleased rule", () => {
      const { loader, injections } = setup();

      const config = loader.generateRules({
        rules: [
          {
            rule: SupportedDefaultRule.supportPreReleaseIfNotReleased,
            options: { numberOfPreReleases: 2 },
          },
        ],
      });

      expect(config).toHaveLength(1);
      config[0](new SemVer("1.0.0"), []);
      expect(injections.supportPreReleaseIfNotReleased).toHaveBeenCalledWith(
        { numberOfPreReleases: 2 },
        new SemVer("1.0.0"),
        []
      );
    });

    it("should throw an error if the rule is not supported", () => {
      const { loader } = setup();

      expect(() => {
        loader.generateRules({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rules: [{ rule: "garbage" as any }],
        });
      }).toThrowError("Unsupported rule garbage");
    });
  });
});
