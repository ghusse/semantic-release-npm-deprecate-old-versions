import { SemVer } from "semver";
import { Action } from "../rule";
import { keepLatest } from "./keep-latest";

describe("keep-latest", () => {
  it("should keep the latest version", () => {
    expect.assertions(1);

    const sortedVersions = ["2.0.0", "1.0.0"].map((v) => new SemVer(v));
    const result = keepLatest(sortedVersions[0], sortedVersions);

    expect(result).toEqual({ action: Action.keep });
  });

  it("should continue with other versions", () => {
    expect.assertions(1);

    const sortedVersions = ["2.0.0", "1.0.0", "1.0.0-alpha.0"].map(
      (v) => new SemVer(v)
    );
    const result = keepLatest(sortedVersions[1], sortedVersions);

    expect(result).toEqual({ action: Action.continue });
  });
});
