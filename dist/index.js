"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deprecier_1 = require("./deprecier");
var old_version_deprecier_1 = require("./old-version-deprecier");
var rule_applier_1 = require("./rule-applier");
var package_info_retriever_1 = require("./package-info-retriever");
var authentifier_1 = require("./authentifier");
module.exports = old_version_deprecier_1.createOldVersionDeprecier({
    packageInfoRetriever: new package_info_retriever_1.PackageInfoRetriever(),
    ruleApplier: new rule_applier_1.RuleApplier(),
    deprecier: new deprecier_1.Deprecier(),
    authentifier: new authentifier_1.Authentifier(),
});
