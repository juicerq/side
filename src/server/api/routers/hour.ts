import { dbSchemas } from "@/server/db/ZSchemasAndTypes";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { SchedulesUtils } from "../utils/SchedulesUtils";

export const scheduleHourRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return await SchedulesUtils.hour.getAll();
  }),

  create: adminProcedure
    .input(dbSchemas.CreateScheduleHourSchema)
    .output(dbSchemas.CreateScheduleHourSchema)
    .mutation(async ({ input }) => {
      const hour = await SchedulesUtils.hour.create({
        hour: input.hour,
      });

      return hour;
    }),
});
