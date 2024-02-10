import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  CreateUserInputSchema,
  LoginUserInputSchema,
} from "../schemas/input/User";
import { UserUtils } from "../utils/UserUtils";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import Cookies from "js-cookie";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreateUserInputSchema)
    .mutation(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await UserUtils.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      });

      return res;
    }),

  login: publicProcedure
    .input(LoginUserInputSchema)
    .mutation(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = await UserUtils.login({
        email: input.email,
      });

      return {
        token,
      };
    }),

  info: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) return;

    return {
      email: ctx.user.email,
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
    };
  }),

  verify: publicProcedure.query(({ ctx }) => {
    if (ctx.user?.uuid) return true;
    return false;
  }),
});
