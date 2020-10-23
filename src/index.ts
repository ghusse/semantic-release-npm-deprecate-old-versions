import { Deprecier } from "./deprecier";
import { OldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";
import { Authentifier } from "./authentifier";
import VersionForMessageFinder from "./version-for-message-finder";
import ConfigurationLoader from "./configuration-loader";

const oldVersionDeprecier = new OldVersionDeprecier(
  new PackageInfoRetriever(),
  new RuleApplier(new VersionForMessageFinder()),
  new Deprecier(),
  new Authentifier(),
  new ConfigurationLoader()
);

module.exports = {
  verifyConditions: oldVersionDeprecier.verifyConditions.bind(
    oldVersionDeprecier
  ),
  publish: oldVersionDeprecier.publish.bind(oldVersionDeprecier),
};
