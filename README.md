[![Maintainability](https://api.codeclimate.com/v1/badges/29751e470914f5b5dd20/maintainability)](https://codeclimate.com/github/ghusse/semantic-release-npm-deprecate-old-versions/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/29751e470914f5b5dd20/test_coverage)](https://codeclimate.com/github/ghusse/semantic-release-npm-deprecate-old-versions/test_coverage)

## Installation and usage

- Install with: `npm install semantic-release-npm-deprecate-old-versions --save-dev`
- Set the environment variable `NPM_TOKEN` (same config than `@semantic-release/npm`)
- Update your `releaserc` configuration file

### Configuration

```json
{
  "plugins": [
    "@semantic-release/npm", 
    "semantic-release-npm-deprecate-old-versions"
  ]
}
```

Equivalent to:
```json
{
  "plugins": [
    "@semantic-release/npm", 
    ["semantic-release-npm-deprecate-old-versions", {
      "rules": [
        "supportLatest",
        "supportPreReleaseIfNotReleased",
        "deprecateAll"
      ]
    }]
  ]
}
```

Equivalent to:
```json
{
  "plugins": [
    "@semantic-release/npm", 
    ["semantic-release-npm-deprecate-old-versions", {
      "rules": [
        { 
          "rule": "supportLatest", 
          "options": {
            "numberOfMajorReleases": 1,
            "numberOfMinorReleases": 1,
            "numberOfPatchReleases": 1
          }
        },
        { 
          "rule": "supportPreReleaseIfNotReleased", 
          "options": {
            "numberOfPreReleases": 1,
          }
        },
        "deprecateAll"
      ]
    }]
  ]
}
```

## Extend rules

If you have a javascript configuration file for releases, you can pass a function in the array:

```js
module.exports = {
    "plugins": [
    "@semantic-release/npm", 
    ["semantic-release-npm-deprecate-old-versions", {
      "rules": [
        customSupportFunction,
        "deprecateAll"
      ]
    }]
  ]
};

/**
 * @param {import('semver').SemVer} version
 * @param {Array<import('semver').SemVer>} allVersionsSortedLatestFirst
 * @returns {import('semantic-release-npm-deprecate-old-versions/rule').RuleResult}
 */
function customSupportFunction(version, allVersionsSortedLatestFirst){
  if (version.major === 4){
    // This version cannot be deprecated by other rules
    return { action: 'support' }
  }

  if (version.major === 3){
    // This version will be deprecated, and other rules
    // will not be applied
    return {
      action: 'deprecate',
      reason: 'Because the new version is awesome'
    }
  }

  // Let other rules decide
  return { action: 'continue' }
}
```

## Supported vs deprecated versions

This plugin considers that either a version is supported, or it is deprecated.

Every rule computes a status on each version. Rules are applied in order, they have 3 possible outputs:

- `continue`: the rule does not enforce the status of the given version, it is left to the next rules to decide the status
- `deprecate`: the rule declares that the given version is deprecated, no further rule will be able to change this status
- `support`: the rule declares that the given version is supported, as a consequence, no further rule will be able to change its status

## Available rules and options

### support-latest

This rule allows to declare a certain number of releases as supported. This rule **does not apply to pre-releases**.

#### Options

All these options are optional. If a value is not set, the default value will apply
```json
{
  "numberOfMajorReleases": 1,
  "numberOfMinorReleases": 1,
  "numberOfPatchReleases": 1
}
```

#### Examples

options: `numberOfMajorReleases=2`

| `2.0.1`       |`2.0.0`     | `1.0.2`    | `1.0.1`    | `1.0.0`    |
| :------------ | :--------: | :--------: | :--------: | ---------: |
| **support**   | continue   | **support**| continue   | continue   |

`continue` means that the status of a version is not fixed by this rule

### support-prerelease-if-not-released

This rule allows to declare a certain number of pre-releases as supported. This rule **only applies to pre-releases**.

#### Options

```json
{
  "numberOfPreReleases": 1,
}
```

#### Examples

options: `numberOfPreReleases=2`

| `3.0.0-alpha.2` | `3.0.0-alpha.1` | `3.0.0-alpha.0` | `2.0.0`  | `2.0.0-alpha.0`    |
| :------------   | :-------------: | :-------------: | :------: | -----------------: |
| **support**     | **support**     | continue        | continue | continue           |

----------------------------------------------------------------------------------------

options: `numberOfPreReleases=2`

| `2.0.0`  | `2.0.0-alpha.0`    |
| :-----   | -----------------: |
| continue | continue           |

`continue` means that the status of a version is not fixed by this rule

In this example the version `2.0.0-alpha.0` is not marked as supported because the version `2.0.0` has been released. 

### deprecate-all

This rule deprecate all remaining versions (not previously marked as supported).

It is meant to be used at the end of rules declaration.

#### Options

This rule does not have any option

#### Examples

options: `numberOfPreReleases=2`

| `2.0.0`        | `1.0.0`           |
| :------------  | ----------------: |
| **deprecate**  | **deprecate**     | 
