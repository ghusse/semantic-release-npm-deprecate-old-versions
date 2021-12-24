import { SemVer } from "semver";
import { Action } from "./interfaces/rule.interface";
import { RuleApplicationResultWithOptionalReason } from "./rule-application-result";
import VersionForMessageFinder from "./version-for-message-finder";

describe("VersionForMessageFinder", () => {
  describe("with not supported versions", () => {
    it("should return undefined", () => {
      const target = new VersionForMessageFinder();

      expect(target.findBest([], new SemVer("1.0.0"))).toBe(undefined);
    });
  });

  describe("with a supported version of the same major & minor version", () => {
    it("should return the oldest major + minor supported version", () => {
      const target = new VersionForMessageFinder();

      const results: RuleApplicationResultWithOptionalReason[] = [
        { version: new SemVer("3.0.0"), action: Action.support },
        { version: new SemVer("2.2.0"), action: Action.support },
        { version: new SemVer("2.1.2"), action: Action.support },
        { version: new SemVer("2.1.1"), action: Action.support },
        { version: new SemVer("2.1.0"), action: Action.deprecate },
      ];

      expect(target.findBest(results, new SemVer("2.1.0"))).toEqual(
        new SemVer("2.1.1")
      );
    });
  });

  describe("with a supported version of the same major version", () => {
    it("should return the latest version of the minor still supported", () => {
      const target = new VersionForMessageFinder();

      const results: RuleApplicationResultWithOptionalReason[] = [
        { version: new SemVer("3.0.0"), action: Action.support },
        { version: new SemVer("2.2.2"), action: Action.support },
        { version: new SemVer("2.2.1"), action: Action.support },
        { version: new SemVer("2.2.0"), action: Action.support },
        { version: new SemVer("2.1.0"), action: Action.deprecate },
      ];

      expect(target.findBest(results, new SemVer("2.1.0"))).toEqual(
        new SemVer("2.2.2")
      );
    });
  });

  describe("with a supported version of another major", () => {
    it("should return the latest minor&patch of the oldest supported version", () => {
      const target = new VersionForMessageFinder();

      const results: RuleApplicationResultWithOptionalReason[] = [
        { version: new SemVer("4.0.0"), action: Action.support },
        { version: new SemVer("3.1.1"), action: Action.support },
        { version: new SemVer("3.1.0"), action: Action.support },
        { version: new SemVer("3.0.0"), action: Action.support },
        { version: new SemVer("2.1.0"), action: Action.deprecate },
      ];

      expect(target.findBest(results, new SemVer("2.1.0"))).toEqual(
        new SemVer("3.1.1")
      );
    });
  });
});
