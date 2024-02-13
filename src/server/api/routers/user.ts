import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  CreateUserInputSchema,
  LoginUserInputSchema,
} from "../schemas/input/User";
import { UserUtils } from "../utils/UserUtils";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreateUserInputSchema)
    .mutation(async ({ input }) => {
      const res = await UserUtils.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      });

      const token = await UserUtils.login({
        email: res.email,
      });

      return { ...res, token };
    }),

  login: publicProcedure
    .input(LoginUserInputSchema)
    .mutation(async ({ input }) => {
      const token = await UserUtils.login({
        email: input.email,
      });

      return {
        token,
      };
    }),

  sendConfirmationCode: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email must be an valid email."),
        code: z.string().min(4).max(4, "Code must be 4 characters exactly."),
        type: z.enum(["login", "register"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, code, type } = input;
      const res = await UserUtils.sendConfirmationCode({ email, code, type });

      return res;
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
