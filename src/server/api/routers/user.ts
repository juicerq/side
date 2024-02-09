import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { UserUtils } from "../utils/UserUtils";
import {
  CreateUserInputSchema,
  LoginUserInputSchema,
} from "../schemas/input/User";
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

      return res;
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

  verify: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      return false;
    }

    return true;
  }),

  hello: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => {
      return {
        greeting: `Hello ${input.email}`,
      };
    }),
  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //     });
  //   }),
  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
});
