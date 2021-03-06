## [1.1.6](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.5...v1.1.6) (2021-03-19)


### Bug Fixes

* remove force on the call to deprecate ([d575f49](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/d575f49f56871773c936ca0f037f6451cb2f99c6))

## [1.1.5](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.4...v1.1.5) (2021-03-19)


### Bug Fixes

* correctly wait for the depreciation to finish before setting the task as completed ([#6](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/issues/6)) ([949f7a4](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/949f7a49c16b231b1cf6b1c681cae6dfbd27b3f4))

## [1.1.4](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.3...v1.1.4) (2021-03-19)


### Bug Fixes

* "invalid version range" error when deprecating versions ([#5](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/issues/5)) ([2b4712e](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/2b4712e1cf267c014f9a2f16360294360a342d44))

## [1.1.3](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.2...v1.1.3) (2021-03-19)


### Bug Fixes

* ignore npm errors when versions are already deprecated ([#4](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/issues/4)) ([f386c74](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/f386c74471260879b43e1d65ed373cf975657c23))

## [1.1.2](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.1...v1.1.2) (2021-01-22)


### Bug Fixes

* configuration of the supportPreReleaseIfNotReleased rule ([2d0939c](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/2d0939c602675ec5521855489eba05b33d4725b7))
* correctly detect configurtion for the rule supportPreReleaseIfNotReleased ([1432c50](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/1432c50bc1e08c89848a40d6c4be460b4ffb1d5b))

## [1.1.1](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.1.0...v1.1.1) (2021-01-22)


### Bug Fixes

* correctly detect configuration for the rume supportPreReleaseIfNotReleased ([4593bcf](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/4593bcf3351b5c690a8e8b1e73a08d36f6adad9a))

# [1.1.0](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.0.1...v1.1.0) (2021-01-08)


### Features

* add a configuration option to support all major/minor/patch versions ([#2](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/issues/2)) ([ac26b69](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/ac26b697967c055a61cb697394855154323e4b11))

## [1.0.1](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.0.0...v1.0.1) (2020-10-23)


### Bug Fixes

* :memo: minor change to update the published README on npm ([e4a9095](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/e4a9095d3054e2db1623cce2688b7924a8efb31c))

# 1.0.0 (2020-10-23)


### Bug Fixes

* :bug: correctly set the authentication token before deprecating versions ([cc5528d](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/cc5528d394ee53bd2965c59e943696f8cd894851))
* fix the instanciation of a service ([6638b77](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/6638b7775e6db4aece0c5564667a0b737e04094a))
* fix warnings by removing useless methods, fix method names ([65572e5](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/65572e55708d31519754a1f4335675f16a8fc39f))
* remove nonsense ([5c52851](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/5c52851c9750b2559e55e11f62b50c5048c3efb9))


### Features

* :sparkles: support configuration ([259bf6b](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/259bf6bcff490720e1f2cd0d6c915567f300e5fe))
* create a new plugin and use it in the release process ([78951ac](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/78951ac720d36c01e0764b9c16861514242c1166))
* depreciate versions ([8b11967](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/8b1196745cac94884b85bf898dd1878c5b8ad882))
* detect already published versions ([f27e8fe](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/f27e8fea3272b3cccbba58288aa266574b39432c))
* detect versions to deprecate by applying rules ([54ae121](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/54ae121af99754ae8cf6b2573f323391b53c9b4b))
* implement and test new rules, that can take options ([fec9e9c](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/fec9e9c4a9452ffb0fb44e35395c93a68384bfd2))
* initial release ([298cc9a](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/298cc9a34d805b15be07bc85f9e55048dab0efdc))

# [1.0.0-alpha.8](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-10-23)


### Bug Fixes

* fix the instanciation of a service ([6638b77](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/6638b7775e6db4aece0c5564667a0b737e04094a))


### Features

* :sparkles: support configuration ([259bf6b](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/259bf6bcff490720e1f2cd0d6c915567f300e5fe))

# [1.0.0-alpha.7](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-10-23)


### Features

* implement and test new rules, that can take options ([fec9e9c](https://github.com/ghusse/semantic-release-npm-deprecate-old-versions/commit/fec9e9c4a9452ffb0fb44e35395c93a68384bfd2))
