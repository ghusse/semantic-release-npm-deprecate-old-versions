import { Deprecier } from "./deprecier";
import { createOldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";

module.exports = createOldVersionDeprecier({
  packageInfoRetriever: new PackageInfoRetriever(),
  ruleApplier: new RuleApplier(),
  deprecier: new Deprecier(),
});
