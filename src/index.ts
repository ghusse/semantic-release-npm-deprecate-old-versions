import { createOldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { VersionsLister } from "./versions-lister";

module.exports = createOldVersionDeprecier({
  versionsLister: new VersionsLister(),
  ruleApplier: new RuleApplier(),
});
