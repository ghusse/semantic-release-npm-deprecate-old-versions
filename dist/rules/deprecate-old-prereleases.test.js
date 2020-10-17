"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semver_1 = require("semver");
var rule_1 = require("../rule");
var deprecate_old_prereleases_1 = require("./deprecate-old-prereleases");
describe("deprecate-old-prereleases", function () {
    it("should return Continue if the version is the only alpha", function () {
        expect.assertions(1);
        var allVersions = ["1.0.0-alpha.1"].map(function (v) { return new semver_1.SemVer(v); });
        var version = allVersions[0];
        var result = deprecate_old_prereleases_1.deprecateOldPrereleases(version, allVersions);
        expect(result).toEqual({ action: rule_1.Action.continue });
    });
    describe("with two alpha versions", function () {
        it("should return Deprecate on the oldest", function () {
            expect.assertions(1);
            var allVersions = ["1.0.0-alpha.2", "1.0.0-alpha.1"].map(function (v) { return new semver_1.SemVer(v); });
            var version = allVersions[1];
            var result = deprecate_old_prereleases_1.deprecateOldPrereleases(version, allVersions);
            expect(result).toEqual({
                action: rule_1.Action.deprecate,
                reason: "Deprecated in favor of 1.0.0-alpha.2",
            });
        });
        it("should return continue on the newest", function () {
            expect.assertions(1);
            var allVersions = ["1.0.0-alpha.2", "1.0.0-alpha.1"].map(function (v) { return new semver_1.SemVer(v); });
            var version = allVersions[0];
            var result = deprecate_old_prereleases_1.deprecateOldPrereleases(version, allVersions);
            expect(result).toEqual({ action: rule_1.Action.continue });
        });
        it("should deprecate the pre-release if the release has been released", function () {
            expect.assertions(1);
            var allVersions = ["1.0.0", "1.0.0-alpha.2"].map(function (v) { return new semver_1.SemVer(v); });
            var version = allVersions[1];
            var result = deprecate_old_prereleases_1.deprecateOldPrereleases(version, allVersions);
            expect(result).toEqual({
                action: rule_1.Action.deprecate,
                reason: "Deprecated in favor of 1.0.0",
            });
        });
        it("should not deprecate the pre-release if the exact release has not been released", function () {
            expect.assertions(1);
            var allVersions = ["2.0.0", "1.1.0-alpha.2", "1.0.0"].map(function (v) { return new semver_1.SemVer(v); });
            var version = allVersions[0];
            var result = deprecate_old_prereleases_1.deprecateOldPrereleases(version, allVersions);
            expect(result).toEqual({ action: rule_1.Action.continue });
        });
    });
});
