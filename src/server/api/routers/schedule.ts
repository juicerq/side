import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { dayOfWeekEnum, monthEnum } from "@/server/db/schema";

export const scheduleRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        month: z.enum(monthEnum),
        dayOfWeek: z.enum(dayOfWeekEnum),
        scheduleTimeUuid: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("input:", input);
    }),
});
