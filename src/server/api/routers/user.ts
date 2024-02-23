import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { UserUtils } from "../utils/UserUtils";
import { z } from "zod";
import { dbSchemas } from "@/server/db/ZSchemasAndTypes";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(dbSchemas.CreateUserSchema)
    .output(
      z.object({ newUser: dbSchemas.CreateUserSchema, token: z.string() }),
    )
    .mutation(async ({ input }) => {
      const newUser = await UserUtils.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      });

      const token = await UserUtils.login({
        email: newUser.email,
      });

      return { newUser, token };
    }),

  login: publicProcedure
    .input(dbSchemas.CreateUserSchema.pick({ email: true }))
    .output(
      z.object({
        token: z.string(),
      }),
    )
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

  info: publicProcedure
    .output(
      z.object({
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        isAdmin: z.boolean(),
      }),
    )
    .query(({ ctx }) => {
      if (!ctx.user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      return {
        email: ctx.user.email,
        firstName: ctx.user.firstName,
        lastName: ctx.user.lastName,
        isAdmin: ctx.user.isAdmin,
      };
    }),

  verify: publicProcedure.query(({ ctx }) => {
    if (ctx.user?.uuid) return true;
    return false;
  }),
});
