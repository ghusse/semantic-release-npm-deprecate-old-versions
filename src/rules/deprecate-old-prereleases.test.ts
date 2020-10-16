import { Action } from "../rule";
import { deprecateOldPrereleases } from "./deprecate-old-prereleases";

describe("deprecate-old-prereleases", () => {
  it("should return Continue if the version is the only alpha", () => {
    expect.assertions(1);
    const version = "1.0.0-alpha.1";
    const allVersions = ["1.0.0", "1.0.0-alpha.1"];

    const result = deprecateOldPrereleases(version, allVersions);

    expect(result).toEqual(Action.continue);
  });

  describe("with two alpha versions", () => {
    it("should return Deprecate on the oldest", () => {
      expect.assertions(1);
      const version = "1.0.0-alpha.1";
      const allVersions = ["1.0.0", "1.0.0-alpha.2", "1.0.0-alpha.1"];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual(Action.deprecate);
    });

    it("should return continue on the newest", () => {
      expect.assertions(1);
      const version = "1.0.0-alpha.2";
      const allVersions = ["1.0.0", "1.0.0-alpha.2", "1.0.0-alpha.1"];

      const result = deprecateOldPrereleases(version, allVersions);

      expect(result).toEqual(Action.continue);
    });
  });
});
