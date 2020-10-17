"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOldVersionDeprecier = void 0;
var deprecate_old_prereleases_1 = require("./rules/deprecate-old-prereleases");
var rule_1 = require("./rule");
var keep_latest_1 = require("./rules/keep-latest");
var semver_1 = require("semver");
function createOldVersionDeprecier(_a) {
    var packageInfoRetriever = _a.packageInfoRetriever, ruleApplier = _a.ruleApplier, deprecier = _a.deprecier, authentifier = _a.authentifier;
    var rules = [];
    function verifyConditions(pluginConfig, context) {
        return __awaiter(this, void 0, void 0, function () {
            var logger;
            return __generator(this, function (_a) {
                logger = context.logger;
                logger.log("using default configuration");
                rules = [keep_latest_1.keepLatest, deprecate_old_prereleases_1.deprecateOldPrereleases];
                return [2 /*return*/];
            });
        });
    }
    function analyzeCommits(pluginConfig, context) {
        return __awaiter(this, void 0, void 0, function () {
            var logger;
            return __generator(this, function (_a) {
                logger = context.logger;
                logger.log("analyzeCommits");
                return [2 /*return*/];
            });
        });
    }
    function prepare(pluginConfig, context) {
        return __awaiter(this, void 0, void 0, function () {
            var logger;
            return __generator(this, function (_a) {
                logger = context.logger;
                logger.log("prepare");
                return [2 /*return*/];
            });
        });
    }
    function publish(pluginConfig, context) {
        return __awaiter(this, void 0, void 0, function () {
            var logger, cwd, env, packageInfo, parsedVersions, actionsOnVersions, depreciations, _i, depreciations_1, depreciation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = context.logger, cwd = context.cwd, env = context.env;
                        return [4 /*yield*/, packageInfoRetriever.getInfo({
                                cwd: cwd,
                                env: env,
                                logger: logger,
                            })];
                    case 1:
                        packageInfo = _a.sent();
                        if (!packageInfo) {
                            return [2 /*return*/];
                        }
                        parsedVersions = packageInfo.versions.map(function (v) { return new semver_1.SemVer(v); });
                        actionsOnVersions = ruleApplier.applyRules(parsedVersions, rules);
                        depreciations = actionsOnVersions
                            .filter(function (actionOnVersion) { return actionOnVersion.action === rule_1.Action.deprecate; })
                            .map(function (actionsOnVersion) { return actionsOnVersion; });
                        if (!depreciations) return [3 /*break*/, 7];
                        logger.log.apply(logger, __spreadArrays(["Versions to deprecate"], depreciations.map(function (v) { return v.version.format(); })));
                        return [4 /*yield*/, authentifier.authentify(context)];
                    case 2:
                        _a.sent();
                        _i = 0, depreciations_1 = depreciations;
                        _a.label = 3;
                    case 3:
                        if (!(_i < depreciations_1.length)) return [3 /*break*/, 6];
                        depreciation = depreciations_1[_i];
                        return [4 /*yield*/, deprecier.deprecate(packageInfo, depreciation, {
                                cwd: cwd,
                                env: env,
                                logger: logger,
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        logger.log("No version to deprecate");
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    return {
        verifyConditions: verifyConditions,
        analyzeCommits: analyzeCommits,
        prepare: prepare,
        publish: publish,
    };
}
exports.createOldVersionDeprecier = createOldVersionDeprecier;
