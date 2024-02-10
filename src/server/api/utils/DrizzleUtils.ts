/* eslint-disable */

import { TRPCError } from "@trpc/server";

export const takeUniqueOrThrow = <T extends any[]>(values: T): T[number] => {
  return values[0]!;
};
