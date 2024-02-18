import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { dayOfWeekEnum, monthEnum } from "@/server/db/schema";
import { SchedulesUtils } from "../utils/SchedulesUtils";
import { scheduleTimesRouter } from "./times";

const NewTimeFormSchema = z.object({
  hour: z
    .number({ required_error: "The hour is required" })
    .min(0, "The hour must be a valid hour")
    .max(23, "The hour must be a valid hour"),
  minute: z.number().min(0).max(59).optional(),
});

export type NewTimeInput = z.infer<typeof NewTimeFormSchema>;

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

  newTime: adminProcedure
    .input(NewTimeFormSchema)
    .mutation(async ({ input }) => {
      await SchedulesUtils.newTime({
        hour: input.hour,
        minute: input.minute,
      });
    }),

  times: scheduleTimesRouter,
});
