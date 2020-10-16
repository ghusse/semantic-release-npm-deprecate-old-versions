import { SemVer } from "semver";
import { Action } from "../rule";
import { deprecateOldPrereleases } from "./deprecate-old-prereleases";

describe("deprecate-old-prereleases", () => {
  it("should return Continue if the version is the only alpha", () => {
    expect.assertions(1);
    const allVersions = ["1.0.0-alpha.1"].map((v) => new SemVer(v));
    const version = allVersions[0];

    const result = deprecateOldPrereleases(version, allVersions);

    expect(result).toEqual({ action: Action.continue });
  });

  describe("with two alpha versions", () => {
    it("should return Deprecate on the oldest", () => {
      expect.assertions(1);
      const allVersions = ["1.0.0-alpha.2", "1.0.0-alpha.1"].map(
        (v) => new SemVer(v)
      );
      const version = allVersions[1];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual({
        action: Action.deprecate,
        reason: "Deprecated in favor of 1.0.0-alpha.2",
      });
    });

    it("should return continue on the newest", () => {
      expect.assertions(1);
      const allVersions = ["1.0.0-alpha.2", "1.0.0-alpha.1"].map(
        (v) => new SemVer(v)
      );
      const version = allVersions[0];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual({ action: Action.continue });
    });

    it("should deprecate the pre-release if the release has been released", () => {
      expect.assertions(1);
      const allVersions = ["1.0.0", "1.0.0-alpha.2"].map((v) => new SemVer(v));
      const version = allVersions[1];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual({
        action: Action.deprecate,
        reason: "Deprecated in favor of 1.0.0",
      });
    });

    it("should not deprecate the pre-release if the exact release has not been released", () => {
      expect.assertions(1);
      const allVersions = ["2.0.0", "1.1.0-alpha.2", "1.0.0"].map(
        (v) => new SemVer(v)
      );
      const version = allVersions[0];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual({ action: Action.continue });
    });
  });
});
