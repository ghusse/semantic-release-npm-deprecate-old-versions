"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleApplier = void 0;
var rsort_1 = __importDefault(require("semver/functions/rsort"));
var rule_1 = require("./rule");
var RuleApplier = /** @class */ (function () {
    function RuleApplier() {
    }
    RuleApplier.prototype.applyRules = function (versions, rules) {
        var sortedVersions = rsort_1.default(versions);
        return sortedVersions.map(function (version) {
            return rules.reduce(function (accumulator, rule) {
                if (accumulator.action === rule_1.Action.continue) {
                    return __assign({ version: version }, rule(version, sortedVersions));
                }
                return accumulator;
            }, { action: rule_1.Action.continue, version: version });
        });
    };
    return RuleApplier;
}());
exports.RuleApplier = RuleApplier;
