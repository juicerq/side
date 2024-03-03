import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { UserUtils } from "../utils/UserUtils";
import { z } from "zod";
import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { takeUniqueOrThrow } from "../utils/DrizzleUtils";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(inputSchemas.user)
    .output(z.object({ newUser: inputSchemas.user, token: z.string() }))
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

  changeRole: publicProcedure
    .input(inputSchemas.user.pick({ email: true, role: true }).required())
    .output(z.object({ updatedUser: inputSchemas.user.required() }))
    .mutation(async ({ input }) => {
      const updatedUser = await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.email, input.email))
        .returning()
        .then(takeUniqueOrThrow);

      return {
        updatedUser,
      };
    }),

  login: publicProcedure
    .input(inputSchemas.user.pick({ email: true }))
    .output(
      z.object({
        token: z.string(),
      })
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
      })
    )
    .mutation(async ({ input }) => {
      const { email, code, type } = input;
      const res = await UserUtils.sendConfirmationCode({ email, code, type });

      return res;
    }),

  info: publicProcedure
    .output(inputSchemas.user.required())
    .query(({ ctx }) => {
      if (!ctx.user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      return ctx.user;
    }),

  verify: publicProcedure.query(({ ctx }) => {
    if (ctx.user?.uuid) return true;
    return false;
  }),
});
