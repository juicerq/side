import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { db } from "@/server/db";
import { inputSchemas, outputSchemas } from "@/server/db/ZSchemasAndTypes";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { takeUniqueOrThrow } from "../utils/DrizzleUtils";
import { UserUtils } from "../utils/UserUtils";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(inputSchemas.user)
    .output(z.object({ newUser: outputSchemas.user, token: z.string() }))
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

  update: publicProcedure
    .input(
      z.object({
        uuid: z.string(),
        update: inputSchemas.user.pick({ role: true, theme: true }).optional(),
      })
    )
    .output(z.object({ updatedUser: outputSchemas.user }))
    .mutation(async ({ input }) => {
      const updatedUser = await db
        .update(users)
        .set({ role: input.update?.role, theme: input.update?.theme })
        .where(eq(users.uuid, input.uuid))
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

  info: publicProcedure.output(outputSchemas.user).query(({ ctx }) => {
    if (!ctx.user)
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    return ctx.user;
  }),

  verify: publicProcedure.query(({ ctx }) => {
    if (ctx.user?.uuid) return true;
    return false;
  }),
});
