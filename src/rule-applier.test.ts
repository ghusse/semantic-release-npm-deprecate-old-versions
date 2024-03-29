import { SemVer } from "semver";
import { Action } from "./interfaces/rule.interface";
import { RuleApplier } from "./rule-applier";

describe("rule-applier", () => {
  it("should return the first result that is not continue", () => {
    expect.assertions(1);

    const versions = ["1.0.0"].map((v) => new SemVer(v));
    const rules = [jest.fn(), jest.fn(), jest.fn()];
    const ruleApplier = new RuleApplier(undefined as any);

    rules[0].mockReturnValue({ action: Action.continue });
    rules[1].mockReturnValue({
      action: Action.deprecate,
      reason: "A good reason",
    });
    rules[2].mockReturnValue({ action: Action.support });

    const result = ruleApplier.applyRules(versions, rules);

    expect(result).toEqual([
      {
        action: Action.deprecate,
        version: new SemVer(versions[0]),
        reason: "A good reason",
      },
    ]);
  });

  it("should sort versions from the newest to the oldest", () => {
    expect.assertions(4);

    const versions = ["1.0.0-alpha.1", "1.0.0-beta.0", "2.0.0", "1.0.0"].map(
      (v) => new SemVer(v)
    );
    const rule = jest.fn();
    const ruleApplier = new RuleApplier(undefined as any);

    rule.mockReturnValue({ action: Action.continue });

    const expectedSortedVersions = [
      "2.0.0",
      "1.0.0",
      "1.0.0-beta.0",
      "1.0.0-alpha.1",
    ].map((v) => new SemVer(v));

    const result = ruleApplier.applyRules(versions, [rule]);

    expect(rule).toHaveBeenCalledTimes(versions.length);
    expect(rule).nthCalledWith(1, new SemVer("2.0.0"), expectedSortedVersions);
    expect(rule).lastCalledWith(
      new SemVer("1.0.0-alpha.1"),
      expectedSortedVersions
    );
    expect(result).toEqual([
      { version: new SemVer("2.0.0"), action: Action.continue },
      { version: new SemVer("1.0.0"), action: Action.continue },
      { version: new SemVer("1.0.0-beta.0"), action: Action.continue },
      { version: new SemVer("1.0.0-alpha.1"), action: Action.continue },
    ]);
  });

  it("should generate deprecation messages when they are not present", () => {
    expect.assertions(1);

    const versions = ["1.0.0"].map((v) => new SemVer(v));
    const rule = jest.fn();
    const versionFinder = {
      findBest: jest.fn(),
    };
    const ruleApplier = new RuleApplier(versionFinder as any);

    versionFinder.findBest.mockReturnValue(new SemVer("2.0.0"));
    rule.mockReturnValue({ action: Action.deprecate });

    const result = ruleApplier.applyRules(versions, [rule]);

    expect(result).toEqual([
      {
        version: new SemVer("1.0.0"),
        action: Action.deprecate,
        reason: "Deprecated in favor of 2.0.0",
      },
    ]);
  });
});
