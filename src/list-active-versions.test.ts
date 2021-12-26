import listActiveVersions from "./list-active-versions";
import { PackageInfo } from "./interfaces/package-info.interface";

describe("listActiveVersions", () => {
  it("should return versions that are not deprecated", () => {
    const packageInfo: PackageInfo = {
      name: "foo",
      versions: {
        "0.0.1": {
          name: "foo",
          version: "0.0.1",
        },
        "0.0.2": {
          name: "foo",
          version: "0.0.2",
        },
      },
    };

    const result = listActiveVersions(packageInfo);

    expect(result).toEqual(["0.0.1", "0.0.2"]);
  });

  it("should not return deprecated versions", () => {
    const packageInfo: PackageInfo = {
      name: "foo",
      versions: {
        "0.0.1": {
          name: "foo",
          version: "0.0.1",
          deprecated: "",
        },
        "0.0.2": {
          name: "foo",
          version: "0.0.2",
          deprecated: "In favor of 0.0.3",
        },
      },
    };

    const result = listActiveVersions(packageInfo);

    expect(result).toEqual([]);
  });
});
