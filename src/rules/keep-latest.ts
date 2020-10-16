import { Action, Rule } from "../rule";

export const keepLatest: Rule = (
  version: string,
  allVersionsSortedLatestFirst: string[]
): Action => {
  if (version === allVersionsSortedLatestFirst[0]) {
    return Action.keep;
  }

  return Action.continue;
};
