import { SemVer } from "semver";
import { Action } from "../rule";
import { supportLatest, SupportLatestOptions } from "./support-latest";

describe("support-latest", () => {
  function generateVersions() {
    const sortedVersions = [
      "3.0.0-alpha.0",
      "2.2.2",
      "2.2.1",
      "2.2.0",
      "2.1.2",
      "2.1.1",
      "2.1.0",
      "2.0.2",
      "2.0.1",
      "2.0.0",
      "1.2.2",
      "1.2.1",
      "1.2.0",
      "1.1.2",
      "1.1.1",
      "1.1.0",
      "1.0.2",
      "1.0.1",
      "1.0.0",
    ].map((v) => new SemVer(v));

    return sortedVersions;
  }
  describe("with default parameters", () => {
    it("should support the latest stable release", () => {
      expect.assertions(1);
      const result = supportLatest(
        undefined,
        new SemVer("2.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the latest prerelease", () => {
      expect.assertions(1);
      const result = supportLatest(
        undefined,
        new SemVer("3.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the major-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        undefined,
        new SemVer("1.0.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        undefined,
        new SemVer("2.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the patch-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        undefined,
        new SemVer("2.2.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });

  describe("with numberOfMajorReleases=2", () => {
    function generateOptions(): SupportLatestOptions {
      return {
        numberOfMajorReleases: 2,
      };
    }
    it("should support the latest version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should support the latest-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the latest major, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest major-1, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest major, latest minor, patch-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.2.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest-1 major, latest minor, patch-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.2.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest prerelease", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("3.0.0-alpha.0"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });

  describe("with numberOfMinorReleases=2", () => {
    function generateOptions(): SupportLatestOptions {
      return {
        numberOfMinorReleases: 2,
      };
    }
    it("should support the latest version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue with the latest major-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should support on the latest major, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue on the latest major-1, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });
  });

  describe("with numberOfPatchReleases=2", () => {
    function generateOptions(): SupportLatestOptions {
      return {
        numberOfPatchReleases: 2,
      };
    }
    it("should support the latest version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });

    it("should continue with the latest major-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.2.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest major, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should continue on the latest major-1, minor-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("1.1.2"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.continue });
    });

    it("should support the latest major, minor and patch-1 version", () => {
      expect.assertions(1);
      const result = supportLatest(
        generateOptions(),
        new SemVer("2.2.1"),
        generateVersions()
      );
      expect(result).toEqual({ action: Action.support });
    });
  });
});
