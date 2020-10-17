"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecateOldPrereleases = void 0;
var prerelease_1 = __importDefault(require("semver/functions/prerelease"));
var rule_1 = require("../rule");
exports.deprecateOldPrereleases = function (version, allVersionsSortedLatestFirst) {
    var preReleaseTags = prerelease_1.default(version);
    if (!preReleaseTags) {
        return { action: rule_1.Action.continue };
    }
    for (var _i = 0, allVersionsSortedLatestFirst_1 = allVersionsSortedLatestFirst; _i < allVersionsSortedLatestFirst_1.length; _i++) {
        var oneVersion = allVersionsSortedLatestFirst_1[_i];
        if (oneVersion.compare(version) === 0) {
            return { action: rule_1.Action.continue };
        }
        if (oneVersion.major === version.major &&
            oneVersion.minor === version.minor &&
            oneVersion.patch === version.patch) {
            return {
                action: rule_1.Action.deprecate,
                reason: "Deprecated in favor of " + oneVersion,
            };
        }
    }
    return { action: rule_1.Action.continue };
};
