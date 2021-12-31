export interface PackageBasicInfo {
  name: string;
  version: string;
  versions: string[];
}

export interface PackageInfo {
  name: string;
  description?: string;
  versions: {
    [key: string]: {
      name: string;
      version: string;
      deprecated?: string;
    };
  };
}
