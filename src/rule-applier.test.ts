import { SemVer } from "semver";
import { Action } from "./rule";
import { RuleApplier } from "./rule-applier";

describe("rule-applier", () => {
  it("should return the first result that is not continue", () => {
    expect.assertions(1);

    const versions = ["1.0.0"].map((v) => new SemVer(v));
    const rules = [jest.fn(), jest.fn(), jest.fn()];
    const ruleApplier = new RuleApplier();

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
    const ruleApplier = new RuleApplier();

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
});
