import { Deprecier } from "./deprecier";
import { OldVersionDeprecier } from "./old-version-deprecier";
import { RuleApplier } from "./rule-applier";
import { PackageInfoRetriever } from "./package-info-retriever";
import { Authentifier } from "./authentifier";
import VersionForMessageFinder from "./version-for-message-finder";
import ConfigurationLoader from "./configuration-loader";
import { deprecateAll } from "./rules/deprecate-all";
import { supportLatest } from "./rules/support-latest";
import { supportPreReleaseIfNotReleased } from "./rules/support-prerelease-if-not-released";
import listActiveVersions from "./list-active-versions";
import { DeprecierState } from "./deprecier-state";
import fetch from "node-fetch";
import execa from "execa";
import { Npm } from "./npm";
import { NpmApi } from "./npm-api";

const npm = new Npm(execa);

const oldVersionDeprecier = new OldVersionDeprecier(
  new PackageInfoRetriever(new NpmApi(fetch), npm),
  new RuleApplier(new VersionForMessageFinder()),
  new Deprecier(npm),
  new Authentifier(npm),
  new ConfigurationLoader({
    deprecateAll: deprecateAll,
    supportLatest: supportLatest,
    supportPreReleaseIfNotReleased: supportPreReleaseIfNotReleased,
  }),
  listActiveVersions,
  npm,
  new DeprecierState()
);

module.exports = {
  verifyConditions: oldVersionDeprecier.verifyConditions.bind(
    oldVersionDeprecier
  ),
  prepare: oldVersionDeprecier.prepare.bind(oldVersionDeprecier),
  publish: oldVersionDeprecier.publish.bind(oldVersionDeprecier),
};
