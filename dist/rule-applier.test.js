"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semver_1 = require("semver");
var rule_1 = require("./rule");
var rule_applier_1 = require("./rule-applier");
describe("rule-applier", function () {
    it("should return the first result that is not continue", function () {
        expect.assertions(1);
        var versions = ["1.0.0"].map(function (v) { return new semver_1.SemVer(v); });
        var rules = [jest.fn(), jest.fn(), jest.fn()];
        var ruleApplier = new rule_applier_1.RuleApplier();
        rules[0].mockReturnValue({ action: rule_1.Action.continue });
        rules[1].mockReturnValue({
            action: rule_1.Action.deprecate,
            reason: "A good reason",
        });
        rules[2].mockReturnValue({ action: rule_1.Action.keep });
        var result = ruleApplier.applyRules(versions, rules);
        expect(result).toEqual([
            {
                action: rule_1.Action.deprecate,
                version: new semver_1.SemVer(versions[0]),
                reason: "A good reason",
            },
        ]);
    });
    it("should sort versions from the newest to the oldest", function () {
        expect.assertions(4);
        var versions = ["1.0.0-alpha.1", "1.0.0-beta.0", "2.0.0", "1.0.0"].map(function (v) { return new semver_1.SemVer(v); });
        var rule = jest.fn();
        var ruleApplier = new rule_applier_1.RuleApplier();
        rule.mockReturnValue({ action: rule_1.Action.continue });
        var expectedSortedVersions = [
            "2.0.0",
            "1.0.0",
            "1.0.0-beta.0",
            "1.0.0-alpha.1",
        ].map(function (v) { return new semver_1.SemVer(v); });
        var result = ruleApplier.applyRules(versions, [rule]);
        expect(rule).toHaveBeenCalledTimes(versions.length);
        expect(rule).nthCalledWith(1, new semver_1.SemVer("2.0.0"), expectedSortedVersions);
        expect(rule).lastCalledWith(new semver_1.SemVer("1.0.0-alpha.1"), expectedSortedVersions);
        expect(result).toEqual([
            { version: new semver_1.SemVer("2.0.0"), action: rule_1.Action.continue },
            { version: new semver_1.SemVer("1.0.0"), action: rule_1.Action.continue },
            { version: new semver_1.SemVer("1.0.0-beta.0"), action: rule_1.Action.continue },
            { version: new semver_1.SemVer("1.0.0-alpha.1"), action: rule_1.Action.continue },
        ]);
    });
});
