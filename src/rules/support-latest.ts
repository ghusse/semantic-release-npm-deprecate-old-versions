import { SemVer } from "semver";
import { Action, Rule, RuleResult } from "../rule";

const DEFAULT_OPTIONS: SupportLatestOptions = {
  numberOfMajorReleases: 1,
  numberOfMinorReleases: 1,
  numberOfPatchReleases: 1,
};

export interface SupportLatestOptions {
  numberOfMajorReleases?: number;
  numberOfMinorReleases?: number;
  numberOfPatchReleases?: number;
}

export const supportLatest: Rule<SupportLatestOptions> = (
  options: SupportLatestOptions | undefined,
  version: SemVer,
  allVersionsSortedLatestFirst: SemVer[]
): RuleResult => {
  const realOptions = {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  };

  if (version.prerelease.length) {
    return { action: Action.continue };
  }

  const supported = new Map<number, Map<number, Set<number>>>();

  for (const currentVersion of allVersionsSortedLatestFirst) {
    if (currentVersion.prerelease.length) {
      continue;
    }

    const minorSupported = addMajorAndReturnMinorSupported(
      supported,
      currentVersion
    );

    const patchSupported = addMinorAndReturnPatchSupported(
      minorSupported,
      currentVersion
    );

    patchSupported.add(currentVersion.patch);

    if (supported.size > (realOptions.numberOfMajorReleases || 1)) {
      return { action: Action.continue };
    }

    if (
      minorSupported.size > (realOptions.numberOfMinorReleases || 1) &&
      version.major === currentVersion.major
    ) {
      return { action: Action.continue };
    }
    if (
      patchSupported.size > (realOptions.numberOfPatchReleases || 1) &&
      version.major === currentVersion.major &&
      version.minor === currentVersion.minor
    ) {
      return { action: Action.continue };
    }

    if (currentVersion.compare(version) === 0) {
      break;
    }
  }

  return { action: Action.support };
};

function addMajorAndReturnMinorSupported(
  supported: Map<number, Map<number, Set<number>>>,
  currentVersion: SemVer
): Map<number, Set<number>> {
  if (!supported.has(currentVersion.major)) {
    supported.set(currentVersion.major, new Map<number, Set<number>>());
  }
  return supported.get(currentVersion.major) as Map<number, Set<number>>;
}

function addMinorAndReturnPatchSupported(
  minorSupported: Map<number, Set<number>>,
  currentVersion: SemVer
): Set<number> {
  if (!minorSupported?.has(currentVersion.minor)) {
    minorSupported?.set(currentVersion.minor, new Set<number>());
  }
  return minorSupported?.get(currentVersion.minor) as Set<number>;
}
