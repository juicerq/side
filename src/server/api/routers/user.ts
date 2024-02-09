import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  CreateUserInputSchema,
  LoginUserInputSchema,
} from "../schemas/input/User";
import { UserUtils } from "../utils/UserUtils";

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
});
