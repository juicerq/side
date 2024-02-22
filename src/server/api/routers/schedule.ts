import { dbSchemas } from "@/server/db/SchemasAndTypes";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleDaysRouter } from "./days";
import { scheduleTimesRouter } from "./times";

export const scheduleRouter = createTRPCRouter({
  create: publicProcedure
    .input(dbSchemas.CreateScheduleSchema)
    .mutation(async ({ input }) => {
      console.log("input:", input);
    }),

  time: scheduleTimesRouter,

  day: scheduleDaysRouter,
});
