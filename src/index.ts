import { createOldVersionDeprecier } from "./old-version-deprecier";
import { VersionsLister } from "./versions-lister";

module.exports = createOldVersionDeprecier({
  versionsLister: new VersionsLister(),
});
