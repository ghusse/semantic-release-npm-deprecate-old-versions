import { SemVer } from "semver";
import { Action } from "../interfaces/rule.interface";
import {
  supportPreReleaseIfNotReleased,
  SupportPreReleaseOptions,
} from "./support-prerelease-if-not-released";

describe("support-prerelease-if-not-released", () => {
  function generateVersions() {
    const sortedVersions = [
      "3.0.0-alpha.2",
      "3.0.0-alpha.1",
      "3.0.0-alpha.0",
      "2.0.0",
      "2.0.0-alpha.0",
    ].map((v) => new SemVer(v));

    return sortedVersions;
  }
  describe("with default parameters", () => {
    it("should support the latest alpha release", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        undefined,
        new SemVer("3.0.0-alpha.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the latest prerelease-1", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        undefined,
        new SemVer("3.0.0-alpha.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest released version", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        undefined,
        new SemVer("2.0.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on alpha version for which a release is present", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        undefined,
        new SemVer("2.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });

  describe("with numberOfMajorReleases=2", () => {
    function generateOptions(): SupportPreReleaseOptions {
      return {
        numberOfPreReleases: 2,
      };
    }
    it("should support the latest alpha version", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should support the latest-1 alpha version", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the latest-2 alpha", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the released alpha", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("2.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });

  describe("with numberOfMajorReleases=all", () => {
    function generateOptions(): SupportPreReleaseOptions {
      return {
        numberOfPreReleases: "all",
      };
    }
    it("should support the latest alpha version", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should support the latest-1 alpha version", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should support on the latest-2 alpha", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("3.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the released alpha", () => {
      expect.assertions(1);
      const result = supportPreReleaseIfNotReleased(
        generateOptions(),
        new SemVer("2.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });
});
