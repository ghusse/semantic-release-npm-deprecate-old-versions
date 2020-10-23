import { SemVer } from "semver";
import { Action } from "../rule";
import { supportLatest } from "./support-latest";

describe("support-latest", () => {
  it("should support the latest version", () => {
    expect.assertions(1);

    const sortedVersions = ["2.0.0", "1.0.0"].map((v) => new SemVer(v));
    const result = supportLatest(sortedVersions[0], sortedVersions);

    expect(result).toEqual({ action: Action.support });
  });

  it("should continue with other versions", () => {
    expect.assertions(1);

    const sortedVersions = ["2.0.0", "1.0.0", "1.0.0-alpha.0"].map(
      (v) => new SemVer(v)
    );
    const result = supportLatest(sortedVersions[1], sortedVersions);

    expect(result).toEqual({ action: Action.continue });
  });
});
