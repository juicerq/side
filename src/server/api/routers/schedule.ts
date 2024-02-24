import { inputSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { scheduleDaysRouter } from "./day";
import { scheduleHourRouter } from "./hour";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleRouter = createTRPCRouter({
  create: adminProcedure
    .input(inputSchemas.schedule)
    .mutation(async ({ input }) => {
      console.log("input:", input);
    }),

  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.getAll();
  }),

  hour: scheduleHourRouter,

  day: scheduleDaysRouter,
});
