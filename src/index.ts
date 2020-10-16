import { Deprecier } from "./deprecier";
import { createOldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";
import tempy from "tempy";

const npmrc = tempy.file({ name: ".npmrc" });

module.exports = createOldVersionDeprecier({
  packageInfoRetriever: new PackageInfoRetriever(),
  ruleApplier: new RuleApplier(),
  deprecier: new Deprecier(npmrc),
});
