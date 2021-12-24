import { PackageInfo } from "./interfaces/package-info.interface";

export default function listActiveVersions(packageInfo: PackageInfo): string[] {
  return Object.values(packageInfo.versions)
    .filter((v) => !Object.prototype.hasOwnProperty.call(v, "deprecated"))
    .map((v) => v.version);
}

export type ListActiveVersions = (packageInfo: PackageInfo) => string[];
