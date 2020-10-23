import { Deprecier } from "./deprecier";
import { OldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";
import { Authentifier } from "./authentifier";
import VersionForMessageFinder from "./version-for-message-finder";

const oldVersionDeprecier = new OldVersionDeprecier(
  new PackageInfoRetriever(),
  new RuleApplier(new VersionForMessageFinder()),
  new Deprecier(),
  new Authentifier()
);

module.exports = {
  verifyConditions: oldVersionDeprecier.verifyConditions.bind(
    oldVersionDeprecier
  ),
  prepare: oldVersionDeprecier.prepare.bind(oldVersionDeprecier),
  analyzeCommits: oldVersionDeprecier.analyzeCommits.bind(oldVersionDeprecier),
  publish: oldVersionDeprecier.publish.bind(oldVersionDeprecier),
};
