/* eslint-disable */

export const takeUniqueOrThrow = <T extends any[]>(values: T): T[number] => {
  return values[0]!;
};
