import { Deprecier } from "./deprecier";
import { OldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";
import { Authentifier } from "./authentifier";

const oldVersionDeprecier = new OldVersionDeprecier({
  packageInfoRetriever: new PackageInfoRetriever(),
  ruleApplier: new RuleApplier(),
  deprecier: new Deprecier(),
  authentifier: new Authentifier(),
});

module.exports = {
  verifyConditions: oldVersionDeprecier.verifyConditions.bind(
    oldVersionDeprecier
  ),
  prepare: oldVersionDeprecier.prepare.bind(oldVersionDeprecier),
  analyzeCommits: oldVersionDeprecier.analyzeCommits.bind(oldVersionDeprecier),
  publish: oldVersionDeprecier.publish.bind(oldVersionDeprecier),
};
