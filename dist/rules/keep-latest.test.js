"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semver_1 = require("semver");
var rule_1 = require("../rule");
var keep_latest_1 = require("./keep-latest");
describe("keep-latest", function () {
    it("should keep the latest version", function () {
        expect.assertions(1);
        var sortedVersions = ["2.0.0", "1.0.0"].map(function (v) { return new semver_1.SemVer(v); });
        var result = keep_latest_1.keepLatest(sortedVersions[0], sortedVersions);
        expect(result).toEqual({ action: rule_1.Action.keep });
    });
    it("should continue with other versions", function () {
        expect.assertions(1);
        var sortedVersions = ["2.0.0", "1.0.0", "1.0.0-alpha.0"].map(function (v) { return new semver_1.SemVer(v); });
        var result = keep_latest_1.keepLatest(sortedVersions[1], sortedVersions);
        expect(result).toEqual({ action: rule_1.Action.continue });
    });
});
