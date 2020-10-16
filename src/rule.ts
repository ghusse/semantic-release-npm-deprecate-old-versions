export enum Action {
  deprecate = "deprecate",
  keep = "keep",
  continue = "continue",
}

export type Rule = (
  version: string,
  allVersionsSortedLatestFirst: string[]
) => Action;
