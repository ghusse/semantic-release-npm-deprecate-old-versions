import { SemVer } from "semver";
import { Action } from "./rule";
import { RuleApplicationResultWithOptionalReason } from "./rule-application-result";

export default class VersionForMessageFinder {
  public findBest(
    results: RuleApplicationResultWithOptionalReason[],
    deprecatedVersion: SemVer
  ): SemVer | undefined {
    const supportedVersions = results
      .filter((result) => result.action !== Action.deprecate)
      .map((result) => result.version);

    return (
      this.findOldestWithSameMajorAndMinor(
        supportedVersions,
        deprecatedVersion
      ) ||
      this.findLatestOfOldestSupportedMinor(
        supportedVersions,
        deprecatedVersion
      ) ||
      this.findLatestOfOldestSupportedMajor(supportedVersions)
    );
  }

  private findOldestWithSameMajorAndMinor(
    supportedVersions: SemVer[],
    deprecatedVersion: SemVer
  ): SemVer | undefined {
    const supportedVersionReversed = [...supportedVersions].reverse();
    for (const candidate of supportedVersionReversed) {
      if (
        candidate.major === deprecatedVersion.major &&
        candidate.minor === deprecatedVersion.minor
      ) {
        return candidate;
      }
    }

    return undefined;
  }

  private findLatestOfOldestSupportedMinor(
    supportedVersions: SemVer[],
    deprecatedVersion: SemVer
  ): SemVer | undefined {
    const supportedVersionsOfSameMajor = supportedVersions.filter(
      (version) => version.major === deprecatedVersion.major
    );

    const oldestSupported = supportedVersions.pop();

    if (!oldestSupported) {
      return undefined;
    }

    const supportedVersionsOfSameMinor = supportedVersionsOfSameMajor.filter(
      (version) => version.minor === oldestSupported.minor
    );

    return supportedVersionsOfSameMinor[0];
  }

  private findLatestOfOldestSupportedMajor(
    supportedVersions: SemVer[]
  ): SemVer | undefined {
    const oldestSupported = supportedVersions.pop();

    if (!oldestSupported) {
      return undefined;
    }

    const supportedVersionsOfSameMajorAndMinor = supportedVersions.filter(
      (version) =>
        version.major === oldestSupported.major &&
        version.minor === oldestSupported.minor
    );

    return supportedVersionsOfSameMajorAndMinor[0];
  }
}
